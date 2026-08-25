# Wellness Tools

White-label launcher that houses MedWell's wellness tools behind one branded page,
plus a Reports view. Tenant-agnostic: branding and tool links come from data, not code.

## Pages

- **`index.html`** — the launcher. Shows tiles for each tool and for Reports.
- **`reports.html`** — the usage dashboard (downloads, QR scans, translations, trends).

## How it works

On load, both pages call the `hub-config` webhook:

```
POST https://n8n-admin.willclower.com/webhook/hub-config
```

It returns the current tenant's branding and tool list. The page skins itself from
`brand_config` (colors, logo, name) and builds the tool tiles from `tool_urls`. Adding a
new client is a data change — a new row in the `orgs` table — with no edits here.

The tool tiles link out to the separate tool sites (Translation, Digital Resource Library).
The Reports tile is internal and opens `reports.html`.

## Configuration lives in the database

Tile links come from the tenant's `brand_config.tool_urls` in the `orgs` table, e.g.:

```json
"tool_urls": {
  "translation": "https://willclower.github.io/translation/",
  "vwl": "https://willclower.github.io/digital_library/"
}
```

Until real URLs are set, tiles show "Coming soon."

## Reports data (current state)

`reports.html` currently renders **sample data** (an amber banner says so). All of it lives
in one `DUMMY` object at the top of the page script. When usage logging and the `hub-report`
webhook are live, replace the `loadData()` function (marked with a `TODO`) with a fetch to:

```
POST https://n8n-admin.willclower.com/webhook/hub-report   (not built yet)
```

...and remove the sample-data banner. Nothing else changes; the charts and filters already
expect the same data shape.

## Deploy

GitHub Pages, served from `main` / root. Settings → Pages → Deploy from a branch → `main` `/`.
Live at `https://willclower.github.io/wellness_tools/`.

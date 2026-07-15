# site-data.json

This file stores the dynamic content used by the portfolio. The JavaScript reads this file when the page loads and automatically updates the Hero statistics and generates every project card.

---

# Structure

```json
{
    "stats": { },
    "projects": [ ]
}
```

| Section | Purpose |
|---------|---------|
| `stats` | Controls the Hero section statistics. |
| `projects` | Generates every project card. |

---

# Stats

The `stats` object controls the three counters displayed in the Hero section.

```json
"stats": {
    "powerBiDashboards": "6+",
    "databaseTables": "20+",
    "pythonStreamlitApps": "8+"
}
```

| Property | Description |
|----------|-------------|
| `powerBiDashboards` | Number of Power BI dashboards. |
| `databaseTables` | Number of database tables. |
| `pythonStreamlitApps` | Number of Python & Streamlit applications. |

---

# Projects

Each object in the `projects` array generates one project card.

Projects appear in the same order they are listed.

To reorder projects, move the objects within the array.

---

# Project Properties

## type

Category displayed above the project title.

```json
"type": "DATA ENGINEERING"
```

---

## title

Project title.

```json
"title": "Production Scheduling Automation"
```

---

## description

Project description displayed below the title.

```json
"description": "Automated scheduling and validation workflows..."
```

---

## tags

Technology badges displayed at the bottom of the card.

```json
"tags": [
    "Python",
    "SQL",
    "MySQL"
]
```

---

## previewType

Determines which preview template is used.

| Value | Description |
|--------|-------------|
| `image` | Displays a project screenshot. |
| `pipeline` | Displays the pipeline template. |
| `app-window` | Displays the Streamlit application template. |
| `mini-dashboard` | Displays the dashboard template. |

---

## previewClass

Controls the preview background color.

| Value | Theme |
|--------|-------|
| `preview-one` | Blue / Purple |
| `preview-two` | Green / Blue |
| `preview-three` | Orange / Pink |

---

## previewLabel

Displays the badge in the upper-left corner of template previews.

```json
"previewLabel": "Python + APIs"
```

Used by:

- `pipeline`
- `app-window`
- `mini-dashboard`

---

## pipelineSteps

Only used when `previewType` is `"pipeline"`.

```json
"pipelineSteps": [
    "API",
    "Python",
    "Database"
]
```

Each value becomes one box in the pipeline.

---

## image

Only used when `previewType` is `"image"`.

```json
"image": "images/dashboard.png"
```

Image should be stored in the `images` folder.

---

## imageAlt

Alt text for image previews.

```json
"imageAlt": "Sales Dashboard"
```

---

## link

Displays the project button when provided.

```json
"link": "https://github.com/username/project"
```

Leave empty to hide the button.

```json
"link": ""
```

---

## linkText

Text displayed on the project button.

```json
"linkText": "View Project →"
```

---

# Adding a Project

1. Copy an existing project object.
2. Paste it into the `projects` array.
3. Update the values.
4. Save the file.

The project will be generated automatically.

---

# Updating Statistics

Edit the values inside `stats` and save the file.

The Hero section will update automatically.

---

# Reordering Projects

Move project objects higher or lower in the `projects` array.

The website displays them in the same order they appear in the JSON.

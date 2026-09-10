# Design notes

Graphite takes its direction from the user's Neo4flix and Nexora projects: a large tactile image, confident typography, deliberate whitespace, and movement linked to scrolling. The result stays focused on learning analytics.

## Identity

- Charcoal backgrounds, warm amber highlights, subdued green success states, and separate violet received-audit values.
- A restrained network mark connects the GraphQL subject to the product's name.
- A split sign-in composition introduces the orbital sculpture; a shallow crop carries that image into the workspace.
- Flat, readable chart surfaces keep the data prominent. Profile details move behind a disclosure rather than consuming the first viewport.

## Artwork

`public/images/graphite-orbit.webp` is an original AI-generated artwork commissioned for this redesign. It depicts graphite and brushed-metal nodes connected by translucent amber glass arcs. The 1536 × 1024 asset is compressed to WebP and served locally; the interface has no remote image dependency. It is decorative and does not represent real data.

## Interaction principles

- The dashboard opens with its overview and primary metrics.
- Sidebar anchors expose the existing functional sections without adding navigation routes for each panel.
- Project search, result filters, pagination, chart periods, and audit filters are keyboard-operable controls.
- Native details elements provide expanded chart data, the complete skill list, and profile details.
- Responsive layouts change from a desktop sidebar to horizontally scrollable navigation, while tables retain their headers and scroll inside their panel.
- Motion can be paused and follows system accessibility preferences.

## Implementation notes

Shared tokens live at the start of `globals.css`. The dashboard, data normalization, query, authentication transport, and charts have separate responsibilities. Components contain explanatory comments around behavior that is easy to get wrong rather than comments that restate every line.

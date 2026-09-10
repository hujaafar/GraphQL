# Data contract

The dashboard operation builds on the original repository's Reboot01 schema. The default module is `/bahrain/bh-module`; public build-time environment variables can configure another compatible installation.

| Display                      | Source                                                        | Calculation                                                                        |
| ---------------------------- | ------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Total module XP              | `transaction_aggregate`, `type = xp`, exact module event path | Sum of `amount`                                                                    |
| Project / exercise module XP | The same module event scope plus object type                  | Sum by object type; any remaining module XP is displayed separately                |
| Piscine Go / JS              | XP transaction paths matching the original piscine patterns   | Separate totals; never added to the module summary                                 |
| XP timeline                  | Module XP transactions ordered by date                        | Monthly awards plus a cumulative total; limited periods retain the opening balance |
| Current level                | Highest `level` transaction with the module path prefix       | Maximum attained level                                                             |
| Rank                         | Current level                                                 | Original rank milestones from 0 to 60; level 60+ remains in the final rank         |
| Skill percentages            | Transactions whose type starts with `skill_`                  | Highest attained value for each skill, constrained to 0–100                        |
| Projects                     | Project progress plus module project XP awards                | One row per object name, combined XP, latest award date, best recorded grade       |
| Audit ratio                  | `user.auditRatio`                                             | Displayed when received audit XP exists; otherwise shown as unavailable            |
| Audit XP                     | `user.totalUp`, `user.totalDown`                              | Given and received totals                                                          |
| Audit history                | Original passed/failed audit aggregates                       | Sorted by the group's creation timestamp                                           |

## Display conventions

- XP uses decimal units: 1 kB = 1,000 B; 1 MB = 1,000,000 B, matching the original project.
- A project with XP or a grade of at least 1 is passed. A recorded grade below 1 is shown as retry. A missing grade without XP is in progress. The UI labels grades as **best grade** because multiple progress records are consolidated.
- The project list combines progress records from all projects with XP from the selected module. Projects outside the module can therefore show a grade and 0 module XP.
- Audit rows say **Group created**. That field is not the timestamp when an audit was completed; the label deliberately preserves the meaning of the available data.
- The 3M and 6M chart controls show calendar months including the current month. Dates use UTC to keep month boundaries consistent.
- `attrs` accepts an object or a stringified object. Missing and malformed values display safely as not provided.
- Empty data is not replaced with sample data. All zero and missing cases are handled directly.

## Upstream dependencies

The query uses the existing `user`, `transaction`, `transaction_aggregate`, `progress`, and audit aggregate fields. Module filters are GraphQL variables rather than interpolated query text. A change to the upstream schema or authorization rules may require updating the operation. No live credentials are required for the repository's test suite.

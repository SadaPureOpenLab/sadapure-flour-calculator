# Validation record — 14 October 2026

The source implementation is an educational prototype. Deployment is pending verification; this record does not claim clinical, food-manufacturing or nutritional validation.

## Automated checks

24 arithmetic, generator and serialization tests pass. Coverage includes all 18 published proportions, batch scaling, exact centigram totals, invalid quantities and percentages, explicit normalization, exclusions, 50-ingredient shared links, corrupted-link recovery, household planning and ingredient costing. Production build passes.

## Browser checks

Verified 5 kg scaling; removing wheat invalidates the total until explicit normalization; gluten flags remain for barley/rye; original reset; local CSV, copied summary and PDF downloads; 50-entry custom table and its two-page PDF; mobile width 390 px with no horizontal page overflow; Urdu right-to-left attributes and quantity-unit separation; household example 4 people × 2 rotis × 40 g × 30 days = 9.6 kg.

## Evidence boundaries

The published 18-ingredient table is a dated brand snapshot, not a laboratory certificate. 32 additional ingredient identities have no reviewed food-composition mapping. Four generated culinary templates are illustrative and untested for cooking performance. Selecting diabetes, PCOS or another concern shows educational guidance and never establishes a therapeutic formula. Cross-contact controls cannot be certified by excluding names.

PDF is currently English only. Urdu uses the browser print path. Accessibility has received focused keyboard/semantic work, but no independent audit is claimed. No clinical validation, nutrient analysis or manufacturing review has been performed.

## Privacy

The app has no backend, account, analytics or AI calls. Free-text context stays in component memory and is excluded from exports and shared recipe URLs. Browser extensions remain outside the app's control. A shared URL includes only batch quantity and blend percentages.

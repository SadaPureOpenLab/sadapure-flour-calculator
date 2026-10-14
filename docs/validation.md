# Validation record — 14 October 2026

The source implementation is an educational prototype. The initial public educational deployment is verified at https://sadapureopenlab.github.io/sadapure-flour-calculator/ . This record does not claim clinical, food-manufacturing or nutritional validation.

## Automated checks

30 arithmetic, generator and serialization tests pass. Coverage includes all 18 published proportions, batch scaling, exact centigram totals, invalid quantities and percentages, explicit normalization, exclusions, 50-ingredient shared links, corrupted-link recovery, household planning and ingredient costing. Production build passes.

## Browser checks

Verified 5 kg scaling; removing wheat invalidates the total until explicit normalization; gluten flags remain for barley/rye; original reset; local CSV, copied summary and PDF downloads; 50-entry custom table and its two-page PDF; mobile width 390 px with no horizontal page overflow; Urdu right-to-left attributes and quantity-unit separation; household example 4 people × 2 rotis × 40 g × 30 days = 9.6 kg.

## Evidence boundaries

The published 18-ingredient table is a dated brand snapshot, not a laboratory certificate. 36 additional ingredient identities have no reviewed food-composition mapping. Four generated culinary templates are illustrative and untested for cooking performance. Selecting diabetes, PCOS or another concern shows educational guidance and never establishes a therapeutic formula. Cross-contact controls cannot be certified by excluding names.

PDF is currently English only. Urdu uses the browser print path. Accessibility has received focused keyboard/semantic work, but no independent audit is claimed. No clinical validation, nutrient analysis or manufacturing review has been performed.

## Privacy

The app has no backend, account, analytics or AI calls. Free-text context stays in component memory and is excluded from exports and shared recipe URLs. Browser extensions remain outside the app's control. A shared URL includes only batch quantity and blend percentages.

## Goal-generation regression checks

All 22 goals × 5 focus choices (110 combinations) produce valid 100% totals; each goal respects exclusions. Browser checks verified that selection hides the previous table, then Generate changes actual percentages: published diabetes wheat 60%; source-adjusted PCOS wheat 30.93%; the same profile with millet focus wheat 15.46%; plant-protein example wheat 45% and besan 20%. These are functional checks, not clinical evidence. Hair and skin share a source recipe; there are 21 distinct unmodified examples rather than an invented difference between them.

The new goal/focus PDF was downloaded and visually reviewed: correct source URL, 97% discrepancy and experimental focus rationale were included without clipping. Private QA text and concern names were absent from the shared URL. Legacy v2 50-entry links remain compatible; v3 preserves all 54 identities. Ingredient search, light/dark appearance and zero captured console errors were checked locally.

## Published-source and deployment checks

All 55 tracked project files were compared with the public checkout; source and asset contents matched after normalizing text line endings. Initial CI and educational demo deployment succeeded on GitHub. Live HTTPS browser checks confirmed goal changes affect the displayed result: besan 20% / 500 g for the plant-protein example and 7% / 175 g for the fibre example at 2.5 kg. This verifies behaviour, not dietary benefit.

Older Dependabot workflow checks ran before workflow files existed; the complete manifest now exists. The initial successful deployment reported deprecated action runtime notices; action versions were updated from their official release records and runner images pinned for stability. Later CI status must be checked on the current revision.

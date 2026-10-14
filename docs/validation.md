# Validation — current goal-only interface

Updated 14 October 2026. The source is a public educational food calculator, not a clinically validated formulation system.

## Automated verification

32 checks pass locally. They cover published data, exact centigram totals, quantity/percentage boundaries, normalization, allergen rules, legacy/v3 shared links, all 22 live goal profiles and order-draft privacy/length. Production build passes.

The main UI now derives results from goal and quantity directly. There is no focus selector, Generate button, personal form or appearance toggle. Theme starts dark in the initial HTML.

## Recipe/source checks

Everyday matches the original 18-entry table. The other unmodified profiles produce 21 distinct baselines across 22 goals; hair and skin intentionally share a source recipe. An incomplete 97% table is visibly marked and rescaled, not represented as an exact published 100% formula. No medical, cooking, nutrient or manufacturing review is claimed.

## Prior browser/public verification

The previous version was publicly deployed and checked on HTTPS. Goal changes altered the actual table; live CSV matched the displayed percentages and 2,500 g total. PDFs with 18 and 50 entries were downloaded and visually reviewed, as was a PDF with the source discrepancy and ratio rationale. Source files and assets matched the public checkout after text line-ending normalization.

Earlier mobile checks at 390 × 844 verified no horizontal page overflow, Urdu direction/quantity-unit separation and result scrolling. The household example 4 people × 2 rotis × 40 g × 30 days gives 9.6 kg. Ingredient search and reduced/print styles were checked. Clipboard tool reads sometimes returned an older local link despite copy feedback, so a visible result-link fallback was added; the current HTTPS result href and restoration were subsequently verified.

## Current UI checks

Local browser checks confirmed exactly two builder fields (quantity and goal), initial dark appearance, immediate besan changes from 20% / 500 g (protein, 2.5 kg) to 7% / 175 g (fibre), then 350 g at 5 kg. Empty quantity hides the table and restoring a valid quantity restores it. Product and email destinations match the official footer, and the expanded order preview contains ingredient weights without the concern label. Email-button hover has dark text rgb(16,39,29) on light green rgb(196,226,151). The same goal/quantity changes, fixed dark theme, product/order links, canonical URL and share restoration passed on the public HTTPS deployment. All 58 tracked files matched the public main checkout. Main build and deployment checks passed on revision 137cd60; later asset/documentation checks are recorded in GitHub Actions. All 22 goal tables rendered valid 100% / 2,500 g totals locally.

## Privacy and limits

No backend, trackers, automatic email or customer/health profile store. Order requests omit condition names and are sent only by the visitor in their own mail app. Browser extensions and mail-client handling remain outside this application's control. Search indexing, an independent accessibility audit, complete unavailable book review, exact food IDs, clinical effects and individual suitability are unverified.

## Google search setup

The calculator URL-prefix property was verified using its published HTML meta tag. The sitemap was submitted and resubmitted after an initial fetch error. A Google live test of sitemap.xml confirmed crawl allowed, page fetch Successful and indexing allowed. The sitemap report still showed Couldn't fetch when last checked. Google accepted the homepage indexing request into its priority crawl queue. Actual indexing/ranking remain unconfirmed.

<p align="center"><img src="public/assets/sadapure-icon.png" width="80" height="80" alt="SadaPure emblem"/></p>

# SadaPure Smart Flour (Atta) Builder

An open, browser-based workspace for exact flour-blend arithmetic: inspect SadaPure's published 18-ingredient recipe, scale it to a quantity, explore a 54-ingredient custom library and plan household flour use.

**Status:** initial implementation; local build and calculation tests executed. Public deployment and complete browser QA are tracked in the validation report. This is not a production-readiness or medical-review claim.

## What it does

- Shows every published ingredient, percentage, gram weight and Urdu name.
- Uses integer percentage units and preserves the total after display rounding.
- Includes quantity presets, custom percentage editing, explicit normalization and reset.
- Offers 54 supported ingredient identities and 22 goals/concerns with linked guidance.
- Uses the selected goal and culinary focus to generate food examples, preserves source provenance and applies explicit exclusions.
- Provides a household flour (atta) planner, ingredient search and user-price costing.
- Exports CSV and English PDF; prints Urdu names; copies summaries and privacy-safe result links.
- Runs locally in the browser without registration, analytics, backend storage or medical API calls.

## Run locally

Requires Node.js 22.12+ and npm.

```sh
npm ci
npm run dev
```

Open `http://127.0.0.1:5184`. Run `npm test` for calculation/data tests and `npm run build` for type checking and the static production build. `npm run preview` serves the built output locally.

## Calculation and rounding

Each ingredient starts from `total flour grams × percentage / 100`. Shares are integer basis points: 48% is 4,800 out of 10,000. Quantity supports 0.001–1,000 kg, with at most three decimal places. Display weights use centigrams (0.01 g). The largest-remainder method distributes residual centigrams by descending remainder, breaking ties by catalogue order. Consequently the table and export total exactly equal the entered flour mass.

Custom percentages permit two decimal places and must sum to 100% before output. Removal does not silently change the remaining percentages. Explicit normalization preserves relative ratios and reports the changed values.

## Source and classification

The published formula is a dated snapshot of the [SadaPure product ingredient table](https://sadapure.com/product/multi-grain-atta-flour), retrieved 14 October 2026. Narrative discrepancies and ambiguous moong/lentil identity remain documented. It does not certify the manufactured formula of a particular pack or batch.

The 36 additional library entries are educational identities, not ingredients of the official recipe. Their exact food-composition IDs, nutrient values, processing state, local-name accuracy and cooking performance need review. No nutrition totals or low-GI/high-protein/gluten-free product certifications are invented.

**Official Published SadaPure Formula** and **Custom Educational Mix** remain distinct even if their proportions happen to match. No recipe is labelled professionally reviewed.

## Health, allergens and private inputs

The original blend contains wheat, barley, rye and sesame and is not gluten-free. A wheat-only exclusion leaves other gluten cereals. An exclusion rule cannot establish certified ingredients, shared-equipment controls or allergy safety.

The 22 goals include diabetes, PCOS/PMOS, hair fall, stamina, weight management and allergy concerns. These selections choose distinct food-exploration profiles, not therapeutic percentages. Four source recipe tables are versioned; an incomplete 97% source is explicitly rescaled and marked custom. Other ratios and the 50:50 goal/focus rule are disclosed experimental development choices, not percentages proven by the linked studies. Age, weight, gender and a private question never prescribe a medical mix and are omitted from exports/shared links. They are not persisted or transmitted.

The app has no clinically validated nutrient engine, therapeutic formulation engine, production batch database or shelf-life prediction.

## Source layout

| Area | Responsibility |
|---|---|
| `src/data` | Immutable published snapshot, custom identity catalogue and guidance links |
| `src/lib` | Percentage arithmetic, explicit mix generation and exports |
| `src/components` | Results, custom editor, planner, explorer and education |
| `tests` | Data integrity, exact totals, boundary cases, exports and generator restrictions |
| `public/assets` | Authentic emblem and an explicitly illustrative grain still life |

## Deployment

The `dist` directory is a static application. Prefer a staging environment on an authorized platform with terms permitting business use. The app has no checkout or storefront; commerce remains on [sadapure.com](https://sadapure.com).

Do not report a public demo URL until it has been deployed and verified. Before public hosting, set deployment-specific canonical and Open Graph URLs, test HTTPS clipboard/download behavior and configure appropriate response headers. The local preview is not an internet deployment.

## Contribution and licensing

See [CONTRIBUTING](CONTRIBUTING.md), [SECURITY](SECURITY.md), [asset policy](ASSET-LICENSE.md) and [LICENSE](LICENSE). Code is MIT licensed. SadaPure trademarks, emblem, packaging and product images are excluded. Third-party dependencies retain their own licenses; no reviewed comparison-project code was copied.

## Research and validation

See [all 22 goal profiles](docs/goal-research.md), [54 ingredient references and review scope](docs/ingredient-research.md), [books and articles reviewed](docs/research-bibliography.md), [completed checks](docs/validation.md) and [design comparison](docs/design-fidelity.md). Complete unavailable books, supplier nutrient mappings, clinical formulations and cooking performance have not been validated.


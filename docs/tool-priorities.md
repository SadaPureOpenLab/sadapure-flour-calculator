# Tool and ecosystem research

Desk review, 14 October 2026. Strengths below come from project documentation. Gaps and development estimates are SadaPure-specific engineering judgments, not usability-test results or market-size claims. No third-party source code or designs were copied.

## Nine relevant examples

| Example and primary source | Strength | Gap for this brief | License/reuse considerations |
|---|---|---|---|
| [Open Food Facts server](https://github.com/openfoodfacts/openfoodfacts-server) | Product ingredients, taxonomy and collaborative corrections | Crowd-sourced products do not establish a particular SadaPure batch formula | AGPL server; database ODbL; images have separate rights |
| [Open Food Facts Android](https://github.com/openfoodfacts/openfoodfacts-androidapp) | Practical product scanning and mobile ingredient information | This repository is explicitly a legacy client; not the basis for a new flour calculator | Check repository license and separate product-image rights before reuse |
| [Open Food Facts Python](https://github.com/openfoodfacts/openfoodfacts-python) | Structured access to product data | A server-side integration adds unnecessary complexity to exact percentage arithmetic | SDK license is separate from ODbL database obligations |
| [USDA FoodData Central](https://fdc.nal.usda.gov/api-guide/) | Multiple documented food-composition datasets and stable IDs | Ingredient identity, milling and missing nutrients need review; not a lab analysis of SadaPure | USDA data are public domain; cite FDC; API key must never be embedded in a public client |
| [Mealie](https://github.com/mealie-recipes/mealie) | Household meal planning, recipe import and translations | Full self-hosted backend is excessive for private local flour arithmetic | AGPL-3.0; no code reused |
| [Tandoor](https://github.com/TandoorRecipes/recipes) | Ingredient/unit organization, recipe scaling and meal planning | Recipe collection is different from versioned official blend transparency | AGPL with Commons Clause selling exception, as stated in README; do not assume unrestricted commercial reuse |
| [Grocy](https://github.com/grocy/grocy) | Stock, shopping and household consumption workflows | Stock management is more complex than a four-input atta planner | MIT; attribution required if copied; no code copied |
| [wger](https://github.com/wger-project/wger) | Nutrition records with explicit data/documentation license distinctions | Fitness, weight and tracking data would expand privacy scope unnecessarily | Code AGPL; entry-specific data licenses; documentation CC-BY-SA |
| [Open Food Network](https://github.com/openfoodfoundation/openfoodnetwork) | Community food distribution and mature contribution practices | Marketplace functionality belongs to the existing store, not this educational app | AGPL; no commerce implementation copied |

The opportunity is a small no-login workspace showing every ingredient, exact quantity scaling, local language names and privacy-safe exports. None of the reviewed documentation establishes demand volumes in Pakistan; user testing after launch should evaluate comprehension and usefulness.

## Priority matrix

Effort assumes one experienced developer and excludes platform approvals. Research: L/M/H. Safety concerns measure harm from misleading outputs, not security alone. GitHub usefulness means whether a maintainable open implementation adds value.

| Tool | Audience/problem | Alternatives | Distinct opportunity | Research | Safety | Effort | Maintenance | GitHub usefulness | Priority |
|---|---|---|---|---|---|---|---|---|---|
| Smart Atta Builder | Households interpreting blend ratios | Spreadsheets; recipe scalers | 18 sourced proportions, exact rounding, all rows visible | M | M: allergy/cross-contact | 3–5 days | Formula/source changes, browser QA | High | P1 |
| Family Atta Planner | Households estimating flour purchases | Grocy, Mealie; manual arithmetic | Roti-based assumptions entered by the user | L | Low: not recommended portions | 0.5–1 day | Shared calculation tests | High | P1 companion |
| Ingredient Explorer + warnings | Consumers matching Urdu names and restrictions | Open Food Facts taxonomy, product labels | Bilingual names linked to exact blend entries | M | M: avoid safe-for-allergy guarantees | 1–2 days | Source and name review | High | P1 companion |
| Ingredient Cost Calculator | Users comparing their own input costs | Spreadsheet costing | Transparent per-kg contributions alongside same blend | L | Low: not internal manufacturing cost | 0.5–1 day | Validation and price-input handling | Medium | P2 companion |
| Roti Nutrition Estimator | Users understanding measured flour per roti | FDC, wger | Food IDs, unmapped nutrients visible, added fats explicit | H | High: avoid clinical precision | 3–6 days + qualified mapping review | Dataset changes and review | High | P3 gated |
| Cold-Pressed Oil Explorer | Care users understanding intended uses | Product pages; carrier guide | Separate cosmetic versus labelled culinary use | H | M/H: topical reactions, ingestion | 2–4 days + content review | Product-label changes | Medium/high | P3 gated |
| Grain Comparison | Users comparing ingredient facts | FDC; encyclopedic pages | Matching processing state and source completeness | H | M | 2–3 days after mapping | Nutrient mapping updates | Medium | P3 |
| Storage Guide | Households avoiding waste | Labels; Grocy expiry records | Usage estimates plus label-first guidance | M | M: no invented shelf life | 1 day | Product storage directions | Medium | P2 content |
| Batch Lookup | Customers verifying a pack | Existing batch labels | Real public batch evidence | H | High: fabricated records/privacy | Backend-dependent | Authorized records integration | High once data exist | P4 blocked by data |
| Recipe Unit Converter | Cooks scaling a measured recipe | Tandoor; calculators | Grams/kg exact; density assumptions explicit | M | Low/M | 1–2 days | Sourced density values | Medium | P3 |

## Launch and validation

One app repository with shared formula data keeps original/custom classifications consistent. Do not create separate repositories for small screens of the same app. A separate dataset repository becomes worthwhile after multiple reviewed formulas and independent consumers exist.

Validate core arithmetic, invalid inputs, exports and allergen visibility before publication. Invite feedback through repository issues about calculations, accessibility and language; never request health narratives. Nutrition, condition-specific formulas and product batch verification remain clearly gated.

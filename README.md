# SadaPure Multigrain Flour (Atta) Calculator

**[Open the live calculator](https://sadapureopenlab.github.io/sadapure-flour-calculator/)** · [Goal research](docs/goal-research.md) · [Ingredient references](docs/ingredient-research.md)

Choose a goal and batch quantity; percentages and gram weights update immediately. The current interface uses a fixed dark theme, with English and Urdu labels. It has no Generate button, culinary-focus selector, personal-health form or manual ingredient editor.

## Current features

- 22 goal profiles, 54 ingredient identities and exact batch arithmetic.
- Everyday calculations preserve SadaPure's published 18-ingredient table.
- Other goals show source-recipe snapshots or explicitly marked ingredient examples.
- Complete ingredient table, composition chart, local CSV/PDF, print and share links.
- Household flour planner and searchable ingredient references.
- Direct button to the SadaPure multigrain flour product page.
- Custom-order checkout with name, email, phone and delivery address; reviewed PDF and Excel files with complete bilingual ingredients. Requests target sadapure.com@gmail.com with contact@sadapure.com copied. Gmail draft and device file-sharing fallbacks are available. Direct sending remains inactive until the user connects the server-side Resend service; see docs/custom-orders.md.

## Run and verify

```sh
npm ci
npm run dev
npm test
npm run build
```

The static build is published by GitHub Actions. Permissions for checks are read-only; the demo workflow has the Pages permissions needed to publish this educational project. Commerce and order confirmation are handled by SadaPure.

## Recipe and research scope

Book records, available previews, food references and published articles inform ingredient roles. Exact experimental proportions have not been established as clinical doses. Complete unavailable books, supplier nutrient mappings, cooking performance and individual dietary suitability have not been validated.

The PCOS source table lists 97% under a 5 kg heading. Its example explicitly rescales existing rows to 100% and does not invent the missing ingredient. Hair and skin share a published source recipe, rather than an invented difference. Gender or body weight alone does not establish a flour formula.

The original blend contains wheat, barley, rye and sesame. Ingredient omission cannot certify allergy safety or shared-equipment controls. Versions, sources and adjustments are preserved in local exports. Shared URLs include only batch size and proportions, not a health-goal name.

## Order requests and privacy

The application has no backend, analytics, customer database or automatic email service. The order button opens a mailto draft. For long ingredient lists, the draft asks the visitor to attach the CSV; the link is bounded to avoid mail-client truncation. No diagnosis, source recipe's medical marketing name or private health narrative is inserted into the order email.

Published recipes and exploration examples are separate from human approval. The SadaPure team can discuss ingredients, availability and price; this app does not claim that a dietitian or manufacturer has approved every example.

## Technical SEO

The build includes a descriptive title, meta description, canonical URL, social metadata, WebApplication structured data, readable initial HTML and a project sitemap. See [SEO and contact verification](docs/seo-and-contact.md). Indexing or ranking has not been confirmed or guaranteed.

See [validation](docs/validation.md), [reviewed books and articles](docs/research-bibliography.md), [design changes](docs/design-fidelity.md), [contribution guide](CONTRIBUTING.md), [security guidance](SECURITY.md) and [asset policy](ASSET-LICENSE.md). Code is MIT licensed; SadaPure branding is reserved.

Older editor, costing and focus helpers remain in source history/library tests but are not part of the current main interface.

## Application redesign and custom orders

Fixed dark application layout with tactile depth, responsive controls and a separate contact/review flow. Chart, table, PDF, Excel and order files use English (Roman Urdu) ingredient names. Customer details remain in memory, never shared calculator URLs or browser storage. 37 tests cover arithmetic, sources, attachments, consent, validation, configured/mock provider acceptance and failure states. No real customer email was sent during automated validation.

# SadaPure Open Lab: research checkpoint

Retrieved 14 October 2026. This is an implementation audit, not independent certification of the products.

## Brand and scope

The live [homepage](https://sadapure.com/) positions the brand around “Good ingredients. Everyday rituals.” The [About page](https://sadapure.com/about-us) identifies an online food and personal-care business based in Lahore. Open Lab will support this identity through ingredient transparency, practical household arithmetic and open software. It will not replace the store or imply medical review.

Live categories include multigrain blends, single-grain flours, cold-pressed oils, carrier oils, hair oils and body/massage oils. Homepage/category totals overlap; they are not a unique product count. The catalogue and Organic Insights provide the next research path for oils after the core flour tools.

## Observed design tokens

Inspected rendered homepage CSS using the authenticated user's browser, without changing the website.

| Role | Value | Observation |
|---|---|---|
| Deep brand green | #023628 | Navigation and brand surfaces |
| Supporting green | #0b4634 | Links and controls |
| Accent | #a9cf62 | Highlight elements |
| Page background | #f7f8f3 | Body |
| Main text | #17251b | Body text |
| White surface | #ffffff | Controls and panels |
| Warm surface | #fffefb | Editorial surfaces |
| Muted text | #46564b | Supporting content |
| Heading font | Lora | Serif headings |
| Body font | DM Sans | Content and controls |
| Supporting font | Quicksand | Selected display elements |
| Urdu fallback | Noto Nastaliq Urdu | Urdu content |

The official header logo was retrieved from the actual homepage image URL and preserved as AVIF and PNG. Its trademark and artwork are excluded from the software license.

## Formula evidence and conflicts

The [18-ingredient product table](https://sadapure.com/product/multi-grain-atta-flour) matches the user brief and totals 100%. Use that exact table as the published snapshot, not a claim about a particular manufactured batch.

The older narrative description names ragi and soy, which are absent from the percentage table. The FAQ says whole wheat plus 18 secondary ingredients, conflicting with the table's 18 total entries. Some marketing copy makes low-GI, weight-loss and detox claims without supplied product-specific clinical evidence. None of these claims is carried into Open Lab. The moong/lentil label remains ambiguous: do not silently resolve it to a specific species.

Allergen information expressly identifies wheat, barley, rye and sesame. The original blend is not gluten-free. User removal of wheat cannot establish gluten-free suitability or absence of cross-contact. [NIDDK guidance](https://www.niddk.nih.gov/health-information/digestive-diseases/celiac-disease/eating-diet-nutrition) explains gluten-containing grains and the importance of avoiding cross-contact.

## GitHub account evidence

Browser shows personal username `sadapure`, display name SadaPure, and the verified email supplied by the owner. The owner identified himself as Muhammad Uzair. No existing organization membership was shown. No personal username or avatar was changed.

Free business organization form prepared with handle `SadaPureOpenLab`. Creation requires the owner's confirmation of the GitHub Customer Agreement. No organization URL is reported as live before successful creation.

## Architecture and publication

Launch with a genuine `.github` organization profile and one app repository containing the atta builder, household planner, ingredient explorer and ingredient-cost arithmetic. Shared source data avoids version drift and unnecessary empty repositories. Nutrition estimation and oils comparison remain research gates rather than fake finished tools.

GitHub's [organization documentation](https://docs.github.com/en/organizations/collaborating-with-groups-in-organizations/customizing-your-organizations-profile) requires public `.github/profile/README.md` for the organization homepage. It permits up to six pinned repositories, but there is no reason to fill every slot at launch.

Reviewed [acceptable-use policy](https://docs.github.com/en/site-policy/acceptable-use-policies/github-acceptable-use-policies) and [Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits). Repositories should support real development. The store remains on sadapure.com. Do not deploy a commercial storefront on GitHub Pages. A separate static staging deployment needs a connected hosting account and current business-use terms; no purchase or production website change is authorized by this checkpoint.

## Nutrition gate

[USDA FoodData Central](https://fdc.nal.usda.gov/) is a candidate for measured ingredient data. A credible nutrition engine needs exact food IDs, raw versus cooked state, milling identity, units, nutrient completeness and documented mapping review. No nutritional numbers are invented and no age/weight/sex based therapeutic blend is generated. More ingredients do not establish a healthier food.

No keyword search volumes have been verified. Tool names describe their actual use rather than claimed search demand.

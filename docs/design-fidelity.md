# Design fidelity and deliberate changes

Compared the generated visual reference with the running app at a normal 1280 × 720 desktop viewport and 390 × 844 mobile viewport.

| Reference point | Implementation |
|---|---|
| Deep green header, pale canvas, lime selected controls | Preserved using sampled SadaPure brand colours |
| Serif headline and section headings, plain sans-serif controls | Lora and DM Sans loaded locally |
| Controls left, chart and complete ingredient table right | Preserved on desktop; stacked in reading order on mobile |
| Quantity presets and published/custom mode switch | Working controls with explicit invalid-total handling |
| Ring chart, legend, gram total and export actions | Rendered from the same verified arithmetic as the table |
| Flour still-life | Educational illustration, labelled clearly; positioned below the added generator |

User-directed changes: authentic square emblem only; international Flour (Atta) wording; 50 supported ingredients and 22 goal/concern options. The added generator lengthens the left column. The original generated reference invented ingredients and percentages; those were replaced by the real dated 18-entry table. The table always exposes every active ingredient, instead of hiding values behind a decorative concept.

Urdu uses Noto Naskh Arabic for legibility. Quantity units and presets retain left-to-right numerical layout. Mobile checks found and corrected a unit/input overlap. PDFs with both 18 and 50 entries were downloaded and visually reviewed; the 50-entry export spans two pages.

Remaining limits: no independent accessibility audit, translation review, clinical review or cooking-performance validation is claimed. Visual screenshots are evidence of the rendered prototype, not product certification.

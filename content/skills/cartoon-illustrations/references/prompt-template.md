# Image Prompt Template

Generate each image separately. Do not combine multiple images into one canvas.

```text
Generate one standalone 16:9 horizontal English article illustration.

Visual DNA:
Pure white background. Minimalist black hand-drawn line art. Slightly wobbly pen lines. Lots of empty white space. Sparse red, orange, and blue handwritten English annotations only. Clean absurd product-sketch feeling. No gradients, no shadows, no paper texture, no complex background, no commercial vector style, no PPT infographic look, no cute mascot poster, no children's illustration, no realistic UI. No Chinese characters anywhere.

Recurring character required:
A small solid-black absurd creature with white dot eyes, tiny thin legs, blank serious expression, slightly uneven hand-drawn body shape. The creature must perform the core conceptual action, not decorate the scene. Make it serious, deadpan, and slightly bizarre, not cute.

Theme:
{image theme}

Structure type:
{Workflow / System Slice / Before And After / Role State / Concept Metaphor / Method Layers / Route Map / Small Comic}

Core idea:
{one sentence describing what the image must communicate}

Composition:
{specific scene: where the creature is, what it is doing, main objects, how information moves}

Suggested elements:
{element 1} / {element 2} / {element 3} / {element 4}

English handwritten labels:
{label 1} / {label 2} / {label 3} / {label 4} / {optional label 5}

Color use:
Black for main line art and the creature. Orange for main flow/path/arrows. Red only for key warnings, weak points, problems, or results. Blue only for secondary notes, evidence, feedback, or system state.

Constraints:
One image explains only one core structure. Keep the main subject around 40%-60% of the canvas. Preserve at least 35% blank white space. Use at most 5-8 short handwritten English labels. Do not write a title in the top-left corner. Do not write the structure type on the image. Do not include Chinese text. Do not make it a formal diagram, course slide, dense explainer, UI mockup, or polished vector art. Do not copy prior examples or reuse known case compositions unless explicitly requested; invent a fresh visual metaphor for this specific content. It should be clear but not instructional, interesting but not childish, strange but clean.
```

## Edit Prompts

Remove a top-left title:

```text
Edit the provided image. Remove only the handwritten title "{text to remove}" and its underline from the top-left corner. Fill that area with the same clean white background, matching the surrounding blank space. Preserve everything else exactly: character, labels, paths, line style, composition, aspect ratio, and image quality. Do not add any new text or objects.
```

Make the creature more central:

```text
Regenerate this illustration with the same core meaning and simple layout, but make the small black creature central to the conceptual action. The creature should be doing the strange work that explains the idea, not standing beside the scene. Keep it clean, sparse, hand-drawn, English-only, and not cute.
```

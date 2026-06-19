---
name: cartoon-illustrations
description: Use when the user wants an English article, LinkedIn post, blog, Notion page, workflow, method, concept, offer, or system turned into a weird clean hand-drawn body illustration prompt, shot list, or image-edit prompt. Default to English-only prompt output. Do not generate images directly unless the user explicitly says to generate the image now.
---

# Cartoon Illustrations

## Core Rule

Create image-generation prompts for 16:9 horizontal body illustrations based on English content. The intended image should feel like a clean hand-drawn product sketch: white background, sparse black line art, lots of whitespace, a deadpan black creature doing the conceptual work, and a few short English handwritten labels.

English is mandatory by default:

- Write assistant responses in English.
- Put only English labels in generated images.
- Do not include Chinese characters, Chinese labels, or Chinese headings.

## Default Output

If the user provides text and says anything like "use it on this", "do this input", "turn this into an illustration", or "make this work", return one polished image-generation prompt, not an image.

If the user explicitly asks for planning, analysis, illustration strategy, or a shot list, return a shot list instead of a full prompt.

Only call `image_gen` when the user explicitly says "generate the image", "create the image now", "run image generation", or equivalent direct generation language.

For a normal social post or article excerpt, produce one strong lead-image prompt. Produce multiple prompts only when the user explicitly asks for several images.

## References

Load only what is needed:

- `references/style-dna.md`: visual style, color rules, forbidden outputs.
- `references/xiaohei-ip.md`: black creature shape, role, behavior, and constraints.
- `references/composition-patterns.md`: composition types and fresh metaphor rules.
- `references/prompt-template.md`: image-generation prompt template.
- `references/qa-checklist.md`: post-generation quality checks.
- `assets/examples/`: optional low-frequency visual calibration only. Do not copy the example compositions.

## Workflow

1. Read the user's content.
2. Extract the central idea, cognitive turn, or strongest visual anchor.
3. Pick one metaphor and one structure type.
4. Make the black creature perform the core action, not stand beside it.
5. Output a complete prompt using `references/prompt-template.md`.
6. Check the prompt against `references/qa-checklist.md`.
7. If the prompt allows Chinese text, dense PPT structure, a decorative creature, or too much text, tighten it before returning.

## Prompt Requirements

Each returned prompt must require:

- 16:9 horizontal English article illustration.
- Pure white background.
- Minimal black hand-drawn line art.
- Lots of whitespace.
- Sparse red, orange, and blue handwritten English annotations only.
- A small solid-black deadpan creature doing the core conceptual action.
- No Chinese text.
- No top-left title.
- No PPT, course slide, business infographic, polished vector art, realistic UI, or cute mascot style.

## Save And Deliver

When working inside a repo or workspace, save final images to:

```text
assets/<article-slug>-illustrations/
```

Use ordered names:

```text
01-topic-name.png
02-topic-name.png
```

Do not overwrite existing assets unless the user asks.

Final response should be terse:

- Provide the final prompt.
- State that it is English-only.
- Do not claim an image was generated unless `image_gen` actually returned a visible image or saved file.

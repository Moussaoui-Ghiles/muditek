# Reverse-Engineer Prompt — TikTok Slideshow → Format Schema

Use this when the user provides screenshots (or detailed descriptions) of a viral TikTok slideshow and wants the format extracted as a reusable JSON schema.

## System prompt

```
You are extracting a reusable content format from a viral TikTok slideshow.
Your output is a JSON schema that someone else will fill with new topics to
generate a new slideshow in the same format.

You are NOT summarizing the content. You are extracting STRUCTURE.

Look at all slides as a sequence. Identify:
1. The hook pattern (slide 1 only): emotional trigger + curiosity gap
2. The payoff pattern (middle slides): how content is delivered, slide-by-slide
3. The CTA pattern (final slide): what action the slideshow asks for
4. Visual layout: where text sits, image-to-text ratio, dominant color, font weight
5. Pacing: how the narrative arc moves across slides

Then output JSON conforming to the schema below.
Field rules:
- text_template uses {placeholders} for variable content (topic, number, name, etc.)
- visual_style_notes is concrete, not vague ("bold white serif over dark photo, bottom 40% of frame")
- image_prompt_template is a Stable Diffusion / ChatGPT Images 2.0-style prompt with placeholders
- role is one of: hook | setup | payoff | cta | filler
```

## Output schema

```json
{
  "format_name": "<short-snake-case-name>",
  "niche": "<niche-slug>",
  "source_url": "<original tiktok URL if known>",
  "source_metrics": {
    "likes": <int>,
    "estimated_views": "<range as string>",
    "scraped_date": "YYYY-MM-DD"
  },
  "total_slides": <int>,
  "narrative_arc": "<one sentence describing the emotional/logical progression>",
  "slides": [
    {
      "slide_number": 1,
      "role": "hook",
      "text_template": "<template with {placeholders}>",
      "visual_style_notes": "<specific visual description>",
      "image_prompt_template": "<image-gen prompt with {placeholders}>",
      "text_position": "<top | center | bottom | top-left | bottom-third>",
      "text_emphasis": "<which words bolded/colored/animated>"
    }
    // ... repeat for each slide
  ],
  "caption_template": "<TikTok caption template with {placeholders} + recommended hashtags>",
  "audio_recommendation": "<trending sound type, e.g. 'somber piano under 60s', 'aggressive build', 'voiceover with light beat'>",
  "do_not": ["<banned phrasings>", "<things that break the format>"]
}
```

## Few-shot example

If shown a slideshow with 7 slides where slide 1 is a black background with white bold text "Nobody talks about $X but..." then 5 listicle slides with photos + caption, then a CTA slide with link to comments — output:

```json
{
  "format_name": "nobody_talks_about_listicle",
  "niche": "ai-tools",
  "total_slides": 7,
  "narrative_arc": "Curiosity-gap hook → 5-step listicle payoff → soft CTA to comments",
  "slides": [
    {
      "slide_number": 1,
      "role": "hook",
      "text_template": "Nobody talks about {gap_topic} but {claim}",
      "visual_style_notes": "Pure black background, no image. White Inter Black 96px, centered vertically, takes up middle 60% of frame",
      "image_prompt_template": "Solid black 1080x1920 frame, no objects, no texture",
      "text_position": "center",
      "text_emphasis": "{gap_topic} highlighted in cyan #00E5FF"
    }
    // ... etc
  ],
  "caption_template": "{topic_summary} 👇 #ai #tools #aitoolsforwork",
  "audio_recommendation": "Trending tense / build-up sound, last 72h",
  "do_not": ["call out specific competitor names", "use 'game-changer'", "exceed 12 words on hook"]
}
```

## Validation rules

- Every slide must have non-empty `text_template`, `visual_style_notes`, `image_prompt_template`
- `total_slides` must equal length of `slides`
- `caption_template` must include at least 1 hashtag
- If `narrative_arc` doesn't logically connect each slide's role, regenerate

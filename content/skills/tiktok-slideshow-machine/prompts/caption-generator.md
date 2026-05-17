# Caption Generator — TikTok Slideshow

Generate the TikTok caption + hashtag set that ships with each slideshow.

## System prompt

```
You write TikTok captions for slideshow posts on a faceless theme page.
The caption is NOT a copy of the hook. It is the SECOND chance to convert a
scroller — adds a 1-line tease + delivers the affiliate-context CTA.

Rules:
- Length: 80-150 characters before hashtags
- 3-5 hashtags max (saturation hurts reach in 2026)
- Hashtag mix: 1 broad (>1M posts), 2 mid (100K-1M), 1-2 niche (<100K)
- One short CTA, never two
- No emojis except 1 max for emphasis
- Match the brand voice from `niches/<niche>/brand.md`
- Apply `negative-constraints.md` to all output
```

## Caption structure

```
{1-line tease that complements but doesn't repeat hook}
{1-line CTA}

{hashtag1} {hashtag2} {hashtag3} {hashtag4}
```

## Examples (TESTED.AI brand)

Hook: "I tested 7 AI agents. 5 are trash, 2 are worth it."
Caption:
```
The 2 that survived saved me ~6 hours/week. Bio link has the breakdown.

#aitools #aiagents #aitoolsforwork #productivityhack
```

Hook: "I ran the same prompt through 12 AI writers. Only 3 didn't sound like a robot."
Caption:
```
Tested with the same product brief. Result: every "AI writer" tier list lied to you.

#aiwriting #aitools #contentcreator #copywriting
```

## Hashtag bank for ai-tools niche

- **Broad** (>1M posts): #ai #aitools #tech #productivity
- **Mid** (100K-1M): #aitoolsforwork #aiagents #aiproductivity #aiwriting #chatgpt #aitoolsforbusiness
- **Niche** (<100K): #aiagentbuilder #aitooltesting #aitierlist #aitoolreview

Rotate to avoid pattern flag. Same hashtag set on >5 posts/account → algorithm treats as repetitive.

## Output format

```json
{
  "caption": "<150 chars before hashtags>",
  "hashtags": ["#aitools", "#aiagents", "#aitoolsforwork", "#productivityhack"],
  "char_count": 142,
  "hashtag_count": 4
}
```

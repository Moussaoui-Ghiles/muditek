# Negative Constraints — Banned Phrasings & AI-Slop Signals

Apply these constraints to every hook, caption, slide-text, and CTA generated for TikTok slideshows. Per `library/sources/twitter/roman-khaves`: feeding real TikTok comments + negative constraints separates posts that get pushed from posts that get buried.

## Banned words/phrases (auto-reject if present)

Hype-marketing:
- game-changer, game changer, gamechanger
- revolutionary, revolutionize
- must-have, must have
- elevate (your X)
- unlock (your X potential)
- 10x (your X)
- "in [year]" appended without specific reason
- "the future of X"
- "let's dive in", "let's break it down", "today we're going to talk about"
- supercharge
- harness the power of
- in today's fast-paced world

Default LLM tells:
- delve, delving, delved
- comprehensive, robust, holistic
- ensure, ensuring
- meticulously, seamlessly
- crafted, crafting
- whilst (over "while")
- furthermore, moreover, additionally (chained)
- "it's important to note that"
- "in conclusion"

Empty filler:
- really, actually, literally, basically, simply, just (as filler)
- amazing, incredible, mind-blowing (without earned context)
- "you won't believe"
- "this is everything"

Generic AI content tells:
- "in today's digital age"
- "in this era of"
- "as an AI"
- emoji vomit (more than 1 emoji per 12 words)

## Banned visual patterns

- Purple gradient backgrounds (default LLM image-gen output)
- Default Inter font without weight specification (everyone uses it the same way)
- Stock-photo "person staring at laptop"
- Generic "AI" representations: glowing brain, robotic hand reaching, generic neural network mesh
- Emoji-as-visual replacements (💡 instead of an actual lightbulb image)

## Banned structural patterns

- Slide that says "Like and follow for more" without earning it first
- "Comment X to get Y" without specifying what X actually delivers
- Self-introduction on slide 1 ("Hi I'm X")
- Hook that doesn't promise a payoff
- CTA that doesn't match the hook
- Listicle where item N+1 is a paraphrase of item N

## Required vs forbidden patterns by content layer

| Layer | Required | Forbidden |
|---|---|---|
| Hook (slide 1) | Specific number, concrete claim, curiosity gap | Aspirational verbs, hedging words |
| Body slides | Concrete examples, named tools/people | Vague "many", "most", "studies show" |
| CTA slide | One clear action, link in bio reference | Multiple CTAs, "more in comments AND DM AND link" |
| Caption | Hook-payoff match, 3-5 hashtags max | Hashtag stuffing (10+), emoji walls |

## Override rule

If the user explicitly cites a top-performing slideshow that breaks one of these rules, the rule yields to the source data. The constraints are heuristics from library notes — the actual algorithm signal beats the heuristic.

## Audit checklist (run before output)

```
[ ] No banned words/phrases anywhere
[ ] Hook contains a specific number OR concrete claim
[ ] No more than 1 emoji per slide
[ ] Each body slide says something the hook didn't already promise
[ ] CTA earns its ask (delivered the payoff first)
[ ] Caption has 3-5 hashtags, not 10+
[ ] No purple gradients in image prompts
```

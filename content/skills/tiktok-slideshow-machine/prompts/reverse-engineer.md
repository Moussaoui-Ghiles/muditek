# Reverse-engineer a slideshow

```text
Analyze the complete slideshow supplied by the user.

Extract reusable structure, not the creator's claims.

For each slide record:
- slide number;
- role: hook, setup, evidence, payoff, or CTA;
- text hierarchy;
- text position;
- image or logo treatment;
- density and safe margins;
- how it connects to the previous and next slide.

Also record:
- source URL;
- capture date;
- visible metrics, with no estimates;
- the overall narrative arc;
- the design tokens that can be reused;
- elements that must not be copied.

Return JSON matching templates/format-schema.template.json.
Use null for unknown fields. Do not infer missing metrics or slides.
```

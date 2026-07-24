import { createHash } from "node:crypto";
import { containsInlineImages, htmlToPlainText } from "./newsletter-html";

export type NewsletterCampaignType = "reactivation" | "editorial";

export type NewsletterDraft = {
  subject: string;
  previewText?: string | null;
  html: string;
  audienceFilter?: string | null;
  campaignType?: NewsletterCampaignType | null;
};

export type PreflightFinding = {
  code: string;
  message: string;
};

export type NewsletterPreflight = {
  errors: PreflightFinding[];
  warnings: PreflightFinding[];
  links: string[];
  wordCount: number;
};

const ALLOWED_PLACEHOLDERS = new Set(["NEWSLETTER_CONFIRM_URL"]);

export function newsletterContentHash(draft: NewsletterDraft): string {
  return createHash("sha256")
    .update(
      JSON.stringify({
        subject: draft.subject.trim(),
        previewText: draft.previewText?.trim() ?? "",
        html: draft.html.trim(),
        audienceFilter: draft.audienceFilter ?? "all",
        campaignType: draft.campaignType ?? "editorial",
      }),
    )
    .digest("hex");
}

function extractLinks(html: string): string[] {
  const links: string[] = [];
  const pattern = /<a\b[^>]*\bhref\s*=\s*["']([^"']+)["'][^>]*>/gi;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(html)) !== null) links.push(match[1].trim());
  return links;
}

function extractPlaceholders(value: string): string[] {
  return [...value.matchAll(/\{\{\s*([A-Z0-9_]+)\s*\}\}/g)].map((match) => match[1]);
}

export function validateNewsletterDraft(draft: NewsletterDraft): NewsletterPreflight {
  const errors: PreflightFinding[] = [];
  const warnings: PreflightFinding[] = [];
  const subject = draft.subject.trim();
  const html = draft.html.trim();
  const plainText = htmlToPlainText(html);
  const links = extractLinks(html);
  const wordCount = plainText ? plainText.split(/\s+/).filter(Boolean).length : 0;

  if (!subject) errors.push({ code: "subject_missing", message: "Subject is required." });
  if (subject.length > 80) {
    warnings.push({
      code: "subject_long",
      message: "Subject is longer than 80 characters and may be truncated.",
    });
  }
  if (!html || html === "<p></p>" || wordCount < 20) {
    errors.push({
      code: "body_incomplete",
      message: "Email body must contain at least 20 words.",
    });
  }
  if (containsInlineImages(html)) {
    errors.push({
      code: "inline_image",
      message: "Inline base64 images are not deliverable. Use hosted HTTPS images.",
    });
  }
  if (/<\s*(script|iframe|form|input|button|video|audio)\b/i.test(html)) {
    errors.push({
      code: "unsupported_html",
      message: "Email contains unsupported interactive or executable HTML.",
    });
  }
  for (const match of html.matchAll(/<img\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/gi)) {
    const source = match[1].trim();
    if (!/^https:\/\//i.test(source)) {
      errors.push({
        code: "unsafe_image",
        message: `Images must use a hosted HTTPS URL: ${source}`,
      });
    }
  }

  for (const link of links) {
    if (
      link === "#" ||
      link.startsWith("#") ||
      /^javascript:/i.test(link) ||
      /localhost|127\.0\.0\.1/i.test(link)
    ) {
      errors.push({ code: "invalid_link", message: `Invalid send link: ${link}` });
      continue;
    }
    if (
      !/^https:\/\//i.test(link) &&
      !/^mailto:/i.test(link) &&
      !link.includes("{{NEWSLETTER_CONFIRM_URL}}")
    ) {
      errors.push({
        code: "unsafe_link",
        message: `Links must use HTTPS or mailto: ${link}`,
      });
    }
  }

  const placeholders = extractPlaceholders(`${subject}\n${draft.previewText ?? ""}\n${html}`);
  for (const placeholder of new Set(placeholders)) {
    if (!ALLOWED_PLACEHOLDERS.has(placeholder)) {
      errors.push({
        code: "unknown_placeholder",
        message: `Unknown placeholder: {{${placeholder}}}`,
      });
    }
  }

  if (
    (draft.campaignType ?? "editorial") === "reactivation" &&
    !html.includes("{{NEWSLETTER_CONFIRM_URL}}")
  ) {
    errors.push({
      code: "confirmation_missing",
      message: "Reactivation emails must contain the confirmation link.",
    });
  }

  if (!draft.previewText?.trim()) {
    warnings.push({
      code: "preview_missing",
      message: "Preview text is empty. Inbox clients may show body copy instead.",
    });
  }
  if (wordCount > 500) {
    warnings.push({
      code: "body_long",
      message: "Email is longer than 500 words. Consider one email, one job.",
    });
  }

  return { errors, warnings, links, wordCount };
}

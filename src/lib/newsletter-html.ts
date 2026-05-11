export function containsInlineImages(html: string): boolean {
  return /<img\b[^>]*\bsrc=["']data:image\//i.test(html);
}

function addStyle(html: string, tag: string, style: string): string {
  const re = new RegExp(`<${tag}(\\s[^>]*)?>`, "gi");
  return html.replace(re, (match, attrs = "") => {
    if (/\sstyle\s*=/.test(attrs)) return match;
    return `<${tag}${attrs} style="${style}">`;
  });
}

function styleImages(html: string): string {
  return html.replace(/<img\b([^>]*)>/gi, (match, attrs = "") => {
    const imageStyle = "display:block;max-width:100%;height:auto;margin:24px 0;border:0;outline:none;text-decoration:none;";
    if (/\sstyle\s*=/.test(attrs)) return match;
    const trimmed = attrs.trimEnd();
    const selfClosing = trimmed.endsWith("/");
    const cleanAttrs = selfClosing ? trimmed.slice(0, -1).trimEnd() : attrs;
    return `<img${cleanAttrs} style="${imageStyle}"${selfClosing ? " /" : ""}>`;
  });
}

export function styleIssueHtmlForEmail(html: string): string {
  let out = html;
  out = addStyle(out, "h1", "font-size:26px;line-height:1.18;margin:32px 0 14px;color:#111111;font-weight:700;");
  out = addStyle(out, "h2", "font-size:21px;line-height:1.25;margin:28px 0 12px;color:#111111;font-weight:700;");
  out = addStyle(out, "h3", "font-size:17px;line-height:1.35;margin:22px 0 10px;color:#111111;font-weight:700;");
  out = addStyle(out, "p", "margin:0 0 16px;font-size:16px;color:#1a1a1a;line-height:1.72;");
  out = addStyle(out, "ul", "margin:0 0 18px;padding-left:22px;color:#1a1a1a;line-height:1.72;font-size:16px;");
  out = addStyle(out, "ol", "margin:0 0 18px;padding-left:22px;color:#1a1a1a;line-height:1.72;font-size:16px;");
  out = addStyle(out, "li", "margin:0 0 8px;");
  out = addStyle(out, "blockquote", "margin:22px 0;padding:2px 0 2px 18px;border-left:3px solid #d6cdb8;color:#4a3f33;font-style:italic;");
  out = addStyle(out, "code", "background:#f2eee4;border-radius:4px;padding:2px 5px;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:0.92em;");
  out = addStyle(out, "a", "color:#111111;text-decoration:underline;text-underline-offset:2px;");
  out = out.replace(/<hr\s*\/?>/gi, '<hr style="border:0;border-top:1px solid #d6cdb8;margin:30px 0;" />');
  out = styleImages(out);
  return out;
}

export function wrapIssueHtml(bodyHtml: string, footer: { unsubUrl: string; prefsUrl: string }): string {
  const logoUrl = "https://muditek.com/brand/muditek-logo-dark.png";
  return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;max-width:620px;margin:0 auto;padding:40px 20px;background:#ffffff;color:#1a1a1a;">
      <div style="margin-bottom:28px;">
        <a href="https://muditek.com" style="text-decoration:none;display:inline-block;">
          <img src="${logoUrl}" alt="Muditek" width="120" height="28" style="display:block;border:0;outline:none;text-decoration:none;height:28px;" />
        </a>
      </div>

      ${styleIssueHtmlForEmail(bodyHtml)}

      <p style="margin:48px 0 0;font-size:12px;color:#8a8a8a;line-height:1.7;">
        Muditek &middot; Ghiles Moussaoui &middot; <a href="mailto:ghiles@muditek.com" style="color:#8a8a8a;text-decoration:underline;">ghiles@muditek.com</a><br/>
        <a href="${footer.prefsUrl}" style="color:#8a8a8a;text-decoration:underline;">Manage preferences</a> &middot; <a href="${footer.unsubUrl}" style="color:#8a8a8a;text-decoration:underline;">Unsubscribe</a>
      </p>
    </div>
  `;
}

export function htmlToPlainText(html: string): string {
  if (!html) return "";
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|h1|h2|h3|h4|h5|h6|li|tr|div)>/gi, "\n\n")
    .replace(/<li[^>]*>/gi, "- ")
    .replace(/<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, "$2 ($1)")
    .replace(/<img[^>]*alt=["']([^"']*)["'][^>]*>/gi, "[image: $1]")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

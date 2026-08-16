import { loadEnv } from "./_load-env.mts";
loadEnv();
import { Resend } from "resend";

const r = new Resend(process.env.RESEND_API_KEY);

const result = await r.emails.send({
  from: "Ghiles <resources@mail.ghiless.com>",
  to: "biz@ghiless.com",
  subject: "fresh tracking test v2 — open me",
  html: `<p>Fresh tracking probe ${new Date().toISOString()}.</p>
<p>To test BOTH events fire, open this email with images loaded (Gmail web auto-loads them), then click the link.</p>
<p><a href="https://muditek.com/portal">Click here to fire click event</a></p>`,
  text: `Fresh tracking probe ${new Date().toISOString()}.`,
});

console.log("ID:", (result.data as any)?.id, "error:", result.error);
process.exit(0);

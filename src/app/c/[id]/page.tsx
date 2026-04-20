import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import { getEmbedUrl } from "@/lib/linkedin";
import SubmitForm from "./submit-form";

export default async function CampaignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return notFound();

  const sql = getDb();
  const campaigns = await sql`SELECT id, title, keyword, post_url, post_activity_id, is_active, expires_at FROM campaigns WHERE id = ${id}`;
  const campaign = campaigns[0];
  if (!campaign) return notFound();

  const expired = !campaign.is_active || (campaign.expires_at && new Date(campaign.expires_at) < new Date());

  if (expired) {
    return (
      <main className="min-h-[100dvh] bg-[#0c0c0e] text-[#e8e8ec] flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <h1 className="text-xl font-bold mb-2">This offer has ended</h1>
          <p className="text-sm text-[#a0a0a6]">Follow the author on LinkedIn for future resources.</p>
        </div>
      </main>
    );
  }

  const embedUrl = campaign.post_activity_id ? getEmbedUrl(campaign.post_activity_id) : null;

  return (
    <main className="min-h-[100dvh] bg-[#0c0c0e] text-[#e8e8ec] flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-xl space-y-6">
        {embedUrl && (
          <div className="rounded-xl overflow-hidden border border-[#232326] bg-white">
            <iframe src={embedUrl} height="380" width="100%" frameBorder="0" allowFullScreen title="LinkedIn Post" className="w-full" />
          </div>
        )}

        <div className="border border-[#232326] rounded-xl px-5 py-3 text-sm text-[#a0a0a6]">
          Comment <span className="font-bold text-[#e8e8ec]">&ldquo;{campaign.keyword}&rdquo;</span> and like the post, then enter your details below.
        </div>

        <div className="bg-[#151517] border border-[#232326] rounded-xl p-6 sm:p-8">
          <p className="text-xs font-bold tracking-wider uppercase text-[#636366] font-[family-name:var(--font-geist-mono)] mb-3">Free Resource</p>
          <h1 className="text-2xl font-bold tracking-tight mb-2">{campaign.title}</h1>
          <p className="text-sm text-[#a0a0a6] mb-6">Enter your name and email. We verify your comment and send it to your inbox.</p>
          <SubmitForm campaignId={id} title={campaign.title} keyword={campaign.keyword} postUrl={campaign.post_url} />
        </div>

        <div className="flex gap-6 justify-center text-xs text-[#636366]">
          <span>Verified via LinkedIn comment</span>
          <span>Delivered within 24hrs</span>
        </div>
      </div>
    </main>
  );
}

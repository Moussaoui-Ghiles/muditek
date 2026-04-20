import PreferencesContent from "./preferences-content";

export default async function PreferencesPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ unsubscribed?: string }>;
}) {
  const { token } = await params;
  const sp = await searchParams;
  return <PreferencesContent token={token} unsubscribed={sp.unsubscribed === "1"} />;
}

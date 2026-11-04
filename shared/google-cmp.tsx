// Google creates/configures the European regulations message in AdSense
// Privacy & messaging. The CMP endpoint expects the complete AdSense client
// id (including the `ca-` prefix), not only the numeric publisher id.
const client =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "ca-pub-7889756010922674";

export function GoogleCmp() {
  if (!client) return null;

  // Render it in the server HTML. The CMP must initialize independently of
  // React hydration; otherwise the page can be visible while its request has
  // not yet been scheduled.
  return (
    <script
      id="copero-google-cmp"
      async
      src={`https://fundingchoicesmessages.google.com/i/${client}?ers=2`}
    />
  );
}

import FeedClient from "./FeedClient";

export default async function FeedPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic: slug } = await params;
  return <FeedClient slug={slug} />;
}

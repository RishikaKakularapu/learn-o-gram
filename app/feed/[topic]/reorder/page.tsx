import ReorderClient from "./ReorderClient";

export default async function ReorderPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  return <ReorderClient slug={topic} />;
}

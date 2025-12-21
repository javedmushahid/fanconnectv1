import StreamViewer from "@/components/streaming/stream-viewer";

export default async function StreamPage({
  params,
}: {
  params: Promise<{ streamId: string }>;
}) {
  const { streamId } = await params;

  return <StreamViewer streamId={streamId} />;
}

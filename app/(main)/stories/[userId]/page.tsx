import StoryViewer from '@/components/stories/story-viewer'

export default async function ViewStoryPage({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const { userId } = await params

  return <StoryViewer userId={userId} />
}

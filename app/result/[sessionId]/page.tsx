const Page = async ({ params }: { params: Promise<{ sessionId: string }> }) => {
  const { sessionId } = await params;

  return <>기본</>;
};

export default Page;

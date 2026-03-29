import { fetchNotes } from '@/lib/api';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import NotesClient from './Notes.client';
import { NoteTag } from '@/types/note';

type NotesPageProps = {
  params: Promise<{ slug: string[] }>;
};

export default async function NotesPage({ params }: NotesPageProps) {
  const queryClient = new QueryClient();
  const { slug } = await params;
  const selectedTag = slug[0] === 'all' ? undefined : (slug[0] as NoteTag);

  await queryClient.prefetchQuery({
    queryKey: ['notes', 1, '', selectedTag],
    queryFn: () => fetchNotes(1, 12, '', selectedTag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={selectedTag} />
    </HydrationBoundary>
  );
}

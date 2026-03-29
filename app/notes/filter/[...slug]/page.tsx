import { fetchNotes } from '@/lib/api';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import NotesClient from './Notes.client';
import { NoteTag } from '@/types/note';
import { Metadata } from 'next';

type NotesPageProps = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({
  params,
}: NotesPageProps): Promise<Metadata> {
  const { slug } = await params;

  return {
    title: `Filtered as ${slug[0]}`,
    description: `Displayed all notes filtered using tag chosen by user. Current tag is ${slug[0]}`,
    openGraph: {
      title: `Filtered as ${slug[0]}`,
      description: `Displayed all notes filtered using tag chosen by user. Current tag is ${slug[0]}`,
      url: `https://08-zustand-beta-six-31.vercel.app/notes/filter/${slug[0]}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: 'NoteHub',
        },
      ],
    },
  };
}

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

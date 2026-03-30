'use client';

import css from './page.module.css';
import NoteList from '@/components/NoteList/NoteList';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import { useState } from 'react';
import Pagination from '@/components/Pagination/Pagination';
import { useDebouncedCallback } from 'use-debounce';
import SearchBox from '@/components/SearchBox/SearchBox';
import { NoteTag } from '@/types/note';
import Link from 'next/link';

interface NotesClientProps {
  tag?: NoteTag;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [page, setPage] = useState<number>(1);
  const perPage = 12;
  const [query, setQuery] = useState<string>('');

  const { data } = useQuery({
    queryKey: ['notes', page, query, tag],
    queryFn: () => fetchNotes(page, perPage, query, tag),
    placeholderData: keepPreviousData,
  });

  const searchNote = useDebouncedCallback((value: string) => {
    setQuery(value);
    setPage(1);
  }, 500);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onNoteSearch={searchNote} value={query} />
        {data && data.totalPages > 1 && (
          <Pagination
            totalPages={data.totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}
        <Link className={css.button} href="/notes/action/create">
          Create note +
        </Link>
      </header>

      {data && <NoteList notes={data.notes} />}
    </div>
  );
}

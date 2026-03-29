'use client';

import css from './page.module.css';
import NoteList from '@/components/NoteList/NoteList';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import { useState } from 'react';
import Pagination from '@/components/Pagination/Pagination';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';
import { useDebouncedCallback } from 'use-debounce';
import SearchBox from '@/components/SearchBox/SearchBox';
import { NoteTag } from '@/types/note';

interface NotesClientProps {
  tag?: NoteTag;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [page, setPage] = useState<number>(1);
  const perPage = 12;
  const [isModalShown, setIsModalShown] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');

  const { data } = useQuery({
    queryKey: ['notes', page, query, tag],
    queryFn: () => fetchNotes(page, perPage, query, tag),
    placeholderData: keepPreviousData,
  });

  const onClose = () => setIsModalShown(false);

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
        <button className={css.button} onClick={() => setIsModalShown(true)}>
          Create note +
        </button>
      </header>

      {data && <NoteList notes={data.notes} />}
      {isModalShown && (
        <Modal onClose={onClose}>
          <NoteForm onClose={onClose} />
        </Modal>
      )}
    </div>
  );
}

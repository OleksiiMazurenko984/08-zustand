'use client';

import { useId } from 'react';
import css from './NoteForm.module.css';
import type { NoteData, NoteTag } from '../../types/note';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useNoteDraftStore } from '@/lib/store/noteStore';

const allowedTags: NoteTag[] = [
  'Todo',
  'Work',
  'Personal',
  'Meeting',
  'Shopping',
];

export default function NoteForm() {
  const id = useId();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { noteDraft, setNoteDraft, clearNoteDraft } = useNoteDraftStore();

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setNoteDraft({
      ...noteDraft,
      [event.target.name]: event.target.value,
    });
  };

  const { mutateAsync: addNote, isPending } = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      clearNoteDraft();
      router.back();
    },
  });

  const handleSubmit = async (formData: FormData) => {
    const title = String(formData.get('title')).trim();
    const content = String(formData.get('content')).trim();
    const tag = String(formData.get('tag')) as NoteTag;

    if (title.length < 3 || title.length > 50) return;
    if (content.length > 500) return;
    if (!allowedTags.includes(tag)) return;

    const noteData: NoteData = {
      title,
      content,
      tag,
    };

    await addNote(noteData);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <form className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor={`${id}-title`}>Title</label>
        <input
          className={css.input}
          type="text"
          name="title"
          id={`${id}-title`}
          minLength={3}
          maxLength={50}
          required
          defaultValue={noteDraft.title}
          onChange={handleChange}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`${id}-content`}>Content</label>
        <textarea
          id={`${id}-content`}
          name="content"
          rows={8}
          className={css.textarea}
          maxLength={500}
          defaultValue={noteDraft.content}
          onChange={handleChange}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`${id}-tag`}>Tag</label>
        <select
          id={`${id}-tag`}
          name="tag"
          className={css.select}
          defaultValue={noteDraft.tag}
          onChange={handleChange}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={handleCancel}
          disabled={isPending}
        >
          Cancel
        </button>

        <button
          type="submit"
          className={css.submitButton}
          formAction={handleSubmit}
          disabled={isPending}
        >
          {isPending ? 'Creating...' : 'Create note'}
        </button>
      </div>
    </form>
  );
}

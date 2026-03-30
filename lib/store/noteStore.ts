import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { NoteData } from '@/types/note';

interface NoteDraft {
  noteDraft: NoteData;
  setNoteDraft: (newNoteData: NoteData) => void;
  clearNoteDraft: () => void;
}

export const initialNoteDraft: NoteData = {
  title: '',
  content: '',
  tag: 'Todo',
};

export const useNoteDraftStore = create<NoteDraft>()(
  persist(
    set => {
      return {
        noteDraft: initialNoteDraft,
        setNoteDraft: newNoteDraft => {
          set({
            noteDraft: newNoteDraft,
          });
        },
        clearNoteDraft: () => {
          set({
            noteDraft: initialNoteDraft,
          });
        },
      };
    },
    {
      name: 'note-draft',
      partialize: state => ({ noteDraft: state.noteDraft }),
    }
  )
);

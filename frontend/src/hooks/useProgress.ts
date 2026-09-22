import { useState, useEffect } from 'react';
import { api } from '../services/api';

export function useProgress() {
  const [state, setState] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchState = async () => {
    try {
      const res = await api.getState();
      setState(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchState();
  }, []);

  const updateProgress = async (lessonId: string, completed: boolean) => {
    await api.updateProgress(lessonId, completed);
    await fetchState();
  };

  const updateNotes = async (lessonId: string, notes: any) => {
    await api.updateNotes(lessonId, notes);
    await fetchState();
  };

  const updateChecklist = async (lessonId: string, itemIndex: number, checked: boolean) => {
    await api.updateChecklist(lessonId, itemIndex, checked);
    await fetchState();
  };

  return { state, loading, updateProgress, updateNotes, updateChecklist, refresh: fetchState };
}

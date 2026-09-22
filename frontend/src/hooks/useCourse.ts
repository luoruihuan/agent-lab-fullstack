import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Course } from '../types/course';

export function useCourse() {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    api.getCourse()
      .then(res => setCourse(res))
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, []);

  return { course, loading, error };
}

const BASE_URL = '/api';

async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (!res.ok) {
    if (res.status === 401) {
      window.location.href = '/login';
    }
    throw new Error(await res.text() || res.statusText);
  }
  return res.json();
}

export const api = {
  login: (data: any) => fetchApi('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  logout: () => fetchApi('/auth/logout', { method: 'POST' }),
  getMe: () => fetchApi('/auth/me'),
  getCourse: () => fetchApi('/course'),
  getState: () => fetchApi('/me/state'),
  updateProgress: (lessonId: string, completed: boolean) => fetchApi(`/me/progress/${lessonId}`, { method: 'PUT', body: JSON.stringify({ completed }) }),
  updateNotes: (lessonId: string, notes: any) => fetchApi(`/me/notes/${lessonId}`, { method: 'PUT', body: JSON.stringify(notes) }),
  updateChecklist: (lessonId: string, itemIndex: number, checked: boolean) => fetchApi(`/me/checklist/${lessonId}/${itemIndex}`, { method: 'PUT', body: JSON.stringify({ checked }) }),
  runCode: (code: string, lessonId: string) => fetchApi('/me/run-code', { method: 'POST', body: JSON.stringify({ code, lessonId }) }),
  getSettings: () => fetchApi('/me/settings'),
  updateSettings: (settings: any) => fetchApi('/me/settings', { method: 'PUT', body: JSON.stringify(settings) }),
  search: (q: string) => fetchApi(`/search?q=${encodeURIComponent(q)}`),
};

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './components/auth/LoginPage';
import LessonView from './components/lesson/LessonView';
import { message } from 'antd';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<AppLayout />}>
          <Route path="lesson/:lessonId" element={<LessonView />} />
          <Route index element={<Navigate to="/lesson/intro" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;

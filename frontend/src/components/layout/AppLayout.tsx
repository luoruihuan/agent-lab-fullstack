import React, { useMemo } from 'react';
import { Layout, Spin } from 'antd';
import { Outlet } from 'react-router-dom';
import TopBar from './TopBar';
import Sidebar from './Sidebar';
import { useCourse } from '../../hooks/useCourse';
import { useProgress } from '../../hooks/useProgress';

const { Header, Sider, Content } = Layout;

const AppLayout: React.FC = () => {
  const { course, loading: courseLoading } = useCourse();
  const { state, loading: progressLoading } = useProgress();

  const totalLessons = useMemo(() => {
    if (!course) return 0;
    let count = 0;
    course.stages.forEach(s => s.chapters.forEach(c => count += c.lessons.length));
    return count;
  }, [course]);

  const completedCount = useMemo(() => {
    if (!state || !state.progress) return 0;
    return Object.values(state.progress).filter(Boolean).length;
  }, [state]);

  if (courseLoading || progressLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Spin size="large" /></div>;
  }

  if (!course) {
    return <div>Failed to load course data.</div>;
  }

  return (
    <Layout style={{ height: '100vh', overflow: 'hidden' }}>
      <Header style={{ padding: 0, height: 64, lineHeight: '64px', background: '#fff' }}>
        <TopBar completedCount={completedCount} totalCount={totalLessons} />
      </Header>
      <Layout>
        <Sider width={260} theme="light" style={{ overflowY: 'auto', borderRight: '1px solid #f0f0f0' }}>
          <Sidebar course={course} progress={state?.progress || {}} />
        </Sider>
        <Content style={{ display: 'flex', background: '#fff', overflow: 'hidden' }}>
          <Outlet context={{ course, state }} />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;

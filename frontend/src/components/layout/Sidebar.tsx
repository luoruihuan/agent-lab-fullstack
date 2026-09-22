import React from 'react';
import { Menu } from 'antd';
import { Course } from '../../types/course';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircleOutlined } from '@ant-design/icons';

interface SidebarProps {
  course: Course;
  progress: Record<string, boolean>;
}

const Sidebar: React.FC<SidebarProps> = ({ course, progress }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname.replace('/lesson/', '');

  const items = course.stages.map(stage => ({
    key: `stage-${stage.id}`,
    label: stage.title,
    children: stage.chapters.map(chapter => ({
      key: `chapter-${chapter.id}`,
      label: chapter.title,
      children: chapter.lessons.map(lesson => ({
        key: lesson.id,
        label: (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{lesson.title}</span>
            {progress[lesson.id] && <CheckCircleOutlined style={{ color: '#52c41a' }} />}
          </div>
        ),
      }))
    }))
  }));

  // Find the stage key of the current lesson to default open it
  let defaultOpenKeys: string[] = [];
  course.stages.forEach(stage => {
    stage.chapters.forEach(chapter => {
      if (chapter.lessons.some(l => l.id === currentPath)) {
        defaultOpenKeys = [`stage-${stage.id}`, `chapter-${chapter.id}`];
      }
    });
  });

  return (
    <Menu
      mode="inline"
      selectedKeys={[currentPath]}
      defaultOpenKeys={defaultOpenKeys}
      style={{ height: '100%', borderRight: 0 }}
      items={items}
      onClick={({ key }) => {
        if (!key.startsWith('stage-') && !key.startsWith('chapter-')) {
          navigate(`/lesson/${key}`);
        }
      }}
    />
  );
};

export default Sidebar;

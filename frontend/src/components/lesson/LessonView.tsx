import React, { useMemo } from 'react';
import { useParams, useOutletContext, useNavigate } from 'react-router-dom';
import { Tabs, Button } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { Course, Lesson, Chapter, Stage } from '../../types/course';
import CoreContent from './CoreContent';
import ConceptTab from './ConceptTab';
import InterviewTab from './InterviewTab';
import LabPanel from '../lab/LabPanel';
import { useProgress } from '../../hooks/useProgress';

interface ContextType {
  course: Course;
  state: any;
}

const LessonView: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const { course, state } = useOutletContext<ContextType>();
  const navigate = useNavigate();
  const { updateProgress } = useProgress();

  const { lesson, chapter, stage, prevLessonId, nextLessonId } = useMemo(() => {
    let lesson: Lesson | undefined;
    let chapter: Chapter | undefined;
    let stage: Stage | undefined;
    let flatLessons: { id: string }[] = [];

    for (const s of course.stages) {
      for (const c of s.chapters) {
        for (const l of c.lessons) {
          flatLessons.push({ id: l.id });
          if (l.id === lessonId) {
            lesson = l;
            chapter = c;
            stage = s;
          }
        }
      }
    }

    const currentIndex = flatLessons.findIndex(l => l.id === lessonId);
    const prevLessonId = currentIndex > 0 ? flatLessons[currentIndex - 1].id : null;
    const nextLessonId = currentIndex < flatLessons.length - 1 ? flatLessons[currentIndex + 1].id : null;

    return { lesson, chapter, stage, prevLessonId, nextLessonId };
  }, [course, lessonId]);

  if (!lesson) {
    return <div style={{ padding: 24 }}>Lesson not found</div>;
  }

  const isCompleted = state?.progress?.[lesson.id];

  const handleToggleComplete = () => {
    updateProgress(lesson.id, !isCompleted);
  };

  const tabItems = [
    {
      key: 'core',
      label: '核心概念',
      children: <CoreContent lesson={lesson} stage={stage} />,
    },
    {
      key: 'concept',
      label: '概念图&术语',
      children: <ConceptTab lesson={lesson} chapter={chapter} />,
    },
    {
      key: 'interview',
      label: '面试题',
      children: <InterviewTab lesson={lesson} />,
    },
  ];

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 0' }}>
          <Tabs defaultActiveKey="core" items={tabItems} style={{ padding: '0 24px' }} />
        </div>
        
        {/* Bottom Navigation */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' }}>
          <Button disabled={!prevLessonId} onClick={() => prevLessonId && navigate(`/lesson/${prevLessonId}`)}>
            ← 上一节
          </Button>
          <Button 
            type={isCompleted ? 'default' : 'primary'} 
            icon={isCompleted && <CheckOutlined />}
            onClick={handleToggleComplete}
            style={isCompleted ? { color: '#52c41a', borderColor: '#52c41a' } : {}}
          >
            {isCompleted ? '已完成' : '✓ 标记完成'}
          </Button>
          <Button disabled={!nextLessonId} onClick={() => nextLessonId && navigate(`/lesson/${nextLessonId}`)}>
            下一节 →
          </Button>
        </div>
      </div>

      {/* Lab Panel Area */}
      <div style={{ width: 420, borderLeft: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column' }}>
        <LabPanel lesson={lesson} state={state} />
      </div>
    </div>
  );
};

export default LessonView;

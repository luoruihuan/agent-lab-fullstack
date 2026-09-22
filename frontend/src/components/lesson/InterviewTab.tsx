import React from 'react';
import { Collapse, Typography } from 'antd';
import { Lesson } from '../../types/course';

const { Paragraph } = Typography;

interface InterviewTabProps {
  lesson: Lesson;
}

const InterviewTab: React.FC<InterviewTabProps> = ({ lesson }) => {
  if (!lesson.interview || lesson.interview.length === 0) {
    return <div style={{ padding: 24 }}>暂无面试题。</div>;
  }

  const items = lesson.interview.map((item, index) => ({
    key: String(index),
    label: item.q,
    children: <Paragraph style={{ whiteSpace: 'pre-wrap' }}>{item.a}</Paragraph>,
  }));

  return (
    <div style={{ padding: '0 24px' }}>
      <Collapse items={items} />
    </div>
  );
};

export default InterviewTab;

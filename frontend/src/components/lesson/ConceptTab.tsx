import React, { useState } from 'react';
import { Button, Card, Drawer, Typography, Row, Col } from 'antd';
import { Lesson, Chapter } from '../../types/course';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

interface ConceptTabProps {
  lesson: Lesson;
  chapter?: Chapter;
}

const ConceptTab: React.FC<ConceptTabProps> = ({ lesson, chapter }) => {
  const navigate = useNavigate();
  const [selectedTerm, setSelectedTerm] = useState<any>(null);

  return (
    <div style={{ padding: '0 24px' }}>
      {chapter && (
        <div style={{ marginBottom: 32 }}>
          <Title level={4}>本章知识点导航</Title>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {chapter.lessons.map(l => (
              <Button
                key={l.id}
                type={l.id === lesson.id ? 'primary' : 'default'}
                onClick={() => navigate(`/lesson/${l.id}`)}
              >
                {l.title}
              </Button>
            ))}
          </div>
        </div>
      )}

      {lesson.terms && lesson.terms.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <Title level={4}>核心术语字典</Title>
          <Row gutter={[16, 16]}>
            {lesson.terms.map((term, i) => (
              <Col span={8} key={i}>
                <Card
                  hoverable
                  size="small"
                  onClick={() => setSelectedTerm(term)}
                  title={term.name}
                >
                  <Paragraph ellipsis={{ rows: 2 }}>{term.summary}</Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}

      {chapter?.examples && chapter.examples.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <Title level={4}>本章示例</Title>
          {chapter.examples.map((ex, i) => (
            <Card key={i} size="small" title={ex.title} style={{ marginBottom: 16 }}>
              <p><strong>场景：</strong>{ex.scenario}</p>
              <p><strong>收获：</strong>{ex.takeaway}</p>
            </Card>
          ))}
        </div>
      )}

      <Drawer
        title={selectedTerm?.name}
        open={!!selectedTerm}
        onClose={() => setSelectedTerm(null)}
        width={400}
      >
        {selectedTerm && (
          <div>
            <Paragraph strong>{selectedTerm.summary}</Paragraph>
            {selectedTerm.detail?.map((p: string, i: number) => (
              <Paragraph key={i}>{p}</Paragraph>
            ))}
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default ConceptTab;

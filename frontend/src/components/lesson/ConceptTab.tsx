import React, { useState } from 'react';
import { Button, Card, Modal, Typography, Row, Col } from 'antd';
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

      <Modal
        title={selectedTerm?.name}
        open={!!selectedTerm}
        onCancel={() => setSelectedTerm(null)}
        footer={[
          <Button key="close" type="primary" onClick={() => setSelectedTerm(null)}>
            关闭
          </Button>
        ]}
        width={600}
      >
        {selectedTerm && (
          <div style={{ maxHeight: '60vh', overflowY: 'auto', padding: '12px 0' }}>
            <Paragraph strong style={{ fontSize: 15, color: '#1677ff' }}>{selectedTerm.summary}</Paragraph>
            {selectedTerm.detail?.map((p: string, i: number) => (
              <Paragraph key={i} style={{ lineHeight: 1.7, marginBottom: 12 }}>{p}</Paragraph>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ConceptTab;

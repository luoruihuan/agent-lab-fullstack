import React from 'react';
import { Alert, Typography, Steps, List, Table, Card } from 'antd';
import { BookOutlined, CloseCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { Lesson, Stage } from '../../types/course';

const { Title, Paragraph, Text } = Typography;

interface CoreContentProps {
  lesson: Lesson;
  stage?: Stage;
}

const CoreContent: React.FC<CoreContentProps> = ({ lesson, stage }) => {
  return (
    <div style={{ padding: '0 24px', maxWidth: 800 }}>
      <Title level={2}>{lesson.title}</Title>
      
      {lesson.scenario && (
        <Alert
          message="开场场景"
          description={lesson.scenario}
          type="info"
          showIcon
          icon={<BookOutlined />}
          style={{ marginBottom: 24 }}
        />
      )}

      {lesson.why && (
        <div style={{ marginBottom: 24 }}>
          <Title level={4}>为什么要学？</Title>
          <Paragraph>{lesson.why}</Paragraph>
        </div>
      )}

      <div style={{ marginBottom: 24 }}>
        <Title level={4}>一句话定义</Title>
        <blockquote style={{ borderLeft: '4px solid #1677ff', paddingLeft: 16, color: '#555', margin: 0, background: '#f9f9f9', padding: '12px 16px' }}>
          {lesson.definition}
        </blockquote>
      </div>

      {lesson.explanation && lesson.explanation.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <Title level={4}>详细解析</Title>
          {lesson.explanation.map((p, i) => (
            <Paragraph key={i}>{p}</Paragraph>
          ))}
        </div>
      )}

      {lesson.levels && lesson.levels.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <Title level={4}>由浅及深</Title>
          <Steps
            direction="vertical"
            items={lesson.levels.map(l => ({
              title: l.label,
              description: l.content,
            }))}
          />
        </div>
      )}

      {lesson.misconceptions && lesson.misconceptions.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <Title level={4}>常见误区</Title>
          <List
            size="small"
            dataSource={lesson.misconceptions}
            renderItem={item => (
              <List.Item>
                <CloseCircleOutlined style={{ color: '#ff4d4f', marginRight: 8 }} /> {item}
              </List.Item>
            )}
          />
        </div>
      )}

      {lesson.pitfalls && lesson.pitfalls.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <Title level={4}>工程坑点</Title>
          <List
            size="small"
            dataSource={lesson.pitfalls}
            renderItem={item => (
              <List.Item>
                <WarningOutlined style={{ color: '#faad14', marginRight: 8 }} /> {item}
              </List.Item>
            )}
          />
        </div>
      )}

      {lesson.compare && lesson.compare.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <Title level={4}>对比分析</Title>
          <Table
            dataSource={lesson.compare.slice(1).map((row, i) => {
              const obj: any = { key: i };
              row.forEach((cell, j) => {
                obj[`col${j}`] = cell;
              });
              return obj;
            })}
            columns={lesson.compare[0].map((col, i) => ({
              title: col,
              dataIndex: `col${i}`,
              key: `col${i}`,
            }))}
            pagination={false}
            bordered
            size="small"
          />
        </div>
      )}

      {stage && stage.studyFlow && stage.studyFlow.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <Title level={4}>学习方式</Title>
          <Card size="small" style={{ background: '#fafafa' }}>
            <List
              size="small"
              dataSource={stage.studyFlow}
              renderItem={item => <List.Item>{item}</List.Item>}
            />
          </Card>
        </div>
      )}
    </div>
  );
};

export default CoreContent;

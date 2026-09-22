import React, { useState, useEffect } from 'react';
import { Tabs, Button, Checkbox, Input, message, Spin, Typography } from 'antd';
import { PlayCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { Lesson } from '../../types/course';
import CodeEditor from './CodeEditor';
import OutputBox from './OutputBox';
import { api } from '../../services/api';
import { useProgress } from '../../hooks/useProgress';

const { TextArea } = Input;
const { Title } = Typography;

interface LabPanelProps {
  lesson: Lesson;
  state: any;
}

const LabPanel: React.FC<LabPanelProps> = ({ lesson, state }) => {
  const [code, setCode] = useState(lesson.lab?.starterCode || '');
  const [output, setOutput] = useState<{ stdout: string; stderr: string }>({ stdout: '', stderr: '' });
  const [running, setRunning] = useState(false);
  const { updateNotes, updateChecklist } = useProgress();

  const [notes, setNotes] = useState({ understanding: '', questions: '', conclusion: '' });

  useEffect(() => {
    setCode(lesson.lab?.starterCode || '');
    setOutput({ stdout: '', stderr: '' });
    
    // Load notes
    if (state?.notes?.[lesson.id]) {
      setNotes(state.notes[lesson.id]);
    } else {
      setNotes({ understanding: '', questions: '', conclusion: '' });
    }
  }, [lesson, state]);

  const handleRun = async () => {
    setRunning(true);
    try {
      const res = await api.runCode(code, lesson.id);
      setOutput({ stdout: res.stdout || '', stderr: res.stderr || '' });
    } catch (err: any) {
      setOutput({ stdout: '', stderr: err.message || '运行失败' });
    } finally {
      setRunning(false);
    }
  };

  const handleReset = () => {
    setCode(lesson.lab?.starterCode || '');
    setOutput({ stdout: '', stderr: '' });
  };

  const saveNotes = () => {
    updateNotes(lesson.id, notes);
    message.success('记录已保存');
  };

  const labRuns = state?.labRuns?.[lesson.id] || [];
  const checklistState = state?.checklist?.[lesson.id] || [];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: '50%', display: 'flex', flexDirection: 'column', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ padding: '8px 16px', background: '#fafafa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <strong>{lesson.lab?.title || '实验代码'}</strong>
          <div>
            <Button size="small" icon={<ReloadOutlined />} onClick={handleReset} style={{ marginRight: 8 }}>重置</Button>
            <Button size="small" type="primary" icon={<PlayCircleOutlined />} loading={running} onClick={handleRun}>运行</Button>
          </div>
        </div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <CodeEditor value={code} onChange={val => setCode(val || '')} />
        </div>
      </div>
      
      <div style={{ height: '20%', borderBottom: '1px solid #f0f0f0' }}>
        <OutputBox stdout={output.stdout} stderr={output.stderr} />
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        <Tabs 
          defaultActiveKey="task" 
          style={{ padding: '0 16px' }}
          items={[
            {
              key: 'task',
              label: '任务',
              children: (
                <div>
                  <Title level={5}>{lesson.task?.title}</Title>
                  <p>{lesson.task?.description}</p>
                  {lesson.task?.checklist?.map((item, i) => (
                    <div key={i} style={{ marginBottom: 8 }}>
                      <Checkbox 
                        checked={!!checklistState[i]} 
                        onChange={e => updateChecklist(lesson.id, i, e.target.checked)}
                      >
                        {item}
                      </Checkbox>
                    </div>
                  ))}
                </div>
              )
            },
            {
              key: 'notes',
              label: '我的记录',
              children: (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <div style={{ marginBottom: 4 }}>我的理解</div>
                    <TextArea rows={3} value={notes.understanding} onChange={e => setNotes(n => ({...n, understanding: e.target.value}))} />
                  </div>
                  <div>
                    <div style={{ marginBottom: 4 }}>疑问</div>
                    <TextArea rows={3} value={notes.questions} onChange={e => setNotes(n => ({...n, questions: e.target.value}))} />
                  </div>
                  <div>
                    <div style={{ marginBottom: 4 }}>结论</div>
                    <TextArea rows={3} value={notes.conclusion} onChange={e => setNotes(n => ({...n, conclusion: e.target.value}))} />
                  </div>
                  <Button type="primary" onClick={saveNotes}>保存记录</Button>
                </div>
              )
            },
            {
              key: 'history',
              label: '运行历史',
              children: (
                <div>
                  {labRuns.slice(-8).reverse().map((run: any, i: number) => (
                    <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                      <div style={{ color: '#888', fontSize: 12 }}>{new Date(run.timestamp).toLocaleString()}</div>
                      <div style={{ color: run.status === 'success' ? '#52c41a' : '#ff4d4f' }}>
                        状态: {run.status}
                      </div>
                    </div>
                  ))}
                  {labRuns.length === 0 && <div style={{ color: '#888' }}>暂无运行历史</div>}
                </div>
              )
            }
          ]}
        />
      </div>
    </div>
  );
};

export default LabPanel;

import React from 'react';

interface OutputBoxProps {
  stdout: string;
  stderr: string;
}

const OutputBox: React.FC<OutputBoxProps> = ({ stdout, stderr }) => {
  return (
    <div style={{ padding: 16, background: '#1e1e1e', color: '#ccc', height: '100%', overflowY: 'auto', fontFamily: 'monospace' }}>
      {stdout && (
        <pre style={{ color: '#52c41a', margin: 0, whiteSpace: 'pre-wrap' }}>
          {stdout}
        </pre>
      )}
      {stderr && (
        <pre style={{ color: '#ff4d4f', margin: 0, whiteSpace: 'pre-wrap' }}>
          {stderr}
        </pre>
      )}
      {!stdout && !stderr && (
        <span style={{ color: '#666' }}>暂无输出...</span>
      )}
    </div>
  );
};

export default OutputBox;

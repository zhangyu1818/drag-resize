import React from 'react';
import DragResize from 'drag-resize';

export default () => (
  <div style={{ padding: 200, display: 'flex', justifyContent: 'center' }}>
    <DragResize maxWidth={400} minWidth={100} maxHeight={300} minHeight={50}>
      <div
        style={{
          width: 200,
          height: 200,
          border: '1px solid',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        8向拖动
      </div>
    </DragResize>
  </div>
);

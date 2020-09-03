import React from 'react';
import DragResize from 'drag-resize';

export default () => (
  <div style={{ padding: 200, display: 'flex', justifyContent: 'center' }}>
    <DragResize>
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

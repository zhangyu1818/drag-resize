import React from 'react';
import DragResize from 'drag-resize';

export default () => (
  <DragResize maxWidth={500}>
    <div style={{ width: 200, height: 200, background: '#000' }} />
  </DragResize>
);

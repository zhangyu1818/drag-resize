import React from 'react';
import './index.less';
export interface DragResizeProps {
    children: React.ReactElement;
    directions?: Directions;
    maxHeight?: number;
    maxWidth?: number;
    minHeight?: number;
    minWidth?: number;
}
export declare type Directions = typeof directions;
declare const directions: readonly ["n", "e", "s", "w", "ne", "se", "sw", "nw"];
declare const DragResize: React.FC<DragResizeProps>;
export default DragResize;

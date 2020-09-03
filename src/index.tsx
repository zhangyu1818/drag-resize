import React, { useEffect, useMemo, useRef } from 'react';
import clamp from 'lodash/clamp';
import useIsMount from './useIsMount';
import { inset0 } from './utils';

import './index.less';

export interface DragResizeProps {
  children: React.ReactElement;
  directions?: Directions;
  maxHeight?: number;
  maxWidth?: number;
  minHeight?: number;
  minWidth?: number;
}

type Directions = typeof directions;
type DirectionMapValue = ['top' | 'right' | 'bottom' | 'left', 1 | -1];
type DirectionMap = {
  x?: DirectionMapValue;
  y?: DirectionMapValue;
};

const contentCSSProperties: React.CSSProperties = {
  position: 'absolute',
  display: 'inline-block',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

const directions = ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'] as const;

const getDirection = (direction: Directions[number]): DirectionMap => {
  const directionMap = {
    n: { y: ['top', 1] },
    e: { x: ['right', -1] },
    s: { y: ['bottom', -1] },
    w: { x: ['left', 1] },
  };
  if (direction.length === 2) {
    const [v, h] = direction;
    return {
      ...directionMap[v as keyof typeof directionMap],
      ...directionMap[h as keyof typeof directionMap],
    } as DirectionMap;
  }
  return directionMap[direction as keyof typeof directionMap] as DirectionMap;
};

const DragResize: React.FC<DragResizeProps> = ({
  children,
  directions: propsDirections = directions,
  maxWidth = Number.MAX_SAFE_INTEGER,
  minWidth = 0,
  maxHeight = Number.MAX_SAFE_INTEGER,
  minHeight = 0,
}) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const isMount = useIsMount();

  const startPos = useRef({ x: 0, y: 0 });

  const currentDirection = useRef<Directions[number] | null>(null);

  const baseChildrenSize = useMemo(() => {
    if (!isMount || !contentRef.current) return { width: 0, height: 0 };
    contentRef.current.style.position = 'static';
    const { width, height } = contentRef.current.getBoundingClientRect();
    contentRef.current.style.position = 'absolute';
    return { width, height };
  }, [isMount, children]);

  const getChildren = () => {
    if (!isMount || !contentRef.current || (baseChildrenSize.width === 0 && baseChildrenSize.height === 0))
      return children;

    if (React.isValidElement(children)) {
      const childrenStyle: React.CSSProperties = children.props.style ?? {};
      return React.cloneElement(children, {
        style: { ...childrenStyle, width: '100%', height: '100%' },
      });
    }

    return null;
  };

  const onDragStart: React.DragEventHandler<HTMLDivElement> = event => {
    event.preventDefault();
  };

  const onMouseDown = (event: MouseEvent) => {
    const { pageX: x, pageY: y } = event;
    startPos.current = { x, y };
  };

  const onMouseMove = (event: MouseEvent) => {
    if (!currentDirection.current) return;
    const { pageX, pageY } = event;
    const moveX = pageX - startPos.current.x;
    const moveY = pageY - startPos.current.y;

    if (contentRef.current && wrapperRef.current) {
      const { width, height } = wrapperRef.current.getBoundingClientRect();
      const { x, y } = getDirection(currentDirection.current);
      if (x) {
        const [property, direction] = x;
        const clampX = clamp(moveX * direction, -maxWidth + width, minWidth + width);
        contentRef.current.style[property] = `${clampX}px`;
      }
      if (y) {
        const [property, direction] = y;
        const clampY = clamp(moveY * direction, -maxHeight + height, minHeight + height);
        contentRef.current.style[property] = `${clampY}px`;
      }
    }
  };

  const onMouseUp = () => {
    currentDirection.current = null;
    document.body.style.cursor = '';

    const { width, height } = contentRef.current!.getBoundingClientRect();
    wrapperRef.current!.style.width = `${width}px`;
    wrapperRef.current!.style.height = `${height}px`;

    document.body.style.userSelect = '';
    inset0(contentRef.current);
  };

  useEffect(() => {
    document.body.addEventListener('mousedown', onMouseDown);
    document.body.addEventListener('mousemove', onMouseMove);
    document.body.addEventListener('mouseup', onMouseUp);
    return () => {
      document.body.removeEventListener('mousedown', onMouseDown);
      document.body.removeEventListener('mousemove', onMouseMove);
      document.body.removeEventListener('mouseup', onMouseUp);
    };
  }, [maxWidth, minWidth, maxHeight, minHeight]);

  return (
    <div ref={wrapperRef} className="drag-resize" style={baseChildrenSize}>
      <div ref={contentRef} style={contentCSSProperties}>
        {getChildren()}
      </div>
      {propsDirections.map(direction => (
        <div
          key={direction}
          className={`drag-resize-handle-${direction}`}
          onDragStart={onDragStart}
          onMouseDown={() => {
            currentDirection.current = direction;
            document.body.style.cursor = `${direction}-resize`;
            document.body.style.userSelect = 'none';
          }}
        />
      ))}
    </div>
  );
};

export default DragResize;

import React, { useEffect, useRef, useState } from 'react';
import clamp from 'lodash/clamp';

export interface DragResizeProps {
  children: React.ReactElement;
  directions?: Directions;
  maxHeight?: number;
  maxWidth?: number;
  minHeight?: number;
  minWidth?: number;
}

export type Directions = typeof directions;

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

const clampMove = (value: number, direction: -1 | 1, min: number, max: number, current: number) =>
  direction == -1 ? clamp(value, min - current, max - current) : clamp(value, -max + current, -min + current);

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

const inset0 = (element: HTMLDivElement | null) => {
  if (element) {
    element.style.position = 'absolute';
    element.style.top = '0px';
    element.style.right = '0px';
    element.style.bottom = '0px';
    element.style.left = '0px';
  }
};

const DragResize: React.FC<DragResizeProps> = ({
  children,
  directions: propsDirections = directions,
  maxWidth = Number.MAX_SAFE_INTEGER,
  minWidth = 0,
  maxHeight = Number.MAX_SAFE_INTEGER,
  minHeight = 0,
}) => {
  const [baseChildrenSize, setBaseChildrenSize] = useState({ width: 0, height: 0 });
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const startPos = useRef({ x: 0, y: 0 });

  const currentDirection = useRef<Directions[number] | null>(null);

  const getBaseChildrenSize = () => {
    if (!contentRef.current) return { width: 0, height: 0 };
    contentRef.current.style.position = 'static';
    const { width, height } = contentRef.current.getBoundingClientRect();
    contentRef.current.style.position = 'absolute';
    return { width, height };
  };

  const getChildren = () => {
    if (!contentRef.current || (baseChildrenSize.width === 0 && baseChildrenSize.height === 0))
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
        const clampX = clampMove(moveX, direction, minWidth, maxWidth, width);
        contentRef.current.style[property] = `${clampX * direction}px`;
      }

      if (y) {
        const [property, direction] = y;
        const clampY = clampMove(moveY, direction, minHeight, maxHeight, height);
        contentRef.current.style[property] = `${clampY * direction}px`;
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
    const size = getBaseChildrenSize();
    setBaseChildrenSize(size);
  }, [children]);

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

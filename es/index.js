function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

import React, { useEffect, useRef, useState } from 'react';
import clamp from 'lodash/clamp';
import './index.less';
var contentCSSProperties = {
  position: 'absolute',
  display: 'inline-block',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0
};
var directions = ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'];

var clampMove = function clampMove(value, direction, min, max, current) {
  return direction == -1 ? clamp(value, min - current, max - current) : clamp(value, -max + current, -min + current);
};

var getDirection = function getDirection(direction) {
  var directionMap = {
    n: {
      y: ['top', 1]
    },
    e: {
      x: ['right', -1]
    },
    s: {
      y: ['bottom', -1]
    },
    w: {
      x: ['left', 1]
    }
  };

  if (direction.length === 2) {
    var _direction = _slicedToArray(direction, 2),
        v = _direction[0],
        h = _direction[1];

    return _objectSpread(_objectSpread({}, directionMap[v]), directionMap[h]);
  }

  return directionMap[direction];
};

var inset0 = function inset0(element) {
  if (element) {
    element.style.position = 'absolute';
    element.style.top = '0px';
    element.style.right = '0px';
    element.style.bottom = '0px';
    element.style.left = '0px';
  }
};

var DragResize = function DragResize(_ref) {
  var children = _ref.children,
      _ref$directions = _ref.directions,
      propsDirections = _ref$directions === void 0 ? directions : _ref$directions,
      _ref$maxWidth = _ref.maxWidth,
      maxWidth = _ref$maxWidth === void 0 ? Number.MAX_SAFE_INTEGER : _ref$maxWidth,
      _ref$minWidth = _ref.minWidth,
      minWidth = _ref$minWidth === void 0 ? 0 : _ref$minWidth,
      _ref$maxHeight = _ref.maxHeight,
      maxHeight = _ref$maxHeight === void 0 ? Number.MAX_SAFE_INTEGER : _ref$maxHeight,
      _ref$minHeight = _ref.minHeight,
      minHeight = _ref$minHeight === void 0 ? 0 : _ref$minHeight;

  var _useState = useState({
    width: 0,
    height: 0
  }),
      _useState2 = _slicedToArray(_useState, 2),
      baseChildrenSize = _useState2[0],
      setBaseChildrenSize = _useState2[1];

  var wrapperRef = useRef(null);
  var contentRef = useRef(null);
  var startPos = useRef({
    x: 0,
    y: 0
  });
  var currentDirection = useRef(null);

  var getBaseChildrenSize = function getBaseChildrenSize() {
    if (!contentRef.current) return {
      width: 0,
      height: 0
    };
    contentRef.current.style.position = 'static';

    var _contentRef$current$g = contentRef.current.getBoundingClientRect(),
        width = _contentRef$current$g.width,
        height = _contentRef$current$g.height;

    contentRef.current.style.position = 'absolute';
    return {
      width: width,
      height: height
    };
  };

  var getChildren = function getChildren() {
    if (!contentRef.current || baseChildrenSize.width === 0 && baseChildrenSize.height === 0) return children;

    if (React.isValidElement(children)) {
      var _children$props$style;

      var childrenStyle = (_children$props$style = children.props.style) !== null && _children$props$style !== void 0 ? _children$props$style : {};
      return React.cloneElement(children, {
        style: _objectSpread(_objectSpread({}, childrenStyle), {}, {
          width: '100%',
          height: '100%'
        })
      });
    }

    return null;
  };

  var onDragStart = function onDragStart(event) {
    event.preventDefault();
  };

  var onMouseDown = function onMouseDown(event) {
    var x = event.pageX,
        y = event.pageY;
    startPos.current = {
      x: x,
      y: y
    };
  };

  var onMouseMove = function onMouseMove(event) {
    if (!currentDirection.current) return;
    var pageX = event.pageX,
        pageY = event.pageY;
    var moveX = pageX - startPos.current.x;
    var moveY = pageY - startPos.current.y;

    if (contentRef.current && wrapperRef.current) {
      var _wrapperRef$current$g = wrapperRef.current.getBoundingClientRect(),
          width = _wrapperRef$current$g.width,
          height = _wrapperRef$current$g.height;

      var _getDirection = getDirection(currentDirection.current),
          x = _getDirection.x,
          y = _getDirection.y;

      if (x) {
        var _x = _slicedToArray(x, 2),
            property = _x[0],
            direction = _x[1];

        var clampX = clampMove(moveX, direction, minWidth, maxWidth, width);
        contentRef.current.style[property] = "".concat(clampX * direction, "px");
      }

      if (y) {
        var _y = _slicedToArray(y, 2),
            _property = _y[0],
            _direction2 = _y[1];

        var clampY = clampMove(moveY, _direction2, minHeight, maxHeight, height);
        contentRef.current.style[_property] = "".concat(clampY * _direction2, "px");
      }
    }
  };

  var onMouseUp = function onMouseUp() {
    currentDirection.current = null;
    document.body.style.cursor = '';

    var _contentRef$current$g2 = contentRef.current.getBoundingClientRect(),
        width = _contentRef$current$g2.width,
        height = _contentRef$current$g2.height;

    wrapperRef.current.style.width = "".concat(width, "px");
    wrapperRef.current.style.height = "".concat(height, "px");
    document.body.style.userSelect = '';
    inset0(contentRef.current);
  };

  useEffect(function () {
    var size = getBaseChildrenSize();
    setBaseChildrenSize(size);
  }, [children]);
  useEffect(function () {
    document.body.addEventListener('mousedown', onMouseDown);
    document.body.addEventListener('mousemove', onMouseMove);
    document.body.addEventListener('mouseup', onMouseUp);
    return function () {
      document.body.removeEventListener('mousedown', onMouseDown);
      document.body.removeEventListener('mousemove', onMouseMove);
      document.body.removeEventListener('mouseup', onMouseUp);
    };
  }, [maxWidth, minWidth, maxHeight, minHeight]);
  return React.createElement("div", {
    ref: wrapperRef,
    className: "drag-resize",
    style: baseChildrenSize
  }, React.createElement("div", {
    ref: contentRef,
    style: contentCSSProperties
  }, getChildren()), propsDirections.map(function (direction) {
    return React.createElement("div", {
      key: direction,
      className: "drag-resize-handle-".concat(direction),
      onDragStart: onDragStart,
      onMouseDown: function onMouseDown() {
        currentDirection.current = direction;
        document.body.style.cursor = "".concat(direction, "-resize");
        document.body.style.userSelect = 'none';
      }
    });
  }));
};

export default DragResize;
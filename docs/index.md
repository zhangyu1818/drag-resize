---
title: 使用方式
---

# drag-resize

让子元素可以拖拽边缘改变大小的组件，由于实现方式的原因，元素实际所占空间需要在拖动完成后才会计算

## 使用

```sh
 yarn add rc-drag-resize
```

## 示例

<code src='./default.tsx' compact title='无限制拖动' desc='拖动大小没有限制'/>

<code src='./clamp.tsx' compact title='限制拖动' desc='拖动大小有限制,元素最小宽度100px，最大宽度400px，最小高度50px，最大高度300px'/>

## Props

| 属性名                       | 默认值                                       | 描述             |
| ---------------------------- | -------------------------------------------- | ---------------- |
| children: React.ReactElement | 无                                           | 需要拖动的子元素 |
| directions?: Directions      | ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'] | 可以拖动的方向   |
| maxHeight?: number           | 无                                           | 最大高度         |
| maxWidth?: number            | 无                                           | 最大宽度         |
| minHeight?: number           | 无                                           | 最小高度         |
| minWidth?: number            | 无                                           | 最小宽度         |

方向 'n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw' 分别对应 上、右、下、左、上右、下右、左下、左上

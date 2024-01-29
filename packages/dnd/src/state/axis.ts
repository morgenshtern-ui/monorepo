export interface VerticalAxis {
  direction: 'vertical'
  line: 'y'
  start: 'top'
  end: 'bottom'
  size: 'height'
  crossAxisLine: 'x'
  crossAxisStart: 'left'
  crossAxisEnd: 'right'
  crossAxisSize: 'width'
}

export interface HorizontalAxis {
  direction: 'horizontal'
  line: 'x'
  start: 'left'
  end: 'right'
  size: 'width'
  crossAxisLine: 'y'
  crossAxisStart: 'top'
  crossAxisEnd: 'bottom'
  crossAxisSize: 'height'
}

export type Axis = HorizontalAxis | VerticalAxis

export const Vertical: VerticalAxis = {
  crossAxisEnd: 'right',
  crossAxisLine: 'x',
  crossAxisSize: 'width',
  crossAxisStart: 'left',
  direction: 'vertical',
  end: 'bottom',
  line: 'y',
  size: 'height',
  start: 'top',
}

export const Horizontal: HorizontalAxis = {
  crossAxisEnd: 'bottom',
  crossAxisLine: 'y',
  crossAxisSize: 'height',
  crossAxisStart: 'top',
  direction: 'horizontal',
  end: 'right',
  line: 'x',
  size: 'width',
  start: 'left',
}

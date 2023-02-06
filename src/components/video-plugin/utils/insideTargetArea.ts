import { isNil } from 'ramda';

export const insideTargetArea = (
  scrollableContainer: HTMLElement,
  target: HTMLElement,
  x: number,
  y: number,
  addMargin?: (rect: ClientRect) => ClientRect
): boolean => {
  if (isNil(target)) {
    return false;
  }

  let rect = target.getBoundingClientRect();

  if (addMargin && !isNil(addMargin)) {
    rect = addMargin(rect);
  }

  const { left, right, top, bottom } = rect;
  const scrolledLeft = left;
  const scrolledTop = top;

  if (x > scrolledLeft && x < right) {
    if (y > scrolledTop && y < bottom) {
      return true;
    }
  }

  return false;
};

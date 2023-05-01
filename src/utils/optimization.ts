import isEqual from 'lodash.isequal';

export function propsAreEqual<T = Record<string, string>>(prevProps: T, nextProps: T) {
  return isEqual(prevProps, nextProps);
}

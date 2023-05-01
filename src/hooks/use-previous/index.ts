import { useEffect, useRef } from 'react';

function usePrevious<P>(value: P): P | undefined {
  const ref = useRef<P>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

export default usePrevious;

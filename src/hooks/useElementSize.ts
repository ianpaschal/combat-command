import {
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from 'react';

export const useElementSize = <T extends HTMLDivElement>(): [MutableRefObject<T | null>, number, number] => {
  const ref = useRef(null);
  const [size, setSize] = useState<{ width: number, height: number }>({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return;

    const observer = new ResizeObserver(([entry]) => {
      const { inlineSize: width, blockSize: height } = entry.borderBoxSize[0];
      setSize({ width, height });
    });

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return [
    ref,
    size.width,
    size.height,
  ];
};

import {
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from 'react';

export const useElementSize = <T extends HTMLElement>(): [MutableRefObject<T | null>, number, number] => {
  const [size, setSize] = useState<[number, number]>([0, 0]);
  const ref = useRef<T | null>(null);

  const updateWidth = () => {
    if (ref.current) {
      setSize([ref.current.offsetWidth, ref.current.offsetHeight]);
    }
  };

  useEffect(() => {
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => {
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  return [
    ref,
    ...size,
  ];
};
import { useLayoutEffect, useRef } from 'react';

export const useAdjustHeight = (value: string) => {
  const textbox = useRef<HTMLTextAreaElement | null>(null);

  const adjustHeight = () => {
    if (textbox?.current) {
      textbox.current.style.height = 'inherit';
      textbox.current.style.height = `${textbox.current.scrollHeight}px`;
    }
  };

  useLayoutEffect(() => {
    adjustHeight();
  }, [value]);

  return { textbox, adjustHeight };
};

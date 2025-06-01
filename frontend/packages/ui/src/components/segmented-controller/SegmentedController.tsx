import { useRef, useState, useEffect } from 'react';
import './style.css';
import { cn } from '../../lib/utils';

type segmentedControllerProps = {
  name: string;
  className?: string;
  segments: Array<{
    value: string;
    ref: any;
    label: string;
  }>;
  callback: (value: string, index: number) => void;
  defaultIndex?: number;
  /* controlRef?: any; */
};

const SegmentedControl = ({
  name,
  segments,
  callback,
  className,
  defaultIndex = 0
}: segmentedControllerProps) => {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const componentReady = useRef<boolean>(false); // Initialize with false
  const controlRef = useRef<any>(); // Initialize with null

  // Determine when the component is "ready"
  useEffect(() => {
    componentReady.current = true; // Assign true after initialization
  }, []);

  useEffect(() => {
    const activeSegmentRef = segments[activeIndex]?.ref;
    const { offsetWidth, offsetLeft } = activeSegmentRef.current;
    const { style } = controlRef.current;

    style.setProperty('--highlight-width', `${offsetWidth}px`);
    style.setProperty('--highlight-x-pos', `${offsetLeft}px`);
  }, [activeIndex, callback, controlRef, segments]);

  const onInputChange = (value: any, index: any) => {
    setActiveIndex(index);
    callback(value, index);
  };

  return (
    <div className="" ref={controlRef}>
      <div
        className={cn(
          `controls inline-flex justify-between bg-neutral-n-200 rounded-[100px] w-full min-w-[343px] max-w-[343px] h-[48px] p-1 m-auto relative overflow-hidden items-center ${componentReady.current ? 'ready' : 'idle'}`,
          className
        )}
      >
        {segments?.map((item, i) => (
          <div
            key={item.value}
            className={`segment relative text-center z-[1] w-full ${i === activeIndex ? 'active' : 'inactive'}`}
            ref={item.ref}
          >
            <input
              className="opacity-0 m-0 top-0 right-0 bottom-0 left-0 absolute w-full cursor-pointer h-full"
              type="radio"
              value={item.value}
              id={item.label}
              name={name}
              onChange={() => onInputChange(item.value, i)}
              checked={i === activeIndex}
            />
            <label
              htmlFor={item.label}
              className="tracking-[-0.28px] text-neutral-n-700 cursor-pointer text-sm block font-medium p-[10px]"
            >
              {item.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SegmentedControl;

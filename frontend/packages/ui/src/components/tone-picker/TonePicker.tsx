'use client';

import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { Typography } from '../typography';

export type ToneValues = {
  casual: number;
  concise: number;
  expanded: number;
  professional: number;
};

export type TonePosition = {
  x: number;
  y: number;
};

type TonePickerProps = {
  className?: string;
  initialPosition?: TonePosition;
  onToneChange?: (toneValues: ToneValues, position: TonePosition) => void;
};

const TonePicker = ({
  className,
  initialPosition = { x: 4, y: 3 },
  onToneChange
}: TonePickerProps) => {
  const [selectedPosition, setSelectedPosition] =
    useState<TonePosition>(initialPosition);

  const gridSize = 9;

  const dots = Array.from({ length: gridSize }, (value, y) =>
    Array.from({ length: gridSize }, (value, x) => ({ x, y }))
  );

  const calculateToneValues = (tonePosition: TonePosition) => {
    // Convert grid position to percentage values (0-100)
    // For expanded: right (x=8) = 100%, left (x=0) = 0%
    // For professional: top (y=0) = 100%, bottom (y=8) = 0%

    const professional = Math.round(
      ((gridSize - 1 - tonePosition.y) / (gridSize - 1)) * 100
    );

    const expanded = Math.round((tonePosition.x / (gridSize - 1)) * 100);

    return {
      expanded,
      professional,
      concise: 100 - expanded,
      casual: 100 - professional
    };
  };

  const handleDotClick = (tonePosition: TonePosition) => {
    setSelectedPosition(tonePosition);
    const toneValues = calculateToneValues(tonePosition);
    onToneChange?.(toneValues, tonePosition);
  };

  // Call onToneChange on initial render and when dependencies change

  useEffect(() => {
    const toneValues = calculateToneValues(selectedPosition);
    onToneChange?.(toneValues, selectedPosition);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPosition]); // Remove onToneChange from dependencies

  // Function to determine dot styling
  const getDotStyle = (x: number, y: number) => {
    const { x: selectedX, y: selectedY } = selectedPosition;

    // Selected dot
    if (selectedX === x && selectedY === y) {
      return 'w-4 h-4 bg-white';
    }
    // Dots 1 position away in cardinal directions
    else if (
      (Math.abs(x - selectedX) === 1 && y === selectedY) ||
      (Math.abs(y - selectedY) === 1 && x === selectedX)
    ) {
      return 'w-3 h-3 bg-white/80';
    }
    // Dots 2 positions away in cardinal directions
    else if (
      (Math.abs(x - selectedX) === 2 && y === selectedY) ||
      (Math.abs(y - selectedY) === 2 && x === selectedX)
    ) {
      return 'w-3 h-3 bg-white/60';
    }
    // Dots 1 position away diagonally (creating the square corners)
    else if (Math.abs(x - selectedX) === 1 && Math.abs(y - selectedY) === 1) {
      return 'w-3 h-3 bg-white/70';
    }
    // Regular dots
    else {
      return 'w-2 h-2 bg-white/50 hover:bg-white/60';
    }
  };

  return (
    <div
      className={cn(
        'w-full max-w-md mx-auto rounded-3xl overflow-hidden',
        className
      )}
    >
      <div className="relative p-8 bg-[url(/images/adjust-tone-bg.svg)] bg-cover bg-center bg-no-repeat">
        <Typography
          variant="heading-sm"
          className="text-white text-center mb-8"
        >
          Adjust Tone
        </Typography>

        <div className="relative p-8">
          {/* Top label */}
          <div className="absolute -top-4 left-0 right-0">
            <Typography variant="caption" className="text-white text-center">
              Professional
            </Typography>
          </div>

          {/* Right label */}
          <div className="absolute top-1/2 -right-8 text-white -translate-y-1/2 rotate-90">
            <Typography variant="caption" className="text-white text-center">
              Expanded
            </Typography>
          </div>

          {/* Bottom label */}
          <div className="absolute -bottom-4 left-0 right-0 text-white text-center">
            <Typography variant="caption" className="text-white text-center">
              Casual
            </Typography>
          </div>

          {/* Left label */}
          <div className="absolute top-1/2 -left-8 text-white -translate-y-1/2 -rotate-90">
            <Typography variant="caption" className="text-white text-center">
              Concise
            </Typography>
          </div>

          {/* Dots grid */}
          <div className="grid grid-cols-9 gap-3 w-64 h-64 mx-auto">
            {dots.flat().map((dot, index) => (
              <button
                key={index}
                className={cn(
                  'rounded-full transition-all duration-200 flex items-center justify-center',
                  getDotStyle(dot.x, dot.y)
                )}
                onClick={() => handleDotClick(dot)}
                aria-label={`Select tone: ${dot.y < gridSize / 2 ? 'More professional' : 'More casual'}, ${
                  dot.x < gridSize / 2 ? 'More concise' : 'More expanded'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TonePicker;

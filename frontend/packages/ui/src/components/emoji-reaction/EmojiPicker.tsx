import React from 'react';
import { PhosphorIcon } from '@/icons/PhosphorIcon';
import { cn } from '@/lib/utils';
import { Reaction, REACTIONS, EMOJI_STYLES } from './types';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '../tooltip-2/Tooltip';
import { Typography } from '../typography';

export interface EmojiPickerInterface {
  popup?: boolean;
  pickedEmoji: Reaction;
  onSelect: (reaction: Reaction) => void;
  className?: string;
}

const Caret = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="4"
    viewBox="0 0 18 4"
    fill="none"
    className="z-10 relative"
  >
    <path
      d="M0.422119 0H17.5779L16.2153 0.300446C14.1392 0.758231 12.21 1.72646 10.6022 3.11751C9.67283 3.92164 8.30288 3.95096 7.33993 3.18734L7.10528 3.00126C5.44122 1.68164 3.5092 0.741117 1.44408 0.245343L0.422119 0Z"
      fill="white"
    />
  </svg>
);

const defaultStyle = 'fill-neutral-n-300 cursor-pointer';

export const EmojiPicker = ({
  pickedEmoji,
  onSelect,
  className,
  popup = true
}: EmojiPickerInterface) => {
  // handler to prevent parent's blur from triggering before onClick can process
  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
  };
  return (
    <div className={cn('flex flex-col items-center ', className)}>
      <div
        className={`flex gap-1 p-1 rounded-[24px] overflow-clip justify-center ${popup ? 'bg-white shadow-lg' : 'bg-neutral-n-100'}`}
      >
        {REACTIONS.map(emotion => (
          <div key={emotion}>
            {popup ? (
              <div
                onClick={() => onSelect(emotion)}
                onMouseDown={onMouseDown}
                key={emotion}
              >
                <PhosphorIcon
                  iconVariant={EMOJI_STYLES[emotion].icon}
                  className={cn(
                    defaultStyle,
                    EMOJI_STYLES[emotion].hover,
                    pickedEmoji === emotion && EMOJI_STYLES[emotion].fill
                  )}
                />
              </div>
            ) : (
              <TooltipProvider delayDuration={0} key={emotion}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      onClick={() => onSelect(emotion)}
                      onMouseDown={onMouseDown}
                      key={emotion}
                    >
                      <PhosphorIcon
                        iconVariant={EMOJI_STYLES[emotion].icon}
                        className={cn(
                          defaultStyle,
                          EMOJI_STYLES[emotion].hover,
                          pickedEmoji === emotion && EMOJI_STYLES[emotion].fill
                        )}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="bg-white"
                    arrowFill="fill-white"
                  >
                    <Typography
                      variant="caption"
                      className="text-neutral-n-700"
                    >
                      {emotion}
                    </Typography>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        ))}
      </div>
      <Caret />
    </div>
  );
};

import React, { useState } from "react";
import { EmojiPicker } from "./EmojiPicker";
import { IconVariant, PhosphorIcon } from "@/icons/PhosphorIcon";
import { Typography } from "../typography";
import { cn } from "@/lib/utils";
import { Reaction, EMOJI_STYLES } from "./types";

interface EmojiReactionProps {
  initialReaction: Reaction;
  onSelectFeeling?: (feeling: Reaction) => void;
}

export const EmojiReaction = ({ initialReaction, onSelectFeeling }: EmojiReactionProps) => {
  const [displayPicker, setDisplayPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(initialReaction);

  const onSelectReaction = (reaction: Reaction) => {
    setSelectedEmoji(reaction);
    setDisplayPicker(false);
    onSelectFeeling?.(reaction);
  };

  return (
    <div className="flex flex-col relative items-center" onBlur={() => setDisplayPicker(false)}>
      <EmojiPicker
        pickedEmoji={selectedEmoji}
        onSelect={onSelectReaction}
        className={`absolute bottom-[28px] ${displayPicker ? "visible" : "invisible"}`}
      />
      <div
        className={cn(
          "flex gap-1 justify-center items-center py-1 px-2 rounded-[24px] border border-neutral-n-300 hover:bg-neutral-n-200 w-[100px] cursor-pointer",
          displayPicker && "bg-neutral-n-200"
        )}
        data-testid="emoji-reaction"
        tabIndex={0}
        onClick={() => setDisplayPicker(!displayPicker)}
      >
        <PhosphorIcon
          iconVariant={EMOJI_STYLES[selectedEmoji].icon as IconVariant}
          className={EMOJI_STYLES[selectedEmoji].text}
          size={16}
        />
        <Typography variant="caption-strong" className={EMOJI_STYLES[selectedEmoji].text}>
          {EMOJI_STYLES[selectedEmoji].title}
        </Typography>
      </div>
    </div>
  );
};

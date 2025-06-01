import { type IconProps, Flag } from '@phosphor-icons/react';

function FlagIcon({ size, color }: IconProps) {
  return <Flag weight="fill" size={size} color={color} />;
}

export { FlagIcon };

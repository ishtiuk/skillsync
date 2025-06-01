import { type IconProps, Drop } from '@phosphor-icons/react';

function DropIcon({ size, color }: IconProps) {
  return <Drop weight="fill" size={size} color={color} />;
}

export { DropIcon };

import { type IconProps, Trash } from '@phosphor-icons/react';

function TrashIcon({ size, color }: IconProps) {
  return <Trash weight="fill" size={size} color={color} />;
}

export { TrashIcon };

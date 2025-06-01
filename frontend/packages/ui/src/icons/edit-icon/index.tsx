import { type IconProps, Eraser } from '@phosphor-icons/react';

function EditIcon({ size, color }: IconProps) {
  return <Eraser weight="fill" size={size} color={color} />;
}

export { EditIcon };

import { type IconProps, Placeholder } from '@phosphor-icons/react';

function PlaceholderIcon({ size, color }: IconProps) {
  return <Placeholder weight="bold" size={size} color={color} />;
}

export { PlaceholderIcon };

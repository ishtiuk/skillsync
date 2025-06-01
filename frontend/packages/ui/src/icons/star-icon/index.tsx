import { type IconProps, Star } from '@phosphor-icons/react';

function StarIcon({ size, color }: IconProps) {
  return <Star weight="fill" size={size} color={color} />;
}

export { StarIcon };

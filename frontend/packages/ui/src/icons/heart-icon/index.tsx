import { type IconProps, Heart } from '@phosphor-icons/react';

function HeartIcon({ size, color }: IconProps) {
  return <Heart weight="fill" size={size} color={color} />;
}

export { HeartIcon };

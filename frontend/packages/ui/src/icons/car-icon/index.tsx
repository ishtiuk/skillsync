import { type IconProps, CarProfile } from '@phosphor-icons/react';

function CarIcon({ size, color }: IconProps) {
  return <CarProfile weight="fill" size={size} color={color} />;
}

export { CarIcon };

import { type IconProps, Buildings } from '@phosphor-icons/react';

function BuildingIcon({ size, color }: IconProps) {
  return <Buildings weight="fill" size={size} color={color} />;
}

export { BuildingIcon };

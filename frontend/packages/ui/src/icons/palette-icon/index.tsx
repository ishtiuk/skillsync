import { type IconProps, Palette } from '@phosphor-icons/react';

function PaletteIcon({ size, color }: IconProps) {
  return <Palette weight="fill" size={size} color={color} />;
}

export { PaletteIcon };

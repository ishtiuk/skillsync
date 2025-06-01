import { type IconProps, ChartLine } from '@phosphor-icons/react';

function ChartLineIcon({ size, color }: IconProps) {
  return <ChartLine weight="bold" size={size} color={color} />;
}

export { ChartLineIcon };

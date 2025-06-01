import { type IconProps, Warning } from '@phosphor-icons/react';

function WarningIcon({ size, color }: IconProps) {
  return <Warning weight="fill" size={size} color={color} />;
}

export { WarningIcon };

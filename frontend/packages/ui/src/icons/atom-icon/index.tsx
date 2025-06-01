import { type IconProps, Atom } from '@phosphor-icons/react';

function AtomIcon({ size, color }: IconProps) {
  return <Atom weight="bold" size={size} color={color} />;
}

export { AtomIcon };

import { type IconProps, Kanban } from '@phosphor-icons/react';

function KanbanIcon({ size, color }: IconProps) {
  return <Kanban weight="fill" size={size} color={color} />;
}

export { KanbanIcon };

import { IconVariant } from '@/icons/PhosphorIcon';
import { Navigation } from '@/components/navigation';
import { FavoritesData } from '../navigation-favorites/NavigationFavorites';

type NavigationItem = {
  label: string;
  pathname: string;
  icon?: IconVariant | undefined;
};

type NavigationPageWrapperProps = {
  profile?: string;
  items: NavigationItem[];
  children?: React.ReactNode;
  onClickCustom?: () => void;
};

const data: FavoritesData[] = [
  {
    label: 'Communication Coordinator',
    color: 'neutral',
    pathname: 'collection',
    id: 'communication-1'
  },
  {
    label: 'Communication Coordinator',
    color: 'blue',
    pathname: 'collection',
    id: 'communication-2'
  },
  {
    label: 'Communication Coordinator',
    color: 'purple',
    pathname: 'collection',
    id: 'communication-3'
  }
];

function NavigationPageWrapper({
  items,
  children,
  profile,
  onClickCustom
}: NavigationPageWrapperProps) {
  return (
    <div className="flex" style={{ width: '100%' }}>
      <Navigation
        items={items}
        status={false}
        notifications="5"
        profile={profile}
        onClickCustom={onClickCustom}
      />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}

export { NavigationPageWrapper };

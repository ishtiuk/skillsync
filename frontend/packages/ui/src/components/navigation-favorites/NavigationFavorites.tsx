import { PhosphorIcon } from '@/icons/PhosphorIcon';
import { AvatarCompany } from '../avatar-company/AvatarCompany';
import { Typography } from '../typography/Typography';
import Link from 'next/link';

type FavoritesData = {
  pathname?: string;
  color: any;
  companyName?: string;
  label: string;
  id: string;
};

export interface NavigationFavoritesProps {
  data: FavoritesData[];
  collapsed: boolean;
}
function NavigationFavorites({
  data,
  collapsed,
  ...props
}: NavigationFavoritesProps) {
  return (
    <div className="rounded-xl bg-neutral-n-100 py-2 gap-1">
      {collapsed === false && (
        <div className="flex items-center justify-between py-2 px-4">
          <Typography variant="caption" className="nowrap">
            Your Favorites
          </Typography>
        </div>
      )}
      {data.map((item, index) => {
        return (
          <Link
            key={item.id}
            href="#"
            className="flex items-center py-3 px-4 gap-2"
          >
            <AvatarCompany
              AvatarType="alt"
              avatarId="1"
              companyName={item.companyName}
              size="24px"
            />
            {collapsed === false && (
              <Typography variant="caption-strong" className="truncate">
                {item.label}
              </Typography>
            )}
          </Link>
        );
      })}
    </div>
  );
}

export { NavigationFavorites };
export type { FavoritesData };

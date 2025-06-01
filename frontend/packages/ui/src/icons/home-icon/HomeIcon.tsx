import { HouseSimple } from '@phosphor-icons/react';
import { type ComponentPropsWithRef } from 'react';

function HomeIcon(props: ComponentPropsWithRef<'svg'>) {
  return <HouseSimple weight="fill" {...props} />;
}

export { HomeIcon };

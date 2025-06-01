import axios from 'axios';
import {
  COUNTRY_STATE_CITY_API_KEY,
  COUNTRY_STATE_CITY_API_URL
} from '@/lib/constants/urls';
import { queryOptions } from '@tanstack/react-query';

type State = {
  id: string;
  name: string;
  iso2: string;
};

const headers = {
  'X-CSCAPI-KEY': COUNTRY_STATE_CITY_API_KEY,
  'Content-Type': 'application/json'
};

export const getStates = async ({ queryKey }: { queryKey: [string] }) => {
  const [countryCode] = queryKey;
  const { data } = await axios.get(
    `${COUNTRY_STATE_CITY_API_URL}/countries/${countryCode}/states`,
    {
      headers
    }
  );

  return data as State[];
};

export const getStatesOptions = queryOptions({
  queryKey: ['countryCode'],
  queryFn: getStates
});

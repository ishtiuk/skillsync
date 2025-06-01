import axios from 'axios';
import {
  COUNTRY_STATE_CITY_API_KEY,
  COUNTRY_STATE_CITY_API_URL
} from '@/lib/constants/urls';
import { queryOptions } from '@tanstack/react-query';

const headers = {
  'X-CSCAPI-KEY': COUNTRY_STATE_CITY_API_KEY,
  'Content-Type': 'application/json'
};

type City = {
  id: string;
  name: string;
  latitude: string;
  longitude: string;
};

export const getCities = async ({
  queryKey
}: {
  queryKey: [string, string];
}) => {
  const [countryCode, stateCode] = queryKey;
  const { data } = await axios.get(
    `${COUNTRY_STATE_CITY_API_URL}/countries/${countryCode}/states/${stateCode}/cities`,
    {
      headers
    }
  );

  return data as City[];
};

export const getCitiesOptions = queryOptions({
  queryKey: ['countryCode', 'stateCode'],
  queryFn: getCities
});

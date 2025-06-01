import axios from 'axios';
import { queryOptions } from '@tanstack/react-query';
import {
  COUNTRY_STATE_CITY_API_KEY,
  COUNTRY_STATE_CITY_API_URL
} from '@/lib/constants/urls';

type Country = {
  id: string;
  name: string;
  iso3: string;
  iso2: string;
  emoji: string;
  native: string;
  capital: string;
  currency: string;
  phonecode: string;
};

const headers = {
  'X-CSCAPI-KEY': COUNTRY_STATE_CITY_API_KEY,
  'Content-Type': 'application/json'
};

export const getCountries = async () => {
  const { data } = await axios.get(`${COUNTRY_STATE_CITY_API_URL}/countries`, {
    headers
  });

  return data as Country[];
};

export const getCountriesOptions = queryOptions({
  queryKey: ['geolocation', 'countries'],
  queryFn: getCountries
});

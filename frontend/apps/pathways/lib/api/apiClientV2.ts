import { BASE_URL } from '@/lib/constants/urls';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getToken } from '../utils/token';

const defaultHeaders = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`
};

const apiClientV2 = () => {
  const axiosInstance: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: defaultHeaders
  });

  const handleResponse = (response: AxiosResponse) => response;

  const handleError = (error: unknown) => Promise.reject(error);

  axiosInstance.interceptors.response.use(handleResponse, handleError);

  const get = <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return axiosInstance.get(url, config);
  };

  const post = <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    return axiosInstance.post(url, data, config);
  };

  const put = <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    return axiosInstance.put(url, data, config);
  };

  const patch = <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    return axiosInstance.patch(url, data, config);
  };

  const del = <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return axiosInstance.delete(url, config);
  };

  return {
    get,
    post,
    put,
    patch,
    delete: del
  };
};

export default apiClientV2;

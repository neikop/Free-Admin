import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { openAlert } from 'reducers/notificationSlice';
import { ProfileState, signOut } from 'reducers/profileSlice';
import { store } from 'reducers/store';

const beforeRequest = (config: AxiosRequestConfig) => {
  const { isLoggedIn, accessToken }: ProfileState = store.getState().profile;
  if (isLoggedIn) {
    Object.assign(config.headers as any, {
      Authorization: `Bearer ${accessToken}`,
    });
  }
  try {
    if (config.data instanceof FormData) {
      Object.assign(config.headers as any, { 'Content-Type': 'multipart/form-data' });
    }
  } catch {}
  return config;
};

const onError = async (error: AxiosError) => {
  const { response } = error;
  if (response) {
    const { status } = response;
    if (status === 401) {
      store.dispatch(signOut({}));
    } else {
      let message = '';
      // let [, message] = response?.data?.errors["_"] || response?.data?.error[""];
      if (message.startsWith('message: ')) {
        message = message.slice(9);
        store.dispatch(openAlert({ message, variant: 'error' }));
        return Promise.reject(message);
      }
    }
  }
  return Promise.reject(error);
};

const client = axios.create({ baseURL: process.env.REACT_APP_API_URI });
client.interceptors.request.use(beforeRequest);
client.interceptors.response.use(({ data }) => data, onError);

client.defaults.transformResponse = [...(axios.defaults.transformResponse as []), (data) => data];

export { client };

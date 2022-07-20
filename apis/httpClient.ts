import Cookies from 'js-cookie';
import axios, { AxiosRequestConfig } from 'axios';
import HttpStatusCodes from './HttpStatusCodes';
import { authenticationService } from './services/auth';

const apiConfig = {
  apiUrl: process.env.API_BASE_URL
};

let refreshTokenPromise
let initPromise

export const httpClient = axios.create({
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS, PUT',
    'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, Origin',
  },
});

const getRefreshToken = async () => {
  const refreshToken = Cookies.get('REFRESH_TOKEN');
  if (refreshToken) {
    try {
      const rs = await httpClient.post(`${apiConfig.apiUrl}/auth/refresh-token`, {
        refreshToken,
      });
      const { accessToken } = rs.data.data;
      return accessToken;
    } catch (_error) {
      return null;
    }
  }
};

const handleAccessTokenExpire = async (err) => {
  const originalRequest = err.config;
  const refreshToken = Cookies.get('REFRESH_TOKEN');
  if (refreshToken) {
    originalRequest._retry = true;
    try {
      const rs = await httpClient.post(`${apiConfig.apiUrl}/auth/refresh-token`, {
        refreshToken,
      });
      const { accessToken } = rs.data.data;
      axios.defaults.headers.common['Authorization'] = accessToken;
      Cookies.set('ACCESS_TOKEN', accessToken);
      return httpClient(originalRequest);
    } catch (_error) {
      return Promise.reject(_error);
    }
  }
};

httpClient.interceptors.request.use(
  (config: AxiosRequestConfig = {}) => {
    const accessToken = Cookies.get('ACCESS_TOKEN');
    if (accessToken && config.headers) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    if (config.data instanceof FormData) {
      config.headers = {
        ...config.headers,
        'Content-Type': 'multipart/form-data',
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

httpClient.interceptors.response.use(
  async (response) => {
    return response;
  },
  async (error) => {
    if (!error) {
      return;
    }
    const httpStatus = error?.response?.status;
    const rawErrors = error?.response?.data;
    const errors = 'message' in (rawErrors || {}) ? rawErrors.message : rawErrors;

    switch (httpStatus) {
      case HttpStatusCodes.UNAUTHORIZED:
        // TODO: handle unauthorized response
        if (!refreshTokenPromise) { // check for an existing in-progress request
          // if nothing is in-progress, start a new refresh token request
          refreshTokenPromise = getRefreshToken().then(token => {
            refreshTokenPromise = null // clear state
            return token // resolve with the new token
          })
        }
        error.config._retry = true;
        return refreshTokenPromise.then(token => {
          error.config.headers['ACCESS_TOKEN'] = token
          return httpClient.request(error.config)
        })
      case HttpStatusCodes.NOT_FOUND:
        throw !!errors ? errors : 'Requested resource was not found.';
      case HttpStatusCodes.BAD_REQUEST:
        throw !!errors ? errors : 'Bad Request.';
      case HttpStatusCodes.FORBIDDEN:
        throw errors ? errors : 'Access to this resource is forbidden';
      case HttpStatusCodes.INTERNAL_SERVER_ERROR:
        throw errors;
      default:
        throw !!errors
          ? errors
          : 'Unknown error occurred, please try again later.';
    }
  },
);

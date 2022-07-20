import { httpClient } from '../httpClient';

const api = process.env.API_BASE_URL;

export const startKyc = async (payload) => {
  return await httpClient.post(`${api}/kyc/verification/start`, payload);
};

export const finishKyc = async (payload) => {
  return await httpClient.post(`${api}/kyc/verification/finish`, payload);
};

export const getKycStatus = async () => {
  return await httpClient.get(`${api}/kyc/verification/status`);
};
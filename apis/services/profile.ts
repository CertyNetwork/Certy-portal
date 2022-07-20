import { httpClient } from '../httpClient';

const api = process.env.API_BASE_URL;

export const getUserType = async () => {
  return await httpClient.get(`${api}/profile/type`);
};

export const changeUserType = async (userType: 'individual' | 'institution') => {
  return await httpClient.post(`${api}/profile/me`, {
    userType
  });
};

export const getProfile = async () => {
  return await httpClient.get(`${api}/profile/me`);
};

export const getAvatar = async () => {
  return await httpClient.get(`${api}/profile/me/avatar`);
};

export const uploadAvatar = async (formData: FormData) => {
  return await httpClient.post(`${api}/profile/me/avatar`, formData);
};

export const removeAvatar = async () => {
  return await httpClient.delete(`${api}/profile/me/avatar`);
};

export const getBgImage = async () => {
  return await httpClient.get(`${api}/profile/me/bg-image`);
};

export const uploadBgImage = async (formData: FormData) => {
  return await httpClient.post(`${api}/profile/me/bg-image`, formData);
};

export const removeBgImage = async () => {
  return await httpClient.delete(`${api}/profile/me/bg-image`);
};

export const getAccountAvatar = async (accountId: string) => {
  return await httpClient.get(`${api}/profile/avatar/${accountId}`);
};

export const updateIndividualBasicInfo = async (info) => {
  return await httpClient.post(`${api}/profile/me/individual-info`, info, {});
};

export const updateOrganizationBasicInfo = async (info) => {
  return await httpClient.post(`${api}/profile/me/organization-info`, info, {});
};

export const uploadOrganizationImages =async (formData: any, onUploadProgress?: (progressEvent: any) => void) => {
  return await httpClient.post(`${api}/profile/me/organization-images`, formData, {
    onUploadProgress
  });
}

export const removeOrganizationImages =async (docUri) => {
  return await httpClient.delete(`${api}/profile/me/organization-images/${docUri}`);
}

export const addExperience = async (experience) => {
  return await httpClient.post(`${api}/profile/me/experiences`, experience, {});
};

export const addEducation = async (education) => {
  return await httpClient.post(`${api}/profile/me/educations`, education, {});
};

export const addSkills = async (payload) => {
  return await httpClient.post(`${api}/profile/me/skills`, payload, {});
};

export const addCertificates = async (payload) => {
  return await httpClient.post(`${api}/profile/me/certificates`, payload, {});
};

export const addAbout = async (payload) => {
  return await httpClient.post(`${api}/profile/me/about`, payload, {});
};

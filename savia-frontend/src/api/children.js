import api from './client';

export const getMyChildren = async () => {
  const response = await api.get('/children');
  return response.data;
};

export const getChildById = async (id) => {
  const response = await api.get(`/children/${id}`);
  return response.data;
};

export const createChild = async (childData) => {
  const response = await api.post('/children', childData);
  return response.data;
};

export const updateChild = async (id, childData) => {
  const response = await api.put(`/children/${id}`, childData);
  return response.data;
};

export const getChildNeeds = async (id) => {
  const response = await api.get(`/children/${id}/needs`);
  return response.data;
};

export const upsertChildNeeds = async (id, needsData) => {
  const response = await api.put(`/children/${id}/needs`, needsData);
  return response.data;
};

export const getChildGuardians = async (id) => {
  const response = await api.get(`/children/${id}/guardians`);
  return response.data;
};

export const addGuardianToChild = async (id, guardianData) => {
  const response = await api.post(`/children/${id}/guardians`, guardianData);
  return response.data;
};

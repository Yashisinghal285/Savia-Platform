import api from './client';

export const getUserDashboard = async () => {
  const response = await api.get('/dashboard/me');
  return response.data;
};

export const getChildDashboard = async (childId) => {
  const response = await api.get(`/dashboard/children/${childId}`);
  return response.data;
};

export const getAdminDashboard = async () => {
  const response = await api.get('/dashboard/admin');
  return response.data;
};

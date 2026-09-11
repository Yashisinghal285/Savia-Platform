import api from './client';

export const getProgressLogsForChild = async (childId, params = {}) => {
  const response = await api.get(`/children/${childId}/progress`, { params });
  return response.data;
};

export const getProgressLogsForProgram = async (programId) => {
  const response = await api.get(`/programs/${programId}/progress`);
  return response.data;
};

export const logProgress = async (childId, logData) => {
  const response = await api.post(`/children/${childId}/progress`, logData);
  return response.data;
};

export const updateProgressLog = async (id, logData) => {
  const response = await api.put(`/progress/${id}`, logData);
  return response.data;
};

export const deleteProgressLog = async (id) => {
  const response = await api.delete(`/progress/${id}`);
  return response.data;
};

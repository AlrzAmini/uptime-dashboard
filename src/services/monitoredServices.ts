import axios from 'axios';

const api = axios.create({
  baseURL: 'https://uptimex-api.liara.run',
  timeout: 7000,
});

export async function getServices() {
  const response = await api.get('/monitored-services');
  return response.data;
}

export async function getServiceById(id: string) {
  const response = await api.get(`/monitored-services/${id}`);
  return response.data;
}

export async function createService(service: {
  name: string;
  url: string;
  description?: string | null;
  type?: string | null;
  isActive?: boolean;
  environment?: string | null;
  expectedResponseTimeMs?: number;
  ownerTeam?: string | null;
  contactEmail?: string | null;
  projectName?: string | null;
  maxAllowedDowntimePerMonth?: string | null;
  checkInterval?: string | null;
  tags?: string[];
}) {
  const response = await api.post('/monitored-services', service);
  return response.data;
}

export async function updateService(id: string, service: any) {
  const response = await api.put(`/monitored-services/${id}`, service);
  return response.data;
}

export async function deleteService(id: string) {
  await api.delete(`/monitored-services/${id}`);
}

export async function analyzeUptime(params: {
  monitoredServiceId?: string;
  from?: string;
  to?: string;
  pageNumber?: number;
  pageSize?: number;
}) {
  const response = await api.get('/monitored-services/analyze', { params });
  return response.data;
}
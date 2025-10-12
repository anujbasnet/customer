import axios from 'axios';

// TODO: externalize to env / app config. For now reuse same base.
export const API_BASE_URL = 'http://192.168.1.4:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  // token logic placeholder (add if auth implemented for mobile)
  return config;
});

export interface BackendBusinessListItem {
  id: string;
  name: string;
  service?: string;
  address: string;
  category: string;
  image: string;
}

export async function fetchAllBusinesses() {
  const { data } = await api.get<BackendBusinessListItem[]>('/admin/business/all');
  return data;
}

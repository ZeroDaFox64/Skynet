/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

axios.defaults.withCredentials = true;

const baseURL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL,
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json"
  },
  validateStatus: function (status) {
    return (status >= 200 && status < 300) || [400, 401].includes(status);
  }
});

export const post = async (url: string, data: any) => {
  const response = await api.post(url, data);
  return response.data;
};

export const get = async (url: string) => {
  const response = await api.get(url);
  return response.data;
};

export const put = async (url: string, data: any) => {
  const response = await api.put(url, data);
  return response.data;
};
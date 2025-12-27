import axios, { type AxiosError } from 'axios';
import { Platform } from 'react-native';

export class API {
  public static async get<T>(url: string): Promise<T> {
    const fullUrl = API.getApiUrl(url);
    console.log(`GET: ${fullUrl}`);

    try {
      const { data } = await axios.get(fullUrl, {
        withCredentials: true,
      });

      return data;
    } catch (e) {
      const error = e as AxiosError;

      if (error.response?.data) {
        throw new Error((error.response?.data as any).error);
      }

      throw error;
    }
  }

  public static async put<T>(url: string, data: any): Promise<T> {
    const fullUrl = API.getApiUrl(url);
    console.log(`PUT: ${fullUrl}`);

    try {
      return (
        await axios.put(fullUrl, data, {
          withCredentials: true,
        })
      ).data;
    } catch (e) {
      const error = e as AxiosError;

      if (error.response?.data) {
        throw new Error((error.response?.data as any).error);
      }

      throw error;
    }
  }

  public static async patch<T>(url: string, data: any): Promise<T> {
    const fullUrl = API.getApiUrl(url);
    console.log(`PATCH: ${fullUrl}`);

    try {
      return (
        await axios.patch(fullUrl, data, {
          withCredentials: true,
        })
      ).data;
    } catch (e) {
      const error = e as AxiosError;

      if (error.response?.data) {
        throw new Error((error.response?.data as any).error);
      }

      throw error;
    }
  }

  public static async delete<T>(url: string): Promise<T> {
    const fullUrl = API.getApiUrl(url);
    console.log(`DELETE: ${fullUrl}`);

    try {
      return (
        await axios.delete(fullUrl, {
          withCredentials: true,
        })
      ).data;
    } catch (e) {
      const error = e as AxiosError;

      if (error.response?.data) {
        throw new Error((error.response?.data as any).error);
      }

      throw error;
    }
  }

  public static getApiUrl(apiUrl: string): string {
    let url = apiUrl;

    if (!url.startsWith('/')) {
      url = `/${url}`;
    }

    if (Platform.OS === 'web') {
      return `http://localhost:3000${url}`;
    }

    switch (process.env.NODE_ENV) {
      case 'development':
        // return `http://172.20.10.2:3000${url}`;
        return `http://192.168.1.250:3000${url}`;
      default:
        return `https://forest-api-khaki.vercel.app/${url}`;
    }
  }
}

import { PUBLIC_BASE_API } from '$env/static/public';
import { parse } from 'cookie';

interface RequestConfig extends RequestInit {
  noRefresh?: boolean;
}

let controller: AbortController | null = null;

export async function fetchApi(input: RequestInfo | URL, init?: RequestConfig): Promise<Response> {
  if (controller) {
    controller.abort();
  }

  controller = new AbortController();
  const { signal } = controller;

  const originalPath = `${PUBLIC_BASE_API}${input}`;
  let response = await fetch(originalPath, { ...init, signal });

  // Request fails
  if (response.status === 401 && !init?.noRefresh) {

    // Refresh user's access token
    const refreshToken = getCookie('Refresh');
    if (refreshToken) {
      const refreshPath = `${PUBLIC_BASE_API}/auth/refresh`;
      const refresh = await fetch(refreshPath, { method: 'POST' });

      if (!refresh.ok) {
        const logoutPath = `${PUBLIC_BASE_API}/auth/logout`;
        await fetch(logoutPath, { method: 'POST' });

        return refresh;
      }

      // Retry request
      response = await fetch(originalPath, { ...init, signal });
    }
  }

  return response;
}

const getCookie = (name: string) => {
  const cookies = parse(document.cookie);
  return cookies[name];
};
import { Capacitor, CapacitorHttp } from '@capacitor/core';

export const WEBSITE_ORIGIN = 'https://www.gearboxautos.in';
export const isNativeApp = () => Capacitor.isNativePlatform();
export const publicShareUrl = (path: string) => new URL(path, WEBSITE_ORIGIN).href;

// TanStack supplies the serialized request; this adapter never constructs RPC payloads.
export async function appServerFetch(url: string, init: RequestInit): Promise<Response> {
  if (!isNativeApp()) return fetch(url, init);
  if (!navigator.onLine) throw new Error('No internet connection. Your request has not been submitted.');
  init.signal?.throwIfAborted();
  const remote = new URL(url, WEBSITE_ORIGIN);
  if (remote.origin !== WEBSITE_ORIGIN) throw new Error('Unexpected app service address.');
  const headers = Object.fromEntries(new Headers(init.headers).entries());
  try {
    const result = await CapacitorHttp.request({
      url: remote.href,
      method: init.method ?? 'GET',
      headers,
      data: init.body ?? undefined,
      responseType: 'arraybuffer',
      connectTimeout: 15000,
      readTimeout: 30000,
      disableRedirects: true,
    });
    init.signal?.throwIfAborted();
    if (result.status >= 300 && result.status < 400) {
      throw new Error('The app service redirected unexpectedly. Please try again.');
    }
    const contentType = Object.entries(result.headers).find(([key]) => key.toLowerCase() === 'content-type')?.[1] ?? '';
    // Capacitor parses JSON responses itself; framed/binary responses are base64.
    const body = contentType.includes('application/json')
      ? JSON.stringify(result.data)
      : Uint8Array.from(atob(result.data), (char) => char.charCodeAt(0));
    return new Response(body, { status: result.status, headers: result.headers });
  } catch (error) {
    if (init.signal?.aborted) throw error;
    throw new Error('Unable to connect. Please check your internet connection before retrying.');
  }
}
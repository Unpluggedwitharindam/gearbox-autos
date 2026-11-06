import { Capacitor, CapacitorHttp } from '@capacitor/core';

export const WEBSITE_ORIGIN = 'https://www.gearboxautos.in';
export const isNativeApp = () => Capacitor.isNativePlatform();
export const publicShareUrl = (path: string) => new URL(path, WEBSITE_ORIGIN).href;

// TanStack supplies the serialized request; this adapter never constructs RPC payloads.
export async function appServerFetch(input: string | URL | Request, init: RequestInit = {}): Promise<Response> {
  if (!isNativeApp()) return fetch(input, init);
  if (!navigator.onLine) throw new Error('No internet connection. Your request has not been submitted.');
  const remote = new URL(input instanceof Request ? input.url : String(input), WEBSITE_ORIGIN);
  if (remote.origin !== WEBSITE_ORIGIN) throw new Error('Unexpected app service address.');
  const request = input instanceof Request ? new Request(input, init) : new Request(remote, init);
  request.signal.throwIfAborted();
  const headers = Object.fromEntries(request.headers.entries());
  const data = ['GET', 'HEAD'].includes(request.method) ? undefined : await request.text();
  try {
    const result = await CapacitorHttp.request({
      url: remote.href,
      method: request.method,
      headers,
      data,
      responseType: 'arraybuffer',
      connectTimeout: 15000,
      readTimeout: 30000,
      disableRedirects: true,
    });
    request.signal.throwIfAborted();
    if (result.status >= 300 && result.status < 400) {
      throw new Error('The app service redirected unexpectedly. Please try again.');
    }
    const contentType = Object.entries(result.headers).find(([key]) => key.toLowerCase() === 'content-type')?.[1] ?? '';
    // Capacitor parses JSON responses itself; framed/binary responses are base64.
    const body = contentType.includes('application/json')
      ? JSON.stringify(result.data)
      : result.status >= 400 ? String(result.data) : Uint8Array.from(atob(result.data), (char) => char.charCodeAt(0));
    return new Response(body, { status: result.status, headers: result.headers });
  } catch (error) {
    if (request.signal.aborted) throw error;
    throw new Error('Unable to connect. Please check your internet connection before retrying.');
  }
}
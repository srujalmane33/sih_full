/**
 * Light fetch wrapper for data loading with fallback support
 */
export async function getJson(url, options = {}) {
  try {
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
      ...options,
    });
    if (!res.ok) {
      throw new Error(`HTTP Error ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`[httpClient] Error fetching ${url}:`, err.message);
    throw err;
  }
}

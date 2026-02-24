/**
 * Geocoding utility — resolves an Argentine address to lat/lng via Nominatim (OSM).
 * Falls back silently if the API is unavailable or returns no results.
 */
export async function geocodeAddress(
  address: string,
  city: string,
  state: string,
): Promise<{ latitude: number; longitude: number } | null> {
  try {
    const query = [address, city, state].filter(Boolean).join(", ");
    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=ar&q=${encodeURIComponent(query)}`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "app-inmobiliaria/1.0 (contacto@app-inmobiliaria.local)",
        "Accept-Language": "es",
      },
      signal: AbortSignal.timeout(4000), // 4s timeout — don't block property creation
    });

    if (!res.ok) return null;
    const json = await res.json();
    if (!Array.isArray(json) || json.length === 0) return null;

    const latitude = parseFloat(json[0].lat);
    const longitude = parseFloat(json[0].lon);
    if (isNaN(latitude) || isNaN(longitude)) return null;

    return { latitude, longitude };
  } catch {
    return null; // fail silently
  }
}

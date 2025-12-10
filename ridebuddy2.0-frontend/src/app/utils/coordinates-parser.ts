export function parseCoordinates(coordinates: any): { lat: number; lng: number } {
  // Case 1: coordinate is a string "lng,lat"
  if (typeof coordinates === 'string') {
    const [lng, lat] = coordinates.split(',').map(Number);
    return { lat, lng };
  }

  // Case 2: coordinate is an array [lng, lat]
  if (Array.isArray(coordinates)) {
    return { lat: coordinates[1], lng: coordinates[0] };
  }

  // Case 3: coordinate is already { lat, lng }
  if ('lat' in coordinates && 'lng' in coordinates) {
    return { lat: coordinates.lat, lng: coordinates.lng };
  }

  throw new Error('Invalid coordinate format');
}

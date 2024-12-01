export function validateSpotifyArtistUrl(url: string): { isValid: boolean; artistId?: string } {
  try {
    const urlObj = new URL(url);
    
    // Check if it's a Spotify URL
    if (!urlObj.hostname.includes('spotify.com')) {
      return { isValid: false };
    }

    // Handle open.spotify.com URLs
    if (urlObj.hostname === 'open.spotify.com') {
      const pathParts = urlObj.pathname.split('/');
      if (pathParts[1] === 'artist' && pathParts[2]) {
        return { isValid: true, artistId: pathParts[2] };
      }
    }

    // Handle spotify:artist: URIs (in case someone pastes those)
    if (url.startsWith('spotify:artist:')) {
      const artistId = url.split(':')[2];
      if (artistId) {
        return { isValid: true, artistId };
      }
    }

    return { isValid: false };
  } catch (error) {
    return { isValid: false };
  }
}

export function getSpotifyArtistUri(artistId: string): string {
  return `spotify:artist:${artistId}`;
}

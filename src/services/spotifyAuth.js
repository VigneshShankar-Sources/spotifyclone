// Spotify Web API OAuth 2.0 PKCE Service

const SPOTIFY_SCOPES = [
  'user-read-private',
  'user-read-email',
  'user-library-read',
  'user-library-modify',
  'playlist-read-private',
  'playlist-read-collaborative',
  'playlist-modify-public',
  'playlist-modify-private',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing'
].join(' ');

// Generate a random code verifier
function generateRandomString(length) {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], '');
}

// Generate code challenge from verifier using SHA-256
async function generateCodeChallenge(codeVerifier) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export const getStoredClientId = () => {
  return localStorage.getItem('spotify_client_id') || '';
};

export const setStoredClientId = (clientId) => {
  localStorage.setItem('spotify_client_id', clientId.trim());
};

export const initiateSpotifyLogin = async (clientId) => {
  if (!clientId) {
    throw new Error('Please enter a Spotify Client ID.');
  }

  setStoredClientId(clientId);
  const verifier = generateRandomString(64);
  const challenge = await generateCodeChallenge(verifier);

  localStorage.setItem('spotify_code_verifier', verifier);

  const redirectUri = window.location.origin + window.location.pathname;
  localStorage.setItem('spotify_redirect_uri', redirectUri);

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    scope: SPOTIFY_SCOPES,
    code_challenge_method: 'S256',
    code_challenge: challenge
  });

  window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
};

export const exchangeCodeForToken = async (code) => {
  const verifier = localStorage.getItem('spotify_code_verifier');
  const clientId = getStoredClientId();
  const redirectUri = localStorage.getItem('spotify_redirect_uri') || (window.location.origin + window.location.pathname);

  if (!verifier || !clientId) {
    throw new Error('Missing code verifier or client ID');
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      code_verifier: verifier
    })
  });

  const data = await response.json();
  if (data.error) {
    throw new Error(data.error_description || data.error);
  }

  const expiresAt = Date.now() + (data.expires_in * 1000);
  localStorage.setItem('spotify_access_token', data.access_token);
  if (data.refresh_token) {
    localStorage.setItem('spotify_refresh_token', data.refresh_token);
  }
  localStorage.setItem('spotify_token_expires_at', expiresAt.toString());

  return data.access_token;
};

export const getStoredAccessToken = () => {
  const token = localStorage.getItem('spotify_access_token');
  const expiresAt = localStorage.getItem('spotify_token_expires_at');
  if (!token || !expiresAt) return null;
  if (Date.now() > parseInt(expiresAt, 10)) {
    // Expired
    return null;
  }
  return token;
};

export const fetchSpotifyProfile = async (token) => {
  const res = await fetch('https://api.spotify.com/v1/me', {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch Spotify profile');
  return res.json();
};

export const fetchSpotifyPlaylists = async (token) => {
  const res = await fetch('https://api.spotify.com/v1/me/playlists?limit=20', {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.items || [];
};

export const fetchSpotifySavedTracks = async (token) => {
  const res = await fetch('https://api.spotify.com/v1/me/tracks?limit=30', {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.items || [];
};

export const logoutSpotify = () => {
  localStorage.removeItem('spotify_access_token');
  localStorage.removeItem('spotify_refresh_token');
  localStorage.removeItem('spotify_token_expires_at');
  localStorage.removeItem('spotify_user_profile');
  localStorage.removeItem('spotify_code_verifier');
};

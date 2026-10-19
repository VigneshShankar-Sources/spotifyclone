import React, { useState } from 'react';
import { X, ExternalLink, Key, LogIn, CheckCircle2, ShieldCheck } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { initiateSpotifyLogin, getStoredClientId, setStoredClientId } from '../services/spotifyAuth';

export const LoginModal = () => {
  const {
    isLoginModalOpen,
    setIsLoginModalOpen,
    spotifyUser,
    logout,
    connectWithAccessToken,
    showToast
  } = usePlayer();

  const [clientId, setClientId] = useState(getStoredClientId() || '');
  const [tokenInput, setTokenInput] = useState('');
  const [activeTab, setActiveTab] = useState('oauth'); // 'oauth' | 'token'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isLoginModalOpen) return null;

  const currentRedirectUri = window.location.origin + window.location.pathname;

  const handleOAuthLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!clientId.trim()) {
      setError('Please provide a Spotify Client ID.');
      return;
    }
    try {
      setIsLoading(true);
      await initiateSpotifyLogin(clientId.trim());
    } catch (err) {
      setError(err.message || 'Login initiation failed');
      setIsLoading(false);
    }
  };

  const handleTokenSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!tokenInput.trim()) {
      setError('Please enter a Spotify access token.');
      return;
    }
    try {
      setIsLoading(true);
      await connectWithAccessToken(tokenInput.trim());
      setIsLoading(false);
      setIsLoginModalOpen(false);
    } catch (err) {
      setError('Invalid or expired token. Please verify permissions.');
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsLoginModalOpen(false)}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="var(--spotify-green)">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 5.524 4.477 10 10 10 5.524 0 10-4.476 10-10 0-5.523-4.476-10-10-10zm4.586 14.424c-.18.295-.563.387-.857.207-2.35-1.435-5.308-1.76-8.793-.963-.335.077-.67-.133-.746-.468-.077-.334.132-.67.467-.746 3.808-.87 7.076-.496 9.722 1.115.294.18.386.563.207.855zm1.226-2.729c-.227.37-.714.486-1.083.26-2.69-1.654-6.79-2.133-9.972-1.167-.417.127-.862-.11-.989-.526-.126-.417.11-.862.527-.99 3.633-1.103 8.147-.568 11.257 1.34.37.227.486.715.26 1.083zm.106-2.835C14.692 8.95 9.375 8.775 6.297 9.71c-.495.15-1.02-.132-1.17-.627-.15-.494.133-1.02.628-1.17 3.535-1.073 9.404-.866 13.115 1.338.445.264.59.838.327 1.282-.264.444-.838.59-1.282.327z" />
            </svg>
            <h2 style={{ fontSize: '20px', fontWeight: '800' }}>
              {spotifyUser ? 'Spotify Account' : 'Connect Spotify Account'}
            </h2>
          </div>
          <button
            onClick={() => setIsLoginModalOpen(false)}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* If already logged in */}
        {spotifyUser ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px',
                backgroundColor: 'rgba(255,255,255,0.06)',
                borderRadius: '8px'
              }}
            >
              <img
                src={spotifyUser.images?.[0]?.url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                alt={spotifyUser.display_name}
                style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '18px', fontWeight: '800' }}>{spotifyUser.display_name}</span>
                  <CheckCircle2 size={18} fill="var(--spotify-green)" color="#000" />
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '2px' }}>
                  {spotifyUser.email || spotifyUser.id}
                </div>
                <div style={{ color: 'var(--spotify-green)', fontSize: '12px', fontWeight: '600', marginTop: '4px' }}>
                  Product: {spotifyUser.product || 'Premium'} • Followers: {spotifyUser.followers?.total || 0}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                onClick={() => {
                  logout();
                  setIsLoginModalOpen(false);
                }}
                style={{
                  background: 'none',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff',
                  borderRadius: '9999px',
                  padding: '8px 20px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Log Out
              </button>
              <button
                onClick={() => setIsLoginModalOpen(false)}
                className="btn-spotify-primary"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          /* Login Tabs & Options */
          <div>
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', marginBottom: '16px' }}>
              <button
                onClick={() => setActiveTab('oauth')}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '10px 16px',
                  color: activeTab === 'oauth' ? '#fff' : 'var(--text-secondary)',
                  fontWeight: '700',
                  borderBottom: activeTab === 'oauth' ? '2px solid var(--spotify-green)' : 'none',
                  cursor: 'pointer'
                }}
              >
                OAuth PKCE Login
              </button>
              <button
                onClick={() => setActiveTab('token')}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '10px 16px',
                  color: activeTab === 'token' ? '#fff' : 'var(--text-secondary)',
                  fontWeight: '700',
                  borderBottom: activeTab === 'token' ? '2px solid var(--spotify-green)' : 'none',
                  cursor: 'pointer'
                }}
              >
                Direct Access Token
              </button>
            </div>

            {error && (
              <div
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid #ef4444',
                  color: '#fca5a5',
                  padding: '10px 14px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  marginBottom: '16px'
                }}
              >
                {error}
              </div>
            )}

            {activeTab === 'oauth' ? (
              <form onSubmit={handleOAuthLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.5' }}>
                  Sign in with your real Spotify account using Spotify's official OAuth 2.0 PKCE flow.
                </p>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#fff', display: 'block', marginBottom: '6px' }}>
                    Spotify Client ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 5f4e3c2b1a0d9e8f..."
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    style={{
                      width: '100%',
                      backgroundColor: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '6px',
                      padding: '10px 12px',
                      color: '#fff',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                  <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    Add this Redirect URI in your{' '}
                    <a
                      href="https://developer.spotify.com/dashboard"
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: 'var(--spotify-green)', textDecoration: 'none' }}
                    >
                      Spotify Developer Dashboard <ExternalLink size={12} style={{ display: 'inline' }} />
                    </a>
                    :
                    <div
                      style={{
                        backgroundColor: '#181818',
                        padding: '6px 8px',
                        borderRadius: '4px',
                        fontFamily: 'monospace',
                        color: '#fff',
                        marginTop: '4px',
                        wordBreak: 'break-all'
                      }}
                    >
                      {currentRedirectUri}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setIsLoginModalOpen(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontWeight: '700'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-spotify-primary"
                  >
                    {isLoading ? 'Redirecting...' : 'Log In with Spotify'}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleTokenSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.5' }}>
                  Have an active Spotify OAuth Token from the Spotify Developer Console or API tester? Paste it here for instantaneous connection!
                </p>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#fff', display: 'block', marginBottom: '6px' }}>
                    Access Token (Bearer ...)
                  </label>
                  <textarea
                    rows={4}
                    placeholder="BQB_your_spotify_token_here..."
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    style={{
                      width: '100%',
                      backgroundColor: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '6px',
                      padding: '10px 12px',
                      color: '#fff',
                      fontSize: '13px',
                      fontFamily: 'monospace',
                      outline: 'none',
                      resize: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setIsLoginModalOpen(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontWeight: '700'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-spotify-primary"
                  >
                    {isLoading ? 'Connecting...' : 'Connect Token'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

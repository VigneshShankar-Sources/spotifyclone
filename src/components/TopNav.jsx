import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Search, Bell, Download, ExternalLink, LogIn, LogOut, CheckCircle2 } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

export const TopNav = ({ searchQuery, setSearchQuery, isScrolled }) => {
  const {
    canGoBack,
    canGoForward,
    navigateBack,
    navigateForward,
    activeView,
    navigateTo,
    spotifyUser,
    logout,
    setIsLoginModalOpen,
    showToast
  } = usePlayer();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const userDisplayName = spotifyUser?.display_name || 'Vignesh Shankar';
  const userAvatar = spotifyUser?.images?.[0]?.url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80';

  return (
    <header className={`top-nav ${isScrolled ? 'scrolled' : ''}`}>
      {/* Left: Navigation Chevrons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          className="btn-round-nav"
          onClick={navigateBack}
          disabled={!canGoBack}
          title="Go back"
        >
          <ChevronLeft size={22} />
        </button>

        <button
          className="btn-round-nav"
          onClick={navigateForward}
          disabled={!canGoForward}
          title="Go forward"
        >
          <ChevronRight size={22} />
        </button>

        {/* Search input in TopNav if in Search view */}
        {activeView === 'search' && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#242424',
              borderRadius: '500px',
              padding: '6px 14px',
              marginLeft: '12px',
              width: '320px',
              border: '1px solid transparent',
              transition: 'all 0.2s ease'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#ffffff';
              e.currentTarget.style.backgroundColor = '#2a2a2a';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'transparent';
              e.currentTarget.style.backgroundColor = '#242424';
            }}
          >
            <Search size={18} color="var(--text-secondary)" style={{ marginRight: '8px' }} />
            <input
              type="text"
              placeholder="What do you want to play?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'none',
                border: 'none',
                color: '#fff',
                fontSize: '14px',
                outline: 'none',
                width: '100%'
              }}
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                ✕
              </button>
            )}
          </div>
        )}
      </div>

      {/* Right: Actions and Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
        {/* Connect / Login Button */}
        {!spotifyUser ? (
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="btn-spotify-primary"
            style={{ padding: '7px 18px', fontSize: '13px' }}
          >
            <LogIn size={15} />
            <span>Connect Spotify</span>
          </button>
        ) : (
          <button
            onClick={() => setIsLoginModalOpen(true)}
            style={{
              backgroundColor: 'rgba(29, 185, 84, 0.15)',
              border: '1px solid var(--spotify-green)',
              color: 'var(--spotify-green)',
              borderRadius: '9999px',
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <CheckCircle2 size={14} />
            <span>Connected</span>
          </button>
        )}

        {/* Explore Premium */}
        <button
          onClick={() => showToast('Spotify Premium: Unlimited skips and ad-free listening!')}
          style={{
            backgroundColor: '#ffffff',
            color: '#000000',
            fontWeight: '700',
            fontSize: '13px',
            padding: '7px 16px',
            borderRadius: '9999px',
            border: 'none',
            cursor: 'pointer',
            transition: 'transform 0.15s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          Explore Premium
        </button>

        {/* Install App */}
        <button
          onClick={() => showToast('Desktop App is currently running & active')}
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: '#ffffff',
            fontWeight: '700',
            fontSize: '13px',
            padding: '7px 14px',
            borderRadius: '9999px',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <Download size={16} />
          <span>Install App</span>
        </button>

        {/* Bell Notification */}
        <button
          className="btn-round-nav"
          title="What's New"
          onClick={() => showToast('No new notifications')}
        >
          <Bell size={18} />
        </button>

        {/* Profile Avatar Button */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#1f1f1f',
              border: spotifyUser ? '2px solid var(--spotify-green)' : '2px solid rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              overflow: 'hidden',
              padding: 0
            }}
            title={userDisplayName}
          >
            <img
              src={userAvatar}
              alt={userDisplayName}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </button>

          {/* Profile Dropdown */}
          {isProfileMenuOpen && (
            <div
              style={{
                position: 'absolute',
                top: '46px',
                right: 0,
                width: '220px',
                backgroundColor: '#282828',
                borderRadius: '6px',
                boxShadow: '0 16px 24px rgba(0,0,0,0.5)',
                padding: '6px',
                zIndex: 100,
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div style={{ padding: '8px 12px 6px 12px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff' }}>{userDisplayName}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {spotifyUser ? 'Connected Spotify Account' : 'Guest Account'}
                </div>
              </div>

              {[
                {
                  label: spotifyUser ? 'Spotify Account' : 'Connect Spotify Account',
                  onClick: () => setIsLoginModalOpen(true)
                },
                {
                  label: 'Profile',
                  onClick: () => navigateTo('artist', { artistId: 'artist-weeknd' })
                },
                {
                  label: 'Upgrade to Premium',
                  icon: ExternalLink,
                  onClick: () => showToast('Opening Spotify Premium portal')
                },
                {
                  label: 'Settings',
                  onClick: () => showToast('Preferences opened')
                },
                ...(spotifyUser
                  ? [
                      {
                        label: 'Log out',
                        divider: true,
                        onClick: () => logout()
                      }
                    ]
                  : [])
              ].map((item, idx) => (
                <div key={idx}>
                  {item.divider && (
                    <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', margin: '4px 0' }} />
                  )}
                  <div
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      if (item.onClick) item.onClick();
                    }}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '4px',
                      fontSize: '13px',
                      fontWeight: '500',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'background-color 0.15s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <span>{item.label}</span>
                    {item.icon && <item.icon size={14} color="var(--text-secondary)" />}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

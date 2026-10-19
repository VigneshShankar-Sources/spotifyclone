import React, { useState } from 'react';
import { Home, Search, Library, Plus, Heart, Music, Disc, User, ListFilter } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { MOCK_TRACKS } from '../data/mockData';

export const Sidebar = () => {
  const {
    activeView,
    navigateTo,
    playlists,
    likedSongIds,
    activePlaylistId,
    isPlaying,
    currentTrack,
    setIsCreatePlaylistOpen
  } = usePlayer();

  const [filterType, setFilterType] = useState('all'); // 'all' | 'playlists' | 'artists'
  const [searchFilter, setSearchFilter] = useState('');

  const filteredPlaylists = playlists.filter((pl) => {
    if (filterType === 'artists') return false;
    if (!searchFilter) return true;
    return pl.title.toLowerCase().includes(searchFilter.toLowerCase());
  });

  return (
    <aside className="sidebar">
      {/* Top Nav Box */}
      <div className="sidebar-box">
        {/* Spotify Logo */}
        <div
          onClick={() => navigateTo('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            marginBottom: '20px'
          }}
        >
          <svg width="34" height="34" viewBox="0 0 24 24" fill="#ffffff">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 5.524 4.477 10 10 10 5.524 0 10-4.476 10-10 0-5.523-4.476-10-10-10zm4.586 14.424c-.18.295-.563.387-.857.207-2.35-1.435-5.308-1.76-8.793-.963-.335.077-.67-.133-.746-.468-.077-.334.132-.67.467-.746 3.808-.87 7.076-.496 9.722 1.115.294.18.386.563.207.855zm1.226-2.729c-.227.37-.714.486-1.083.26-2.69-1.654-6.79-2.133-9.972-1.167-.417.127-.862-.11-.989-.526-.126-.417.11-.862.527-.99 3.633-1.103 8.147-.568 11.257 1.34.37.227.486.715.26 1.083zm.106-2.835C14.692 8.95 9.375 8.775 6.297 9.71c-.495.15-1.02-.132-1.17-.627-.15-.494.133-1.02.628-1.17 3.535-1.073 9.404-.866 13.115 1.338.445.264.59.838.327 1.282-.264.444-.838.59-1.282.327z" />
          </svg>
          <span style={{ fontSize: '22px', fontWeight: '800', letterSpacing: '-0.5px' }}>Spotify</span>
        </div>

        {/* Primary Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <button
            onClick={() => navigateTo('home')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              background: 'none',
              border: 'none',
              color: activeView === 'home' ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontWeight: activeView === 'home' ? '700' : '600',
              fontSize: '15px',
              cursor: 'pointer',
              padding: '6px 0',
              transition: 'color 0.2s ease'
            }}
          >
            <Home size={24} color={activeView === 'home' ? 'var(--text-primary)' : 'var(--text-secondary)'} />
            <span>Home</span>
          </button>

          <button
            onClick={() => navigateTo('search')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              background: 'none',
              border: 'none',
              color: activeView === 'search' ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontWeight: activeView === 'search' ? '700' : '600',
              fontSize: '15px',
              cursor: 'pointer',
              padding: '6px 0',
              transition: 'color 0.2s ease'
            }}
          >
            <Search size={24} color={activeView === 'search' ? 'var(--text-primary)' : 'var(--text-secondary)'} />
            <span>Search</span>
          </button>
        </div>
      </div>

      {/* Library Box */}
      <div className="sidebar-library-box">
        {/* Library Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '4px 8px 12px 4px'
          }}
        >
          <button
            onClick={() => navigateTo('library')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'none',
              border: 'none',
              color: activeView === 'library' ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontWeight: '700',
              fontSize: '15px',
              cursor: 'pointer'
            }}
          >
            <Library size={24} />
            <span>Your Library</span>
          </button>

          <button
            onClick={() => setIsCreatePlaylistOpen(true)}
            title="Create playlist"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-secondary)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <Plus size={20} />
          </button>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', padding: '0 4px 12px 4px' }}>
          {['all', 'playlists', 'artists'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type === filterType ? 'all' : type)}
              style={{
                background: filterType === type ? '#ffffff' : 'rgba(255,255,255,0.08)',
                color: filterType === type ? '#000000' : '#ffffff',
                border: 'none',
                borderRadius: '16px',
                padding: '5px 12px',
                fontSize: '12px',
                fontWeight: '600',
                textTransform: 'capitalize',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Search within library */}
        <div style={{ padding: '0 4px 10px 4px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255,255,255,0.06)',
              padding: '6px 10px',
              borderRadius: '4px'
            }}
          >
            <Search size={14} color="var(--text-secondary)" />
            <input
              type="text"
              placeholder="Search in Your Library"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              style={{
                background: 'none',
                border: 'none',
                color: '#fff',
                fontSize: '12px',
                outline: 'none',
                width: '100%'
              }}
            />
          </div>
        </div>

        {/* Library Items List */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
          {/* Liked Songs Pinned Item */}
          {(filterType === 'all' || filterType === 'playlists') && (
            <div
              onClick={() => navigateTo('liked')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '8px',
                borderRadius: '6px',
                cursor: 'pointer',
                backgroundColor: activeView === 'liked' ? 'rgba(255,255,255,0.12)' : 'transparent',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (activeView !== 'liked') e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.07)';
              }}
              onMouseLeave={(e) => {
                if (activeView !== 'liked') e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '4px',
                  background: 'linear-gradient(135deg, #450af5 0%, #8e8ee5 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Heart size={20} fill="#ffffff" color="#ffffff" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    color: activeView === 'liked' ? 'var(--spotify-green)' : 'var(--text-primary)',
                    fontWeight: '600',
                    fontSize: '14px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  Liked Songs
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '12px', marginTop: '2px' }}>
                  📌 Playlist • {likedSongIds.length} songs
                </div>
              </div>
            </div>
          )}

          {/* User & Curated Playlists */}
          {filteredPlaylists.map((playlist) => {
            const isCurrent = activeView === 'playlist' && activePlaylistId === playlist.id;
            return (
              <div
                key={playlist.id}
                onClick={() => navigateTo('playlist', { playlistId: playlist.id })}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '8px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  backgroundColor: isCurrent ? 'rgba(255,255,255,0.12)' : 'transparent',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isCurrent) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.07)';
                }}
                onMouseLeave={(e) => {
                  if (!isCurrent) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <img
                  src={playlist.cover}
                  alt={playlist.title}
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '4px',
                    objectFit: 'cover',
                    flexShrink: 0
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      color: isCurrent ? 'var(--spotify-green)' : 'var(--text-primary)',
                      fontWeight: '600',
                      fontSize: '14px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {playlist.title}
                  </div>
                  <div
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '12px',
                      marginTop: '2px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span>Playlist • {playlist.owner}</span>
                  </div>
                </div>

                {isCurrent && isPlaying && (
                  <div className="equalizer-indicator" style={{ marginRight: '6px' }}>
                    <div className="equalizer-bar"></div>
                    <div className="equalizer-bar"></div>
                    <div className="equalizer-bar"></div>
                    <div className="equalizer-bar"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

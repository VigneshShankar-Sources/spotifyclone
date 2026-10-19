import React from 'react';
import { Play, Pause } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { MOCK_PLAYLISTS, MOCK_TRACKS, MOCK_ARTISTS } from '../data/mockData';

export const HomeView = () => {
  const {
    navigateTo,
    playTrack,
    currentTrack,
    isPlaying,
    togglePlay,
    likedSongIds,
    playlists,
    spotifyUser
  } = usePlayer();

  // Dynamic greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  // Quick 6 items
  const quickItems = [
    {
      id: 'liked',
      title: 'Liked Songs',
      cover: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80',
      action: () => navigateTo('liked'),
      tracks: MOCK_TRACKS.filter((t) => likedSongIds.includes(t.id))
    },
    ...playlists.map((pl) => ({
      id: pl.id,
      title: pl.title,
      cover: pl.cover,
      action: () => navigateTo('playlist', { playlistId: pl.id }),
      tracks: pl.tracks.map((tid) => MOCK_TRACKS.find((t) => t.id === tid)).filter(Boolean)
    }))
  ].slice(0, 6);

  const handleQuickPlay = (e, item) => {
    e.stopPropagation();
    if (item.tracks && item.tracks.length > 0) {
      const isThisTrackPlaying = isPlaying && item.tracks.some((t) => t.id === currentTrack?.id);
      if (isThisTrackPlaying) {
        togglePlay();
      } else {
        playTrack(item.tracks[0], item.tracks);
      }
    }
  };

  return (
    <div style={{ padding: '0 24px 32px 24px', position: 'relative', zIndex: 1 }}>
      {/* Dynamic Ambient Gradient at the top */}
      <div
        className="backdrop-glow"
        style={{
          background: 'linear-gradient(180deg, #1e3a8a 0%, rgba(18, 18, 18, 0) 100%)',
          opacity: 0.6
        }}
      />

      {/* Greeting Title */}
      <h1
        style={{
          fontSize: '32px',
          fontWeight: '800',
          letterSpacing: '-0.5px',
          marginBottom: '20px',
          marginTop: '16px'
        }}
      >
        {greeting}
      </h1>

      {/* Quick 6 Grid */}
      <div className="quick-grid">
        {quickItems.map((item) => {
          const isItemActive = isPlaying && item.tracks.some((t) => t.id === currentTrack?.id);
          return (
            <div
              key={item.id}
              className="quick-card"
              onClick={item.action}
            >
              <img src={item.cover} alt={item.title} />
              <span className="quick-title">{item.title}</span>

              <button
                className="quick-play-btn"
                onClick={(e) => handleQuickPlay(e, item)}
                title={isItemActive ? 'Pause' : 'Play'}
              >
                {isItemActive ? (
                  <Pause size={20} fill="#000" color="#000" />
                ) : (
                  <Play size={20} fill="#000" color="#000" style={{ marginLeft: '2px' }} />
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Section 1: Made For User */}
      <div style={{ marginTop: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '700' }}>
              Made For {spotifyUser?.display_name || 'viki ✦'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
              Your personal library playlists, favorite mixes, and tracks on repeat.
            </p>
          </div>
          <button
            onClick={() => navigateTo('search')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
            onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
          >
            Show all
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '20px'
          }}
        >
          {MOCK_PLAYLISTS.slice(0, 4).map((pl) => {
            const tracks = pl.tracks.map((tid) => MOCK_TRACKS.find((t) => t.id === tid)).filter(Boolean);
            const isPlPlaying = isPlaying && tracks.some((t) => t.id === currentTrack?.id);

            return (
              <div
                key={pl.id}
                className="media-card"
                onClick={() => navigateTo('playlist', { playlistId: pl.id })}
              >
                <div style={{ position: 'relative', marginBottom: '14px' }}>
                  <img
                    src={pl.cover}
                    alt={pl.title}
                    style={{
                      width: '100%',
                      aspectRatio: '1/1',
                      objectFit: 'cover',
                      borderRadius: '6px',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.4)'
                    }}
                  />
                  <button
                    className="play-overlay-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isPlPlaying) {
                        togglePlay();
                      } else if (tracks.length > 0) {
                        playTrack(tracks[0], tracks);
                      }
                    }}
                  >
                    {isPlPlaying ? (
                      <Pause size={22} fill="#000" color="#000" />
                    ) : (
                      <Play size={22} fill="#000" color="#000" style={{ marginLeft: '2px' }} />
                    )}
                  </button>
                </div>

                <h3
                  style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    color: 'var(--text-primary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    marginBottom: '6px'
                  }}
                >
                  {pl.title}
                </h3>
                <p
                  style={{
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: '1.4'
                  }}
                >
                  {pl.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Popular Artists */}
      <div style={{ marginTop: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '700' }}>Popular Artists</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
              Chart-toppers streaming around the world right now.
            </p>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '20px'
          }}
        >
          {MOCK_ARTISTS.map((artist) => (
            <div
              key={artist.id}
              className="media-card"
              onClick={() => navigateTo('artist', { artistId: artist.id })}
            >
              <div style={{ position: 'relative', marginBottom: '14px' }}>
                <img
                  src={artist.avatar}
                  alt={artist.name}
                  style={{
                    width: '100%',
                    aspectRatio: '1/1',
                    objectFit: 'cover',
                    borderRadius: '50%',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.5)'
                  }}
                />
                <button
                  className="play-overlay-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    const firstTrack = MOCK_TRACKS.find((t) => artist.popularTrackIds.includes(t.id));
                    if (firstTrack) playTrack(firstTrack);
                  }}
                >
                  <Play size={22} fill="#000" color="#000" style={{ marginLeft: '2px' }} />
                </button>
              </div>

              <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                {artist.name}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Artist</p>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Trending Songs */}
      <div style={{ marginTop: '40px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px' }}>Trending Tracks</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '20px'
          }}
        >
          {MOCK_TRACKS.slice(0, 5).map((track) => {
            const isThisPlaying = isPlaying && currentTrack?.id === track.id;
            return (
              <div
                key={track.id}
                className="media-card"
                onClick={() => playTrack(track, MOCK_TRACKS)}
              >
                <div style={{ position: 'relative', marginBottom: '14px' }}>
                  <img
                    src={track.cover}
                    alt={track.title}
                    style={{
                      width: '100%',
                      aspectRatio: '1/1',
                      objectFit: 'cover',
                      borderRadius: '6px',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.4)'
                    }}
                  />
                  <button
                    className="play-overlay-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isThisPlaying) togglePlay();
                      else playTrack(track, MOCK_TRACKS);
                    }}
                  >
                    {isThisPlaying ? (
                      <Pause size={22} fill="#000" color="#000" />
                    ) : (
                      <Play size={22} fill="#000" color="#000" style={{ marginLeft: '2px' }} />
                    )}
                  </button>
                </div>

                <h3
                  style={{
                    fontSize: '15px',
                    fontWeight: '700',
                    color: isThisPlaying ? 'var(--spotify-green)' : 'var(--text-primary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    marginBottom: '4px'
                  }}
                >
                  {track.title}
                </h3>
                <p
                  style={{
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {track.artist}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

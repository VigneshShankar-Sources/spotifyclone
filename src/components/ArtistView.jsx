import React, { useState } from 'react';
import { Play, Pause, Heart, CheckCircle2, MoreHorizontal } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { MOCK_ARTISTS, MOCK_TRACKS } from '../data/mockData';

export const ArtistView = () => {
  const {
    activeArtistId,
    currentTrack,
    isPlaying,
    playTrack,
    togglePlay,
    likedSongIds,
    toggleLike,
    showToast
  } = usePlayer();

  const [isFollowing, setIsFollowing] = useState(false);

  const artist = MOCK_ARTISTS.find((a) => a.id === activeArtistId) || MOCK_ARTISTS[0];
  const popularTracks = (artist.popularTrackIds || [])
    .map((tid) => MOCK_TRACKS.find((t) => t.id === tid))
    .filter(Boolean);

  const isArtistPlaying = isPlaying && popularTracks.some((t) => t.id === currentTrack?.id);

  const handlePlayArtist = () => {
    if (popularTracks.length === 0) return;
    if (isArtistPlaying) {
      togglePlay();
    } else {
      playTrack(popularTracks[0], popularTracks);
    }
  };

  const handleToggleFollow = () => {
    setIsFollowing(!isFollowing);
    showToast(!isFollowing ? `Saved ${artist.name} to your library` : `Removed ${artist.name} from your library`);
  };

  return (
    <div style={{ position: 'relative', zIndex: 1, paddingBottom: '40px' }}>
      {/* Giant Artist Hero Header */}
      <div
        style={{
          position: 'relative',
          height: '380px',
          backgroundImage: `url(${artist.banner})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 20%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '24px 28px',
          boxShadow: 'inset 0 -120px 100px -20px #121212'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <CheckCircle2 size={24} fill="#3d91f4" color="#fff" />
          <span style={{ fontSize: '14px', fontWeight: '600' }}>Verified Artist</span>
        </div>

        <h1
          style={{
            fontSize: '72px',
            fontWeight: '900',
            letterSpacing: '-2px',
            lineHeight: '1',
            marginBottom: '14px'
          }}
        >
          {artist.name}
        </h1>

        <p style={{ fontSize: '15px', color: 'rgba(255, 255, 255, 0.85)', fontWeight: '500' }}>
          {artist.monthlyListeners} monthly listeners
        </p>
      </div>

      {/* Action Buttons Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          padding: '24px 28px',
          position: 'relative'
        }}
      >
        {/* Play Button */}
        <button
          onClick={handlePlayArtist}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: 'var(--spotify-green)',
            color: '#000',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
            transition: 'transform 0.15s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          {isArtistPlaying ? (
            <Pause size={24} fill="#000" color="#000" />
          ) : (
            <Play size={24} fill="#000" color="#000" style={{ marginLeft: '2px' }} />
          )}
        </button>

        {/* Follow Button */}
        <button
          onClick={handleToggleFollow}
          style={{
            backgroundColor: 'transparent',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '9999px',
            padding: '7px 18px',
            color: '#fff',
            fontWeight: '700',
            fontSize: '13px',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#fff';
            e.currentTarget.style.transform = 'scale(1.04)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </button>

        <button
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-secondary)'
          }}
        >
          <MoreHorizontal size={32} />
        </button>
      </div>

      {/* Popular Tracks */}
      <div style={{ padding: '0 28px', marginTop: '8px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '16px' }}>Popular</h2>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {popularTracks.map((track, idx) => {
            const isTrackActive = currentTrack?.id === track.id;
            const isThisPlaying = isTrackActive && isPlaying;
            const isLiked = likedSongIds.includes(track.id);

            return (
              <div
                key={track.id}
                onClick={() => playTrack(track, popularTracks)}
                className={`track-row ${isTrackActive ? 'active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 16px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                  <span style={{ width: '20px', textAlign: 'center', color: isTrackActive ? 'var(--spotify-green)' : 'var(--text-secondary)' }}>
                    {isThisPlaying ? (
                      <div className="equalizer-indicator">
                        <div className="equalizer-bar"></div>
                        <div className="equalizer-bar"></div>
                        <div className="equalizer-bar"></div>
                        <div className="equalizer-bar"></div>
                      </div>
                    ) : (
                      idx + 1
                    )}
                  </span>

                  <img
                    src={track.cover}
                    alt={track.title}
                    style={{ width: '44px', height: '44px', borderRadius: '4px', objectFit: 'cover' }}
                  />

                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: '15px',
                        fontWeight: '600',
                        color: isTrackActive ? 'var(--spotify-green)' : '#fff'
                      }}
                    >
                      {track.title}
                    </div>
                  </div>
                </div>

                <div style={{ color: 'var(--text-secondary)', fontSize: '13px', width: '120px', textAlign: 'right' }}>
                  {track.plays || '1,892,109'}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: '32px' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(track.id);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: isLiked ? 'var(--spotify-green)' : 'var(--text-secondary)'
                    }}
                  >
                    <Heart size={16} fill={isLiked ? 'var(--spotify-green)' : 'none'} />
                  </button>

                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)', width: '36px', textAlign: 'right' }}>
                    {Math.floor(track.duration / 60)}:
                    {track.duration % 60 < 10 ? '0' : ''}
                    {track.duration % 60}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* About Section */}
      <div style={{ padding: '0 28px', marginTop: '48px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '16px' }}>About</h2>

        <div
          style={{
            position: 'relative',
            borderRadius: '12px',
            overflow: 'hidden',
            height: '280px',
            backgroundImage: `url(${artist.avatar})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            maxWidth: '680px',
            boxShadow: '0 12px 32px rgba(0,0,0,0.6)'
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.3) 100%)'
            }}
          />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <span style={{ fontSize: '16px', fontWeight: '800', color: '#fff' }}>
              {artist.monthlyListeners} monthly listeners
            </span>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '8px', lineHeight: '1.5' }}>
              {artist.bio}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

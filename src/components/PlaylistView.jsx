import React, { useState } from 'react';
import { Play, Pause, Heart, Clock, Search, MoreHorizontal, Trash2 } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { MOCK_TRACKS, MOCK_PLAYLISTS } from '../data/mockData';

export const PlaylistView = ({ isLikedView = false }) => {
  const {
    activePlaylistId,
    playlists,
    likedSongIds,
    currentTrack,
    isPlaying,
    playTrack,
    togglePlay,
    toggleLike,
    removeTrackFromPlaylist
  } = usePlayer();

  const [playlistSearch, setPlaylistSearch] = useState('');

  // Determine current playlist info
  let playlist;
  let tracks = [];

  if (isLikedView) {
    tracks = MOCK_TRACKS.filter((t) => likedSongIds.includes(t.id));
    playlist = {
      id: 'liked',
      title: 'Liked Songs',
      description: 'Your favorite tracks in one place. Stream online or on any device.',
      owner: 'HP',
      likes: `${tracks.length} songs`,
      cover: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80',
      color: '#4f46e5'
    };
  } else {
    playlist = playlists.find((p) => p.id === activePlaylistId) || playlists[0];
    tracks = (playlist.tracks || [])
      .map((tid) => MOCK_TRACKS.find((t) => t.id === tid))
      .filter(Boolean);
  }

  // Filter tracks if searching in playlist
  const displayedTracks = tracks.filter((t) => {
    if (!playlistSearch) return true;
    const q = playlistSearch.toLowerCase();
    return t.title.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q) || t.album.toLowerCase().includes(q);
  });

  // Calculate total duration
  const totalSeconds = tracks.reduce((acc, t) => acc + (t.duration || 0), 0);
  const totalMins = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMins / 60);
  const durationString = totalHours > 0
    ? `${totalHours} hr ${totalMins % 60} min`
    : `${totalMins} min ${totalSeconds % 60} sec`;

  const isCurrentPlaylistPlaying = isPlaying && tracks.some((t) => t.id === currentTrack?.id);

  const handlePlayAll = () => {
    if (tracks.length === 0) return;
    if (isCurrentPlaylistPlaying) {
      togglePlay();
    } else {
      playTrack(tracks[0], tracks);
    }
  };

  return (
    <div style={{ position: 'relative', zIndex: 1, paddingBottom: '40px' }}>
      {/* Dynamic Hero Gradient Background */}
      <div
        className="backdrop-glow"
        style={{
          background: `linear-gradient(180deg, ${playlist.color || '#1db954'} 0%, rgba(18, 18, 18, 0) 100%)`,
          opacity: 0.85
        }}
      />

      {/* Playlist Hero Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '28px',
          padding: '24px 28px 24px 28px',
          minHeight: '260px',
          position: 'relative'
        }}
      >
        {/* Cover artwork */}
        <img
          src={playlist.cover}
          alt={playlist.title}
          style={{
            width: '232px',
            height: '232px',
            objectFit: 'cover',
            borderRadius: '4px',
            boxShadow: '0 16px 36px rgba(0,0,0,0.6)',
            flexShrink: 0
          }}
        />

        {/* Metadata info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {isLikedView ? 'Playlist' : 'Public Playlist'}
          </span>

          <h1
            style={{
              fontSize: playlist.title.length > 20 ? '48px' : '64px',
              fontWeight: '900',
              letterSpacing: '-1.5px',
              lineHeight: '1.05',
              margin: '4px 0'
            }}
          >
            {playlist.title}
          </h1>

          <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', maxWidth: '640px' }}>
            {playlist.description}
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: '600',
              marginTop: '8px'
            }}
          >
            <span style={{ color: '#fff' }}>{playlist.owner}</span>
            <span>•</span>
            <span style={{ color: 'var(--text-secondary)' }}>{tracks.length} songs,</span>
            <span style={{ color: 'var(--text-secondary)' }}>{durationString}</span>
          </div>
        </div>
      </div>

      {/* Action Bar (Play button, Like button, Search) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 28px',
          position: 'relative'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {/* Big Green Play Button */}
          <button
            onClick={handlePlayAll}
            disabled={tracks.length === 0}
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
              cursor: tracks.length === 0 ? 'not-allowed' : 'pointer',
              boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
              transition: 'transform 0.15s ease'
            }}
            onMouseEnter={(e) => {
              if (tracks.length > 0) e.currentTarget.style.transform = 'scale(1.06)';
            }}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            {isCurrentPlaylistPlaying ? (
              <Pause size={24} fill="#000" color="#000" />
            ) : (
              <Play size={24} fill="#000" color="#000" style={{ marginLeft: '2px' }} />
            )}
          </button>

          {!isLikedView && (
            <button
              onClick={() => toggleLike('track-1')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-secondary)'
              }}
            >
              <Heart size={32} />
            </button>
          )}

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

        {/* Search within playlist */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            padding: '6px 14px',
            borderRadius: '500px',
            width: '220px'
          }}
        >
          <Search size={16} color="var(--text-secondary)" />
          <input
            type="text"
            placeholder="Search in playlist"
            value={playlistSearch}
            onChange={(e) => setPlaylistSearch(e.target.value)}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              fontSize: '13px',
              outline: 'none',
              width: '100%'
            }}
          />
        </div>
      </div>

      {/* Tracklist Table */}
      <div style={{ padding: '0 28px' }}>
        {tracks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
            <p style={{ fontSize: '18px', fontWeight: '600', color: '#fff', marginBottom: '8px' }}>
              It's a bit empty here
            </p>
            <p>Find more of what you love in the Search view and add tracks to this playlist!</p>
          </div>
        ) : (
          <table className="track-table">
            <thead>
              <tr>
                <th style={{ width: '40px', textAlign: 'center' }}>#</th>
                <th>Title</th>
                <th>Album</th>
                <th>Date added</th>
                <th style={{ width: '60px', textAlign: 'right' }}>
                  <Clock size={16} />
                </th>
                <th style={{ width: '40px' }}></th>
              </tr>
            </thead>
            <tbody>
              {displayedTracks.map((track, idx) => {
                const isTrackActive = currentTrack?.id === track.id;
                const isThisPlaying = isTrackActive && isPlaying;
                const isLiked = likedSongIds.includes(track.id);

                return (
                  <tr
                    key={track.id}
                    className={`track-row ${isTrackActive ? 'active' : ''}`}
                    onClick={() => playTrack(track, tracks)}
                  >
                    {/* Index / Play Button */}
                    <td style={{ textAlign: 'center' }}>
                      {isThisPlaying ? (
                        <div className="equalizer-indicator" style={{ margin: '0 auto' }}>
                          <div className="equalizer-bar"></div>
                          <div className="equalizer-bar"></div>
                          <div className="equalizer-bar"></div>
                          <div className="equalizer-bar"></div>
                        </div>
                      ) : (
                        <span style={{ color: isTrackActive ? 'var(--spotify-green)' : 'var(--text-secondary)' }}>
                          {idx + 1}
                        </span>
                      )}
                    </td>

                    {/* Title & Artist */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <img
                          src={track.cover}
                          alt={track.title}
                          style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }}
                        />
                        <div>
                          <div
                            className="track-name"
                            style={{
                              fontSize: '14px',
                              fontWeight: '600',
                              color: isTrackActive ? 'var(--spotify-green)' : '#fff'
                            }}
                          >
                            {track.title}
                          </div>
                          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                            {track.artist}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Album */}
                    <td>
                      <span style={{ fontSize: '13px' }}>{track.album}</span>
                    </td>

                    {/* Date added */}
                    <td>
                      <span style={{ fontSize: '13px' }}>{track.addedAt || '3 days ago'}</span>
                    </td>

                    {/* Duration */}
                    <td style={{ textAlign: 'right', fontSize: '13px' }}>
                      {Math.floor(track.duration / 60)}:
                      {track.duration % 60 < 10 ? '0' : ''}
                      {track.duration % 60}
                    </td>

                    {/* Actions: Heart & Remove */}
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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

                        {!isLikedView && playlist.owner === 'HP' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeTrackFromPlaylist(playlist.id, track.id);
                            }}
                            title="Remove from playlist"
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: 'var(--text-secondary)'
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

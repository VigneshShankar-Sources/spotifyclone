import React from 'react';
import { X, Play, Music } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

export const QueueModal = () => {
  const {
    currentTrack,
    queue,
    queueIndex,
    playTrack,
    setIsQueueOpen
  } = usePlayer();

  const nextTracks = queue.slice(queueIndex + 1);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 'var(--player-height)',
        width: '360px',
        backgroundColor: '#121212',
        borderLeft: '1px solid var(--border-subtle)',
        zIndex: 45,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-8px 0 24px rgba(0,0,0,0.6)',
        animation: 'slideIn 0.25s ease'
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-subtle)'
        }}
      >
        <h2 style={{ fontSize: '20px', fontWeight: '800' }}>Queue</h2>
        <button
          onClick={() => setIsQueueOpen(false)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          <X size={20} />
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
        {/* Now Playing */}
        <div style={{ marginBottom: '28px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            Now Playing
          </h3>

          {currentTrack && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '8px 12px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                borderRadius: '6px'
              }}
            >
              <img
                src={currentTrack.cover}
                alt={currentTrack.title}
                style={{ width: '48px', height: '48px', borderRadius: '4px', objectFit: 'cover' }}
              />
              <div style={{ minWidth: 0, flex: 1 }}>
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    color: 'var(--spotify-green)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {currentTrack.title}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {currentTrack.artist}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Next from Queue */}
        <div>
          <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            Next In Queue
          </h3>

          {nextTracks.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
              No more tracks in queue. Add songs from your playlists or search.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {nextTracks.map((track, idx) => (
                <div
                  key={track.id + '-' + idx}
                  onClick={() => playTrack(track, queue)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <img
                    src={track.cover}
                    alt={track.title}
                    style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }}
                  />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div
                      style={{
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#fff',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {track.title}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {track.artist}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Play, Pause, Heart, Sparkles, Flame, Mic, Headphones, Radio, Activity, Coffee, Zap, Smile, Dumbbell, BookOpen, Compass } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { MOCK_CATEGORIES, MOCK_TRACKS, MOCK_PLAYLISTS, MOCK_ARTISTS } from '../data/mockData';

const iconMap = {
  Mic,
  Sparkles,
  Flame,
  Headphones,
  Radio,
  Activity,
  Coffee,
  Zap,
  Smile,
  Dumbbell,
  BookOpen,
  Compass
};

export const SearchView = ({ searchQuery, setSearchQuery }) => {
  const {
    playTrack,
    currentTrack,
    isPlaying,
    togglePlay,
    likedSongIds,
    toggleLike,
    navigateTo
  } = usePlayer();

  const query = searchQuery.trim().toLowerCase();

  // Search Results
  const matchingTracks = query
    ? MOCK_TRACKS.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.artist.toLowerCase().includes(query) ||
          t.album.toLowerCase().includes(query)
      )
    : [];

  const matchingArtists = query
    ? MOCK_ARTISTS.filter((a) => a.name.toLowerCase().includes(query))
    : [];

  const matchingPlaylists = query
    ? MOCK_PLAYLISTS.filter(
        (pl) =>
          pl.title.toLowerCase().includes(query) ||
          pl.description.toLowerCase().includes(query)
      )
    : [];

  const topResult = matchingTracks[0] || null;

  return (
    <div style={{ padding: '0 24px 32px 24px', position: 'relative', zIndex: 1 }}>
      {/* If search query is present */}
      {query ? (
        <div style={{ marginTop: '24px' }}>
          {matchingTracks.length === 0 && matchingArtists.length === 0 && matchingPlaylists.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '64px 0' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
                No results found for "{searchQuery}"
              </h2>
              <p style={{ color: 'var(--text-secondary)' }}>
                Please make sure your words are spelled correctly, or use fewer or different keywords.
              </p>
            </div>
          ) : (
            <div>
              {/* Top Result & Songs Split */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: topResult ? '1fr 1.5fr' : '1fr',
                  gap: '24px',
                  marginBottom: '36px'
                }}
              >
                {/* Top Result Card */}
                {topResult && (
                  <div>
                    <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px' }}>Top result</h2>
                    <div
                      className="media-card"
                      style={{
                        padding: '24px',
                        height: '240px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                      onClick={() => playTrack(topResult, matchingTracks)}
                    >
                      <img
                        src={topResult.cover}
                        alt={topResult.title}
                        style={{
                          width: '92px',
                          height: '92px',
                          borderRadius: '4px',
                          objectFit: 'cover',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
                        }}
                      />

                      <div>
                        <h3
                          style={{
                            fontSize: '28px',
                            fontWeight: '800',
                            letterSpacing: '-0.5px',
                            marginBottom: '6px',
                            color: currentTrack?.id === topResult.id ? 'var(--spotify-green)' : '#fff'
                          }}
                        >
                          {topResult.title}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                            {topResult.artist}
                          </span>
                          <span
                            style={{
                              backgroundColor: '#121212',
                              padding: '4px 10px',
                              borderRadius: '9999px',
                              fontSize: '11px',
                              fontWeight: '700',
                              letterSpacing: '0.05em',
                              textTransform: 'uppercase'
                            }}
                          >
                            Song
                          </span>
                        </div>
                      </div>

                      <button
                        className="play-overlay-btn"
                        style={{ right: '24px', bottom: '24px' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isPlaying && currentTrack?.id === topResult.id) togglePlay();
                          else playTrack(topResult, matchingTracks);
                        }}
                      >
                        {isPlaying && currentTrack?.id === topResult.id ? (
                          <Pause size={24} fill="#000" color="#000" />
                        ) : (
                          <Play size={24} fill="#000" color="#000" style={{ marginLeft: '2px' }} />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Songs list */}
                {matchingTracks.length > 0 && (
                  <div>
                    <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px' }}>Songs</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {matchingTracks.slice(0, 4).map((track) => {
                        const isThisPlaying = isPlaying && currentTrack?.id === track.id;
                        const isLiked = likedSongIds.includes(track.id);
                        return (
                          <div
                            key={track.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '8px 12px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              backgroundColor: isThisPlaying ? 'rgba(255,255,255,0.1)' : 'transparent',
                              transition: 'background-color 0.2s ease'
                            }}
                            onClick={() => playTrack(track, matchingTracks)}
                            onMouseEnter={(e) => {
                              if (!isThisPlaying) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.07)';
                            }}
                            onMouseLeave={(e) => {
                              if (!isThisPlaying) e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <img
                                src={track.cover}
                                alt={track.title}
                                style={{ width: '42px', height: '42px', borderRadius: '4px', objectFit: 'cover' }}
                              />
                              <div>
                                <div
                                  style={{
                                    fontSize: '15px',
                                    fontWeight: '600',
                                    color: isThisPlaying ? 'var(--spotify-green)' : '#fff'
                                  }}
                                >
                                  {track.title}
                                </div>
                                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                                  {track.artist}
                                </div>
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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
                              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
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
                )}
              </div>

              {/* Matching Playlists */}
              {matchingPlaylists.length > 0 && (
                <div style={{ marginTop: '32px' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px' }}>Playlists</h2>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                      gap: '20px'
                    }}
                  >
                    {matchingPlaylists.map((pl) => (
                      <div
                        key={pl.id}
                        className="media-card"
                        onClick={() => navigateTo('playlist', { playlistId: pl.id })}
                      >
                        <img
                          src={pl.cover}
                          alt={pl.title}
                          style={{
                            width: '100%',
                            aspectRatio: '1/1',
                            objectFit: 'cover',
                            borderRadius: '6px',
                            marginBottom: '12px'
                          }}
                        />
                        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#fff' }}>{pl.title}</h3>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                          By {pl.owner}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Browse All Category Grid */
        <div style={{ marginTop: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px' }}>Browse all</h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: '20px'
            }}
          >
            {MOCK_CATEGORIES.map((cat) => {
              const IconComp = iconMap[cat.icon] || Headphones;
              return (
                <div
                  key={cat.id}
                  onClick={() => setSearchQuery(cat.name)}
                  style={{
                    backgroundColor: cat.color,
                    borderRadius: '8px',
                    height: '180px',
                    padding: '16px',
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'transform 0.2s cubic-bezier(0.2, 0, 0, 1)'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  <h3
                    style={{
                      fontSize: '22px',
                      fontWeight: '800',
                      color: '#ffffff',
                      wordBreak: 'break-word',
                      maxWidth: '120px'
                    }}
                  >
                    {cat.name}
                  </h3>

                  {/* Angled Decorative Icon/Artwork */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '-10px',
                      right: '-10px',
                      transform: 'rotate(25deg)',
                      width: '90px',
                      height: '90px',
                      backgroundColor: 'rgba(0, 0, 0, 0.25)',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.3)'
                    }}
                  >
                    <IconComp size={48} color="#ffffff" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

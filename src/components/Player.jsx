import React, { useState } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Heart,
  Volume2,
  Volume1,
  VolumeX,
  Mic2,
  ListMusic,
  Tv,
  Maximize2,
  Minimize2,
  PictureInPicture2
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

export const Player = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    togglePlay,
    playNext,
    playPrev,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    likedSongIds,
    toggleLike,
    isLyricsOpen,
    setIsLyricsOpen,
    isQueueOpen,
    setIsQueueOpen,
    isDeviceModalOpen,
    setIsDeviceModalOpen,
    navigateTo,
    showToast
  } = usePlayer();

  const [isHoveringScrubber, setIsHoveringScrubber] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Time format helper
  const formatTime = (secs) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;
  const isLiked = currentTrack ? likedSongIds.includes(currentTrack.id) : false;

  const handleFullscreenToggle = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  if (!currentTrack) return null;

  return (
    <footer
      style={{
        height: 'var(--player-height)',
        backgroundColor: '#000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        zIndex: 50,
        position: 'relative'
      }}
    >
      {/* 1. Left: Track Details */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          width: '30%',
          minWidth: '200px'
        }}
      >
        <div style={{ position: 'relative', width: '56px', height: '56px', flexShrink: 0 }}>
          <img
            src={currentTrack.cover}
            alt={currentTrack.title}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '4px',
              objectFit: 'cover',
              boxShadow: '0 4px 10px rgba(0,0,0,0.5)'
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, justifyContent: 'center' }}>
          <span
            style={{
              color: 'var(--text-primary)',
              fontWeight: '600',
              fontSize: '14px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              cursor: 'pointer'
            }}
            onClick={() => navigateTo('playlist', { playlistId: 'playlist-1' })}
            onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
            onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
          >
            {currentTrack.title}
          </span>
          <span
            style={{
              color: 'var(--text-secondary)',
              fontSize: '12px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              cursor: 'pointer',
              marginTop: '2px'
            }}
            onClick={() => navigateTo('artist', { artistId: 'artist-weeknd' })}
            onMouseEnter={(e) => {
              e.currentTarget.style.textDecoration = 'underline';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textDecoration = 'none';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            {currentTrack.artist}
          </span>
        </div>

        {/* Heart like button */}
        <button
          onClick={() => toggleLike(currentTrack.id)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            color: isLiked ? 'var(--spotify-green)' : 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(1.25)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          title={isLiked ? 'Remove from Your Library' : 'Save to Your Library'}
        >
          <Heart
            size={18}
            fill={isLiked ? 'var(--spotify-green)' : 'none'}
            color={isLiked ? 'var(--spotify-green)' : 'currentColor'}
          />
        </button>

        {/* Picture-in-picture / Miniplayer */}
        <button
          onClick={() => showToast('Mini Player activated')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '6px',
            color: 'var(--text-secondary)'
          }}
          title="Picture in Picture"
        >
          <PictureInPicture2 size={16} />
        </button>
      </div>

      {/* 2. Center: Playback Controls & Scrubber */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          width: '40%',
          maxWidth: '720px'
        }}
      >
        {/* Buttons Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Shuffle */}
          <button
            onClick={toggleShuffle}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: isShuffle ? 'var(--spotify-green)' : 'var(--text-secondary)',
              position: 'relative',
              padding: '6px'
            }}
            title={isShuffle ? 'Disable shuffle' : 'Enable shuffle'}
          >
            <Shuffle size={18} />
            {isShuffle && (
              <span
                style={{
                  position: 'absolute',
                  bottom: '-2px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--spotify-green)'
                }}
              />
            )}
          </button>

          {/* Previous */}
          <button
            onClick={playPrev}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              padding: '6px',
              transition: 'color 0.15s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
            title="Previous"
          >
            <SkipBack size={20} fill="currentColor" />
          </button>

          {/* Play / Pause button */}
          <button
            onClick={togglePlay}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              color: '#000000',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
              transition: 'transform 0.15s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause size={18} fill="#000" color="#000" />
            ) : (
              <Play size={18} fill="#000" color="#000" style={{ marginLeft: '2px' }} />
            )}
          </button>

          {/* Next */}
          <button
            onClick={playNext}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              padding: '6px',
              transition: 'color 0.15s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
            title="Next"
          >
            <SkipForward size={20} fill="currentColor" />
          </button>

          {/* Repeat */}
          <button
            onClick={toggleRepeat}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: repeatMode !== 'off' ? 'var(--spotify-green)' : 'var(--text-secondary)',
              position: 'relative',
              padding: '6px'
            }}
            title={`Repeat mode: ${repeatMode}`}
          >
            {repeatMode === 'one' ? <Repeat1 size={18} /> : <Repeat size={18} />}
            {repeatMode !== 'off' && (
              <span
                style={{
                  position: 'absolute',
                  bottom: '-2px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--spotify-green)'
                }}
              />
            )}
          </button>
        </div>

        {/* Scrubber Progress Bar */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}
          onMouseEnter={() => setIsHoveringScrubber(true)}
          onMouseLeave={() => setIsHoveringScrubber(false)}
        >
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', width: '36px', textAlign: 'right' }}>
            {formatTime(currentTime)}
          </span>

          <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', height: '14px' }}>
            {/* Custom Background Track */}
            <div
              style={{
                position: 'absolute',
                width: '100%',
                height: isHoveringScrubber ? '6px' : '4px',
                borderRadius: '3px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                overflow: 'hidden',
                transition: 'height 0.1s ease'
              }}
            >
              {/* Progress Fill */}
              <div
                style={{
                  width: `${progressPercent}%`,
                  height: '100%',
                  backgroundColor: isHoveringScrubber ? 'var(--spotify-green)' : '#ffffff',
                  borderRadius: '3px',
                  transition: 'background-color 0.1s ease'
                }}
              />
            </div>

            {/* Native Slider for Accessible Interaction */}
            <input
              type="range"
              min="0"
              max={duration || 100}
              step="0.5"
              value={currentTime}
              onChange={(e) => seek(parseFloat(e.target.value))}
              style={{
                position: 'relative',
                width: '100%',
                opacity: 0,
                cursor: 'pointer',
                zIndex: 2,
                height: '100%'
              }}
            />
          </div>

          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', width: '36px' }}>
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* 3. Right: Utility Controls & Volume */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '12px',
          width: '30%',
          minWidth: '200px'
        }}
      >
        {/* Lyrics Toggle */}
        <button
          onClick={() => setIsLyricsOpen(!isLyricsOpen)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '6px',
            color: isLyricsOpen ? 'var(--spotify-green)' : 'var(--text-secondary)',
            transition: 'color 0.15s ease'
          }}
          title="Lyrics"
        >
          <Mic2 size={18} />
        </button>

        {/* Queue Toggle */}
        <button
          onClick={() => setIsQueueOpen(!isQueueOpen)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '6px',
            color: isQueueOpen ? 'var(--spotify-green)' : 'var(--text-secondary)',
            transition: 'color 0.15s ease'
          }}
          title="Queue"
        >
          <ListMusic size={18} />
        </button>

        {/* Connect to a Device */}
        <button
          onClick={() => setIsDeviceModalOpen(!isDeviceModalOpen)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '6px',
            color: isDeviceModalOpen ? 'var(--spotify-green)' : 'var(--text-secondary)',
            transition: 'color 0.15s ease'
          }}
          title="Connect to a device"
        >
          <Tv size={18} />
        </button>

        {/* Volume Mute & Slider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '130px' }}>
          <button
            onClick={toggleMute}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '6px',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center'
            }}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted || volume === 0 ? (
              <VolumeX size={18} />
            ) : volume < 0.5 ? (
              <Volume1 size={18} />
            ) : (
              <Volume2 size={18} />
            )}
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="spotify-slider"
            style={{
              background: `linear-gradient(to right, #1db954 ${
                (isMuted ? 0 : volume) * 100
              }%, rgba(255,255,255,0.3) ${(isMuted ? 0 : volume) * 100}%)`
            }}
          />
        </div>

        {/* Fullscreen */}
        <button
          onClick={handleFullscreenToggle}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '6px',
            color: 'var(--text-secondary)',
            transition: 'color 0.15s ease'
          }}
          title="Full screen"
        >
          {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </button>
      </div>
    </footer>
  );
};

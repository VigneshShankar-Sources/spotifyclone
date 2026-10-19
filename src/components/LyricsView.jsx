import React, { useEffect, useRef } from 'react';
import { X, Mic2 } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

export const LyricsView = () => {
  const { currentTrack, currentTime, seek, setIsLyricsOpen } = usePlayer();
  const activeLineRef = useRef(null);

  const lyrics = currentTrack?.lyrics || [
    { time: 0, text: "Lyrics aren't available for this track right now." }
  ];

  // Find active line index based on currentTime
  let activeIndex = 0;
  for (let i = 0; i < lyrics.length; i++) {
    if (currentTime >= lyrics[i].time) {
      activeIndex = i;
    } else {
      break;
    }
  }

  // Auto-scroll to active line
  useEffect(() => {
    if (activeLineRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [activeIndex]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: currentTrack?.color || '#121212',
        backgroundImage: `linear-gradient(180deg, ${currentTrack?.color || '#181818'} 0%, #121212 90%)`,
        zIndex: 40,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        animation: 'fadeIn 0.3s ease'
      }}
    >
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '24px 32px',
          zIndex: 2
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img
            src={currentTrack?.cover}
            alt={currentTrack?.title}
            style={{ width: '48px', height: '48px', borderRadius: '4px', objectFit: 'cover' }}
          />
          <div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#fff' }}>{currentTrack?.title}</div>
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>{currentTrack?.artist}</div>
          </div>
        </div>

        <button
          onClick={() => setIsLyricsOpen(false)}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            border: 'none',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'transform 0.15s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          title="Close lyrics"
        >
          <X size={20} />
        </button>
      </div>

      {/* Lyrics Scroll Container */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '40px 32px 120px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          maxWidth: '850px'
        }}
      >
        {lyrics.map((line, idx) => {
          const isActive = idx === activeIndex;
          const isPassed = idx < activeIndex;

          return (
            <div
              key={idx}
              ref={isActive ? activeLineRef : null}
              onClick={() => seek(line.time)}
              style={{
                fontSize: isActive ? '34px' : '28px',
                fontWeight: isActive ? '900' : '700',
                lineHeight: '1.3',
                color: isActive ? '#ffffff' : isPassed ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.55)',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.2, 0, 0, 1)',
                textShadow: isActive ? '0 4px 16px rgba(0,0,0,0.4)' : 'none',
                userSelect: 'none'
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = isPassed ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.55)';
                }
              }}
            >
              {line.text}
            </div>
          );
        })}
      </div>
    </div>
  );
};

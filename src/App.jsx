import React, { useState, useEffect, useRef } from 'react';
import { PlayerProvider, usePlayer } from './context/PlayerContext';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { Player } from './components/Player';
import { HomeView } from './components/HomeView';
import { SearchView } from './components/SearchView';
import { PlaylistView } from './components/PlaylistView';
import { ArtistView } from './components/ArtistView';
import { LyricsView } from './components/LyricsView';
import { QueueModal } from './components/QueueModal';
import { DeviceModal } from './components/DeviceModal';
import { CreatePlaylistModal } from './components/CreatePlaylistModal';
import { LoginModal } from './components/LoginModal';

function SpotifyApp() {
  const {
    activeView,
    togglePlay,
    playNext,
    playPrev,
    toggleMute,
    isLyricsOpen,
    isQueueOpen,
    isDeviceModalOpen,
    toasts
  } = usePlayer();

  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollContainerRef = useRef(null);

  // Scroll detection for TopNav background blur
  const handleScroll = (e) => {
    setIsScrolled(e.target.scrollTop > 60);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'KeyM') {
        toggleMute();
      } else if (e.code === 'ArrowRight' && (e.ctrlKey || e.metaKey)) {
        playNext();
      } else if (e.code === 'ArrowLeft' && (e.ctrlKey || e.metaKey)) {
        playPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, toggleMute, playNext, playPrev]);

  return (
    <div className="app-container">
      {/* Main Top Area: Sidebar + Scrollable Content */}
      <div className="main-wrapper">
        <Sidebar />

        {/* Scrollable View Content */}
        <main
          className="content-area"
          ref={scrollContainerRef}
          onScroll={handleScroll}
        >
          <TopNav
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isScrolled={isScrolled}
          />

          {/* Views */}
          {activeView === 'home' && <HomeView />}
          {activeView === 'search' && (
            <SearchView searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          )}
          {activeView === 'playlist' && <PlaylistView isLikedView={false} />}
          {activeView === 'liked' && <PlaylistView isLikedView={true} />}
          {activeView === 'artist' && <ArtistView />}
          {activeView === 'library' && <PlaylistView isLikedView={true} />}

          {/* Full Screen Karaoke Lyrics View */}
          {isLyricsOpen && <LyricsView />}
        </main>

        {/* Queue Side Drawer */}
        {isQueueOpen && <QueueModal />}
      </div>

      {/* Spotify Connect Device Modal */}
      {isDeviceModalOpen && <DeviceModal />}

      {/* Create / Edit Playlist Modal */}
      <CreatePlaylistModal />

      {/* Spotify Account Login / Connection Modal */}
      <LoginModal />

      {/* Floating Action Toasts */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className="toast-message">
            {toast.message}
          </div>
        ))}
      </div>

      {/* Bottom Sticky Player Bar */}
      <Player />
    </div>
  );
}

export default function App() {
  return (
    <PlayerProvider>
      <SpotifyApp />
    </PlayerProvider>
  );
}

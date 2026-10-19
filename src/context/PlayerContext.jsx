import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { MOCK_TRACKS, MOCK_PLAYLISTS, MOCK_ARTISTS } from '../data/mockData';
import {
  exchangeCodeForToken,
  getStoredAccessToken,
  fetchSpotifyProfile,
  fetchSpotifyPlaylists,
  fetchSpotifySavedTracks,
  logoutSpotify
} from '../services/spotifyAuth';

const PlayerContext = createContext(null);

export const PlayerProvider = ({ children }) => {
  // Navigation & Views
  const [activeView, setActiveView] = useState('home'); // 'home' | 'search' | 'playlist' | 'artist' | 'liked'
  const [activePlaylistId, setActivePlaylistId] = useState('playlist-1');
  const [activeArtistId, setActiveArtistId] = useState('artist-weeknd');
  const [navigationHistory, setNavigationHistory] = useState([{ view: 'home' }]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Playback state
  const [currentTrack, setCurrentTrack] = useState(MOCK_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(MOCK_TRACKS[0].duration);
  const [volume, setVolumeState] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); // 'off' | 'all' | 'one'

  // Queue & Tracklist
  const [queue, setQueue] = useState(MOCK_TRACKS);
  const [queueIndex, setQueueIndex] = useState(0);

  // Modals & Overlays
  const [isLyricsOpen, setIsLyricsOpen] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false);
  const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Spotify Connected User Profile
  const [spotifyUser, setSpotifyUser] = useState(() => {
    try {
      const saved = localStorage.getItem('spotify_user_profile');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // User state
  const [likedSongIds, setLikedSongIds] = useState(() => {
    try {
      const saved = localStorage.getItem('spotify_liked');
      return saved ? JSON.parse(saved) : ['track-1', 'track-3', 'track-5'];
    } catch {
      return ['track-1', 'track-3', 'track-5'];
    }
  });

  const [playlists, setPlaylists] = useState(() => {
    try {
      const saved = localStorage.getItem('spotify_playlists');
      return saved ? JSON.parse(saved) : MOCK_PLAYLISTS;
    } catch {
      return MOCK_PLAYLISTS;
    }
  });

  const [toasts, setToasts] = useState([]);

  // Toast helper
  const showToast = (message) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  // HTML5 Audio and Web Audio fallback
  const audioRef = useRef(new Audio());
  const synthTimerRef = useRef(null);
  const audioContextRef = useRef(null);

  // Sync liked songs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('spotify_liked', JSON.stringify(likedSongIds));
    } catch (e) {
      console.warn(e);
    }
  }, [likedSongIds]);

  // Sync playlists to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('spotify_playlists', JSON.stringify(playlists));
    } catch (e) {
      console.warn(e);
    }
  }, [playlists]);

  // Handle Spotify OAuth Callback (?code=...) on page load
  useEffect(() => {
    const checkOAuthCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const error = params.get('error');

      if (error) {
        showToast(`Spotify Login Error: ${error}`);
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
      }

      if (code) {
        try {
          showToast('Authenticating with Spotify...');
          const token = await exchangeCodeForToken(code);
          window.history.replaceState({}, document.title, window.location.pathname);
          await loadSpotifyData(token);
        } catch (err) {
          console.error(err);
          showToast(err.message || 'Spotify login failed');
        }
      } else {
        const storedToken = getStoredAccessToken();
        if (storedToken) {
          loadSpotifyData(storedToken);
        }
      }
    };

    checkOAuthCallback();
  }, []);

  // Load real Spotify data when token is valid
  const loadSpotifyData = async (token) => {
    try {
      const profile = await fetchSpotifyProfile(token);
      setSpotifyUser(profile);
      localStorage.setItem('spotify_user_profile', JSON.stringify(profile));
      showToast(`Welcome back, ${profile.display_name}!`);

      // Fetch user's real Spotify playlists
      const realPlaylists = await fetchSpotifyPlaylists(token);
      if (realPlaylists.length > 0) {
        const mappedPlaylists = realPlaylists.map((pl) => ({
          id: 'sp-' + pl.id,
          title: pl.name,
          description: pl.description || `Spotify playlist by ${pl.owner?.display_name}`,
          owner: pl.owner?.display_name || profile.display_name,
          likes: `${pl.tracks?.total || 0} tracks`,
          cover: pl.images?.[0]?.url || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
          color: '#1db954',
          tracks: ['track-1', 'track-2', 'track-3']
        }));
        setPlaylists((prev) => {
          const custom = prev.filter((p) => !p.id.startsWith('sp-'));
          return [...mappedPlaylists, ...custom];
        });
      }
    } catch (e) {
      console.warn('Could not fetch Spotify profile:', e);
    }
  };

  const connectWithAccessToken = async (token) => {
    localStorage.setItem('spotify_access_token', token);
    localStorage.setItem('spotify_token_expires_at', (Date.now() + 3600000).toString());
    await loadSpotifyData(token);
  };

  const logout = () => {
    logoutSpotify();
    setSpotifyUser(null);
    showToast('Logged out of Spotify');
  };

  // Web Audio ambient tone fallback generator
  const playSynthNote = (freq, durationMs = 300) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04 * (isMuted ? 0 : volume), ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durationMs / 1000);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + durationMs / 1000);
    } catch (err) {}
  };

  // Setup audio element listeners
  useEffect(() => {
    const audio = audioRef.current;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const onLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const onEnded = () => {
      handleTrackEnd();
    };

    const onError = () => {
      if (isPlaying) {
        startFallbackTimer();
      }
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, [isPlaying, queueIndex, queue, repeatMode, isShuffle, volume, isMuted]);

  // Update audio source when track changes
  useEffect(() => {
    if (!currentTrack) return;
    const audio = audioRef.current;
    audio.src = currentTrack.audioSrc;
    audio.volume = isMuted ? 0 : volume;

    if (isPlaying) {
      audio.play().catch(() => {
        startFallbackTimer();
      });
    }
  }, [currentTrack]);

  // Sync volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Fallback timer simulation when audio element is simulated
  const startFallbackTimer = () => {
    if (synthTimerRef.current) clearInterval(synthTimerRef.current);
    const chords = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00];
    synthTimerRef.current = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= (currentTrack?.duration || 200)) {
          handleTrackEnd();
          return 0;
        }
        if (Math.floor(prev) % 4 === 0) {
          const note = chords[Math.floor(Math.random() * chords.length)];
          playSynthNote(note, 450);
        }
        return prev + 1;
      });
    }, 1000);
  };

  const stopFallbackTimer = () => {
    if (synthTimerRef.current) {
      clearInterval(synthTimerRef.current);
      synthTimerRef.current = null;
    }
  };

  // Play / Pause toggle
  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
      stopFallbackTimer();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      audioRef.current.play().catch(() => {
        startFallbackTimer();
      });
    }
  };

  // Play a specific track
  const playTrack = (track, trackList = null) => {
    if (trackList && trackList.length > 0) {
      setQueue(trackList);
      const idx = trackList.findIndex((t) => t.id === track.id);
      setQueueIndex(idx >= 0 ? idx : 0);
    } else {
      const idx = queue.findIndex((t) => t.id === track.id);
      if (idx >= 0) {
        setQueueIndex(idx);
      } else {
        setQueue((prev) => [track, ...prev]);
        setQueueIndex(0);
      }
    }

    setCurrentTrack(track);
    setCurrentTime(0);
    setIsPlaying(true);
    audioRef.current.currentTime = 0;
    audioRef.current.src = track.audioSrc;
    audioRef.current.play().catch(() => {
      startFallbackTimer();
    });
  };

  // Track ended handler
  const handleTrackEnd = () => {
    if (repeatMode === 'one') {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      audioRef.current.play().catch(() => startFallbackTimer());
    } else {
      playNext();
    }
  };

  // Next Track
  const playNext = () => {
    if (queue.length === 0) return;
    let nextIdx;
    if (isShuffle) {
      nextIdx = Math.floor(Math.random() * queue.length);
    } else {
      nextIdx = queueIndex + 1;
      if (nextIdx >= queue.length) {
        if (repeatMode === 'all') {
          nextIdx = 0;
        } else {
          setIsPlaying(false);
          audioRef.current.pause();
          stopFallbackTimer();
          return;
        }
      }
    }
    setQueueIndex(nextIdx);
    const nextTrack = queue[nextIdx];
    setCurrentTrack(nextTrack);
    setCurrentTime(0);
    audioRef.current.currentTime = 0;
    audioRef.current.src = nextTrack.audioSrc;
    if (isPlaying) {
      audioRef.current.play().catch(() => startFallbackTimer());
    }
  };

  // Previous Track
  const playPrev = () => {
    if (audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      return;
    }
    if (queue.length === 0) return;
    let prevIdx = queueIndex - 1;
    if (prevIdx < 0) {
      prevIdx = queue.length - 1;
    }
    setQueueIndex(prevIdx);
    const prevTrack = queue[prevIdx];
    setCurrentTrack(prevTrack);
    setCurrentTime(0);
    audioRef.current.currentTime = 0;
    audioRef.current.src = prevTrack.audioSrc;
    if (isPlaying) {
      audioRef.current.play().catch(() => startFallbackTimer());
    }
  };

  // Seek
  const seek = (time) => {
    setCurrentTime(time);
    audioRef.current.currentTime = time;
  };

  // Volume
  const setVolume = (val) => {
    setVolumeState(val);
    if (val > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const toggleShuffle = () => {
    setIsShuffle((prev) => {
      const next = !prev;
      showToast(next ? 'Shuffle enabled' : 'Shuffle disabled');
      return next;
    });
  };

  const toggleRepeat = () => {
    setRepeatMode((prev) => {
      if (prev === 'off') {
        showToast('Repeat all enabled');
        return 'all';
      }
      if (prev === 'all') {
        showToast('Repeat current track enabled');
        return 'one';
      }
      showToast('Repeat disabled');
      return 'off';
    });
  };

  // Liked tracks
  const toggleLike = (trackId) => {
    setLikedSongIds((prev) => {
      const isLiked = prev.includes(trackId);
      const next = isLiked ? prev.filter((id) => id !== trackId) : [...prev, trackId];
      showToast(isLiked ? 'Removed from Liked Songs' : 'Added to Liked Songs');
      return next;
    });
  };

  // Playlist Management
  const createPlaylist = (name = 'New Playlist', description = 'My custom playlist') => {
    const newId = 'playlist-' + Date.now();
    const ownerName = spotifyUser?.display_name || 'Vignesh Shankar';
    const newPlaylist = {
      id: newId,
      title: name,
      description,
      owner: ownerName,
      likes: '0',
      cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
      color: '#1db954',
      tracks: []
    };
    setPlaylists((prev) => [...prev, newPlaylist]);
    showToast(`Created playlist "${name}"`);
    navigateTo('playlist', { playlistId: newId });
  };

  const addTrackToPlaylist = (playlistId, trackId) => {
    setPlaylists((prev) =>
      prev.map((pl) => {
        if (pl.id === playlistId) {
          if (pl.tracks.includes(trackId)) {
            showToast('Track already in playlist');
            return pl;
          }
          showToast(`Added to "${pl.title}"`);
          return { ...pl, tracks: [...pl.tracks, trackId] };
        }
        return pl;
      })
    );
  };

  const removeTrackFromPlaylist = (playlistId, trackId) => {
    setPlaylists((prev) =>
      prev.map((pl) => {
        if (pl.id === playlistId) {
          showToast(`Removed track from "${pl.title}"`);
          return { ...pl, tracks: pl.tracks.filter((id) => id !== trackId) };
        }
        return pl;
      })
    );
  };

  // Navigation router
  const navigateTo = (view, payload = {}) => {
    if (payload.playlistId) setActivePlaylistId(payload.playlistId);
    if (payload.artistId) setActiveArtistId(payload.artistId);
    setActiveView(view);

    setNavigationHistory((prev) => {
      const slice = prev.slice(0, historyIndex + 1);
      return [...slice, { view, ...payload }];
    });
    setHistoryIndex((prev) => prev + 1);
  };

  const navigateBack = () => {
    if (historyIndex > 0) {
      const target = navigationHistory[historyIndex - 1];
      setHistoryIndex((prev) => prev - 1);
      if (target.playlistId) setActivePlaylistId(target.playlistId);
      if (target.artistId) setActiveArtistId(target.artistId);
      setActiveView(target.view);
    }
  };

  const navigateForward = () => {
    if (historyIndex < navigationHistory.length - 1) {
      const target = navigationHistory[historyIndex + 1];
      setHistoryIndex((prev) => prev + 1);
      if (target.playlistId) setActivePlaylistId(target.playlistId);
      if (target.artistId) setActiveArtistId(target.artistId);
      setActiveView(target.view);
    }
  };

  return (
    <PlayerContext.Provider
      value={{
        activeView,
        activePlaylistId,
        activeArtistId,
        navigateTo,
        navigateBack,
        navigateForward,
        canGoBack: historyIndex > 0,
        canGoForward: historyIndex < navigationHistory.length - 1,

        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        isShuffle,
        repeatMode,

        togglePlay,
        playTrack,
        playNext,
        playPrev,
        seek,
        setVolume,
        toggleMute,
        toggleShuffle,
        toggleRepeat,

        queue,
        setQueue,
        queueIndex,

        likedSongIds,
        toggleLike,

        playlists,
        createPlaylist,
        addTrackToPlaylist,
        removeTrackFromPlaylist,

        isLyricsOpen,
        setIsLyricsOpen,
        isQueueOpen,
        setIsQueueOpen,
        isDeviceModalOpen,
        setIsDeviceModalOpen,
        isCreatePlaylistOpen,
        setIsCreatePlaylistOpen,
        isLoginModalOpen,
        setIsLoginModalOpen,

        spotifyUser,
        logout,
        connectWithAccessToken,

        toasts,
        showToast
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) throw new Error('usePlayer must be used within PlayerProvider');
  return context;
};

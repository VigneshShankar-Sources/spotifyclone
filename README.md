# Spotify Web Player Clone 🎵

A feature-packed, responsive Spotify Web Player clone built with **React**, **Vite**, and **Vanilla CSS**. Features an authentic Spotify dark theme, interactive audio playback engine, karaoke lyrics mode, and **Spotify Web API OAuth 2.0 PKCE** account integration.

---

## 🚀 Features

- **🎧 Interactive Audio Engine**:
  - Full playback controls: Play/Pause, Shuffle, Repeat (`all`, `one`, `off`), Skip Next/Prev.
  - Interactive seek scrubber with real-time timestamps and hover preview.
  - Volume control with dynamic speaker icons and mute toggle.
  - HTML5 Audio with graceful Web Audio API fallback.

- **🔐 Spotify Account Integration**:
  - Official Spotify Web API OAuth 2.0 PKCE authentication.
  - Direct Access Token authentication option for rapid testing.
  - Real-time profile sync: Display name, profile avatar, email, follower count.
  - Live playlist synchronization from your real Spotify account.

- **🎨 Authentic Spotify Aesthetic**:
  - Signature Spotify dark theme palette (`#121212`, `#181818`, `#282828`, `#1db954`).
  - Dynamic ambient hero gradient matching currently playing track/playlist.
  - Animated equalizer bars during playback.
  - Smooth micro-interactions, card hover lifts, and spring play buttons.

- **📱 Complete Navigation & Views**:
  - **Home**: Dynamic time-based greeting, quick 6-item play grid, *Made For You*, *Popular Artists*, *Trending Tracks*.
  - **Search**: 12 vibrant browse categories, real-time live search with Top Result card highlighting.
  - **Playlists & Liked Songs**: Tracklist table with play counts, duration, and like toggles.
  - **Artist Profile**: Verified badge, monthly listener stats, popular tracks, and bio.
  - **Karaoke Lyrics**: Synchronized line-by-line karaoke lyrics with auto-scroll and click-to-seek.

- **🛠️ Extra Utilities**:
  - Queue drawer showing upcoming songs.
  - Spotify Connect device selector.
  - Custom playlist creator.
  - Keyboard shortcuts (`Space`, `Ctrl+Arrows`, `M`).

---

## 📦 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/VigneshShankar-Sources/spotifyclone.git
cd spotifyclone
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start development server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔑 Spotify Account Setup (Optional)

To connect your real Spotify account:
1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) and create an App.
2. In your App settings, add the Redirect URI: `http://localhost:5173/`
3. Copy your **Client ID**.
4. In this app, click **"Connect Spotify"** in the top navigation bar, enter your Client ID, and click **"Log In with Spotify"**.

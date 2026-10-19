import React, { useState } from 'react';
import { X, Music } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

export const CreatePlaylistModal = () => {
  const { isCreatePlaylistOpen, setIsCreatePlaylistOpen, createPlaylist } = usePlayer();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  if (!isCreatePlaylistOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalTitle = title.trim() || 'My Playlist #' + Math.floor(Math.random() * 100);
    createPlaylist(finalTitle, description.trim() || 'Custom playlist created by HP');
    setIsCreatePlaylistOpen(false);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsCreatePlaylistOpen(false)}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '800' }}>Edit details</h2>
          <button
            onClick={() => setIsCreatePlaylistOpen(false)}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div
              style={{
                width: '140px',
                height: '140px',
                backgroundColor: '#333333',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
              }}
            >
              <Music size={48} color="var(--text-secondary)" />
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <input
                  type="text"
                  placeholder="Playlist name"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    border: '1px solid transparent',
                    borderRadius: '4px',
                    padding: '10px 12px',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: '600',
                    outline: 'none'
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.4)')}
                  onBlur={(e) => (e.target.style.borderColor = 'transparent')}
                  autoFocus
                />
              </div>

              <textarea
                placeholder="Add an optional description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  border: '1px solid transparent',
                  borderRadius: '4px',
                  padding: '10px 12px',
                  color: '#fff',
                  fontSize: '13px',
                  outline: 'none',
                  resize: 'none',
                  fontFamily: 'inherit'
                }}
                onFocus={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.4)')}
                onBlur={(e) => (e.target.style.borderColor = 'transparent')}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
            <button type="submit" className="btn-spotify-primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

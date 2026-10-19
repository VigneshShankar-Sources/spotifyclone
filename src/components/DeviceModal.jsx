import React, { useState } from 'react';
import { X, Laptop, Speaker, Smartphone, Tv, Check } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

export const DeviceModal = () => {
  const { setIsDeviceModalOpen, showToast } = usePlayer();
  const [selectedDevice, setSelectedDevice] = useState('web-player');

  const devices = [
    { id: 'web-player', name: 'This Web Browser', type: 'Computer', icon: Laptop },
    { id: 'echo-living', name: 'Living Room Echo Studio', type: 'Smart Speaker', icon: Speaker },
    { id: 'hp-phone', name: "HP's Phone", type: 'Smartphone', icon: Smartphone },
    { id: 'living-tv', name: 'LG 4K OLED TV', type: 'Spotify Connect TV', icon: Tv }
  ];

  const handleSelect = (device) => {
    setSelectedDevice(device.id);
    showToast(`Connected to ${device.name}`);
    setTimeout(() => {
      setIsDeviceModalOpen(false);
    }, 600);
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsDeviceModalOpen(false)}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '800' }}>Connect to a device</h2>
          <button
            onClick={() => setIsDeviceModalOpen(false)}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {devices.map((device) => {
            const isSelected = selectedDevice === device.id;
            const Icon = device.icon;

            return (
              <div
                key={device.id}
                onClick={() => handleSelect(device)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  backgroundColor: isSelected ? 'rgba(29, 185, 84, 0.12)' : 'rgba(255,255,255,0.05)',
                  cursor: 'pointer',
                  border: isSelected ? '1px solid var(--spotify-green)' : '1px solid transparent',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <Icon size={24} color={isSelected ? 'var(--spotify-green)' : '#fff'} />
                  <div>
                    <div
                      style={{
                        fontSize: '15px',
                        fontWeight: '700',
                        color: isSelected ? 'var(--spotify-green)' : '#fff'
                      }}
                    >
                      {device.name}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {isSelected ? '🟢 Spotify Connect Active' : device.type}
                    </div>
                  </div>
                </div>

                {isSelected && <Check size={18} color="var(--spotify-green)" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

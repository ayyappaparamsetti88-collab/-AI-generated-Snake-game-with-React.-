/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack, Music, Volume2 } from 'lucide-react';
import { Track } from '../types';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Skyline',
    artist: 'AI Oracle',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://picsum.photos/seed/neon1/400/400'
  },
  {
    id: '2',
    title: 'Cyber Pulse',
    artist: 'Neural Beat',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://picsum.photos/seed/neon2/400/400'
  },
  {
    id: '3',
    title: 'Electric Dreams',
    artist: 'Synth Soul',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://picsum.photos/seed/neon3/400/400'
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="thick-hardware-border w-full max-w-[480px] overflow-hidden bg-black shadow-[0_0_50px_-12px_rgba(255,0,255,0.5)]">
      <div className="bg-[#0a0a0a] p-8 h-full">
        <audio
          ref={audioRef}
          src={currentTrack.url}
          onTimeUpdate={handleTimeUpdate}
          onEnded={nextTrack}
        />
        
        <div className="flex items-center gap-8">
          {/* Cover Art */}
          <motion.div 
            key={currentTrack.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-28 h-28 flex-shrink-0"
          >
            <img 
              src={currentTrack.cover} 
              alt={currentTrack.title}
              className="w-full h-full object-cover rounded-xl border border-white/10"
              referrerPolicy="no-referrer"
            />
          </motion.div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-mono">Now Playing</span>
              <h3 className="text-2xl font-bold text-white truncate tracking-tight">
                {currentTrack.title}
              </h3>
              <p className="text-sm font-mono text-neon-pink truncate">
                {currentTrack.artist}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-10 space-y-2">
          <div className="h-[2px] bg-white/5 w-full relative">
            <motion.div 
              className="absolute inset-y-0 left-0 bg-white/20"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ type: 'spring', bounce: 0, duration: 0.2 }}
            />
          </div>
          <div className="flex justify-between text-[9px] font-mono text-white/20 uppercase tracking-widest">
            <span>00:00</span>
            <span className="text-white/10">Live Stream</span>
            <span>00:00</span>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-8 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <button 
              onClick={prevTrack}
              className="text-white/40 hover:text-white transition-colors cursor-pointer"
            >
              <SkipBack className="w-6 h-6" />
            </button>
            
            <button 
              onClick={togglePlay}
              className="w-14 h-14 flex items-center justify-center rounded-full bg-neon-pink text-black shadow-[0_0_30px_var(--color-neon-pink)] hover:scale-105 transition-all cursor-pointer relative"
            >
              <div className="absolute inset-0 rounded-full bg-neon-pink blur-md opacity-50" />
              <div className="relative z-10">
                {isPlaying ? <Pause className="fill-current w-6 h-6" /> : <Play className="fill-current ml-1 w-6 h-6" />}
              </div>
            </button>

            <button 
              onClick={nextTrack}
              className="text-white/40 hover:text-white transition-colors cursor-pointer"
            >
              <SkipForward className="w-6 h-6" />
            </button>
          </div>

          <div className="flex items-center gap-3 text-white/20">
            <Volume2 className="w-4 h-4" />
            <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="w-2/3 h-full bg-white/30" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

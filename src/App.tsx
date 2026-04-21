/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Terminal, Cpu, Zap, Activity } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 space-y-12">
      {/* Header / Brand */}
      <header className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-50 pointer-events-none">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-neon-cyan flex items-center justify-center rounded-lg shadow-[0_0_15px_var(--color-neon-cyan)] animate-pulse">
            <Cpu className="text-black w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-mono font-bold tracking-tighter text-white neon-text-cyan">
              NEON_RHYTHM
            </h1>
            <span className="text-[10px] uppercase font-mono text-white/30 tracking-[0.3em]">
              Neural Interface v2.4
            </span>
          </div>
        </div>

        <div className="hidden md:flex gap-8 items-center pointer-events-auto">
          <div className="flex flex-col items-end">
            <span className="text-[9px] text-white/30 uppercase font-mono">Signal Strength</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className={`w-1 h-3 rounded-full ${i < 4 ? 'bg-neon-cyan' : 'bg-white/10'}`} />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
            <Activity className="w-3 h-3 text-neon-lime animate-pulse" />
            <span className="text-[10px] font-mono text-neon-lime">SYSTEM_OPTIMAL</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-6xl flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 lg:gap-16 pt-24 lg:pt-0">
        
        {/* Left Side: Stats / Meta (Hidden on mobile maybe, or just stacked) */}
        <div className="hidden xl:flex flex-col gap-6 w-64 order-first">
          <div className="glass-panel p-4 space-y-4">
            <h4 className="text-[10px] uppercase tracking-widest text-white/40 font-mono flex items-center gap-2">
              <Terminal className="w-3 h-3" /> System Logs
            </h4>
            <div className="space-y-2">
              {[
                { time: '08:45', msg: 'Kernel loaded' },
                { time: '08:46', msg: 'Neural link established' },
                { time: '08:47', msg: 'Audio driver online' },
              ].map((log, i) => (
                <div key={i} className="text-[10px] font-mono text-white/20">
                  <span className="text-neon-cyan/50 mr-2">[{log.time}]</span> {log.msg}
                </div>
              ))}
            </div>
          </div>
          <div className="glass-panel p-4 space-y-4 border-neon-lime/20 shadow-[0_0_10px_rgba(57,255,20,0.05)]">
            <h4 className="text-[10px] uppercase tracking-widest text-white/40 font-mono flex items-center gap-2">
              <Zap className="w-3 h-3 text-neon-lime" /> Performance
            </h4>
            <div className="w-full h-12 bg-white/5 rounded relative overflow-hidden">
               <motion.div 
                 className="absolute inset-y-0 left-0 bg-neon-lime/20 border-r border-neon-lime"
                 animate={{ 
                   width: ['40%', '60%', '45%', '70%', '50%'],
                 }}
                 transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
               />
               <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-neon-lime/60">
                 CPU_LOAD: 42%
               </div>
            </div>
          </div>
        </div>

        {/* Center: Game Container */}
        <section className="flex-1 flex flex-col items-center justify-center order-1 lg:order-none">
          <SnakeGame />
        </section>

        {/* Right Side: Music Player */}
        <aside className="w-full lg:w-auto flex flex-col items-center lg:items-end justify-center lg:pt-32">
          <MusicPlayer />
          
          <div className="mt-8 glass-panel p-4 w-full max-w-[400px] hidden lg:block">
            <div className="flex justify-between items-center mb-4">
               <span className="text-[10px] font-mono text-white/40 uppercase">Visualizer</span>
               <div className="flex gap-0.5">
                 {[1,2,3,4,5,6,3,5,2,4].map((h, i) => (
                   <motion.div 
                     key={i}
                     className="w-1 bg-neon-pink"
                     animate={{ height: [h*2, h*4, h*2] }}
                     transition={{ repeat: Infinity, duration: 0.5 + i*0.1 }}
                   />
                 ))}
               </div>
            </div>
            <p className="text-[10px] font-mono text-white/20 italic leading-relaxed">
              "The rhythm of the machine is the only truth in this neon wasteland. Keep moving, or get left in the static."
            </p>
          </div>
        </aside>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 w-full p-4 flex justify-center items-center pointer-events-none">
        <div className="text-[9px] font-mono text-white/10 uppercase tracking-[0.5em] pb-2">
          Transmitting from Sector 7-G
        </div>
      </footer>
    </div>
  );
}

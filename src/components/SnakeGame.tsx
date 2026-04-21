/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Point, Direction } from '../types';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = 'UP';
const GAME_SPEED = 150;

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setIsGameOver(false);
    setScore(0);
    setIsPaused(true);
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Check wall collision
      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE
      ) {
        setIsGameOver(true);
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        case ' ': // Space to pause/start
          if (isGameOver) resetGame();
          else setIsPaused(p => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, isGameOver]);

  useEffect(() => {
    gameLoopRef.current = setInterval(moveSnake, GAME_SPEED);
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake]);

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      {/* HUD */}
      <div className="w-full max-w-[400px] flex justify-between items-end px-2">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-widest text-white/40 font-mono">Mission Status</span>
          <span className={`font-mono text-xl ${isGameOver ? 'text-neon-pink neon-text-pink' : 'text-neon-cyan neon-text-cyan'}`}>
            {isGameOver ? 'SYSTEM CRITICAL' : isPaused ? 'PENDING...' : 'LIVE_FEED'}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase tracking-widest text-white/40 font-mono">Score</span>
          <span className="font-mono text-3xl text-neon-lime neon-text-lime">
            {score.toString().padStart(5, '0')}
          </span>
        </div>
      </div>

      {/* Game Board */}
      <div className="relative glass-panel p-2 neon-border-cyan group">
        <div 
          className="grid gap-0 bg-black/50"
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            width: 'min(80vw, 400px)',
            height: 'min(80vw, 400px)'
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const isSnakeHead = snake[0].x === x && snake[0].y === y;
            const isSnakeBody = snake.slice(1).some(s => s.x === x && s.y === y);
            const isFood = food.x === x && food.y === y;

            return (
              <div 
                key={i} 
                className={`relative transition-all duration-200 ${
                  isSnakeHead ? 'bg-neon-cyan shadow-[0_0_10px_var(--color-neon-cyan)] z-10' : 
                  isSnakeBody ? 'bg-neon-cyan/40 border border-neon-cyan/20' : 
                  isFood ? 'bg-neon-pink shadow-[0_0_15px_var(--color-neon-pink)] animate-pulse rounded-full' : 
                  'border-[0.5px] border-white/5'
                }`}
              />
            );
          })}
        </div>

        {/* Overlays */}
        <AnimatePresence>
          {(isPaused || isGameOver) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-20 rounded-2xl"
            >
              <div className="text-center p-8 space-y-4">
                <h2 className={`text-4xl font-mono font-bold tracking-tighter ${isGameOver ? 'text-neon-pink neon-text-pink' : 'text-neon-cyan neon-text-cyan'}`}>
                  {isGameOver ? 'GAME OVER' : 'READY?'}
                </h2>
                <p className="text-white/60 font-mono text-sm">
                  {isGameOver ? 'NEURAL LINK SEVERED' : 'AWAITING INPUT...'}
                </p>
                <button 
                  onClick={() => isGameOver ? resetGame() : setIsPaused(false)}
                  className={`px-8 py-3 font-mono font-bold text-sm tracking-widest transition-all duration-300 ${
                    isGameOver 
                      ? 'neon-border-pink text-neon-pink hover:bg-neon-pink/10' 
                      : 'neon-border-cyan text-neon-cyan hover:bg-neon-cyan/10'
                  }`}
                >
                  {isGameOver ? 'REBOOT' : 'START'}
                </button>
                <div className="mt-4 flex flex-col gap-1 items-center">
                  <span className="text-[10px] text-white/30 uppercase font-mono">Controls</span>
                  <div className="flex gap-2">
                    <kbd className="px-2 py-1 bg-white/10 rounded text-[10px] font-mono">ARROWS</kbd>
                    <span className="text-white/20">/</span>
                    <kbd className="px-2 py-1 bg-white/10 rounded text-[10px] font-mono">SPACE</kbd>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Decorative details */}
      <div className="w-full max-w-[400px] flex justify-between px-2 pt-2">
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={`w-1 h-3 rounded-full ${i < 2 ? 'bg-neon-cyan' : 'bg-white/10'}`} />
          ))}
        </div>
        <div className="text-[10px] font-mono text-white/20 uppercase tracking-widest">
          Build v1.0.4-crypto
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useRef } from 'react';
import { GameEngine } from '../game/GameEngine';
import { Renderer } from '../game/Renderer';
import { useGameStore } from '../store';

export default function GameCanvas({ onOpenBase, onEngineCreated }: { onOpenBase: (base: any) => void, onEngineCreated: (engine: GameEngine) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const rendererRef = useRef<Renderer | null>(null);
  
  const { gameState, rocketBlueprint, rocketName, addNews, setGameState, addStation, addFunds, stations, unlockPlanet } = useGameStore();

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (rendererRef.current && engineRef.current && gameState === 'FLYING') {
          const gamePos = rendererRef.current.screenToGame(e.clientX, e.clientY);
          engineRef.current.setAutoPilotTarget(gamePos);
          if (engineRef.current.rocket?.parts.some(p => p.id === 'cmd_auto')) {
              addNews(`Auto-pilot set to ${Math.floor(gamePos.x)}, ${Math.floor(gamePos.y)}`);
          }
      }
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const engine = new GameEngine(
      (msg) => addNews(msg),
      (x, y) => {
        addStation(x, y);
        addFunds(1000); // Massive payout for deploying a station
      },
      () => {
        addFunds(500);
      },
      () => {
        addFunds(500); // Deploy Rover
      },
      (name: string) => unlockPlanet(name),
      onOpenBase
    );
    engineRef.current = engine;
    onEngineCreated(engine);
    
    const renderer = new Renderer(canvasRef.current);
    rendererRef.current = renderer;

    const onResize = () => {
      if (canvasRef.current && rendererRef.current) {
        rendererRef.current.resize(window.innerWidth, window.innerHeight);
      }
    };
    window.addEventListener('resize', onResize);
    onResize();

    const onWheel = (e: WheelEvent) => {
      if (rendererRef.current && useGameStore.getState().gameState === 'FLYING') {
        rendererRef.current.targetZoom *= (e.deltaY > 0 ? 0.9 : 1.1);
        rendererRef.current.targetZoom = Math.max(0.001, Math.min(5, rendererRef.current.targetZoom));
      }
    };
    window.addEventListener('wheel', onWheel, { passive: false });

    window.addEventListener('keydown', engine.handleKeyDown);
    window.addEventListener('keyup', engine.handleKeyUp);

    let animationFrameId: number;
    const loop = () => {
      const currentState = useGameStore.getState().gameState;
      engine.update(currentState);
      renderer.render(engine, useGameStore.getState().stations, currentState);
      animationFrameId = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', engine.handleKeyDown);
      window.removeEventListener('keyup', engine.handleKeyUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    if (!engineRef.current) return;
    
    if (gameState === 'FLYING') {
      engineRef.current.startFlight(rocketBlueprint, rocketName);
    } else if (gameState === 'BUILDING') {
      // Create a dummy rocket for the renderer to display while building
      engineRef.current.startFlight(rocketBlueprint, rocketName);
      // Ensure it doesn't fall/move
      if (engineRef.current.rocket) {
         engineRef.current.rocket.vel.x = 0;
         engineRef.current.rocket.vel.y = 0;
      }
    }
  }, [gameState, rocketBlueprint, rocketName]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full block" 
      style={{ zIndex: 0 }}
      onClick={handleCanvasClick}
    />
  );
}

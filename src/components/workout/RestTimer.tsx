import { useState, useEffect, useCallback } from 'react';
import { useWorkoutStore } from '../../store/useWorkoutStore';

export function RestTimer() {
  const restSeconds = useWorkoutStore((s) => s.settings.restTimerSeconds);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running || secondsLeft <= 0) return;
    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          setRunning(false);
          // Vibrate if available
          if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [running, secondsLeft]);

  const start = useCallback(() => {
    setSecondsLeft(restSeconds);
    setRunning(true);
  }, [restSeconds]);

  const stop = useCallback(() => {
    setRunning(false);
    setSecondsLeft(0);
  }, []);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;

  if (!running && secondsLeft === 0) {
    return (
      <button
        onClick={start}
        className="w-full py-2 text-sm text-blue-600 font-medium bg-blue-50 rounded-lg active:bg-blue-100 transition-colors"
      >
        Start Rest Timer ({Math.floor(restSeconds / 60)}:{(restSeconds % 60).toString().padStart(2, '0')})
      </button>
    );
  }

  return (
    <div className="flex items-center justify-between bg-blue-50 rounded-lg px-4 py-2">
      <span className="text-2xl font-mono font-bold text-blue-700">
        {mins}:{secs.toString().padStart(2, '0')}
      </span>
      <button
        onClick={stop}
        className="text-sm text-red-500 font-medium active:text-red-700"
      >
        Stop
      </button>
    </div>
  );
}

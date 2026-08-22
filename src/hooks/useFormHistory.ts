import { useState, useCallback } from 'react';

export function useFormHistory<T>(
  currentState: T,
  restoreSnapshot: (state: T) => void
) {
  const [past, setPast] = useState<T[]>([]);
  const [future, setFuture] = useState<T[]>([]);
  const [originalState, setOriginalState] = useState<T>(currentState);

  const undo = useCallback(() => {
    if (past.length === 0) return;

    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);
    
    setFuture(prev => [currentState, ...prev]);
    setPast(newPast);
    
    restoreSnapshot(previous);
  }, [past, currentState, restoreSnapshot]);

  const redo = useCallback(() => {
    if (future.length === 0) return;

    const next = future[0];
    const newFuture = future.slice(1);

    setPast(prev => [...prev, currentState]);
    setFuture(newFuture);

    restoreSnapshot(next);
  }, [future, currentState, restoreSnapshot]);

  const markSaved = useCallback((newState: T) => {
    setPast(prev => {
      // Simpan state terakhir sebelum di-save ke dalam history past
      const newPast = [...prev, originalState];
      if (newPast.length > 20) newPast.shift();
      return newPast;
    });
    setFuture([]);
    setOriginalState(newState);
  }, [originalState]);

  const resetHistory = useCallback((newState: T) => {
    setOriginalState(newState);
    setPast([]);
    setFuture([]);
  }, []);

  const isDirty = JSON.stringify(currentState) !== JSON.stringify(originalState);

  return {
    undo,
    redo,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
    isDirty,
    markSaved,
    resetHistory,
  };
}

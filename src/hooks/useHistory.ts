import { useState, useCallback } from 'react';

interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
  lastCommitted: T;
}

interface UseHistoryResult<T> {
  state: T;
  setState: (newState: T | ((currentState: T) => T)) => void;
  updateStateWithoutHistory: (newState: T | ((currentState: T) => T)) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  clearHistory: () => void;
}

export function useHistory<T>(initialState: T): UseHistoryResult<T> {
  const [history, setHistory] = useState<HistoryState<T>>({
    past: [],
    present: initialState,
    future: [],
    lastCommitted: initialState,
  });

  const { past, present, future, lastCommitted } = history;

  const canUndo = past.length > 0;
  const canRedo = future.length > 0;

  const undo = useCallback(() => {
    if (!canUndo) return;

    setHistory((curr) => {
      const previous = curr.past[curr.past.length - 1];
      const newPast = curr.past.slice(0, curr.past.length - 1);
      return {
        past: newPast,
        present: previous,
        future: [curr.lastCommitted, ...curr.future],
        lastCommitted: previous,
      };
    });
  }, [canUndo]);

  const redo = useCallback(() => {
    if (!canRedo) return;

    setHistory((curr) => {
      const next = curr.future[0];
      const newFuture = curr.future.slice(1);
      return {
        past: [...curr.past, curr.lastCommitted],
        present: next,
        future: newFuture,
        lastCommitted: next,
      };
    });
  }, [canRedo]);

  const setState = useCallback((newState: T | ((currentState: T) => T)) => {
    setHistory((curr) => {
      const resolvedNewState = typeof newState === 'function' 
        ? (newState as (currentState: T) => T)(curr.present)
        : newState;
      
      // If state hasn't changed and is committed, do nothing.
      // If state IS different from present, OR if present is different from lastCommitted (dirty), we proceed.
      if (resolvedNewState === curr.present && curr.present === curr.lastCommitted) {
        return curr;
      }

      return {
        past: [...curr.past, curr.lastCommitted],
        present: resolvedNewState,
        future: [],
        lastCommitted: resolvedNewState,
      };
    });
  }, []);

  const updateStateWithoutHistory = useCallback((newState: T | ((currentState: T) => T)) => {
    setHistory((curr) => {
      const resolvedNewState = typeof newState === 'function' 
        ? (newState as (currentState: T) => T)(curr.present)
        : newState;

      return {
        ...curr,
        present: resolvedNewState,
        // lastCommitted remains unchanged, preserving the restore point
      };
    });
  }, []);

  const clearHistory = useCallback(() => {
      setHistory(curr => ({
          past: [],
          present: curr.present,
          future: [],
          lastCommitted: curr.present
      }));
  }, []);

  return {
    state: present,
    setState,
    updateStateWithoutHistory,
    undo,
    redo,
    canUndo,
    canRedo,
    clearHistory
  };
}
/**
 * Typed pub/sub. Every event the game emits must appear in a GameEventMap
 * (declared where it makes sense — often in the feature that owns it).
 * Features extend the global map via TypeScript declaration merging.
 */

export type Listener<TPayload> = (payload: TPayload) => void;

export interface IEventBus<TEventMap extends object> {
  on<K extends keyof TEventMap>(event: K, listener: Listener<TEventMap[K]>): () => void;
  emit<K extends keyof TEventMap>(event: K, payload: TEventMap[K]): void;
  clear(): void;
}

export const createEventBus = <TEventMap extends object>(): IEventBus<TEventMap> => {
  const listeners = new Map<keyof TEventMap, Set<Listener<unknown>>>();

  return {
    on(event, listener) {
      let set = listeners.get(event);
      if (!set) {
        set = new Set();
        listeners.set(event, set);
      }
      set.add(listener as Listener<unknown>);
      return () => {
        set?.delete(listener as Listener<unknown>);
      };
    },
    emit(event, payload) {
      const set = listeners.get(event);
      if (!set) {
        return;
      }
      for (const listener of set) {
        (listener as Listener<typeof payload>)(payload);
      }
    },
    clear() {
      listeners.clear();
    },
  };
};

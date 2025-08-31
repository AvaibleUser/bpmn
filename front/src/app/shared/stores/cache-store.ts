import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Cache } from '@shared/models/cache.model';

export const initialState: Cache = { cache: undefined };

export const CacheStore = signalStore(
  { providedIn: 'root' },
  withState(() => initialState),
  withMethods((store) => ({
    set(key: string, value: unknown) {
      patchState(store, (state) => ({ ...state, [key]: value }));
    },
  }))
);

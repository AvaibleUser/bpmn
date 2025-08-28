import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import {
  ComponentInputs,
  ComponentLoader,
  ModalCloser,
  ModalOpener,
  ModalState,
} from '@shared/models/modal.model';

const initialState: ModalState<unknown> = {
  openModalCallback: undefined,
  closeModalCallback: undefined,
};

export const ModalStore = signalStore(
  { providedIn: 'root' },
  withState(() => initialState),
  withMethods((store) => ({
    setModalCallback(openModalCallback?: ModalOpener<unknown>, closeModalCallback?: ModalCloser) {
      patchState(store, (state) => ({
        ...state,
        openModalCallback,
        closeModalCallback,
      }));
    },

    openModal<Component>(loadComponent: ComponentLoader<Component>, inputs?: ComponentInputs) {
      store.openModalCallback?.()?.(loadComponent, inputs);
    },

    closeModal() {
      store.closeModalCallback?.()?.();
    },
  }))
);

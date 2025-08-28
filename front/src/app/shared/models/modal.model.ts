import { Binding } from '@angular/core';

export type ComponentLoader<Component> = () => Promise<new () => Component>;

export type ComponentInputs = Binding[];

export type ModalOpener<Component> = (
  loadComponent: ComponentLoader<Component>,
  inputs?: ComponentInputs
) => Promise<void>;

export type ModalCloser = () => void;

export interface ModalState<Component> {
  openModalCallback?: ModalOpener<Component>;
  closeModalCallback?: ModalCloser;
}

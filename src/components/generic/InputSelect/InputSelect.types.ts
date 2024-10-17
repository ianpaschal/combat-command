export type SelectValue = string | number | null;

export interface InputSelectOption<T> {
  value: T;
  label: string;
}

export interface InputSelectGroup<T> {
  label: string;
  options: InputSelectOption<T>[];
}

export type InputSelectItem<T> = (InputSelectGroup<T> | InputSelectOption<T> | '-');
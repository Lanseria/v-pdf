import { ExtractPropTypes } from "vue";

export type ExtractPublicPropTypes<T> = Omit<
  Partial<ExtractPropTypes<T>>,
  Extract<keyof T, `internal${string}`>
>;

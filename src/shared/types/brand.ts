declare const BRAND: unique symbol;

export type Brand<T, B extends string> = T & { readonly [BRAND]: B };

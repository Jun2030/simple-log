declare type Nullable<T> = T | null;

type ArrayLengthMutationKeys = 'splice' | 'push' | 'pop' | 'shift' | 'unshift' | number
type ArrayItems<T extends Array> = T extends Array<infer TItems> ? TItems : never
declare type FixedLengthArray<T extends any[]> =
  Pick<T, Exclude<keyof T, ArrayLengthMutationKeys>>
  & { [Symbol.iterator]: () => IterableIterator< ArrayItems< T > > }

type ProtocolType = '' | 'HTTP' | 'WS';

type wsOption = {
  limitConnect: number;
}

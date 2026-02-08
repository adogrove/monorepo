/** biome-ignore-all lint/suspicious/noExplicitAny: Really any */

export type Constructor = new (...args: any[]) => any
export type NormalizeConstructor<T extends Constructor> = {
  new (...unknown: any[]): InstanceType<T>
} & Omit<T, 'constructor'>

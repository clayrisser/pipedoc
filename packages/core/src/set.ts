export function union<T>(setA: Set<T>, setB: Set<T>): Set<T> {
  return new Set([...setA, ...setB]);
}

export function intersection<T>(setA: Set<T>, setB: Set<T>): Set<T> {
  return new Set([...setA].filter((x) => setB.has(x)));
}

export function difference<T>(setA: Set<T>, setB: Set<T>): Set<T> {
  return new Set([...setA].filter((x) => !setB.has(x)));
}

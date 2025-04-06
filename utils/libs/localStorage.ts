export class LocalStorage {
  constructor() {}

  static setItem(key: string, item: string) {
    if (typeof window === 'undefined') return;

    localStorage.setItem(key, item);
  }

  static getItem(key: string) {
    if (typeof window === 'undefined') return;

    return localStorage.getItem(key);
  }

  static removeItem(key: string) {
    if (typeof window === 'undefined') return;

    localStorage.removeItem(key);
  }

  static setArrayItem<T>(key: string, item: T) {
    if (typeof window === 'undefined') return;

    const data = localStorage.getItem(key);
    const items = data ? JSON.parse(data) : [];

    items.push(item);

    localStorage.setItem(key, JSON.stringify(items));
  }

  static getArrayItems<T>(key: string): T[] {
    if (typeof window === 'undefined') return [];

    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  static removeArrayItem<T>(key: string, predicate: (item: T) => boolean) {
    if (typeof window === 'undefined') return;

    const data = localStorage.getItem(key);

    if (!data) return;

    const parsed = JSON.parse(data);
    const filtered = parsed.filter((item: T) => !predicate(item));
    localStorage.setItem(key, JSON.stringify(filtered));
  }
}

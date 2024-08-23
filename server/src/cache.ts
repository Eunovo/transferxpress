export interface Cache {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlMs?: number): void;
  del(key: string): void;
}

export class InMemoryCache implements Cache {
  private cache: Map<string, { value: any, ttl: number }> = new Map();

  get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key);
    if (!entry) {
      return Promise.resolve(null);
    }
    if (entry.ttl !== 0 && entry.ttl < Date.now()) {
      this.cache.delete(key);
      return Promise.resolve(null);
    }
    return Promise.resolve(entry.value);
  }

  set<T>(key: string, value: T, ttlMs?: number) {
    this.cache.set(key, { value, ttl: ttlMs ? Date.now() + ttlMs : 0 });
  }

  del(key: string) {
    this.cache.delete(key);
  }
}

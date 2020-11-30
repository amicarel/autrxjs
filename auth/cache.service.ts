/* @Injectable({
  providedIn: 'root'
}) */
/**
 * This cache service base class can be used to give caching capabilities to any service. It is not the same as creating a centralized cache service that you inject into another service. By avoiding a centralized value store, we avoid interdependencies between various services.
 *
 * è usato per estendere AuthService in modo da gestire e recuperare al bisogno i dati dell'user.
 */
export abstract class CacheService {
  constructor() {}
  protected getItem<T>(key: string): T | null {
    const data = localStorage.getItem(key)
    if (data != null) {
      return JSON.parse(data)
    }
    return null
  }
  protected setItem(key: string, data: object | string): void {
    if (typeof data === 'string') {
      localStorage.setItem(key, data)
    }
    localStorage.setItem(key, JSON.stringify(data))
  }
  protected removeItem(key: string): void {
    localStorage.removeItem(key)
  }
  protected clear(): void {
    localStorage.clear()
  }
}

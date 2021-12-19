export function set(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function get<T>(key: string) {
  try {
    return JSON.parse(localStorage.getItem(key) as string) as T
  } catch (error) {
    return
  }
}

type Callback<T> = (data: T) => void;

export class Observer<T> {
  private observers: Callback<T>[] = [];
  private value: T | null = null;

  subscribe(callback: Callback<T>) {
    this.observers.push(callback);

    if (this.value) callback(this.value);

    return () => this.unsubscribe(callback);
  }

  unsubscribe(callback: Callback<T>) {
    this.observers = this.observers.filter((sub) => sub !== callback);
  }

  notify(data: T) {
    this.value = data;
    this.observers.forEach((callback) => callback(data));
  }

  get(): T | null {
    return this.value;
  }
}

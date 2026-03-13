import { MaybePromise } from '@/shared/types'

export interface ClickObserver<T = void> {
  handle(data: T): MaybePromise<void>
}

export class ClickSubject<T = void> {
  private observers: ClickObserver<T>[] = []

  public attach(observer: ClickObserver<T>): void {
    this.observers.push(observer)
  }

  public async notify(data: T): Promise<void> {
    for (const observer of this.observers) {
      await observer.handle(data)
    }
  }
}

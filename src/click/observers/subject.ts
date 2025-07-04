import { ClickData } from '@/click/click-data'
import { Stream } from '@/campaign/entity/stream.entity'
import { RequestAdapter } from '@/utils/request-adapter'

export interface RequestObserverData {
  request: RequestAdapter
  clickData: ClickData
}

export interface StreamObserverData {
  stream: Stream
  clickData: ClickData
}

export interface ClickObserver<T> {
  handle(data: T): Promise<void>
}

export class ClickSubject<T> {
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

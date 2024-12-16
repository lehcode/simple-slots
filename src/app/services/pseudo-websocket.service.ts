import { Injectable, OnDestroy } from '@angular/core'
import { BehaviorSubject, filter, map, Observable, Subject } from 'rxjs'
import { IGameUpdate } from '../interfaces/game-update.interface'

@Injectable({
  providedIn: 'root',
})
export class PseudoWebsocketService implements OnDestroy {
  private readonly connection$ = new BehaviorSubject<boolean>(false)
  private readonly destroy$ = new Subject<void>()
  private readonly gameUpdates$ = new Subject<IGameUpdate>()
  readonly isConnected$ = this.connection$.asObservable()

  readonly updates$ = this.gameUpdates$.asObservable().pipe(
    filter(() => this.connection$.value),
    map((update) => this.simulateServerProcessing(update)),
  )

  private simulateServerProcessing(update: IGameUpdate): IGameUpdate {
    return {
      ...update,
      // Add server timestamp
      timestamp: new Date().toISOString(),
    }
  }

  connect(): Observable<boolean> {
    // Simulate connection delay
    setTimeout(() => {
      console.log('WebSocket Connected')
      this.connection$.next(true)
    }, 100)

    return this.isConnected$
  }

  disconnect(): void {
    console.log('WebSocket Disconnected')
    this.connection$.next(false)
    this.destroy$.next()
  }

  sendUpdate(update: IGameUpdate) {
    if (!this.connection$.value) {
      console.warn('Websocket not connected')
      return
    }

    this.gameUpdates$.next(update)
  }

  isConnected(): boolean {
    return this.connection$.value
  }

  private simulateLatency(update: IGameUpdate): Observable<IGameUpdate> {
    // Random latency between 50-150ms
    const latency = Math.random() * 100 + 50
    return new Observable<IGameUpdate>((observer) => {
      setTimeout(() => {
        observer.next(update)
        observer.complete()
      }, latency)
    })
  }

  /**
   * Lifecycle hook that is called when the service is destroyed.
   *
   * Cleans up the service by disconnecting the WebSocket and completing
   * all internal subjects to prevent memory leaks.
   */

  ngOnDestroy(): void {
    this.disconnect()
    this.destroy$.complete()
    this.gameUpdates$.complete()
    this.connection$.complete()
  }
}

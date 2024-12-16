import { computed, Injectable, signal } from '@angular/core'
import { toObservable } from '@angular/core/rxjs-interop'
import { Subject } from 'rxjs'

import { IGameSettings } from '../interfaces/game-settings.interface'
import { IGameState } from '../interfaces/game-state.interface'

import { PseudoWebsocketService } from './pseudo-websocket.service'

const INITIAL_SETTINGS: IGameSettings = {
  fallingSpeed: 20,
  fallingFrequency: 20,
  playerSpeed: 30,
  gameTime: 30,
}

const INITIAL_STATE: IGameState = {
  isPlaying: false,
  score: 0,
  timeRemaining: 0,
  playerPosition: 50, // Center
  objects: [],
}

@Injectable({
  providedIn: 'root',
})
export class GameStateService {
  private readonly settings = signal<IGameSettings>(INITIAL_SETTINGS)
  private readonly gameState = signal<IGameState>(INITIAL_STATE)
  private readonly gameOver = new Subject<void>()
  private objectId = 0;
  private readonly destroy$ = new Subject<void>();

  readonly isPlaying = computed(() => this.gameState().isPlaying)
  readonly timeRemaining = computed(() => this.gameState().timeRemaining)
  readonly playerPosition = computed(() => this.gameState().playerPosition)
  readonly score = computed(() => this.gameState().score)
  readonly objects = computed(() => this.gameState().objects)

  // Observables for external subscriptions
  readonly playerPosition$ = toObservable(this.playerPosition);
  readonly settings$ = toObservable(this.settings)
  readonly gameState$ = toObservable(this.gameState)
  readonly gameOver$ = this.gameOver.asObservable()

  constructor(private webSocketService: PseudoWebsocketService) {
    this.setupGameStateUpdates();
  }

  private setupGameStateUpdates(): void {
    // Handle keyboard controls
    // Set up game timer when game is playing
  }

  public updateSettings(newSettings: Partial<IGameSettings>): boolean {
    try {
      this.settings.update((current) => {
        console.log('Current settings:', current);
        console.log('New settings:', newSettings);
        return { ...current, ...newSettings }
      })
    } catch (error: any) {
      throw new Error(error.message)
    }

    return true;
  }

  startGame(): void {
    this.gameState.update((current) => {
      return {
        ...current,
        isPlaying: true,
        timeRemaining: this.settings().gameTime,
        score: 0,
        objects: [],
      }
    })
  }

  stopGame(): void {
    this.gameState.update((current) => {
      return {
        ...current,
        isPlaying: false,
        timeRemaining: 0,
        score: 0,
        objects: [],
      }
    })
    this.gameOver.next();
    // this.webSocketService.disconnect()
  }

  /**
   * Restart the game by stopping the current game and starting a new one.
   */
  restartGame(): void {
    this.stopGame();
    this.startGame();
  }
}

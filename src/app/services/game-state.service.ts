import { computed, effect, Injectable, signal } from '@angular/core'
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop'
import { filter, fromEvent, interval, map, merge, Subject, takeUntil } from 'rxjs'

import { IFallingDrop } from '../interfaces/falling-drop.interface'
import { IGameSettings } from '../interfaces/game-settings.interface'
import { IGameState } from '../interfaces/game-state.interface'

import { PseudoWebsocketService } from './pseudo-websocket.service'

const INITIAL_SETTINGS: IGameSettings = {
  fallingSpeed: 5,
  fallingFrequency: 10,
  playerSpeed: 100,
  gameTime: 30,
}

const INITIAL_STATE: IGameState = {
  isPlaying: false,
  score: 0,
  timeRemaining: 0,
  playerPosition: 50, // Center
  objects: [],
}

const MAX_OBJECTS = 10;

@Injectable({
  providedIn: 'root',
})
export class GameStateService {
  private readonly settings = signal<IGameSettings>(INITIAL_SETTINGS)
  private readonly gameState = signal<IGameState>(INITIAL_STATE)
  private readonly gameOver = new Subject<void>()
  private objectId = 0
  private readonly destroy$ = new Subject<void>()

  readonly isPlaying = computed(() => this.gameState().isPlaying)
  readonly timeRemaining = computed(() => this.gameState().timeRemaining)
  readonly playerPosition = computed(() => this.gameState().playerPosition)
  readonly score = computed(() => this.gameState().score)
  readonly objects = computed(() => this.gameState().objects)

  // Observables for external subscriptions
  readonly playerPosition$ = toObservable(this.playerPosition)
  readonly settings$ = toObservable(this.settings)
  readonly gameState$ = toObservable(this.gameState)
  readonly gameOver$ = this.gameOver.asObservable()

  constructor(private webSocketService: PseudoWebsocketService) {
    this.setupGameStateUpdates()
  }

  private setupGameStateUpdates(): void {
    // Handle keyboard controls
    const leftKey$ = fromEvent<KeyboardEvent>(document, 'keydown').pipe(
      filter((event) => event.key === 'ArrowLeft'),
      map(() => -1),
    )

    const rightKey$ = fromEvent<KeyboardEvent>(document, 'keydown').pipe(
      filter((event) => event.key === 'ArrowRight'),
      map(() => 1),
    )

    merge(leftKey$, rightKey$)
      .pipe(
        takeUntilDestroyed(),
        filter(() => this.isPlaying()),
        map((direction) => (direction * this.settings().playerSpeed) / 100),
      )
      .subscribe((movement) => {
        this.gameState.update((state) => ({
          ...state,
          playerPosition: Math.max(0, Math.min(100, state.playerPosition + movement)),
        }))
      })

    // Set up game timer when game is playing
    effect(() => {
      if (this.isPlaying()) {
        this.startGameTimer()
        this.spawnObjects()
      }
    })
  }

  /**
   * Updates the game settings.
   *
   * This method merges the provided partial settings object with the current
   * settings. If the update is successful, it returns `true`. If the update
   * fails, it throws an error.
   *
   * @param newSettings - The partial settings object to merge with the current
   * settings.
   * @returns `true` if the update is successful, otherwise throws an error.
   */
  public updateSettings(newSettings: Partial<IGameSettings>): boolean {
    try {
      this.settings.update((current) => {
        console.log('Current settings:', current)
        console.log('New settings:', newSettings)
        return { ...current, ...newSettings }
      })
    } catch (error: any) {
      throw new Error(error.message)
    }

    return true
  }

  /**
   * Starts the game.
   *
   * This method updates the game state to mark the game as playing, resets the
   * time remaining to the value specified in the game settings, resets the score
   * to 0, and clears the list of objects.
   */
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

  /**
   * Stop the game by updating the game state to a non-playing state.
   *
   * This will update the game state by setting `isPlaying` to `false`, `timeRemaining` to `0`, `score` to `0`,
   * and `objects` to an empty array. Additionally, an event is emitted to signal the game has ended.
   *
   * @remarks
   * This method does not disconnect the WebSocket connection.
   */
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
    this.gameOver.next()
    // this.webSocketService.disconnect()
  }

  /**
   * Restart the game by stopping the current game and starting a new one.
   */
  restartGame(): void {
    this.stopGame()
    this.startGame()
  }

  private startGameTimer() {
    interval(1000)
      .pipe(
        takeUntil(this.gameOver$),
        filter(() => this.isPlaying()),
      )
      .subscribe(() => {
        this.gameState.update((current) => {
          const newTimeRemaining = current.timeRemaining - 1

          if (newTimeRemaining <= 0) {
            this.stopGame()
            return current
          }

          this.webSocketService.sendUpdate({
            score: current.score,
            timeRemaining: newTimeRemaining,
          })

          return {
            ...current,
            timeRemaining: newTimeRemaining,
          }
        })
      })
  }

  /**
   * Spawns new objects on the game board at an interval specified by the game settings.
   *
   * The spawning of objects is stopped when the game is stopped.
   */
  private spawnObjects() {
    const spawnInterval = interval(1000 / this.settings().fallingFrequency).pipe(
      takeUntil(this.gameOver$),
      filter(() => this.isPlaying()),
      filter(() => this.gameState().objects.length < MAX_OBJECTS)
    )

    spawnInterval.subscribe(() => {
      const newObject: IFallingDrop = {
        id: Date.now(),
        x: Math.floor(Math.random() * 100),
        y: 0,
      }

      this.gameState.update((state) => ({
        ...state,
        objects: [...state.objects, newObject],
      }))

      this.updateObjectPositions()
    })
  }

  private updateObjectPositions() {
    interval(16)
      .pipe(
        takeUntil(this.gameOver$),
        filter(() => this.isPlaying()),
      )
      .subscribe(() => {
        this.gameState.update((state) => {
          const speed = this.settings().fallingSpeed
          const updatedObjects = state.objects
            .map((object) => ({
              ...object,
              y: object.y + speed / 100,
            }))
            .filter((obj) => obj.y < 100)

          // Check collisions
          const collidedObjects = updatedObjects.filter((object) => this.checkCollision(object, state.playerPosition))
          if (collidedObjects.length > 0) {
            const newScore = state.score + collidedObjects.length
            this.webSocketService.sendUpdate({
              score: newScore,
              timeRemaining: state.timeRemaining,
            })
          }

          return {
            ...state,
            objects: updatedObjects.filter((obj) => !collidedObjects.some((collided) => collided.id === obj.id)),
            score: state.score + collidedObjects.length,
          }
        })
      })
  }

  private checkCollision(object: IFallingDrop, playerPosition: number) {
    const playerWidth = 10 // Width as percentage
    const objectWidth = 5 // Width as percentage

    const coords = {
      player: {
        left: playerPosition - playerWidth / 2,
        right: playerPosition + playerWidth / 2,
      },
      object: {
        left: object.x - objectWidth / 2,
        right: object.x + objectWidth / 2,
      },
    }

    return object.y > 90 && coords.player.right > coords.object.left && coords.player.left < coords.object.right
  }
}

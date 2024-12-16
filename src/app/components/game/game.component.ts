import { CommonModule } from '@angular/common'
import { Component, OnDestroy, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { map, Observable, Subject, takeUntil } from 'rxjs'

import { IFallingDrop } from '../../interfaces/falling-drop.interface'
import { GameStateService } from '../../services/game-state.service'

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <header class="p-4 flex justify-between items-center bg-gray-800/50 border-b border-gray-700">
        <div class="flex items-center gap-8">
          <div class="bg-gray-700 rounded-lg px-4 py-2">
            <span class="text-gray-400">Score:</span>
            <span class="text-2xl ml-2 font-bold text-yellow-400">{{ score$ | async }}</span>
          </div>
          <div class="bg-gray-700 rounded-lg px-4 py-2">
            <span class="text-gray-400">Time:</span>
            <span class="text-2xl ml-2 font-bold text-blue-400">{{ timeRemaining$ | async }}s</span>
          </div>
        </div>
        <div class="flex gap-4">
          <button (click)="startGame()" class="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors">
            Start Game
          </button>
          <button (click)="goToSettings()" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
            Settings
          </button>
        </div>
      </header>

      <!-- Game Area -->
      <div class="relative w-full h-[calc(100vh-4rem)] overflow-hidden">
        <ng-container *ngFor="let drop of rain$ | async">
          <div
            class="absolute w-4 h-4 rounded-full bg-yellow-400 shadow-lg shadow-yellow-400/50 transition-all duration-16"
            [style.left.%]="drop.x"
            [style.top.%]="drop.y"
            [style.transform]="'translate(-50%, -50%) scale(' + getDropScale(drop.y) + ')'"
          ></div>
        </ng-container>

        <!-- Player -->
        <div
          class="absolute bottom-8 w-20 h-6 bg-blue-100 rounded-md transition-transform duration-[50ms] ease-linear shadow-lg shadow-blue-500/50"
          [style.left.%]="playerPosition$ | async"
          [style.transform]="'translateX(-50%) ' + getPlayerAnimation()"
        ></div>
      </div>

      <!-- Game Over Overlay -->
      <div *ngIf="(isPlaying$ | async) === false" class="absolute inset-0 bg-black/70 flex items-center justify-center">
        <div class="text-center text-gray-400">
          <h2 class="text-4xl font-bold mb-8">Welcome to Slots Game!</h2>
          <button
            (click)="startGame()"
            class="px-8 py-4 bg-green-600 hover:bg-green-700 rounded-lg text-xl transition-colors"
          >
            Start Game
          </button>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class GameComponent implements OnInit, OnDestroy {
  readonly playerPosition$: Observable<number>
  readonly isPlaying$: Observable<boolean>
  readonly timeRemaining$: Observable<number>
  readonly score$: Observable<number>
  readonly rain$: Observable<IFallingDrop[]>
  private readonly destroy$ = new Subject<void>()

  constructor(
    private readonly gameStateService: GameStateService,
    private readonly router: Router,
  ) {
    this.playerPosition$ = this.gameStateService.playerPosition$
    this.isPlaying$ = this.gameStateService.gameState$.pipe(map((state) => state.isPlaying))
    this.timeRemaining$ = this.gameStateService.gameState$.pipe(map((state) => state.timeRemaining))
    this.score$ = this.gameStateService.gameState$.pipe(map((state) => state.score))
    this.rain$ = this.gameStateService.gameState$.pipe(map((state) => state.objects))
  }

  /**
   * Initializes the component.
   *
   * Subscribes to the game over event emitted by the GameStateService.
   * When the game over event is triggered, a message is logged to
   * the console.
   */
  ngOnInit(): void {
    this.gameStateService.gameOver$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      console.log('Game Over!')
    })
  }

  /**
   * Lifecycle hook that is called when the component is destroyed.
   *
   * Called just before Angular destroys the component. Unsubscribes from
   * all Observables subscribed in the component.
   */
  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
    this.gameStateService.stopGame()
  }

  /**
   * Start the game.
   */
  startGame(): void {
    this.gameStateService.startGame()
  }

  /**
   * Stop the game.
   */
  stopGame(): void {
    this.gameStateService.stopGame()
  }

  /**
   * Navigates to the settings page.
   */
  goToSettings(): void {
    this.stopGame()
    this.router.navigate(['/settings'])
  }
  
  getDropScale(y: number): number {
    // Scale from 0.8 to 1.2 based on y position
    return 0.8 + (y / 100) * 0.4;
  }

  getPlayerAnimation(): string {
    // Add slight squish effect when moving
    return 'scaleY(0.95) scaleX(1.05)';
  }
}

import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';

import { GameStateService } from '../../services/game-state.service';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative w-full h-screen bg-gray-900 overflow-hidden">
      <div #gameContainer class="relative w-full h-full">
        <div
          class="absolute bottom-8 w-20 h-8 bg-blue-500 rounded-sm transition-transform duration-100"
          [style.left.%]="playerPosition$ | async"
          [style.transform]="'translateX(-50%)'"
        ></div>
      </div>
    </div>
  `,
  styles: ``,
})
export class GameComponent implements OnInit, OnDestroy {
  readonly playerPosition$: Observable<number>
  // Stream subscriptions cleanup
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly gameStateService: GameStateService,
  ){
    this.playerPosition$ = this.gameStateService.playerPosition$
  }

  ngOnInit(): void {
    this.gameStateService.gameOver$
    .pipe(takeUntil(this.destroy$))
    .subscribe(() => {
      console.log('Game Over!');
      // More game over logic
    });
  }

  /**
   * Lifecycle hook that is called when the component is destroyed.
   *
   * Called just before Angular destroys the component. Unsubscribes from
   * all Observables subscribed in the component.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  startGame(): void {
    this.gameStateService.startGame();
  }

  stopGame(): void {
    this.gameStateService.stopGame();
  }
}

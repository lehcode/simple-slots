import { IFallingDrop } from "./falling-drop.interface";

export interface IGameState {
  isPlaying: boolean;
  score: number;
  timeRemaining: number;
  playerPosition: number;
  objects: IFallingDrop[];
}
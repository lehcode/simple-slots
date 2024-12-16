import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PseudoWebsocketService {

  private readonly connection$ = new BehaviorSubject<boolean>(false)

  public isConnected$ = this.connection$.asObservable()
  
}

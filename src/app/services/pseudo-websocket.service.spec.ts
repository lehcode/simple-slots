import { TestBed } from '@angular/core/testing';

import { PseudoWebsocketService } from './pseudo-websocket.service';

describe('PseudoWebsocketService', () => {
  let service: PseudoWebsocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PseudoWebsocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

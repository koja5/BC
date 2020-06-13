import { TestBed } from '@angular/core/testing';

import { MessageChatService } from './message-chat.service';

describe('MessageChatService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MessageChatService = TestBed.get(MessageChatService);
    expect(service).toBeTruthy();
  });
});

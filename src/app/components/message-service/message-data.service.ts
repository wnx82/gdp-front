import { Injectable } from '@angular/core';
import { Message } from 'primeng/api';

@Injectable({
    providedIn: 'root',
})
export class MessageDataService {
    private messages: Message[] = [];

    addMessage(message: Message) {
        this.messages.push(message);
    }

    clearMessages() {
        this.messages = [];
    }

    getMessages() {
        return this.messages;
    }
}

import { Component } from '@angular/core';
import { Message, MessageService } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';
import { MessageDataService } from './message-data.service';

@Component({
    selector: 'app-message-service',
    templateUrl: './message-service.component.html',
    styleUrls: ['./message-service.component.css'],
    providers: [MessageService, MessageDataService],
})
@Injectable({
    providedIn: 'root',
})
export class MessageServiceComponent {
    selectedSeverity = 'success';
    selectedSummary = 'Service Message';
    selectedDetail = 'Via MessageService';
    dataForm = new FormGroup({
        severity: new FormControl('', [Validators.required]),
        summary: new FormControl('', [Validators.required]),
        detail: new FormControl('', [Validators.required]),
    });
    messages: Message[] = [];

    constructor(
        public messageDataService: MessageDataService,
        private primengConfig: PrimeNGConfig,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.primengConfig.ripple = true;
        // this.messageDataService.getMessages();

        this.messages = [
            {
                severity: 'success',
                summary: 'Success',
                detail: 'Message Content',
            },
            { severity: 'info', summary: 'Info', detail: 'Message Content' },
        ];
    }

    clearMessage() {
        this.messageDataService.clearMessages();
        this.messageService.clear();
        this.messages = [];
    }

    showViaService() {
        const severity = this.dataForm.get('severity')?.value || 'success';
        const summary =
            this.dataForm.get('summary')?.value || 'Service Message';
        const detail =
            this.dataForm.get('detail')?.value || 'Via MessageService';

        const message: Message = {
            severity,
            summary,
            detail,
            closable: true,
        };
        this.messageDataService.addMessage(message);
        console.log(this.messageDataService.getMessages());
        this.getAll();
        this.messageService.add(message);
        // console.log(this.messageDataService.getMessages());
    }
    getAll() {
        for (const message of this.messages) {
            this.messageService.add({
                severity: message.severity,
                summary: message.summary,
                detail: message.detail,
            });
        }
    }
}

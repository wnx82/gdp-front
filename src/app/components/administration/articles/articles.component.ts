import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MessageService } from 'primeng/api';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Article, Attachment } from '../../../interfaces/Article.interface'; 

@Component({
    selector: 'app-articles',
    templateUrl: './articles.component.html',
    styleUrls: ['./articles.component.scss'],
    providers: [MessageService],
})
export class ArticlesComponent implements OnInit {
    private apiUrl: string | undefined;
    articles: Article[] = [];
    severityOptions: any[] = [
        { label: 'Success', value: 'success' },
        { label: 'Error', value: 'error' },
        { label: 'Info', value: 'info' },
        { label: 'Warning', value: 'warn' }
    ];
    selectedArticle: any = {};
    isAdding: boolean = false;
    isEditing: boolean = false;
    displayConfirmationDialog = false;
    displayConfirmationDelete = false;
    articleForm = new FormGroup({
        title: new FormControl('', [Validators.required]),
        category: new FormControl('', [Validators.required]),
        date: new FormControl('', [Validators.required]),
        content: new FormControl('', [Validators.required]),
        severity: new FormControl('info', [Validators.required]), // Initialisé avec 'info'
        attachments: new FormControl<Attachment[] | null>([]),
        author: new FormControl(''),
    });

    constructor(
        private http: HttpClient,
        private messageService: MessageService
    ) {}

    readonly API_URL = `${environment.apiUrl}/articles`;

    ngOnInit(): void {
        this.get();
    }

    private handleError(error: any): void {
        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message,
        });
    }

    get() {
        this.http.get<Article[]>(this.API_URL).subscribe({
            next: data => {
                this.articles = data;
                console.log(this.articles);
            },
            error: error => {
                console.log(error);
            },
        });
    }

    add(article: any) {
        this.http.post<any>(`${this.API_URL}`, this.articleForm.value).subscribe({
            next: data => {
                this.articles.push(data);
                this.isAdding = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Article ajouté',
                });
                this.articleForm.reset({ severity: 'info' }); // Réinitialise avec 'info'
                this.get();
            },
            error: error => {
                this.handleError(error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: error.error.message,
                });
            },
        });
    }

    edit(id: number, article: any) {
        if (!article) {
            console.error('Données invalides', article);
            return;
        }
        const url = `${this.API_URL}/${id}`;

        this.http.patch<Article>(url, this.articleForm.value).subscribe({
            next: data => {
                const index = this.articles.findIndex(a => a._id === data._id);
                this.articles[index] = data;
                this.selectedArticle = {};
                this.isEditing = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Modification effectuée',
                });
                this.articleForm.reset({ severity: 'info' }); // Réinitialise avec 'info'
                this.get();
            },
            error: error => {
                console.error('Erreur de requête PATCH', error);
                if (error.error && error.error.message) {
                    console.error("Message d'erreur du serveur :", error.error.message);
                }
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'La modification a échouée',
                });
            },
        });
    }

    deleteArticle(id: number) {
        this.http.delete<Article>(`${this.API_URL}/${id}`).subscribe({
            next: () => {
                this.articles = this.articles.filter(a => a._id !== id);
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Suppression',
                    detail: 'Article effacé',
                });
                this.get();
            },
            error: error => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: error.error.message,
                });
                console.log(error);
            },
        });
    }

    deleteDeleted(): void {
        this.displayConfirmationDialog = true;
    }

    confirmDeleteDeleted(): void {
        const url = `${this.API_URL}/purge`;
        this.http.post(url, {}).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Toutes les données ont été complètement effacées',
                });
                this.get(); // Met à jour la liste
            },
            error: error => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: error.error.message,
                });
            },
            complete: () => {
                this.displayConfirmationDialog = false;
            },
        });
    }

    confirmRestoreDeleted(): void {
        const url = `${this.API_URL}/restore`;
        this.http.post(url, {}).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Toutes les données ont été restaurées avec succès',
                });
                this.get(); // Met à jour la liste
            },
            error: error => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: error.error.message,
                });
            },
        });
    }

    onConfirmDelete(article: Article) {
        this.selectedArticle = article; 
        this.displayConfirmationDelete = true;
    }

    deleteData(id: number) {
        this.http.delete<Article>(`${this.API_URL}/${id}`).subscribe({
            next: () => {
                this.articles = this.articles.filter(a => a._id !== id);
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Suppression',
                    detail: 'Article effacé',
                });
                this.get();
            },
            error: error => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: error.error.message,
                });
            },
        });
    }

    selectData(article: Article) {
        this.selectedArticle = { ...article };
        this.articleForm.patchValue({
            title: article?.title,
            category: article?.category,
            date: article?.date,
            content: article?.content,
            severity: article?.severity,
            attachments: article?.attachments,
            author: article?.author,
        });
    }
    getRowStyle(severity: string): any {
        switch (severity) {
            case 'success':
                return { 'background-color': '#d4edda' }; // Vert clair pour success
            case 'error':
                return { 'background-color': '#f8d7da' }; // Rouge clair pour error
            case 'info':
                return { 'background-color': '#d1ecf1' }; // Bleu clair pour info
            case 'warn':
                return { 'background-color': '#fff3cd' }; // Jaune clair pour warning
            default:
                return {};
        }
    }

    cancel() {
        this.selectedArticle = {};
        this.isAdding = false;
        this.isEditing = false;
    }

    toggleAdd() {
        this.isAdding = !this.isAdding;
        this.selectedArticle = {};
        this.articleForm.reset({ severity: 'info' });
    }

    toggleEdit() {
        this.isEditing = !this.isEditing;
    }

    onHide() {
        this.selectedArticle = {};
        this.isAdding = false;
        this.isEditing = false;
    }
    
    get isDialogVisible(): boolean {
        return this.isAdding || this.isEditing;
    }
}

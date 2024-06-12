import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MessageService } from 'primeng/api';
import { Infraction } from '../../../interfaces/Infraction.interface';

@Component({
  selector: 'app-infractions',
  templateUrl: './infractions.component.html',
  styleUrls: ['./infractions.component.scss'],
  providers: [MessageService],
})
export class InfractionsComponent implements OnInit {
  // private API_URL: string = environment.API_URL;
  readonly API_URL = `${environment.apiUrl}/infractions`;
  donnees: Infraction[] = [];
  displayConfirmationDialog = false;

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.get();
  }

  get() {
    this.http.get<Infraction[]>(this.API_URL).subscribe({
      next: data => {
        this.donnees = data.filter(donnee => !donnee.deletedAt);
      },
      error: error => {
        console.log(error);
      },
    });
  }

  deleteDonnee(id: number) {
    this.http.delete(`${this.API_URL}/${id}`).subscribe({
      next: () => {
        this.donnees = this.donnees.filter(a => a._id !== id);
        this.messageService.add({
          severity: 'warn',
          summary: 'Suppression',
          detail: 'Donnée effacée',
        });
        this.get();
      },
      error: error => {
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
        this.get();
      },
      error: error => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: error.message,
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
        this.get();
      },
      error: error => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: error.message,
        });
      },
    });
  }

  clear(table: any) {
    table.clear();
  }
}

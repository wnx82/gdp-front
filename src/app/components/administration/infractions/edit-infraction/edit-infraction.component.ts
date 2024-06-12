import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { MessageService } from 'primeng/api';
import { Infraction } from '../../../../interfaces/Infraction.interface';

@Component({
  selector: 'app-edit-infraction',
  templateUrl: './edit-infraction.component.html',
  styleUrls: ['./edit-infraction.component.scss'],
  providers: [MessageService],
})
export class EditInfractionComponent implements OnInit {
  private apiUrl: string = environment.apiUrl;
  readonly API_URL = `${environment.apiUrl}/infractions`;
  dataForm = new FormGroup({
    category: new FormControl('', [Validators.required]),
    priority: new FormControl(''),
    list: new FormArray([]),
  });
  infractionId: string;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {
    this.infractionId = this.route.snapshot.paramMap.get('id') || '';
  }

  ngOnInit(): void {
    this.getInfraction();
  }

  get list(): FormArray {
    return this.dataForm.get('list') as FormArray;
  }

  getInfraction() {
    const url = `${this.API_URL}/${this.infractionId}`;
    this.http.get<Infraction>(url).subscribe({
      next: (data: Infraction) => {
        this.dataForm.patchValue({
          category: data.category,
          priority: data.priority?.toString() || '',
          list: []
        });
        const list = this.dataForm.get('list') as FormArray;
        list.clear();
        data.list.forEach((item: [string, string]) => {
          list.push(new FormGroup({
            article: new FormControl(item[0]),
            description: new FormControl(item[1])
          }));
        });
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

  addRow() {
    this.list.push(new FormGroup({
      article: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required)
    }));
  }

  deleteRowFromList(rowIndex: number) {
    this.list.removeAt(rowIndex);
  }

  edit(donnee: any) {
    const url = `${this.API_URL}/${this.infractionId}`;
    this.http.patch(url, donnee).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Modification effectuée',
        });
        this.router.navigate(['/infractions']);
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

  navigateToInfractions() {
    this.router.navigate(['/infractions']);
  }
}

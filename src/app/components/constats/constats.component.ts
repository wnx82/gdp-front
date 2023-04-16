import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { LocalStorageService } from '../../services/local-storage.service';
import { MessageService } from 'primeng/api';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
@Component({
  selector: 'app-constats',
  templateUrl: './constats.component.html',
  styleUrls: ['./constats.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class ConstatsComponent implements OnInit {
  private apiUrl: string | undefined;
  constats: any[] = [];
  filteredRues: any[] = [];
  selectedConstat: any = {

  };
  isAdding: boolean = false;
  isEditing: boolean = false;
  displayConfirmationDelete = false;
  displayConfirmationDialog = false;
  dataForm = new FormGroup({
    agents: new FormControl('', [Validators.required]),
    constats: new FormControl('', [Validators.required]),
    date: new FormControl('', [Validators.required]),
    pv: new FormControl('', [Validators.required]),
    vehicule: new FormGroup({
      marque: new FormControl(''),
      modele: new FormControl(''),
      couleur: new FormControl(''),
      type: new FormControl(''),
      immatriculation: new FormControl('')
    }),
    personne: new FormGroup({
      firstname: new FormControl(''),
      lastname: new FormControl(''),
      birthday: new FormControl(''),
      nationalNumber: new FormControl(''),
      tel: new FormControl(''),
      adresse: new FormGroup({
        rue: new FormControl(''),
        cp: new FormControl(''),
        localite: new FormControl('')
      })
    }),
    adresse: new FormGroup({
      rue: new FormControl('', [Validators.required]),
      numero: new FormControl('')
    }),
    geolocation: new FormGroup({
      latitude: new FormControl(''),
      longitude: new FormControl(''),
      horodatage: new FormControl('')
    }),
    infractions: new FormControl('', [Validators.required]),
    notes: new FormControl(''),
    annexes: new FormControl('')
  });

  constructor(private http: HttpClient, private messageService: MessageService, private localStorageService: LocalStorageService, private confirmationService: ConfirmationService) { }
  storedValue: any;
  rues: any[] = [];
  readonly API_URL = `${environment.apiUrl}/constats`;

  ngOnInit() {
    this.getConstats();
    const ruesLocalStorage = localStorage.getItem('rues');

    if (ruesLocalStorage === null) {
      // Si les rues n'existent pas encore dans le local storage
      this.http.get<any[]>('http://localhost:3003/rues').subscribe(
        data => {
          this.rues = data;
          localStorage.setItem('rues', JSON.stringify(this.rues));
          console.log('Sauvegarde des rues dans le local storage');
        },
        error => {
          console.error(error);
        }
      );
    } else {
      // Les rues existent dans le local storage
      this.rues = JSON.parse(ruesLocalStorage);
      console.log('Rues déjà chargées');
    }
  }
  private handleError(error: any): void {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
  }
  getConstats() {
    let url = `${this.API_URL}`;
    this.http.get<any[]>(url).subscribe({
      next: data => {
        this.constats = data.filter(constat => !constat.deletedAt);
        console.log(this.constats);
      },
      error: error => {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: error.error.message });
      }
    });
  }

  addConstat(constat: any) {
    let url = `${this.API_URL}/constats`;
    this.http.post<any>(url, constat).subscribe({
      next: data => {
        this.constats.push(data);
        this.isAdding = false;
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Constat ajouté' });
        this.dataForm.reset();
        this.getConstats();
      },
      error: error => {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: error.error.message });
      }
    });
  }


  editConstat(id: number, constat: any) {
    if (!constat) {
      console.error('Données invalides', constat);
      return;
    }

    const updatedConstat = {
      vehicule: {
        marque: constat.vehicule.marque ?? this.selectedConstat.vehicule.marque,
        modele: constat.vehicule.modele ?? this.selectedConstat.vehicule.modele,
        couleur: constat.vehicule.couleur ?? this.selectedConstat.vehicule.couleur,
        type: constat.vehicule.type ?? this.selectedConstat.vehicule.type,
        immatriculation: constat.vehicule.immatriculation ?? this.selectedConstat.vehicule.immatriculation,
      },
      personne: {
        firstname: constat.personne.firstname ?? this.selectedConstat.personne.firstname,
        lastname: constat.personne.lastname ?? this.selectedConstat.personne.lastname,
        birthday: constat.personne.birthday ?? this.selectedConstat.personne.birthday,
        nationalNumber: constat.personne.nationalNumber ?? this.selectedConstat.personne.nationalNumber,
        tel: constat.personne.tel ?? this.selectedConstat.personne.tel,
        adresse: {
          rue: constat.personne.adresse.rue ?? this.selectedConstat.personne.adresse.rue,
          cp: constat.personne.adresse.cp ?? this.selectedConstat.personne.adresse.cp,
          localite: constat.personne.adresse.localite ?? this.selectedConstat.personne.adresse.localite,
        },
      },
      adresse: {
        rue: constat.adresse.rue ?? this.selectedConstat.adresse.rue,
        numero: constat.adresse.numero ?? this.selectedConstat.adresse.numero,
      },
      geolocation: {
        latitude: constat.geolocation.latitude ?? this.selectedConstat.geolocation.latitude,
        longitude: constat.geolocation.longitude ?? this.selectedConstat.geolocation.longitude,
        horodatage: constat.geolocation.horodatage ?? this.selectedConstat.geolocation.horodatage,
      },
      constats: constat.constats ?? this.selectedConstat.constats,
      date: constat.date ?? this.selectedConstat.date,
      pv: constat.pv ?? this.selectedConstat.pv,
      infractions: constat.infractions ?? this.selectedConstat.infractions,
      notes: constat.notes ?? this.selectedConstat.notes,
      annexes: constat.annexes ?? this.selectedConstat.annexes,
      description: constat.description ?? this.selectedConstat.description,
      degats: constat.degats ?? this.selectedConstat.degats,
      temoins: constat.temoins ?? this.selectedConstat.temoins,
      image: constat.image ?? this.selectedConstat.image,
    };


    const url = `${this.API_URL}/constats/${this.selectedConstat._id}`;

    this.http.patch<any>(url, updatedConstat).subscribe({
      next: data => {
        const index = this.constats.findIndex(a => a._id === data._id);
        this.constats[index] = data;
        this.selectedConstat = {};
        this.isEditing = false;
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Modification effectuée' });
        this.dataForm.reset();
        this.getConstats();
      },
      error: error => {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: error.error.message });
      }
    });
  }

  onConfirmDelete(constat: any) {
    this.displayConfirmationDelete = true;
    this.confirmationService.confirm({
      message: 'Voulez-vous vraiment supprimer cet constat ?',
      header: 'Confirmation de suppression',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteConstat(constat._id);
      }
    });
  }

  deleteConstat(id: number) {
    this.http.delete<any>(`${this.API_URL}/${id}`).subscribe({
      next: () => {
        this.constats = this.constats.filter(a => a._id !== id);
        this.messageService.add({ severity: 'warn', summary: 'Suppression', detail: 'Constat effacé' });
        this.getConstats();
      },
      error: error => {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: error.error.message });
      }
    });
  }


  deleteDeleted(): void {
    this.displayConfirmationDialog = true;
    //
  }
  confirmDeleteDeleted(): void {
    // Mettez ici le code pour supprimer définitivement les données supprimées
    const url = `${this.API_URL}/purge`;
    this.http.post(url, {}).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Toutes les données ont été complètement effacées' });
        this.getConstats(); // Met à jour la liste
      },
      error: error => {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: error.error.message });
      }
    });

    this.displayConfirmationDialog = false;
  }

  selectConstat(constat: any) {
    this.selectedConstat = { ...constat };
  }

  cancel() {
    this.selectedConstat = {};
    this.isAdding = false;
    this.isEditing = false;
  }

  toggleAdd() {
    this.isAdding = !this.isAdding;
    this.selectedConstat = {};
    this.dataForm.reset();
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    console.log(this.selectedConstat);
  }

  filterRues(event: any) {
    const query = event.query.toLowerCase();
    this.filteredRues = this.rues
      .filter(
        rue =>
          typeof rue.nomComplet === 'string' &&
          rue.nomComplet.toLowerCase().includes(query)
      )

      .sort((a, b) => {
        const aIndex = a.nomComplet.toLowerCase().indexOf(query);
        const bIndex = b.nomComplet.toLowerCase().indexOf(query);
        if (aIndex < bIndex) {
          return -1;
        }
        if (aIndex > bIndex) {
          return 1;
        }
        // Si les deux rues ont la même position de la requête,
        // on les trie par ordre alphabétique
        return a.nomComplet.localeCompare(b.nomComplet);
      })

      .slice(0, 10)
      .map(rue => rue.nomComplet);
  }

}

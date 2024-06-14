import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-constats-stats',
  templateUrl: './constats-stats.component.html',
  styleUrls: ['./constats-stats.component.scss']
})
export class ConstatsStatsComponent implements OnInit {
  startDate!: Date;
  endDate!: Date;
  pvCount: number = 0;
  streetsWithMostConstats: { street: string; count: number; }[] = [];

  constructor(private http: HttpClient) {}

  readonly API_URL = `${environment.apiUrl}`;

  ngOnInit(): void {
    // Initialisation avec les dates du jour par exemple
    this.startDate = new Date();
    this.endDate = new Date();
    this.fetchStatistics(); // Appeler la méthode pour charger les statistiques
  }

  fetchStatistics() {
    const params = {
      startDate: this.startDate.toISOString(),
      endDate: this.endDate.toISOString()
    };

    this.http.get<any[]>(`${this.API_URL}/constats`, { params }).subscribe(constats => {
      // Calcul du nombre de PV
      this.pvCount = constats.filter(con => con.pv).length;

      // Calcul des rues avec le plus de constats
      const streetsMap = new Map<string, number>();
      constats.forEach(con => {
        const street = con.adresse.nomComplet;
        streetsMap.set(street, (streetsMap.get(street) || 0) + 1);
      });

      // Convertir Map en tableau d'objets { street: string, count: number }
      this.streetsWithMostConstats = Array.from(streetsMap.entries())
        .map(([street, count]) => ({ street, count }))
        .sort((a, b) => b.count - a.count) // Tri décroissant par nombre de constats
        .slice(0, 5); // Limite aux 5 rues avec le plus de constats
    });
  }
}

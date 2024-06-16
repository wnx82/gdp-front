import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MessageService } from 'primeng/api';
import { Constat } from '../../../interfaces/Constat.interface';
import { GetDataService } from '../../../services/getData/get-data.service';
import { LocalStorageService } from '../../../services/localstorage/local-storage.service';

@Component({
    selector: 'app-constats-stats',
    templateUrl: './constats-stats.component.html',
    styleUrls: ['./constats-stats.component.scss'],
})
export class ConstatsStatsComponent implements OnInit {
    private apiUrl: string | undefined;
    startDate!: Date;
    endDate!: Date;
    pvCount: number = 0;
    nonPvCount: number = 0;
    streetsWithMostConstats: { street: string; count: number }[] = [];
    agentsStats: { name: string; pvCount: number; nonPvCount: number }[] = [];
    constats: Constat[] = [];
    availableYears: { label: string; value: number | string }[] = [];
    selectedYear: number | string = 'all';

    chartData: any;
    chartOptions: any;

    pieData: any;
    pieOptions: any;

    barData: any;
    barOptions: any;

    constructor(
        private http: HttpClient,
        private _localStorageService: LocalStorageService,
        private getDataService: GetDataService,
        private messageService: MessageService
    ) {}

    readonly API_URL = `${environment.apiUrl}/constats`;

    ngOnInit(): void {
        this.initializeYears();
        this.getConstats();
        this.initializePieOptions();
        this.initializeBarOptions();
    }

    initializeYears() {
        const currentYear = new Date().getFullYear();
        this.availableYears.push({ label: 'All', value: 'all' });
        for (let year = 2022; year <= currentYear; year++) {
            this.availableYears.push({ label: year.toString(), value: year });
        }
    }

    onYearChange() {
        this.processConstats(this.constats);
        this.updateChartData();
        this.updatePieData();
        this.updateBarData();
    }

    getConstats() {
        const url = `${this.API_URL}`;
        this.http.get<any[]>(url).subscribe({
            next: constats => {
                const filteredConstats = constats.filter(
                    constat => !constat.deletedAt
                );
                this.constats = filteredConstats;
                this.processConstats(filteredConstats);
                this.updateChartData();
                this.updatePieData();
                this.updateBarData();
                console.log('liste des constats: ', this.constats);
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

    processConstats(filteredConstats: Constat[]) {
        const constatsByYear =
            this.selectedYear === 'all'
                ? filteredConstats
                : filteredConstats.filter(
                      con =>
                          con.date &&
                          new Date(con.date).getFullYear() === this.selectedYear
                  );

        this.calculatePvAndNonPvCount(constatsByYear);
        this.calculateTopStreets(constatsByYear);
        this.calculateAgentsStats(constatsByYear);
    }

    calculatePvAndNonPvCount(constats: Constat[]) {
        this.pvCount = constats.filter(con => con.pv).length;
        this.nonPvCount = constats.filter(con => !con.pv).length;
    }

    calculateTopStreets(constats: Constat[]) {
        const streetsMap = new Map<string, number>();
        constats.forEach(con => {
            const street = con?.adresse?.nomComplet;
            if (street) {
                streetsMap.set(street, (streetsMap.get(street) || 0) + 1);
            }
        });

        this.streetsWithMostConstats = Array.from(streetsMap.entries())
            .map(([street, count]) => ({ street, count }))
            .sort((a, b) => b.count - a.count);
    }

    calculateAgentsStats(constats: Constat[]) {
        const agentsMap = new Map<
            string,
            { pvCount: number; nonPvCount: number }
        >();
        constats.forEach(con => {
            con.agents.forEach(agent => {
                const agentName = agent.toString(); // Convert agent number to string for consistency
                if (!agentsMap.has(agentName)) {
                    agentsMap.set(agentName, { pvCount: 0, nonPvCount: 0 });
                }
                if (con.pv) {
                    agentsMap.get(agentName)!.pvCount++;
                } else {
                    agentsMap.get(agentName)!.nonPvCount++;
                }
            });
        });

        this.agentsStats = Array.from(agentsMap.entries()).map(
            ([name, stats]) => ({
                name,
                pvCount: stats.pvCount,
                nonPvCount: stats.nonPvCount,
            })
        );
    }

    updateChartData() {
        const filteredConstats =
            this.selectedYear === 'all'
                ? this.constats
                : this.constats.filter(
                      con =>
                          con.date &&
                          new Date(con.date).getFullYear() === this.selectedYear
                  );

        const years = Array.from(
            new Set(
                filteredConstats.map(con =>
                    con.date ? new Date(con.date).getFullYear() : null
                )
            )
        ).filter(year => year !== null && year > 2021); // Exclude 2020 and 2021 and null years

        const pvCounts = years.map(
            year =>
                filteredConstats.filter(
                    con =>
                        con.date &&
                        new Date(con.date).getFullYear() === year &&
                        con.pv
                ).length
        );

        const nonPvCounts = years.map(
            year =>
                filteredConstats.filter(
                    con =>
                        con.date &&
                        new Date(con.date).getFullYear() === year &&
                        !con.pv
                ).length
        );

        this.chartData = {
            labels: years,
            datasets: [
                {
                    label: 'PV',
                    data: pvCounts,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                },
                {
                    label: 'Avertissements',
                    data: nonPvCounts,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                },
            ],
        };

        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue(
            '--text-color-secondary'
        );
        const surfaceBorder =
            documentStyle.getPropertyValue('--surface-border');

        this.chartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                    },
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false,
                    },
                },
                x: {
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false,
                    },
                },
            },
        };
    }

    initializePieOptions() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');

        this.pieOptions = {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                        color: textColor,
                    },
                },
            },
        };
    }

    initializeBarOptions() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue(
            '--text-color-secondary'
        );
        const surfaceBorder =
            documentStyle.getPropertyValue('--surface-border');

        this.barOptions = {
            indexAxis: 'y',
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                    },
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                        font: {
                            weight: 500,
                        },
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false,
                    },
                },
                y: {
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false,
                    },
                },
            },
        };
    }

    getRandomPastelColor() {
        const hue = Math.floor(Math.random() * 360); // 0-360 for a wide range of colors
        const saturation = 70 + Math.floor(Math.random() * 10); // 70-80 for pastel
        const lightness = 85 + Math.floor(Math.random() * 10); // 85-95 for pastel
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }

    updatePieData() {
        const agents = this.agentsStats.map(agent => agent.name);
        const counts = this.agentsStats.map(
            agent => agent.pvCount + agent.nonPvCount
        ); // Cumulate PV and non-PV
        const backgroundColors = agents.map(() => this.getRandomPastelColor());

        this.pieData = {
            labels: agents,
            datasets: [
                {
                    data: counts,
                    backgroundColor: backgroundColors,
                    hoverBackgroundColor: backgroundColors,
                },
            ],
        };
    }

    updateBarData() {
        // Combine pvCount and nonPvCount into totalCount for sorting
        const sortedAgents = this.agentsStats
            .map(agent => ({
                name: agent.name,
                pvCount: agent.pvCount,
                nonPvCount: agent.nonPvCount,
                totalCount: agent.pvCount + agent.nonPvCount,
            }))
            .sort((a, b) => b.totalCount - a.totalCount);

        // Extract sorted data
        const agents = sortedAgents.map(agent => agent.name);
        const pvCounts = sortedAgents.map(agent => agent.pvCount);
        const nonPvCounts = sortedAgents.map(agent => agent.nonPvCount);

        this.barData = {
            labels: agents,
            datasets: [
                {
                    label: 'Non PV',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    data: nonPvCounts,
                },
                {
                    label: 'PV',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    data: pvCounts,
                },
            ],
        };
    }
}

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { MessageService } from 'primeng/api';
import { Constat } from '../../../interfaces/Constat.interface';

@Component({
    selector: 'app-constats-stats',
    templateUrl: './constats-stats.component.html',
    styleUrls: ['./constats-stats.component.scss'],
})
export class ConstatsStatsComponent implements OnInit {
    private apiUrl = `${environment.apiUrl}/constats`;
    startDate!: Date;
    endDate!: Date;
    pvCount = 0;
    nonPvCount = 0;
    streetsWithMostConstats: { street: string; count: number }[] = [];
    infractionsStats: { infraction: string; count: number }[] = [];
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

    streetBarData: any;
    streetBarOptions: any;

    infractionBarData: any;
    infractionBarOptions: any;

    constructor(
        private http: HttpClient,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.initializeYears();
        this.initializeOptions();
        this.getConstats();
    }

    initializeYears() {
        const currentYear = new Date().getFullYear();
        this.availableYears = [{ label: 'Toutes', value: 'all' }];
        for (let year = 2022; year <= currentYear; year++) {
            this.availableYears.push({ label: year.toString(), value: year });
        }
    }

    onYearChange() {
        this.processConstats();
        this.updateCharts();
    }

    getConstats() {
        this.http.get<Constat[]>(this.apiUrl).subscribe({
            next: constats => {
                this.constats = constats.filter(c => !c.deletedAt);
                this.processConstats();
                this.updateCharts();
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

    processConstats() {
        const constatsByYear =
            this.selectedYear === 'all'
                ? this.constats
                : this.constats.filter(
                      con =>
                          con.date &&
                          new Date(con.date).getFullYear() === this.selectedYear
                  );

        this.calculatePvAndNonPvCount(constatsByYear);
        this.calculateTopStreets(constatsByYear);
        this.calculateAgentsStats(constatsByYear);
        this.calculateInfractionsStats(constatsByYear); // Nouvelle méthode pour les infractions
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
                const agentName = agent.toString();
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

    calculateInfractionsStats(constats: Constat[]) {
        const infractionsMap = new Map<string, number>();
        constats.forEach(con => {
            if (con.infractions) {
                con.infractions.forEach(infraction => {
                    if (infraction) {
                        if (!infractionsMap.has(infraction)) {
                            infractionsMap.set(infraction, 0);
                        }
                        infractionsMap.set(
                            infraction,
                            infractionsMap.get(infraction)! + 1
                        );
                    }
                });
            }
        });

        this.infractionsStats = Array.from(infractionsMap.entries())
            .map(([infraction, count]) => ({ infraction, count }))
            .sort((a, b) => b.count - a.count);
    }

    updateCharts() {
        this.updateChartData();
        this.updatePieData();
        this.updateBarData();
        this.updateStreetBarData();
        this.updateInfractionBarData(); // Nouvelle méthode pour le graphique des infractions
    }

    updateChartData() {
        const years = Array.from(
            new Set(
                this.constats.map(con =>
                    con.date ? new Date(con.date).getFullYear() : null
                )
            )
        ).filter(year => year !== null && year > 2021) as number[];

        const pvCounts = years.map(
            year =>
                this.constats.filter(
                    con =>
                        con.date &&
                        new Date(con.date).getFullYear() === year &&
                        con.pv
                ).length
        );
        const nonPvCounts = years.map(
            year =>
                this.constats.filter(
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
    }

    updatePieData() {
        const agents = this.agentsStats.map(agent => agent.name);
        const counts = this.agentsStats.map(
            agent => agent.pvCount + agent.nonPvCount
        );
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
        const sortedAgents = this.agentsStats
            .map(agent => ({
                name: agent.name,
                pvCount: agent.pvCount,
                nonPvCount: agent.nonPvCount,
                totalCount: agent.pvCount + agent.nonPvCount,
            }))
            .sort((a, b) => b.totalCount - a.totalCount);

        const agents = sortedAgents.map(agent => agent.name);
        const pvCounts = sortedAgents.map(agent => agent.pvCount);
        const nonPvCounts = sortedAgents.map(agent => agent.nonPvCount);

        this.barData = {
            labels: agents,
            datasets: [
                {
                    label: 'Avertissements',
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

    updateStreetBarData() {
        const top20Streets = this.streetsWithMostConstats.slice(0, 20);
        const streets = top20Streets.map(street => street.street);
        const counts = top20Streets.map(street => street.count);

        this.streetBarData = {
            labels: streets,
            datasets: [
                {
                    label: 'Constats',
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1,
                    data: counts,
                },
            ],
        };
    }

    updateInfractionBarData() {
        const infractions = this.infractionsStats.map(inf => inf.infraction);
        const counts = this.infractionsStats.map(inf => inf.count);

        this.infractionBarData = {
            labels: infractions,
            datasets: [
                {
                    label: 'Infractions',
                    backgroundColor: 'rgba(255, 159, 64, 0.2)',
                    borderColor: 'rgba(255, 159, 64, 1)',
                    borderWidth: 1,
                    data: counts,
                },
            ],
        };
    }

    initializeOptions() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue(
            '--text-color-secondary'
        );
        const surfaceBorder =
            documentStyle.getPropertyValue('--surface-border');

        this.chartOptions = this.createChartOptions(
            textColor,
            textColorSecondary,
            surfaceBorder
        );
        this.pieOptions = this.createPieOptions(textColor);
        this.barOptions = this.createBarOptions(
            textColor,
            textColorSecondary,
            surfaceBorder
        );
        this.streetBarOptions = this.createBarOptions(
            textColor,
            textColorSecondary,
            surfaceBorder
        );
        this.infractionBarOptions = this.createBarOptions(
            textColor,
            textColorSecondary,
            surfaceBorder
        );
    }

    createChartOptions(
        textColor: string,
        textColorSecondary: string,
        surfaceBorder: string
    ) {
        return {
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

    createPieOptions(textColor: string) {
        return {
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

    createBarOptions(
        textColor: string,
        textColorSecondary: string,
        surfaceBorder: string
    ) {
        return {
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
        const hue = Math.floor(Math.random() * 360);
        const saturation = 70 + Math.floor(Math.random() * 10);
        const lightness = 85 + Math.floor(Math.random() * 10);
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }
}

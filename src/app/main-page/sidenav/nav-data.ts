import { INavbarData } from './helper';

export const navbarData: INavbarData[] = [
    {
        routeLink: 'dashboard',
        icon: 'fal fa-home',
        label: 'Dashboard',
    },
    {
        routeLink: 'agents',
        icon: 'fal fa-users',
        label: 'Users',
        items: [
            {
                routeLink: 'agents',
                label: 'Level 1.1',
                items: [
                    {
                        routeLink: 'agents',
                        label: 'Level 2.1',
                    },
                    {
                        routeLink: 'agents',
                        label: 'Level 2.2',
                        items: [
                            {
                                routeLink: 'agents',
                                label: 'Level 3.1',
                            },
                            {
                                routeLink: 'agents',
                                label: 'Level 3.2',
                            },
                        ],
                    },
                ],
            },
            {
                routeLink: 'agents',
                label: 'Level 1.2',
            },
        ],
    },

    {
        routeLink: 'statistics',
        icon: 'fal fa-chart-bar',
        label: 'Statistics',
    },
    {
        routeLink: 'constats',
        icon: 'fal fa-file-invoice',
        label: 'Constats',
        items: [
            {
                routeLink: 'constats',
                label: 'Liste constats',
            },
            {
                routeLink: 'constats/create',
                label: 'Create constat',
            },
        ],
    },
    {
        routeLink: 'listing',
        icon: 'fal fa-file',
        label: 'Listing',
        items: [
            {
                routeLink: 'agents',
                label: 'Liste des agents',
            },
            {
                routeLink: 'rues',
                label: 'Liste des rues',
            },
        ],
    },
    {
        routeLink: 'media',
        icon: 'fal fa-camera',
        label: 'Media',
    },
    {
        routeLink: 'messages',
        icon: 'fal fa-message',
        label: 'Messages',
    },
    {
        routeLink: 'settings',
        icon: 'fal fa-cog',
        label: 'Settings',
        expanded: true,
        items: [
            // {
            //     routeLink: 'settings/profile',
            //     label: 'Profile',
            // },
            {
                routeLink: 'agents',
                label: 'Liste des agents',
            },
            {
                routeLink: 'categories',
                label: 'Liste des categories',
            },
            {
                routeLink: 'constats',
                label: 'Liste des constats',
            },
            {
                routeLink: 'dailies',
                label: 'Liste des dailies',
            },
            {
                routeLink: 'habitations',
                label: 'Liste des habitations',
            },
            {
                routeLink: 'horaires',
                label: 'Liste des horaires',
            },
            {
                routeLink: 'infractions',
                label: 'Liste des infractions',
            },
            {
                routeLink: 'missions',
                label: 'Liste des missions',
            },
            {
                routeLink: 'quartiers',
                label: 'Liste des quartiers',
            },
            {
                routeLink: 'rues',
                label: 'Liste des rues',
            },
            {
                routeLink: 'vehicules',
                label: 'Liste des vehicules',
            },
        ],
    },
];

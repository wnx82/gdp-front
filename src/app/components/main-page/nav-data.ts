import { INavbarData } from './sidenav/helper';

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
    },

    {
        routeLink: 'dashboard',
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
        routeLink: 'habitations',
        icon: 'fal fa-camera',
        label: 'Listing Habitations',
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
                routeLink: 'admin/api',
                label: 'Api',
            },
            {
                routeLink: 'admin/agents',
                label: 'Liste des agents',
            },

            {
                routeLink: 'admin/articles',
                label: 'Liste des articles',
            },
            {
                routeLink: 'admin/categories',
                label: 'Liste des categories',
            },
            {
                routeLink: 'admin/constats',
                label: 'Liste des constats',
            },
            {
                routeLink: 'admin/dailies',
                label: 'Liste des dailies',
            },
            {
                routeLink: 'admin/habitations',
                label: 'Liste des habitations',
            },
            {
                routeLink: 'admin/horaires',
                label: 'Liste des horaires',
            },
            {
                routeLink: 'admin/infractions',
                label: 'Liste des infractions',
            },
            {
                routeLink: 'admin/missions',
                label: 'Liste des missions',
            },
            {
                routeLink: 'admin/quartiers',
                label: 'Liste des quartiers',
            },
            {
                routeLink: 'admin/rapports',
                label: 'Liste des rapports',
            },
            {
                routeLink: 'admin/rues',
                label: 'Liste des rues',
            },
            {
                routeLink: 'admin/validations',
                label: 'Liste des validations',
            },
            {
                routeLink: 'admin/vehicules',
                label: 'Liste des vehicules',
            },
            {
                routeLink: '',
                label: '',
            },
        ],
    },
];

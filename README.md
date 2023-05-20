<p align="center"><img src="http://www.peruwelz.be/uploads/page324/86c361ea300e6d3bccbe46573caa688a.jpg" alt="GDP Logo"></p>

<h1 align="center">GDP Portail</h1>

<div align="center">
  <a href="https://github.com/winnux82/habitations-back">
    <img src="https://img.shields.io/github/license/winnux82/nice-front-end-tutorial.svg" alt="LICENSE">
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/Coding-WnX-red.svg?style=flat" alt="Nice Front-End Tutorial">
  </a>
  <a href="[#](https://www.facebook.com/vandermeulen.christophe)">
   <img src="https://img.shields.io/badge/Messenger-%20ContactMe-brightgreen.svg" alt="Chat On facebook">
  </a>
  <a href="https://ekreativ.be">
    <img src="https://img.shields.io/badge/Website-eKreativ.be-%23a696c8.svg" alt="Blog Homepage">
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/Author-winnux82-%23a696c8.svg" alt="Author winnux82">
  </a>
</div>

<div align="center">
  <strong>🌍 Constantly updated ! ☢️ </strong>
</div>

## 📃 Description

☢️ `Frontend pour GDP - Portail` ☢️ 🆙

Application de gestion pour le service GDP de la Ville de Mouscron lié au backend du même nom. Elle permet la gestion de véhicules, des utilisateurs avec JWT pour la sécurité des données, la validation des identifiants pour les différentes routes, l'envoi de mails pour la validation des surveillances, des daily et des rapports journaliers.

Une recherche par immatriculation, localité et rue pour les constats ainsi qu'un tri des rues par localité, code postal, nom et quartier.

Elle permet également la gestion des agents et des utilisateurs, des catégories pour les notes de rapports, des constats sur le terrain, des tâches journalières pour les équipes d'agents avec envoi de mail, des surveillances habitations, des horaires d'agents, des infractions les plus verbalisées, des missions journalières ou occasionnelles, des quartiers avec missions spécifiques, des rapports journaliers, des rues et des validations pour chaque surveillance d'habitation.

Elle me servira également comme TFE & déploiement pour mon stage de fin d'étude d'où sa complexité et le temps consacré!
Le front est réalisé avec Angular et le déploiement sur un serveur du service informatique de la Ville de Mouscron.

| [GDP Back](https://github.com/winnux82/gdp-back) | [GDP Front](https://github.com/winnux82/gdp-front) | GDP Android Application |

## 📥 Installation

Run `npm start` or `ng serve` for a dev server. Navigate to [http://localhost:4200/](http://localhost:4200/)

## ✏️ Components

-   Agents
-   Categories
-   Missions
-   Rues

## 🔥 Features

-   Medias
-   Statistics

## 🐿️ Consignes : Projet de développement SGBD

Pour ce projet, il vous est demandé de développer une **application Angular** qui va interagir avec soit des données stockées dans le **LocalStorage** du navigateur, soit **l’API** créée dans le module de **Projet de développement SGBD**

Le projet devra être réaliser seul et respecter au moins les contraintes suivantes :

-   Création d’au moins 2 formulaires gérés en **Reactive forms**
-   Création d’au moins 1 component utile à l’application (qui n’est pas une page)
-   Création d’au moins 2 services permettant d’interagir avec les données
-   Création d’au moins 1 pipe utile à l’application
-   Utilisation du routing **Angular**
-   Utilisation d’une librairie externe, utile à l’application

Le projet devra être versionné sous **Github** en mode privé et accessible par le chargé de cours. De plus, il est demandé de pousser vos changements en ligne à chaque fois que vous travaillerez sur le projet.

Le sujet est libre, mais devra être validé au préalable par le chargé de cours (via email pour garder une trace).

**Attention** : Ne commencez pas le développement sans validation au préalable et n’utilisez pas des librairies externes non validées par le chargé de cours.

L’application devra être remise au plus tard le lundi 13 juin par email à l’adresse suivante : **[samuel.lassoie@gmail.com](mailto:samuel.lassoie@gmail.com)**.

Une date de présentation de l’application reste à définir et comptera pour des points

## 🐉 Utilz!

-   [**Git Emojis**](https://gitmoji.dev/)
-   [**emojidb**](https://emojidb.org/facebook-emojis?user_typed_query=1&utm_source=user_search)
-   [**Listing Emojis**](emoji.md)
-   [**csv2json**](https://csvjson.com/csv2json)
-   [**Learn JWT**](https://medium.com/front-end-weekly/learn-using-jwt-with-passport-authentication-9761539c4314)
-   [**Message Service**](https://stackblitz.com/edit/angular-8-communicating-between-components?file=app%2F_services%2Fmessage.service.ts)
-   [**Component Interaction**](https://angular.io/guide/component-interaction)
-   [**Angular Bearer Token with HttpClient**](https://stackblitz.com/edit/angular-bearer-token?file=src%2Fapp%2Fapp.component.ts)
-   [**Angular + Reactive Forms - Cross Field Validation Example**](https://stackblitz.com/edit/angular-reactive-forms-cross-field-validation-example?file=src%2Fapp%2Fapp.component.html)
-   [**Angular 15 Auth Boilerplate - Sign Up with Verification, Login and Forgot Password (forked)**](https://stackblitz.com/edit/angular-15-signup-verification-boilerplate-g9nquv)

## ✍️ Notes!

-   à enlever dans le fichier ./helpers/sendMail.js si pas docker car dès que je passe par docker j'ai une erreur
    <code>
    tls: {
    rejectUnauthorized: false,
    },
    </code>

-   protéger tous les dossiers autres que users grace à JWT une fois la phase déploiement lancée
-

## ✍️ TO DO LIST

-   Annexes fichiers
-   Bug Annexe create & update
-   Missions Quartier

## ✍️ TO DO LIST LATER

-   Statistiques
-   Login & pass
-

## 🐛 Bugs!

-   ConfirmationService ne fonctionne pas
-   closable
-   bug dans les recherches
-

## 🎨 Front-End Tutorial

-   [Angular](#)
-   [Tuto Get Data From server ✨](https://angular.io/tutorial/tour-of-heroes/toh-pt6)

## 👽 Back-End Tutorial

-   [Nodejs](https://github.com/geo6/geocoder-php-spw-provider)
-   [JWT](https://medium.com/front-end-weekly/learn-using-jwt-with-passport-authentication-9761539c4314)

## 🎣 Front-Back-End Tools

-   [csv2json](https://csvjson.com/csv2json)

## 🔨 Other Wizards List

-   [Docker 👏](/Docker.md)
-   [Shields.io 👏](https://shields.io/)
-   [Markdown Badges 👏](https://github.com/Ileriayo/markdown-badges)
-   [Badge for github 👏](https://dev.to/envoy_/150-badges-for-github-pnk)
-   [Codes de réponses HTTP 👏](https://developer.mozilla.org/fr/docs/Web/HTTP/Status)

## Liens connexes

[![eKreativ](https://img.shields.io/badge/web-eKreativ.be-916FF?style=for-the-badge&logo=Node.js&logoColor=white&labelColor=101010)](https://eKreativ.be)

[![eafcm](https://img.shields.io/badge/web-eafcm.be-916FF?style=for-the-badge&logo=Node.js&logoColor=white&labelColor=101010)](https://eafcm.be)

[![MongoDb](https://img.shields.io/badge/MongoDb-6.0.4-4EA94B?style=for-the-badge&logo=MongoDb&logoColor=white&labelColor=101010)]()

[![NodeJs](https://img.shields.io/badge/NodeJS-18.13.0-9146FF?style=for-the-badge&logo=Node.js&logoColor=white&labelColor=101010)]()

[![Discord](https://img.shields.io/badge/Discord-Join_Us-5865F2?style=for-the-badge&logo=discord&logoColor=white&labelColor=101010)](https://discord.gg/xfz3WMrt)

[![Facebook](https://img.shields.io/badge/Facebook-Vandermeulen.christophe-1877F2?style=for-the-badge&logo=Facebook&logoColor=white&labelColor=101010)](https://www.facebook.com/vandermeulen.christophe)

[![Linkdin](https://img.shields.io/badge/LinkedIn-vandermeulen_christophe-0077B5?style=for-the-badge&logo=LinkedIn&logoColor=white&labelColor=101010)](https://www.linkedin.com/in/vandermeulen-christophe/)

## 👏 Congratulations

-   🈺 [Constantin Maes](https://www.linkedin.com/in/constantinmaes/)
-   🈺 [Samuel Lassoie](https://www.linkedin.com/in/samuel-lassoie-88769b91/)

| :-: | :-: | :-: | :-: |

| 😉 Vandermeulen Christophe alias WnX 📎🏴‍☠️ |

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2023-present,

[winnux82](https://github.com/winnux82)

[![Web](https://img.shields.io/badge/GitHub-winnux82-14a1f0?style=for-the-badge&logo=github&logoColor=white&labelColor=101010)](https://github.com/winnux82)

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.4.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Agent } from './agent';
import { MessageService } from '../../message.service';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AgentService {
    title = 'Liste des agents';
    private agentsUrl = `${environment.apiUrl}/agents`; // Utilisation de l'URL de l'environnement

    httpOptions = {
        headers: new HttpHeaders()
            .set('Content-Type', 'application/json; charset=utf-8')
            .set('Api-Key', 'xxx'),
    };

    constructor(
        private http: HttpClient,
        private messageService: MessageService
    ) {}

    /** GET agents from the server */
    getAgents(): Observable<Agent[]> {
        return this.http.get<Agent[]>(this.agentsUrl).pipe(
            tap(_ => this.log('fetched agents')),
            catchError(this.handleError<Agent[]>('getAgents', []))
        );
    }
    getAgentById(agentId: string): Observable<Agent | undefined> {
        return this.http
            .get<Agent>(`this.agentsUrl/${agentId}`)
            .pipe
            // tap((response) => this.log(response)),
            // catchError((error) => this.handleError(error, undefined))
            ();
    }

    /** GET agent by id. Return `undefined` when id not found */
    getAgentNo404<Data>(id: number): Observable<Agent> {
        const url = `${this.agentsUrl}/?id=${id}`;
        // await this.http.get().toPromise()
        return this.http.get<Agent[]>(url).pipe(
            map(agents => agents[0]), // returns a {0|1} element array
            tap(h => {
                const outcome = h ? 'fetched' : 'did not find';
                this.log(`${outcome} agent id=${id}`);
            }),
            catchError(this.handleError<Agent>(`getAgent id=${id}`))
        );
    }

    /** GET agent by id. Will 404 if id not found */
    getAgent(id: number): Observable<Agent> {
        const url = `${this.agentsUrl}/${id}`;
        return this.http.get<Agent>(url).pipe(
            tap(_ => this.log(`fetched agent id=${id}`)),
            catchError(this.handleError<Agent>(`getAgent id=${id}`))
        );
    }

    /* GET agents whose name contains search term */
    searchAgent(term: string): Observable<Agent[]> {
        if (!term.trim()) {
            // if not search term, return empty agent array.
            return of([]);
        }
        return this.http.get<Agent[]>(`${this.agentsUrl}/?name=${term}`).pipe(
            tap(x =>
                x.length
                    ? this.log(`found agents matching "${term}"`)
                    : this.log(`no agents matching "${term}"`)
            ),
            catchError(this.handleError<Agent[]>('searchAgents', []))
        );
    }

    //////// Save methods //////////

    /** POST: add a new agent to the server */
    addAgent(agent: Agent): Observable<Agent> {
        return this.http
            .post<Agent>(this.agentsUrl, agent, this.httpOptions)
            .pipe(
                tap((newAgent: Agent) =>
                    this.log(`added agent w/ id=${newAgent._id}`)
                ),
                catchError(this.handleError<Agent>('addAgent'))
            );
    }

    /** DELETE: delete the agent from the server */
    deleteAgent(agent: any): Observable<any> {
        const _id =
            typeof agent._id === 'object' ? agent._id.toString() : agent._id;

        return this.http.delete(`${this.agentsUrl}/${_id}`); // Utilisation de this.agentsUrl au lieu de baseUrl
    }

    /** PUT: update the agent on the server */
    updateAgent(agent: Agent): Observable<any> {
        return this.http.put(this.agentsUrl, agent, this.httpOptions).pipe(
            tap(_ => this.log(`updated agent id=${agent._id}`)),
            catchError(this.handleError<any>('updateAgent'))
        );
    }

    /**
     * Handle Http operation that failed.
     * Let the app continue.
     *
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            // Log error to console
            console.error(error);
            // Log the error message
            this.log(`${operation} failed: ${error.message}`);
            // Return an empty result to keep the app running
            return of(result as T);
        };
    }

    /** Log a AgentService message with the MessageService */
    private log(message: string) {
        this.messageService.add(`AgentService: ${message}`);
    }
}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/

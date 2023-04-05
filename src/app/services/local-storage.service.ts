import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  // Stocke une valeur dans le LocalStorage
  setItem(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // Récupère une valeur depuis le LocalStorage
  getItem(key: string): any {
    const value = localStorage.getItem(key);
    if (value) {
      return JSON.parse(value);
    }
    return null;
  }

  // Supprime une valeur du LocalStorage
  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  // Efface complètement le LocalStorage
  clear(): void {
    localStorage.clear();
  }

}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EtatService {

  private baseURL = "http://localhost:8090/api/etat";

  constructor(private httpClient : HttpClient) { } 

  getEtatsList()
  {
    return this.httpClient.get(`${this.baseURL}/get`); 
  }
}

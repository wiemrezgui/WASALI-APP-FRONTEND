import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HistoriqueEtatService {

  private baseURL = "http://localhost:8090/api/hist";

  constructor(private httpClient : HttpClient) { } 

  franchirEtape(fData : FormData) 
  {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${fData.get("token")}`);
    return this.httpClient.post(`${this.baseURL}/franchirEtapeLiv`, fData, { headers });
  }

  franchirAccepter(fData : FormData) 
  {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${fData.get("token")}`);
    return this.httpClient.post(`${this.baseURL}/franchirAccepterLiv`, fData, { headers });
  }

  findHistEtats(token : string) 
  {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.post(`${this.baseURL}/historique`, token, { headers });
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserIntervalleService {

  private baseURL = "http://localhost:8090/api/userIntervalle";

  constructor(private httpClient : HttpClient) { } 

  findLivreurs(fData : FormData, token : string) 
  {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.post(`${this.baseURL}/livreur`, fData, { headers }); 
  }

  findLivreursDESC(fData : FormData, token : string) 
  {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.post(`${this.baseURL}/livreurDESC`, fData, { headers });  
  }

}

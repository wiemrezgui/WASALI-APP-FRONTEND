import { Injectable } from '@angular/core';
import { Gouvernorat } from '../models/gouvernorat';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GouvernoratService {

  private baseURL = "http://localhost:8090/api/gouv";
  
  constructor(private httpClient : HttpClient) { } 

  getGouvsList():Observable<Gouvernorat[]> 
  {
    return this.httpClient.get<Gouvernorat[]>(`${this.baseURL}/gv`);  
  }

  insertGouv(fData : FormData) 
  {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${fData.get("token")}`);
    return this.httpClient.post(`${this.baseURL}/insertGv`, fData, { headers });
  }

  deleteGouv(fData : FormData) 
  {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${fData.get("token")}`);
    return this.httpClient.post(`${this.baseURL}/deleteGv`, fData, { headers });
  }


}

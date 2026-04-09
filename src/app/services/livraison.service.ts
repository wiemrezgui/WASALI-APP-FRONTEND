import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LivraisonService {

  private baseURL = "http://localhost:8090/api/livraison";

  constructor(private httpClient : HttpClient) { } 

  assignerLivraison(map : { [key: string]: any }, token : string) 
  {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.post(`${this.baseURL}/assigner`, map, { headers }); 
  }

  findAllLivraisons(token : string) 
  {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.get(`${this.baseURL}/allLivraisons`, { headers });
  }

  findLivraisonsUser(token : string) 
  {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.post(`${this.baseURL}/livraisonsUser`, token, { headers });
  }


  deleteLivraison(token : string, map : { [key: string]: any }) 
  {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.post(`${this.baseURL}/deleteLiv`, map, { headers });
  }

  findEtatLivraison(fData : FormData, token : string){
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.post(`${this.baseURL}/etatLiv`, fData, { headers });
  }

  updateLiv(token : string, fData : FormData) 
  {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.post(`${this.baseURL}/updateLiv`, fData, { headers }); 
  }

  insertLiv(token : string, fData : FormData) 
  {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.post(`${this.baseURL}/insertLiv`, fData, { headers }); 
  }
  


}

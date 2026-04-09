import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapsService {

  private apiURLPhoton = 'https://photon.komoot.io/api';
  
  constructor(private http: HttpClient) { } 


  searchDest(query : string) : Observable<any>{

    const params = {
      q: query,
      bbox : '11.5767,30.235,-9.6697,37.5443',
    };
    const headers = new HttpHeaders().set('accept-language', 'fr');
    return this.http.get<any>(this.apiURLPhoton, { params, headers });
  }

  getGouv(lat : number, lng : number)
  {
    const params = {
      lat: lat,
      lon : lng,
      lang : 'fr'
    };
    return this.http.get<any>("https://photon.komoot.io/reverse", { params }); 
  }
}

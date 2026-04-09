import { Injectable } from '@angular/core';
import { TypeVehicule } from '../models/type-vehicule';
import { Observable } from 'rxjs'; 
import { HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TypeVehiculeService {

  private baseURL = "http://localhost:8090/api/typeVehicule";
  
  constructor(private httpClient : HttpClient) { } 

  getTypesList():Observable<TypeVehicule[]> 
  {
    return this.httpClient.get<TypeVehicule[]>(`${this.baseURL}/type`);  
  }


}

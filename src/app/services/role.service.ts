import { Injectable } from '@angular/core'; 
import { Role } from '../models/role'; 
import { HttpClient } from '@angular/common/http' 
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService { 

  private baseURL = "http://localhost:8090/api/role";

  constructor(private httpClient : HttpClient) { } 

  getRolesList():Observable<Role[]> 
  {
    return this.httpClient.get<Role[]>(`${this.baseURL}/rl`); 
  }

}

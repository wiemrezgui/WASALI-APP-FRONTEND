import { Injectable } from '@angular/core'; 
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserPrivilegeService {

  private baseURL = "http://localhost:8090/api/userPrivilege"; 

  constructor(private httpClient : HttpClient) { }  

  findPrivileges(token : string) 
  {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.post(`${this.baseURL}/userPrivs`, token, { headers });
  }

  checkPrivilegeLivr(id : number, token : string)
  {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.post(`${this.baseURL}/checkPrivilege`, id, { headers });
  }

}

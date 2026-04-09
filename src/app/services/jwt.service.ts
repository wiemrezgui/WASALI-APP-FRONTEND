import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  constructor(private httpClient : HttpClient) { }
  
  private baseURL = "http://localhost:8090/api/jwt";
  
  checkToken(token : string)
  {
    return this.httpClient.post(`${this.baseURL}/check`, token); 
  }

}

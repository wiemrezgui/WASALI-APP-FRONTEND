import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
 private baseURL = "http://localhost:8090/api/contact";

  constructor(private httpClient : HttpClient) { } 

  submitContactForm(fData: FormData)
  {
    return this.httpClient.post(`${this.baseURL}/submit`, fData);  }
}

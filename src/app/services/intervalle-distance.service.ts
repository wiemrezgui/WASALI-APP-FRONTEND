import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IntervalleDistance } from '../models/intervalle-distance';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IntervalleDistanceService {

  constructor(private httpClient : HttpClient) { }
  
  private baseURL = "http://localhost:8090/api/intervalleDistance"; 
  
  getIntervallesDistanceList():Observable<IntervalleDistance[]> 
  {
    return this.httpClient.get<IntervalleDistance[]>(`${this.baseURL}/int`); 
  }



  
}

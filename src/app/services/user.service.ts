import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core'; 


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseURL = "http://localhost:8090/api/user"; 
  private baseURLToken = "http://localhost:8090/api/token"; 
  private baseURLSession = "http://localhost:8090/api/session";
  private baseURLAuth = "http://localhost:8090/api/auth";

  constructor(private httpClient : HttpClient) { }

  createClient(fData : FormData) 
  {
    return this.httpClient.post(`${this.baseURL}/createClient`, fData); 
  }
  
  createLivreur(list : Map<string, object>[]) 
  {
    const newList = list.map((item) => this.convertMapToObj(item));
    return this.httpClient.post(`${this.baseURL}/createLivreur`, newList);   
  }

  private convertMapToObj(map: Map<string, object>) {
    const obj: { [key: string]: any } = {};   
    map.forEach((value, key) => {
       obj[key] = value;  
    }); 
    return obj;  
  }

  checkEmail(fData : FormData) 
  {
    return this.httpClient.post(`${this.baseURL}/email`, fData); 
  }

  checkEmailAndPass(fData : FormData) 
  {
    return this.httpClient.post(`${this.baseURLAuth}/login`, fData); 
  } 

  sendResetMail(email : String)  
  {
    return this.httpClient.post(`${this.baseURLToken}/save`, email); 
  }

  verifyToken(token : String) 
  {
    return this.httpClient.post(`${this.baseURLToken}/verify`, token);  
  }

  tokenEmail(token : string | null) 
  {
    return this.httpClient.post(`${this.baseURLToken}/email`, token);  
  }

  updateUser(fData : FormData) 
  {
    return this.httpClient.put<Map<String, Object>>(`${this.baseURL}/updatePass`, fData); 
  }

  createSession(fData : FormData)
  {    
    return this.httpClient.post(`${this.baseURLSession}/create`, fData); 
  } 

  checkSession(sessionId : string | null) 
  {
    return this.httpClient.post(`${this.baseURLSession}/check`, sessionId); 
  }


  findAdresse(token : string) 
  {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.post(`${this.baseURL}/adresse`, token, { headers });
  }

  getToken(fData : FormData) 
  {
    return this.httpClient.post(`${this.baseURLAuth}/generate`, fData);
  }


  findIdUser(token : string) 
  {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.post(`${this.baseURL}/id`, token, { headers });
  }

  posLivreur(token : string, fData : FormData)
  {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.post(`${this.baseURL}/posLivreur`, fData, { headers });
  }

  tkPosLivreur(token : string)
  {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.post(`${this.baseURL}/tkPosLivreur`, token, { headers });
  }

  locLivreur(idLivreur : number, token : string)
  {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.post(`${this.baseURL}/locLivreur`, idLivreur, { headers });
  }

  findClients(token : string)  
  {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.post(`${this.baseURL}/clients`,token, { headers });
  }

  getPhoto(token : string)  
  {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.post(`${this.baseURL}/photo`, token, { headers });
  }

  findDms(token : string) 
  {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.post(`${this.baseURL}/demandesIns`, token, { headers });
  }

  validateDm(fData : FormData) 
  {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${fData.get("token")}`);
    return this.httpClient.post(`${this.baseURL}/validateDm`, fData, { headers });
  }

  rejectDm(fData : FormData) 
  {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${fData.get("token")}`);
    return this.httpClient.post(`${this.baseURL}/rejectDm`, fData, { headers });
  }

  findLivreurs(token : string) 
  {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.post(`${this.baseURL}/fdLivreurs`, token, { headers });
  }

  deleteLivr(fData : FormData) 
  {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${fData.get("token")}`);
    return this.httpClient.post(`${this.baseURL}/deleteLiv`, fData, { headers });
  }

  deleteCl(fData : FormData) 
  {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${fData.get("token")}`);
    return this.httpClient.post(`${this.baseURL}/deleteCl`, fData, { headers });
  }

  addAbonnement(fData : FormData) 
  {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${fData.get("token")}`);
    return this.httpClient.post(`${this.baseURL}/addAbnm`, fData, { headers });
  }

  deleteAbonnement(fData : FormData) 
  {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${fData.get("token")}`);
    return this.httpClient.post(`${this.baseURL}/deleteAbnm`, fData, { headers });
  }

  deletePrivilege(fData : FormData) 
  {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${fData.get("token")}`);
    return this.httpClient.post(`${this.baseURL}/deletePriv`, fData, { headers });
  }

  deletePrivilegeCl(fData : FormData) 
  {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${fData.get("token")}`);
    return this.httpClient.post(`${this.baseURL}/deletePrivCl`, fData, { headers });
  }

  ajouterPrivilege(fData : FormData) 
  {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${fData.get("token")}`);
    return this.httpClient.post(`${this.baseURL}/ajouterPriv`, fData, { headers });
  }

  ajouterPrivilegeCl(fData : FormData) 
  {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${fData.get("token")}`);
    return this.httpClient.post(`${this.baseURL}/ajouterPrivCl`, fData, { headers });
  }

  ajouterTarifs(fData : FormData) 
  {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${fData.get("token")}`);
    return this.httpClient.post(`${this.baseURL}/intsPrv`, fData, { headers });
  }

  getAbonnements(fData : FormData) 
  {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${fData.get("token")}`);
    return this.httpClient.post(`${this.baseURL}/getAbnms`, fData, { headers });
  }

  getPrs(fData : FormData) 
  {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${fData.get("token")}`);
    return this.httpClient.post(`${this.baseURL}/getPrs`, fData, { headers });
  }

  getPrsCl(fData : FormData) 
  {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${fData.get("token")}`);
    return this.httpClient.post(`${this.baseURL}/getPrsCl`, fData, { headers });
  }

  getPrsAdd(fData : FormData) 
  {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${fData.get("token")}`);
    return this.httpClient.post(`${this.baseURL}/getPrsAdd`, fData, { headers });
  }

  getPrsClAdd(fData : FormData) 
  {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${fData.get("token")}`);
    return this.httpClient.post(`${this.baseURL}/getPrsClAdd`, fData, { headers });
  }

  addLivreur(fData : FormData) 
  {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${fData.get("token")}`);
    return this.httpClient.post(`${this.baseURL}/ajouterLiv`, fData, {headers});   
  }

  addAdresse(fData : FormData) 
  {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${fData.get("token")}`);
    return this.httpClient.post(`${this.baseURL}/ajouterAdresse`, fData, {headers});   
  }

  modifierLivreur(fData : FormData) 
  {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${fData.get("token")}`);
    return this.httpClient.post(`${this.baseURL}/modifierLiv`, fData, {headers});   
  }

  modifierClient(fData : FormData) 
  {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${fData.get("token")}`);
    return this.httpClient.post(`${this.baseURL}/modifierCl`, fData, {headers});   
  }

  fdClients(token : string) 
  {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.post(`${this.baseURL}/fdClients`, token, {headers});   
  }

  ajouterCl(fData : FormData) 
  {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${fData.get("token")}`);
    return this.httpClient.post(`${this.baseURL}/ajouterCl`, fData, {headers});   
  }

  addCIN(fData : FormData) 
  {
    return this.httpClient.post(`${this.baseURL}/cin`, fData);   
  }

  findAbs(fData : FormData) 
  {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${fData.get("token")}`);
    return this.httpClient.post(`${this.baseURL}/abns`, fData, {headers});
  }






  

  






  

  








}

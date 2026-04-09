import { NgForOf, NgIf, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, HostListener, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Subject, debounceTime } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { TypeVehicule } from '../../models/type-vehicule';
import { Gouvernorat } from '../../models/gouvernorat';
import { IntervalleDistance } from '../../models/intervalle-distance';
import { MsgSessionnService } from '../../services/msg-sessionn.service';
import { MsgSessionService } from '../../services/msg-session.service';
import { TypeVehiculeService } from '../../services/type-vehicule.service';
import { MapsService } from '../../services/maps.service';
import { UserService } from '../../services/user.service';
import { GouvernoratService } from '../../services/gouvernorat.service';
import { IntervalleDistanceService } from '../../services/intervalle-distance.service';
import { UserIntervalleService } from '../../services/user-intervalle.service';
import { LivraisonService } from '../../services/livraison.service';
import { UserPrivilegeService } from '../../services/user-privilege.service';
@Component({
  selector: 'app-demande-livraison',
  standalone: true,
  imports: [FormsModule, NgIf, NgForOf],
  templateUrl: './demande-livraison.component.html',
  styleUrl: './demande-livraison.component.css'
})
export class DemandeLivraisonComponent implements OnInit { 

  @ViewChild('arr') arr! : ElementRef;
  @ViewChild('pp') pp! : ElementRef;
  @ViewChild('p') p! : ElementRef;
  
  types : TypeVehicule[] = []; 
  idVehicule! : number; 
  sgs : { title : string, lat : number, lng : number, codeP : number, gouv : string, region : string, nom : string}[] = [];       
  sgss : { title : string, lat : number, lng : number, codeP : number, gouv : string, region : string, nom : string}[] = [];       
  ad : string = ""; 
  adr : string = ""; 
  inputSubject: Subject<string> = new Subject<string>();
  inputSubjectt: Subject<string> = new Subject<string>();
  processing = false;         
  showsgs = false;  
  showsgss = false;  
  msgF = false;  
  msgF_ad = false;  
  msgF_t = false;  
  msgF_d = false;  
  msgF_l = false;   
  msgF_pl = false;  
  msgF_g = false;  
  msgF_gv = false;   
  msgF_nv = false;  
  msgF_err = false;  
  msgF_gd = false;  
  msgF_ac = false;  
  msgF_er = false;      
  msgF_e = false;      
  res = false;
  msgF_S = false;
  gouvs : Gouvernorat [] = [];  
  ints : IntervalleDistance[] = []; 
  livreurs! :any;    
  distance! : number;
  dsg! : string; 
  codeP! : string; 
  rg! : string; 
  gouv! : string;  
  dsgg! : string; 
  codePP! : string; 
  rgg! : string; 
  adress! : any; 
  add!: string;  
  id! : number; 
  idLiv! : number; 

  constructor(private titleService : Title, public msgSessionn : MsgSessionnService, public msgSession : MsgSessionService, private typeService : TypeVehiculeService, private mapsService : MapsService, private userService : UserService, private route : ActivatedRoute, private router : Router, @Inject(PLATFORM_ID) private platformId: Object, private gouvService : GouvernoratService, private intService : IntervalleDistanceService, private userIntService : UserIntervalleService, private livraisonService : LivraisonService, private userPrivService : UserPrivilegeService){ 
    this.inputSubject.pipe(debounceTime(50)).subscribe((value: string) => {
      this.searchAd(); 
    });

   
    this.inputSubjectt.pipe(debounceTime(50)).subscribe((value: string) => {
      this.searchAdd(); 
    });
  }

  @HostListener('document:click', ['$event']) 
  onClick(event: Event) { 
    this.showsgs = false; 
    this.showsgss = false;  
  }

  
  


  
  ngOnInit(): void {

    this.titleService.setTitle('WASSALI | Demande Livraison');

    
    if (isPlatformBrowser(this.platformId)) 
    {
      this.userService.findIdUser((window.localStorage.getItem("fPart") as string) + (window.localStorage.getItem("sPart") as string)).subscribe(response => {
        this.id = Number(response); 
      }, 
      error=> {
          setTimeout(() => {
          this.msgF_e = true; 
          }, 10);  
          setTimeout(() => {
          this.msgF_e = false; 
          }, 6000);
      }
    ); 
      this.userPrivService.findPrivileges((window.localStorage.getItem("fPart") as string) + (window.localStorage.getItem("sPart") as string)).subscribe(response => {
        const map = new Map(Object.entries(response)); 
        const privileges : any[] = Array.from(map.get("reponse"));    
        if (privileges.includes("demande et suivi")) 
        {
          window.localStorage.setItem("lat", ""); 
          window.localStorage.setItem("lng", "");

          this.typeService.getTypesList().subscribe(response => {
            this.types = response; 
          },
          error => {
            setTimeout(() => {
              this.msgF_er = true; 
              }, 10);  
              setTimeout(() => {
              this.msgF_er = false; 
              }, 6000);
          } 
        ); 
        } 
        else 
          this.navigateToLivraisons(); 
      }, 
      error => {
        this.msgSession.msg = "Notre serveur rencontre actuellement un problème de traitement des requêtes mais nous nous sommes engagés pour le résoudre. Veuillez réessayer plus tard."; 
        this.router.navigate(['/connexion']);
      }
    );     
    }   
  
      
  }

  handleInp(event : any){
    this.inputSubject.next("");
  }

  handleInpp(event : any){
    this.inputSubjectt.next("");
  }

  



  
  searchAd() { 
    this.showsgs = false;             
    const arabicRegex: RegExp = /[\u0600-\u06FF]/;  
    if (this.ad!="")
    {
      this.mapsService.searchDest(this.ad).subscribe(result => { 
        if (result.features != undefined &&  result.features.length != 0) 
        { 
          this.sgs = [];
          this.gouvService.getGouvsList().subscribe(response => {
            this.gouvs = response; 
            result.features.forEach((itm: any) => { 

              if (itm.properties.name != undefined && itm.properties.countrycode == 'TN' && itm.properties.postcode != undefined && (itm.properties.district != undefined && !arabicRegex.test(itm.properties.district) || itm.properties.county != undefined && !arabicRegex.test(itm.properties.county)) && itm.properties.state != undefined  && !arabicRegex.test(itm.properties.state) && ((itm.properties.state as string).split(' ').length == 3 && this.gouvs.some(item => item.gouv == (itm.properties.state as string).split(' ')[1] + ' ' + (itm.properties.state as string).split(' ')[2]) || this.gouvs.some(item => item.gouv == (itm.properties.state as string).split(' ')[1])) && !this.sgs.some(it => it.nom == itm.properties.name))
              { 
                 if (itm.properties.district != undefined && itm.properties.county != undefined)
                   this.sgs.push({ title: itm.properties.name + ',' + itm.properties.county + ' ' + itm.properties.district + ',' + itm.properties.postcode + "," + itm.properties.state + ',Tunisie', lat: itm.geometry.coordinates[1], lng: itm.geometry.coordinates[0] , codeP : itm.properties.postcode, gouv : (itm.properties.state as string).split(' ')[1], region : itm.properties.county + ' ' + itm.properties.district, nom : itm.properties.name}); 
                 else if (itm.properties.district != undefined) 
                   this.sgs.push({ title: itm.properties.name + ',' + itm.properties.district + ',' + itm.properties.postcode + "," + itm.properties.state + ',Tunisie', lat: itm.geometry.coordinates[1], lng: itm.geometry.coordinates[0] , codeP : itm.properties.postcode, gouv : (itm.properties.state as string).split(' ')[1], region : itm.properties.district, nom : itm.properties.name}); 
                 else 
                   this.sgs.push({ title: itm.properties.name + ',' + itm.properties.county + ',' + itm.properties.postcode + "," + itm.properties.state + ',Tunisie', lat: itm.geometry.coordinates[1], lng: itm.geometry.coordinates[0] , codeP : itm.properties.postcode, gouv : (itm.properties.state as string).split(' ')[1], region : itm.properties.county, nom : itm.properties.name}); 
              }
             });      
             if (this.sgs.length > 0) 
               this.showsgs = true;
          });         
         
        }

      }); 
        
  
  
    }
  }

  searchAdd() { 
    this.showsgss = false;              
    const arabicRegex: RegExp = /[\u0600-\u06FF]/;  

     
    if (this.adr!="")
    {
      this.mapsService.searchDest(this.adr).subscribe(result => { 
        if (result.features != undefined &&  result.features.length != 0) 
        { 
          this.sgss = [];
          this.gouvService.getGouvsList().subscribe(response => {
            this.gouvs = response; 
          });   
          result.features.forEach((itm: any) => {
           if (itm.properties.name != undefined && itm.properties.countrycode == 'TN' && itm.properties.postcode != undefined && (itm.properties.district != undefined && !arabicRegex.test(itm.properties.district) || itm.properties.county != undefined && !arabicRegex.test(itm.properties.county)) && itm.properties.state != undefined  && !arabicRegex.test(itm.properties.state) && !this.sgss.some(it => it.nom == itm.properties.name) && ((itm.properties.state as string).split(' ').length == 3 && this.gouvs.some(item => item.gouv == (itm.properties.state as string).split(' ')[1] + ' ' + (itm.properties.state as string).split(' ')[2]) || this.gouvs.some(item => item.gouv == (itm.properties.state as string).split(' ')[1])))
           { 
              if (itm.properties.district != undefined && itm.properties.county != undefined)
                this.sgss.push({ title: itm.properties.name + ',' + itm.properties.county + ' ' + itm.properties.district + ',' + itm.properties.postcode + "," + itm.properties.state +  ',Tunisie', lat: itm.geometry.coordinates[1], lng: itm.geometry.coordinates[0] , codeP : itm.properties.postcode, gouv : (itm.properties.state as string).split(' ')[1], region : itm.properties.county + ' ' + itm.properties.district, nom : itm.properties.name}); 
              else if (itm.properties.district != undefined) 
                this.sgss.push({ title: itm.properties.name + ',' + itm.properties.district + ',' + itm.properties.postcode + "," + itm.properties.state + ',Tunisie', lat: itm.geometry.coordinates[1], lng: itm.geometry.coordinates[0] , codeP : itm.properties.postcode, gouv : (itm.properties.state as string).split(' ')[1], region : itm.properties.district, nom : itm.properties.name}); 
              else 
                this.sgss.push({ title: itm.properties.name + ',' + itm.properties.county + ',' + itm.properties.postcode + "," + itm.properties.state + ',Tunisie', lat: itm.geometry.coordinates[1], lng: itm.geometry.coordinates[0] , codeP : itm.properties.postcode, gouv : (itm.properties.state as string).split(' ')[1], region : itm.properties.county, nom : itm.properties.name}); 
           }
          });  
          if (this.sgss.length > 0) 
            this.showsgss = true;
        }

      }); 
        
  
  
    }
  } 
 
  display(event : Event) 
  { 
     if (this.sgs.length != 0 && this.ad != "" && this.sgs.some(itm => itm.title.toUpperCase().includes(this.ad.toUpperCase())))
      this.showsgs = true; 
     event.stopPropagation(); 
  }

  displayy(event : Event) 
  { 
    if (this.sgss.length != 0 && this.adr != "" && this.sgss.some(itm => itm.title.toUpperCase().includes(this.adr.toUpperCase())))
      this.showsgss = true;
    event.stopPropagation(); 
  } 



  selectAd(address: any) { 
    this.showsgs = false;     
    this.ad = address.title;              
  }

  selectAdd(address: any) { 
    this.showsgss = false;  
    this.adr = address.title; 
    this.dsg = address.nom;    
    this.gouv = address.gouv; 
    this.rg = address.region; 
    this.codeP = address.codeP; 
    this.pp.nativeElement.style.display = 'none'; 
    this.pp.nativeElement.style.opacity = '0'; 
    window.localStorage.setItem("lat", address.lat);  
    window.localStorage.setItem("lng", address.lng);  
  }

  onSubmit() 
  { 
      this.processing = true; 
      if (this.ad == "" || this.ad == undefined) 
      {
              this.res = false; 
              setTimeout(() => {
              this.processing=false; 
              }, 3000);
              setTimeout(() => {
                this.msgF=true; 
              }, 2000);
              setTimeout(() => {
              this.msgF=false; 
              }, 6000);
      }
      else 
      {
        if (this.sgs.length > 0)  
        { 
          const adexistsInArr = this.sgs.some(item =>
             this.ad == item.title
          ); 
          if (adexistsInArr) 
          {
            if (this.idVehicule == undefined) 
            {
                this.res = false; 
                setTimeout(() => {
                this.processing=false; 
                }, 3000);
                setTimeout(() => {
                  this.msgF_t=true; 
                }, 2000);
                setTimeout(() => {
                this.msgF_t=false; 
                }, 6000); 
            }
            else 
            {
              if (window.localStorage.getItem("lat") == "")
              {
                this.userService.findAdresse((window.localStorage.getItem("fPart") as string) + (window.localStorage.getItem("sPart") as string)).subscribe(response => {
                    const map = new Map(Object.entries(response));  
                    if (map.get("reponse") == "privilege") 
                      window.location.reload(); 
                    else 
                    {
                      const ads = map.get("adresse"); 
                      const lat = ads.split(',')[ads.split(',').length - 2]; 
                      const lng = ads.split(',')[ads.split(',').length - 1];  
                      const matchItem = this.sgs.find(item => this.ad == item.title);  
                      var dist! : number;  
                      if (matchItem != undefined)  
                        dist = this.calculateDist(matchItem.lat, matchItem.lng, lat, lng);  
                      this.distance = Math.round(dist); 
                      if (this.distance == 0) 
                      {
                              this.res = false;   
                              setTimeout(() => {
                              this.processing=false; 
                              }, 3000);
                              setTimeout(() => {
                                this.msgF_d=true; 
                              }, 2000);
                              setTimeout(() => {
                              this.msgF_d=false; 
                              }, 6000);
                      } 
                      else 
                      {
                        this.intService.getIntervallesDistanceList().subscribe(response => {
                          this.ints = response; 
                          this.ints.forEach((itm: {id : number, borneGauche : number, borneDroite : number}) => { 
                            if (this.distance >= itm.borneGauche && this.distance < itm.borneDroite) 
                            {
                              const fData = new FormData(); 
                              fData.append("id", itm.id.toString()); 
                              fData.append("vehicule", this.idVehicule.toString()); 
                              fData.append("idUser", this.id.toString()); 
                              this.userIntService.findLivreurs(fData, (window.localStorage.getItem("fPart") as string) + (window.localStorage.getItem("sPart") as string)).subscribe(response => {
                                  this.processing = false; 
                                  const m = new Map(Object.entries(response));
                                  this.livreurs = m.get("livreurs");  
                                  this.res = true; 
                                  this.adress = this.sgs.find(item => this.ad == item.title); 
                              },
                              error => {
                                this.res = false;   
                                setTimeout(() => {
                                this.processing=false; 
                                }, 3000);
                                setTimeout(() => {
                                  this.msgF_d=true; 
                                }, 2000);
                                setTimeout(() => {
                                this.msgF_d=false; 
                                }, 6000);
                              } 
                            );
                            }
                          });
                        },
                        error => {
                          this.res = false;   
                          setTimeout(() => {
                          this.processing=false; 
                          }, 3000);
                          setTimeout(() => {
                            this.msgF_d=true; 
                          }, 2000);
                          setTimeout(() => {
                          this.msgF_d=false; 
                          }, 6000);
                        } 
                      );
                      }
                    }
                },
                error => {
                  this.res = false;   
                  setTimeout(() => {
                  this.processing=false; 
                  }, 3000);
                  setTimeout(() => {
                    this.msgF_e=true; 
                  }, 2000);
                  setTimeout(() => {
                  this.msgF_e=false; 
                  }, 6000);
                } 
              );
              }
              else 
              { 
                const lat = Number(window.localStorage.getItem("lat")); 
                const lng = Number(window.localStorage.getItem("lng"));  
                const matchItem = this.sgs.find(item => this.ad == item.title);  
                var dist! : number;  
                if (matchItem != undefined)    
                  dist = this.calculateDist(matchItem.lat, matchItem.lng, lat, lng);  
                this.distance = Math.round(dist); 
                if (this.distance == 0) 
                {
                  this.res = false;   
                  setTimeout(() => {
                  this.processing=false; 
                  }, 3000);
                  setTimeout(() => {
                    this.msgF_d=true; 
                  }, 2000);
                  setTimeout(() => {
                  this.msgF_d=false; 
                  }, 6000);
                }
                else
                {
                  this.intService.getIntervallesDistanceList().subscribe(response => {
                    this.ints = response; 
                    this.ints.forEach((itm: {id : number, borneGauche : number, borneDroite : number}) => {  
                      if (this.distance >= itm.borneGauche && this.distance <= itm.borneDroite) 
                      {
                        const fData = new FormData(); 
                        fData.append("id", itm.id.toString()); 
                        fData.append("vehicule", this.idVehicule.toString());  
                        fData.append("idUser", this.id.toString());  
                        this.userIntService.findLivreurs(fData, (window.localStorage.getItem("fPart") as string) + (window.localStorage.getItem("sPart") as string), ).subscribe(response => {
                            this.processing = false;
                            const m = new Map(Object.entries(response)); 
                            this.livreurs = m.get("livreurs"); 
                            this.adress = this.sgs.find(item => this.ad == item.title); 
                            this.res = true; 
                        },
                        error => {
                          this.res = false;   
                          setTimeout(() => {
                          this.processing=false; 
                          }, 3000);
                          setTimeout(() => {
                            this.msgF_d=true; 
                          }, 2000);
                          setTimeout(() => {
                          this.msgF_d=false; 
                          }, 6000);
                        } 
                      );
                      }
                    });
                  },
                  error => {
                    this.res = false;   
                    setTimeout(() => {
                    this.processing=false; 
                    }, 3000);
                    setTimeout(() => {
                      this.msgF_d=true; 
                    }, 2000);
                    setTimeout(() => {
                    this.msgF_d=false; 
                    }, 6000);
                  } 
                );
                }
              }
              
            }
          }
          else 
          {
              this.res = false; 
              setTimeout(() => {
              this.processing=false; 
              }, 3000);
              setTimeout(() => {
                this.msgF_ad=true; 
              }, 2000);
              setTimeout(() => {
              this.msgF_ad=false; 
              }, 6000);
          }
        }
        else 
        {
              this.res = false;
              setTimeout(() => {
              this.processing=false; 
              }, 3000);
              setTimeout(() => {
                this.msgF_ad=true; 
              }, 2000);
              setTimeout(() => {
              this.msgF_ad=false; 
              }, 6000);
        }
      }
    } 

    sort() 
    {
      if (this.arr.nativeElement.src == 'http://localhost:4200/assets/icons/upward.png') 
        this.livreurs.sort((a : {email : any, nom : any, prenom : any, photo : any, type : any, tarif : any, genre : any, id : any}, b : {email : any, nom : any, prenom : any, photo : any, type : any, tarif : any, genre : any, id : any}) => b.tarif - a.tarif);
      else 
        this.livreurs.sort((a : {email : any, nom : any, prenom : any, photo : any, type : any, tarif : any, genre : any, id : any}, b : {email : any, nom : any, prenom : any, photo : any, type : any, tarif : any, genre : any, id : any}) => a.tarif - b.tarif);
    } 

    
    getPosition()
    { 
        if ('geolocation' in navigator) { 
          navigator.geolocation.getCurrentPosition(
            (position) => {
              this.mapsService.getGouv(position.coords.latitude, position.coords.longitude).subscribe(response => {
                const m = (new Map(Object.entries(response))).get("features") as Map<string, any>[]; 
                if (m.length == 0) 
                {
                  this.pp.nativeElement.style.display = "none"; 
                  this.pp.nativeElement.style.opacity = "0";
                  setTimeout(() => {
                    this.msgF_err=true; 
                  }, 10);
                  setTimeout(() => {
                  this.msgF_err=false; 
                  }, 6000);
                }
                else 
                {
                  const mp = new Map(Object.entries(new Map(Object.entries(m[0])).get("properties"))); 
                  const gouv =  mp.get("state") as string; 
                  var gouvs : Gouvernorat[]; 
                  this.gouvService.getGouvsList().subscribe(response => {
                  gouvs = response; 
                  if (gouvs.some(gv => gv.gouv == gouv.split(" ")[1]))  
                  {
                    this.pp.nativeElement.style.display = "none"; 
                     this.pp.nativeElement.style.opacity = "0"; 
                     this.gouv = gouv.split(" ")[1]; 
                     window.localStorage.setItem("lat", position.coords.latitude.toString()); 
                     window.localStorage.setItem("lng", position.coords.longitude.toString()); 
                     this.p.nativeElement.style.display = "block"; 
                     setTimeout(()=> {
                      this.p.nativeElement.style.opacity = "1"; 
                     }, 10); 
                  }
                  else 
                  {
                    this.pp.nativeElement.style.display = "none"; 
                    this.pp.nativeElement.style.opacity = "0";
                    setTimeout(() => {
                      this.msgF_gv=true; 
                    }, 10);
                    setTimeout(() => {
                    this.msgF_gv=false; 
                    }, 6000);
                  }
                 },
                 error => {
                  this.pp.nativeElement.style.display = "none"; 
                  this.pp.nativeElement.style.opacity = "0";
                  setTimeout(() => {
                    this.msgF_e=true; 
                  }, 10);
                  setTimeout(() => {
                  this.msgF_e=false; 
                  }, 6000);
                 } 
                );
                }
              },
              error=>{
                this.pp.nativeElement.style.display = "none"; 
                this.pp.nativeElement.style.opacity = "0";
                setTimeout(() => {
                  this.msgF_err=true; 
                }, 10);
                setTimeout(() => {
                this.msgF_err=false; 
                }, 6000);
              } 
            );
            });
        }
        else 
        {
          this.pp.nativeElement.style.display = "none"; 
          this.pp.nativeElement.style.opacity = "0"; 
          setTimeout(() => {
            this.msgF_nv=true; 
          }, 10);
          setTimeout(() => {
          this.msgF_nv=false; 
          }, 6000);
        }
    } 

    change()
    {
        this.dsg = this.dsgg; 
        this.rg = this.rgg; 
        this.codeP = this.codePP; 
        this.p.nativeElement.style.display = "none"; 
        this.p.nativeElement.style.opacity = "0";
    }



    onSubmitt(email : string) 
    {
        const obj: { [key: string]: any } = {};  
     
        this.processing = true;  
        obj["nom"] = this.adress.nom + ',' + this.adress.lat + ',' + this.adress.lng; 
        obj["region"] = this.adress.region; 
        obj["gouv"] = this.adress.gouv;
        obj["codeP"] = this.adress.codeP;
        if (window.localStorage.getItem("lat") != "") 
        {
          obj["adresseDepNom"] = this.dsg + "," + window.localStorage.getItem("lat") + "," + window.localStorage.getItem("lng"); 
          obj["adresseDepRegion"] = this.rg; 
          obj["adresseDepGouv"] = this.gouv; 
          obj["adresseDepCodeP"] = this.codeP; 
        }
        obj["email"] = email; 
        obj["token"] = (window.localStorage.getItem("fPart") as string) + (window.localStorage.getItem("sPart") as string); 
        this.livraisonService.assignerLivraison(obj ,(window.localStorage.getItem("fPart") as string) + (window.localStorage.getItem("sPart") as string)).subscribe(response => {
        const map = new Map(Object.entries(response)); 
        if (map.get("reponse") == "livreur")  
        {
          setTimeout(() => {
            this.msgF_l=true; 
          }, 2000);
          setTimeout(() => {
          this.msgF_l=false; 
          }, 6000);
          setTimeout(() => {
            this.processing=false; 
            }, 3000);
        }
        else if (map.get("reponse") == "gouvDest")
        {
          setTimeout(() => {
            this.msgF_g=true; 
          }, 2000);
          setTimeout(() => {
          this.msgF_g=false; 
          }, 6000);
          setTimeout(() => {
            this.processing=false; 
            }, 3000);
        } 
        else if (map.get("reponse") == "gouvDep")
        {
          setTimeout(() => {
            this.msgF_gd=true; 
          }, 2000);
          setTimeout(() => {
          this.msgF_gd=false; 
          }, 6000);
          setTimeout(() => {
            this.processing=false; 
            }, 3000);
        } 
        else if (map.get("reponse") == "privilegeLivreur") 
        {
          setTimeout(() => {
            this.msgF_pl=true; 
          }, 2000);
          setTimeout(() => {
          this.msgF_pl=false; 
          }, 6000);
          setTimeout(() => {
            this.processing=false; 
            }, 3000);
        }
        else if (map.get("reponse") == "privilegeClient") 
          window.location.reload();  
        else if (map.get("reponse") == "adresseClient")
        {
            setTimeout(() => {
              this.msgF_ac=true; 
            }, 2000);
            setTimeout(() => {
            this.msgF_ac=false; 
            }, 6000);
            setTimeout(() => {
              this.processing=false; 
              }, 3000);
        }
        else 
        {
            this.processing = false; 
            this.idLiv = map.get("reponse"); 
            this.msgSessionn.msg = "Livraison " + this.idLiv + " en attente d'acceptation"; 
            this.navigateToLivraisons();  
        }
      },
      error => {
        setTimeout(() => {
          this.processing=false; 
          }, 3000);
          setTimeout(() => {
            this.msgF_e=true; 
          }, 2000);
          setTimeout(() => {
          this.msgF_e=false; 
          }, 6000);
      } 
    ); 
    }



    calculateDist(latt1: number, lonn1: number, latt2: number, lonn2: number): number {
      const dLatt = this.deg2radd(latt2 - latt1);
      const dLonn = this.deg2radd(lonn2 - lonn1);
      const a =
        Math.sin(dLatt / 2) * Math.sin(dLatt / 2) +
        Math.cos(this.deg2radd(latt1)) * Math.cos(this.deg2radd(latt2)) *
        Math.sin(dLonn / 2) * Math.sin(dLonn / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = 6371 * c;
      return distance;
    }
  
    private deg2radd(degg: number): number {
      return degg * (Math.PI / 180);
    }

    navigateToLivraisons() 
    {
    this.route.queryParams.subscribe(params => {
      const token = params['token']; 
      this.router.navigate(['/user/livraison/livraisons'], { queryParams : { token : token} });
    }); 
    } 

  



}

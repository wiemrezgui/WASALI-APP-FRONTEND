import { NgForOf, NgIf, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, HostListener, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, debounceTime } from 'rxjs';
import { TypeVehicule } from '../../models/type-vehicule';
import { Gouvernorat } from '../../models/gouvernorat';
import { IntervalleDistance } from '../../models/intervalle-distance';
import { TypeVehiculeService } from '../../services/type-vehicule.service';
import { MapsService } from '../../services/maps.service';
import { GouvernoratService } from '../../services/gouvernorat.service';
import { IntervalleDistanceService } from '../../services/intervalle-distance.service';
import { MsgSessionService } from '../../services/msg-session.service';
import { UserService } from '../../services/user.service';
import { UserPrivilegeService } from '../../services/user-privilege.service';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [FormsModule, NgIf, NgForOf],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css'
})
export class ClientsComponent implements OnInit{

  @HostListener('document:click', ['$event']) 
  onClick(event: Event) { 
    this.showsgs = false;  
    this.showsgs = false; 
  }
  
  
  clients! : any[]; 
  clts! : any[]; 
  msgF_e = false; 
  msgF_lnb = false; 
  msgF_cnb = false;
  msgF_ad = false;  
  msgF_abnn = false;  
  msgF = false;  
  msgF_nm = false;  
  msgF_add = false;  
  msgF_cl = false;  
  msgF_pr = false;  
  msgF_dj = false;  
  msgF_ty = false;  
  msgF_djj = false;  
  msgF_cin = false;  
  processing = false; 
  showsgs = false;   
  return = false; 
  aj = false;   
  genre! : string;  
  ttll! : string; 
  adresse! : string;  
  id! : string;  
  idClt! : string;  
  email : string = "";   
  pass : string = ""; 
  nom : string = ""; 
  prenom : string = "";  
  genree : string = "";  
  tell : string = ""; 
  ad : string = "";
  nmm : string = ""; 
  pmm : string = ""; 
  tll : string = "";
  types : TypeVehicule [] = [];  
  typee! : string; 
  file! : File; 
  filee : File | null = null; 
  prs! : any; 
  idPriv! : string; 
  privv! : string; 
  sgs : { title : string, lat : number, lng : number, codeP : number, gouv : string, region : string, nom : string}[] = [];   
  inputSubject: Subject<string> = new Subject<string>();  
  gouvs : Gouvernorat[] = []; 
  inpts : number[] = []; 
  lg! : number;  
  intsDist : IntervalleDistance[] = []; 
  @ViewChild('dt') dt! : ElementRef;
  @ViewChild('pp') pp! : ElementRef;
  @ViewChild('ajClt') ajClt! : ElementRef;
  @ViewChild('stAj') stAj! : ElementRef;
  @ViewChild('sttAj') sttAj! : ElementRef;
  @ViewChild('upCl') upCl! : ElementRef;
  @ViewChild('stUp') stUp! : ElementRef;
  @ViewChild('ajPriv') ajPriv! : ElementRef;
  @ViewChild('dtPriv') dtPriv! : ElementRef;
  @ViewChild('stPrv') stPrv! : ElementRef;
  @ViewChild('sttPrv') sttPrv! : ElementRef;
  @ViewChild('cin') cin! : ElementRef;
  
  constructor(private typeVehiculeService : TypeVehiculeService, private mapsService : MapsService, private gouvService : GouvernoratService, private intDistService : IntervalleDistanceService, private titleService : Title, private router : Router, public msgSession : MsgSessionService, private route : ActivatedRoute, @Inject(PLATFORM_ID) private platformId: Object, private userService : UserService, private userPrivService : UserPrivilegeService){
    this.inputSubject.pipe(debounceTime(50)).subscribe((value: string) => {
      this.searchAd(); 
    });
  }

  ngOnInit(): void {
    this.titleService.setTitle('WASSALI | Gestion Clients'); 
    if (isPlatformBrowser(this.platformId))
    {
      this.userPrivService.findPrivileges((window.localStorage.getItem("fPart") as string) + (window.localStorage.getItem("sPart") as string)).subscribe(response => {
        const map = new Map(Object.entries(response)); 
        const privileges : any[] = Array.from(map.get("reponse"));    
        if (!privileges.includes("gestion clients")) 
          this.navigateToLivraisons(); 
        this.userService.fdClients((window.localStorage.getItem("fPart") as string) + (window.localStorage.getItem("sPart") as string)).subscribe(response => {
          this.clients = response as any[];  
          this.clts = response as any[]; 
          this.lg = this.clients.length;  
        },
        error => {
            setTimeout(() => {
              this.msgF_e=true; 
            }, 100);
            setTimeout(() => {
            this.msgF_e=false; 
            }, 6000);
        } 
      ); 
      }, 
      error => {
        this.msgSession.msg = "Notre serveur rencontre actuellement un problème de traitement des requêtes mais nous nous sommes engagés pour le résoudre. Veuillez réessayer plus tard."; 
        this.router.navigate(['/connexion']); 
      } 
      );
    }
  }

  aff() 
  {
      this.clients = this.clts; 
  }

  affiche(event: Event): void {
    const slValue = Number((event.target as HTMLSelectElement).value); 
    this.clients = []; 
    for(let i = 0 ; i < slValue ; i++)
      this.clients[i] = this.clts[i];
  }

  capturer(event : any){
    this.file = event.target.files[0]; 
  }

  ccapturer(event : any){
    this.filee = event.target.files[0]; 
  }

  handleInp(event : any){
    this.inputSubject.next("");
  }

  display(event : Event) 
  {  
    if (this.sgs.length != 0 && this.ad != "" && this.sgs.some(itm => itm.title.toUpperCase().includes(this.ad.toUpperCase())))
      this.showsgs = true; 
    event.stopPropagation();      
  } 



  selectAd(address: any) { 
    this.showsgs = false;
    this.ad = address.title;              
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
              if (itm.properties.name != undefined && itm.properties.countrycode == 'TN' && itm.properties.postcode != undefined && (itm.properties.district != undefined && !arabicRegex.test(itm.properties.district) || itm.properties.county != undefined && !arabicRegex.test(itm.properties.county)) && itm.properties.state != undefined  && !arabicRegex.test(itm.properties.state) && !this.sgs.some(it => it.nom == itm.properties.name) && ((itm.properties.state as string).split(' ').length == 3 && this.gouvs.some(item => item.gouv == (itm.properties.state as string).split(' ')[1] + ' ' + (itm.properties.state as string).split(' ')[2]) || this.gouvs.some(item => item.gouv == (itm.properties.state as string).split(' ')[1])))
              { 
                 if (itm.properties.district != undefined && itm.properties.county != undefined)
                   this.sgs.push({ title: itm.properties.name + ',' + itm.properties.county + ' ' + itm.properties.district + + ',' + itm.properties.postcode + ',' + itm.properties.state + ',Tunisie', lat: itm.geometry.coordinates[1], lng: itm.geometry.coordinates[0] , codeP : itm.properties.postcode, gouv : (itm.properties.state as string).split(' ')[1], region : itm.properties.county + ' ' + itm.properties.district, nom : itm.properties.name}); 
                 else if (itm.properties.district != undefined) 
                   this.sgs.push({ title: itm.properties.name + ',' + itm.properties.district + ',' + itm.properties.postcode + ',' + itm.properties.state + ',Tunisie', lat: itm.geometry.coordinates[1], lng: itm.geometry.coordinates[0] , codeP : itm.properties.postcode, gouv : (itm.properties.state as string).split(' ')[1], region : itm.properties.district, nom : itm.properties.name}); 
                 else 
                   this.sgs.push({ title: itm.properties.name + ',' + itm.properties.county + ',' + itm.properties.postcode + ',' + itm.properties.state + ',Tunisie', lat: itm.geometry.coordinates[1], lng: itm.geometry.coordinates[0] , codeP : itm.properties.postcode, gouv : (itm.properties.state as string).split(' ')[1], region : itm.properties.county, nom : itm.properties.name}); 
              }
             });  
             if (this.sgs.length > 0) 
               this.showsgs = true;
          },
          error => {
             this.msgSession.msg = "Les adresses ne sont pas disponibles à cause d'un problème de traitement des requêtes au niveau du serveur mais nous nous sommes engagés pour le résoudre. Veuillez réessayer plus tard."; 
             this.router.navigate(['/connexion']); 
          } 
        ); 
        }
      },
      error => {
        this.msgSession.msg = "Les adresses ne sont pas disponibles à cause d'un problème de traitement des requêtes au niveau du serveur mais nous nous sommes engagés pour le résoudre. Veuillez réessayer plus tard."; 
        this.router.navigate(['/connexion']);
      } 
    ); 
        
  
  
    }
  }

  findPrs(id : string)  
  {
      const fData = new FormData(); 
      fData.append("token", (window.localStorage.getItem("fPart") as string) + (window.localStorage.getItem("sPart") as string)); 
      fData.append("id", id); 
      this.userService.getPrsCl(fData).subscribe(response => {
            const map = new Map(Object.entries(response)); 
            if (map.get("reponse")) 
            {
              this.idClt = id; 
              this.prs = map.get("privs"); 
              this.dtPriv.nativeElement.style.display = "block"; 
              this.pp.nativeElement.style.display = "block"; 
              setTimeout(()=> {
                  this.pp.nativeElement.style.opacity = "1"; 
              }, 10); 
            }
            else 
              window.location.reload(); 
            
      },
      error=> {
        this.msgSession.msg = "Notre serveur rencontre actuellement un problème de traitement des requêtes mais nous nous sommes engagés pour le résoudre. Veuillez réessayer plus tard."; 
        this.router.navigate(['/connexion']);
      } 
    ); 
  }

  findPrsAdd(id : string)  
  {
      const fData = new FormData(); 
      fData.append("token", (window.localStorage.getItem("fPart") as string) + (window.localStorage.getItem("sPart") as string)); 
      fData.append("id", id); 
      this.userService.getPrsClAdd(fData).subscribe(response => {
            const map = new Map(Object.entries(response)); 
            if (map.get("reponse")) 
            {
              this.idClt = id; 
              this.prs = map.get("privs"); 
              this.ajPriv.nativeElement.style.display = "block"; 
              this.pp.nativeElement.style.display = "block"; 
              setTimeout(()=> {
                  this.pp.nativeElement.style.opacity = "1"; 
              }, 10); 
            }
            else 
              window.location.reload(); 
      },
      error=> {
        this.msgSession.msg = "Notre serveur rencontre actuellement un problème de traitement des requêtes mais nous nous sommes engagés pour le résoudre. Veuillez réessayer plus tard."; 
        this.router.navigate(['/connexion']);
      }
    ); 
  }

  deletePriv()  
  {
    this.processing = true; 
    if (this.idPriv != undefined) 
    {
      const fData = new FormData(); 
      fData.append("token", (window.localStorage.getItem("fPart") as string) + (window.localStorage.getItem("sPart") as string)); 
      fData.append("idd", this.idPriv); 
      fData.append("id", this.idClt);  
      this.userService.deletePrivilegeCl(fData).subscribe(response => {
           const map = new Map(Object.entries(response)); 
           if (map.get("reponse") == "deja") 
           {
              setTimeout(() => {
              this.processing=false; 
              }, 3000);
              setTimeout(() => {
                this.msgF_dj=true; 
              }, 2000);
              setTimeout(() => {
              this.msgF_dj=false; 
              }, 6000);
           }
           else if (map.get("reponse") == "abonnement")
            {
               setTimeout(() => {
               this.processing=false; 
               }, 3000);
               setTimeout(() => {
                 this.msgF_abnn=true; 
               }, 2000);
               setTimeout(() => {
               this.msgF_abnn=false; 
               }, 6000);
            }
            else if (map.get("reponse") == "livraison") 
            {
               setTimeout(() => {
               this.processing=false; 
               }, 3000);
               setTimeout(() => {
                 this.msgF_lnb=true; 
               }, 2000);
               setTimeout(() => {
               this.msgF_lnb=false; 
               }, 6000);
            }
            else if (map.get("reponse") == "client demande") 
            {
               setTimeout(() => {
               this.processing=false; 
               }, 3000);
               setTimeout(() => {
                 this.msgF_cnb=true; 
               }, 2000);
               setTimeout(() => {
               this.msgF_cnb=false; 
               }, 6000);
            }
           else 
            window.location.reload();   
      },
      error=> {
        this.msgSession.msg = "Notre serveur rencontre actuellement un problème de traitement des requêtes mais nous nous sommes engagés pour le résoudre. Veuillez réessayer plus tard."; 
        this.router.navigate(['/connexion']);
      } 
    ); 
    }
    else 
    {
        setTimeout(() => {
        this.processing=false; 
        }, 3000);
        setTimeout(() => {
          this.msgF_pr=true; 
        }, 2000);
        setTimeout(() => {
        this.msgF_pr=false; 
        }, 6000);
    }
  }


  cnAj() 
  {
      const emailRx: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (this.email != "" && emailRx.test(this.email) && this.pass != "" && this.nom != "" && this.prenom != "") 
      {
        this.ajClt.nativeElement.style.display = "none"; 
        this.stAj.nativeElement.style.display = "block"; 
        this.pp.nativeElement.style.display = "block"; 
        setTimeout(()=> {
            this.pp.nativeElement.style.opacity = "1"; 
        }, 10);
      }
  }

  cl() 
  {
    this.aj = true; 
  }

  rtrn() 
  {
    this.return = false; 
    this.sttAj.nativeElement.style.display = "none"; 
    this.ajClt.nativeElement.style.display = "block"; 
    setTimeout(()=> {
        this.pp.nativeElement.style.opacity = "1"; 
    }, 10);
  }

  cnnAj() 
  {
    const telRx : RegExp = /^[0-9]{8}$/;
    if (this.genre != "" && telRx.test(this.tell)) 
    {
      this.return = true; 
      this.stAj.nativeElement.style.display = "none"; 
      this.sttAj.nativeElement.style.display = "block"; 
      this.pp.nativeElement.style.display = "block"; 
      setTimeout(()=> {
          this.pp.nativeElement.style.opacity = "1"; 
      }, 10);
    }
  }

  mdf() 
  {
    this.processing = true;   
    if (this.ad == "" || this.ad == undefined) 
    {
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
    else 
    {
        if (this.sgs.length > 0)  
        { 
          const adexistsInArr = this.sgs.some(item =>
           this.ad == item.title
          );   
          if (adexistsInArr) 
          {
            const matchItem = this.sgs.find(item => this.ad == item.title); 
            if (matchItem != undefined) 
            {
              const adr = matchItem.title + "," + matchItem.lat as string + "," + matchItem.lng as string;
              const fData = new FormData();  
              fData.append("id", this.id); 
              fData.append("nom", this.nmm); 
              fData.append("prenom", this.pmm); 
              fData.append("tel", this.tll);  
              fData.append("adresse", adr); 
              fData.append("token", (window.localStorage.getItem("fPart") as string) + (window.localStorage.getItem("sPart") as string));   
              this.userService.modifierClient(fData).subscribe(response => {
                    window.location.reload(); 
              },
              error => {
                this.msgSession.msg = "Notre serveur rencontre actuellement un problème de traitement des requêtes mais nous nous sommes engagés pour le résoudre. Veuillez réessayer plus tard."; 
                this.router.navigate(['/connexion']);
              } 
            ); 
            }
          }
          else 
          { 
              setTimeout(() => {
              this.processing=false; 
              }, 3000);
              setTimeout(() => {
                this.msgF_add=true; 
              }, 2000);
              setTimeout(() => {
              this.msgF_add=false; 
              }, 6000);
          }
        }
        else 
        {
              setTimeout(() => {
              this.processing=false; 
              }, 3000);
              setTimeout(() => {
                this.msgF_add=true; 
              }, 2000);
              setTimeout(() => {
              this.msgF_add=false; 
              }, 6000);
        }
    }
  }


  ajouterClient() 
  {
    this.processing = true;   
    if (this.ad == "" || this.ad == undefined) 
    {
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
    else 
    {
        if (this.sgs.length > 0)  
        { 
          const adexistsInArr = this.sgs.some(item =>
           this.ad == item.title
          );   
          if (adexistsInArr) 
          {
            const matchItem = this.sgs.find(item => this.ad == item.title); 
            if (matchItem != undefined) 
            {
              const adr = matchItem.title + "," + matchItem.lat as string + "," + matchItem.lng as string;
              const fData = new FormData();  
              fData.append("email", this.email); 
              fData.append("password", this.pass); 
              fData.append("nom", this.nom); 
              fData.append("prenom", this.prenom); 
              fData.append("genre", this.genree); 
              fData.append("tel", this.tell);  
              fData.append("adresse", adr); 
              fData.append("token", (window.localStorage.getItem("fPart") as string) + (window.localStorage.getItem("sPart") as string)); 
              fData.append("photo", this.file);    
              this.userService.ajouterCl(fData).subscribe(response => {
                  const map = new Map(Object.entries(response)); 
                  if (map.get("reponse") == "client") 
                  {
                      setTimeout(() => {
                      this.processing=false; 
                      }, 3000);
                      setTimeout(() => {
                        this.msgF_cl=true; 
                      }, 2000);
                      setTimeout(() => {
                        this.msgF_cl=false; 
                      }, 6000);
                  }
                  else 
                    window.location.reload(); 
              },
              error => {
                this.msgSession.msg = "Notre serveur rencontre actuellement un problème de traitement des requêtes mais nous nous sommes engagés pour le résoudre. Veuillez réessayer plus tard."; 
                this.router.navigate(['/connexion']);
              } 
            ); 
            }
          }
          else 
          { 
              setTimeout(() => {
              this.processing=false; 
              }, 3000);
              setTimeout(() => {
                this.msgF_add=true; 
              }, 2000);
              setTimeout(() => {
              this.msgF_add=false; 
              }, 6000);
          }
        }
        else 
        {
              setTimeout(() => {
              this.processing=false; 
              }, 3000);
              setTimeout(() => {
                this.msgF_add=true; 
              }, 2000);
              setTimeout(() => {
              this.msgF_add=false; 
              }, 6000);
        }
    }
  }

  cnnPriv() 
  {
    this.processing = true; 
    var test = true; 
    var ok = true; 
    for (let i = 0; i < this.intsDist.length; i++) {
      if (!this.inpts.hasOwnProperty(i) || this.inpts[i] == null) {
        test = false; 
        break; 
      }
    }     
    if (test) 
    {
      for (let i = 0; i < this.intsDist.length; i++) {
        if (this.inpts[i] < 0.01 || this.inpts[i] > 1000000000) {
          ok = false; 
          break; 
        }
    }  
    }
    if (!test) 
    {
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
    else if (!ok) 
    {
        setTimeout(() => {
        this.processing=false; 
        }, 3000);
        setTimeout(() => {
          this.msgF_nm=true; 
        }, 2000);
        setTimeout(() => {
          this.msgF_nm=false; 
        }, 6000);
    }
    else 
    {
        if (this.typee == undefined) 
        {
            setTimeout(() => {
            this.processing=false; 
            }, 3000);
            setTimeout(() => {
              this.msgF_ty=true; 
            }, 2000);
            setTimeout(() => {
              this.msgF_ty=false; 
            }, 6000);
        }
        else 
        {
          this.processing = false; 
          this.stPrv.nativeElement.style.display = "none"; 
          this.sttPrv.nativeElement.style.display = "block"; 
          this.pp.nativeElement.style.display = "block"; 
          setTimeout(()=> {
              this.pp.nativeElement.style.opacity = "1"; 
          }, 10);
        }   
    }
  }

  ajFnPriv() 
  {
    this.processing = true; 
    if (this.filee == null) 
      {
          setTimeout(() => {
          this.processing=false; 
          }, 3000);
          setTimeout(() => {
            this.msgF_cin=true; 
          }, 2000);
          setTimeout(() => {
            this.msgF_cin=false; 
          }, 6000);
      } 
      else 
      {
        const ffData = new FormData(); 
        ffData.append("token", (window.localStorage.getItem("fPart") as string) + (window.localStorage.getItem("sPart") as string)); 
        ffData.append("priv", this.privv); 
        ffData.append("id", this.idClt);  
        this.userService.ajouterPrivilege(ffData).subscribe(response => {
           const map = new Map(Object.entries(response)); 
           if (map.get("reponse") == "deja") 
           {
              setTimeout(() => {
              this.processing=false; 
              }, 3000);
              setTimeout(() => {
                this.msgF_djj=true; 
              }, 2000);
              setTimeout(() => {
              this.msgF_djj=false; 
              }, 6000);
           }
        },
        error=> {
          this.msgSession.msg = "Notre serveur rencontre actuellement un problème de traitement des requêtes mais nous nous sommes engagés pour le résoudre. Veuillez réessayer plus tard."; 
          this.router.navigate(['/connexion']);
        } 
      );
      const fData = new FormData(); 
      fData.append("id", this.idClt);
      fData.append("type", this.typee);  
      fData.append("token", (window.localStorage.getItem("fPart") as string) + (window.localStorage.getItem("sPart") as string)); 
      for(let i = 0; i < this.inpts.length ;i++) 
        fData.append("tarif" + i, this.inpts[i].toString()); 
      this.userService.ajouterTarifs(fData).subscribe(response => { 
            const ffData = new FormData(); 
            ffData.append("cin", this.filee as File); 
            ffData.append("id", this.idClt);  
            this.userService.addCIN(ffData).subscribe(response => {
                window.location.reload(); 
            },
            error=> {
              this.msgSession.msg = "Notre serveur rencontre actuellement un problème de traitement des requêtes mais nous nous sommes engagés pour le résoudre. Veuillez réessayer plus tard."; 
              this.router.navigate(['/connexion']);
            }
          ); 
      },
      error => {
        this.msgSession.msg = "Notre serveur rencontre actuellement un problème de traitement des requêtes mais nous nous sommes engagés pour le résoudre. Veuillez réessayer plus tard."; 
        this.router.navigate(['/connexion']);
      } 
      ); 
      }
  }

  ajouterPriv()  
  {
    this.processing = true; 
    if (this.privv != undefined) 
    {
      if (this.privv == "livraison") 
      {
        this.inpts = []; 
        this.cin.nativeElement.value = "";  
        this.processing = false; 
        this.ajPriv.nativeElement.style.display = "none"; 
        this.intDistService.getIntervallesDistanceList().subscribe(response => { 
          this.intsDist = response;
        },
        error => {
          this.msgSession.msg = "Notre serveur rencontre actuellement un problème de traitement des requêtes mais nous nous sommes engagés pour le résoudre. Veuillez réessayer plus tard."; 
          this.router.navigate(['/connexion']);
        } 
        ); 
        this.typeVehiculeService.getTypesList().subscribe(response => {
          this.types = response;
        },
        error => {
          this.msgSession.msg = "Notre serveur rencontre actuellement un problème de traitement des requêtes mais nous nous sommes engagés pour le résoudre. Veuillez réessayer plus tard."; 
          this.router.navigate(['/connexion']);
        } 
        ); 
        this.stPrv.nativeElement.style.display = "block"; 
        this.pp.nativeElement.style.display = "block"; 
        setTimeout(()=> {
            this.pp.nativeElement.style.opacity = "1"; 
        }, 10);
      }
      else 
      {
        const fData = new FormData(); 
        fData.append("token", (window.localStorage.getItem("fPart") as string) + (window.localStorage.getItem("sPart") as string)); 
        fData.append("priv", this.privv); 
        fData.append("id", this.idClt);  
        this.userService.ajouterPrivilege(fData).subscribe(response => {
           const map = new Map(Object.entries(response)); 
           if (map.get("reponse") == "deja") 
           {
              setTimeout(() => {
              this.processing=false; 
              }, 3000);
              setTimeout(() => {
                this.msgF_djj=true; 
              }, 2000);
              setTimeout(() => {
              this.msgF_djj=false; 
              }, 6000);
           }
           else 
            window.location.reload();   
        },
        error=> {
          this.msgSession.msg = "Notre serveur rencontre actuellement un problème de traitement des requêtes mais nous nous sommes engagés pour le résoudre. Veuillez réessayer plus tard."; 
          this.router.navigate(['/connexion']);
        } 
      );
      }
       
    }
    else 
    {
        setTimeout(() => {
        this.processing=false; 
        }, 3000);
        setTimeout(() => {
          this.msgF_pr=true; 
        }, 2000);
        setTimeout(() => {
        this.msgF_pr=false; 
        }, 6000);
    }
  }

  deleteClient(id : string)  
  {
      const fData = new FormData(); 
      fData.append("token", (window.localStorage.getItem("fPart") as string) + (window.localStorage.getItem("sPart") as string)); 
      fData.append("id", id); 
      this.processing = true; 
      this.userService.deleteCl(fData).subscribe(response => {
         const map = new Map(Object.entries(response)); 
         if (map.get("reponse") == "livreur nb") 
         {
            setTimeout(() => {
            this.processing=false; 
            }, 3000);
            setTimeout(() => {
              this.msgF_lnb=true; 
            }, 2000);
            setTimeout(() => {
            this.msgF_lnb=false; 
            }, 6000);
         } 
         else if (map.get("reponse") == "client nb") 
         {
            setTimeout(() => {
            this.processing=false; 
            }, 3000);
            setTimeout(() => {
              this.msgF_cnb=true; 
            }, 2000);
            setTimeout(() => {
            this.msgF_cnb=false; 
            }, 6000);
         }
         else 
            window.location.reload(); 
         
      },
      error=> {
        this.msgSession.msg = "Notre serveur rencontre actuellement un problème de traitement des requêtes mais nous nous sommes engagés pour le résoudre. Veuillez réessayer plus tard."; 
        this.router.navigate(['/connexion']);
      } 
    ); 
  }

  rld() 
  {
    window.location.reload(); 
  }

  findClient(client : any) 
  { 
    this.id = client.id; 
    this.nmm = client.nom; 
    this.pmm = client.prenom; 
    this.tll = client.tel;
    var adr : string = client.adresse;  
    var adresse : { title : string, lat : number, lng : number, codeP : number, gouv : string, region : string, nom : string} = {title : "", lat : 0, lng : 0, codeP : 0, gouv : "", region : "", nom : ""};
    for(let i = 0 ; i < adr.split(",").length - 2 ; i++) 
      if (i < adr.split(",").length - 3) 
        adresse.title += adr.split(",")[i] + ","; 
      else 
        adresse.title += adr.split(",")[i];
    adresse.lat = Number(adr.split(',')[adr.split(',').length - 2]); 
    adresse.lng = Number(adr.split(',')[adr.split(',').length - 1]);
    adresse.gouv = adr.split(',')[adr.split(',').length - 4].split(' ')[1]; 
    adresse.region = adr.split(',')[adr.split(',').length - 6]; 
    for(let i = 0 ; i < adr.split(",").length - 6 ; i++) 
      if (i < adresse.nom.split(",").length - 7) 
        adresse.nom += adr.split(",")[i] + ","; 
      else 
        adresse.nom += adr.split(",")[i];
    adresse.codeP = Number(adr.split(',')[adr.split(',').length - 5]); 
    this.sgs.push(adresse); 
    this.selectAd(adresse); 
    this.upCl.nativeElement.style.display = "block"; 
    this.pp.nativeElement.style.display = "block"; 
    setTimeout(()=> {
        this.pp.nativeElement.style.opacity = "1"; 
    }, 10);
  
  }

  cnMdf() 
  {
    const telRx : RegExp = /^[0-9]{8}$/;
    if (this.nmm != "" && this.pmm != "" && telRx.test(this.tll)) 
    {
      this.upCl.nativeElement.style.display = "none"; 
      this.stUp.nativeElement.style.display = "block"; 
      this.pp.nativeElement.style.display = "block"; 
      setTimeout(()=> {
          this.pp.nativeElement.style.opacity = "1"; 
      }, 10);
    }
  }


  passer(adresse : string, genre : string, tel : string) 
  {
    this.adresse = ""; 
    for(let i = 0 ; i < adresse.split(",").length - 2 ; i++) 
      if (i < adresse.split(",").length - 3) 
        this.adresse += adresse.split(",")[i] + ","; 
      else 
        this.adresse += adresse.split(",")[i]; 
    this.genre = genre; 
    this.ttll = tel; 
    this.pp.nativeElement.style.display = "block";
    setTimeout(()=> {this.pp.nativeElement.style.opacity = "1";}, 10);  
    this.dt.nativeElement.style.display = "block"; 
  }


  navigateToLivraisons() 
  {
  this.route.queryParams.subscribe(params => {
    const token = params['token']; 
    this.router.navigate(['/user/livraison/livraisons'], { queryParams : { token : token} });
  }); 
  }

  getNbs(): number[] {
    return Array(this.lg).fill(0).map((x, i) => i + 1);
  }
}

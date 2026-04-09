import { Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForOf, NgIf, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime } from 'rxjs';
import { IntervalleDistance } from '../../models/intervalle-distance';
import { TypeVehicule } from '../../models/type-vehicule';
import { Gouvernorat } from '../../models/gouvernorat';
import { GouvernoratService } from '../../services/gouvernorat.service';
import { MapsService } from '../../services/maps.service';
import { TypeVehiculeService } from '../../services/type-vehicule.service';
import { IntervalleDistanceService } from '../../services/intervalle-distance.service';
import { MsgSessionService } from '../../services/msg-session.service';
import { UserPrivilegeService } from '../../services/user-privilege.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-gestion-livreurs',
  standalone: true,
  imports: [FormsModule, NgIf, NgForOf],
  templateUrl: './gestion-livreurs.component.html',
  styleUrl: './gestion-livreurs.component.css'
})
export class GestionLivreursComponent implements OnInit{

  livreurs! : any[]; 
  livrs! : any[]; 
  intDists! : any;
  t! : string; 
  genre! : string;  
  type! : string;  
  intsDist : IntervalleDistance [] = []; 
  types : TypeVehicule[] = []; 
  msgF_e = false; 
  msgF_abnn = false; 
  msgF_cnb = false; 
  msgF_lnb = false; 
  msgF_abn = false; 
  msgF_ab = false; 
  msgF_pr = false; 
  msgF_dj = false; 
  msgF_djj = false; 
  msgF = false; 
  msgF_nm = false; 
  msgF_lv = false; 
  msgF_prv = false; 
  msgF_ad = false; 
  msgF_add = false; 
  msgF_cin = false; 
  processing = false;
  showsgs = false;     
  return = false;  
  aj = false;  
  abns : {id : string, dateDeb : string, dateFin : string}[] = [];
  sgs : { title : string, lat : number, lng : number, codeP : number, gouv : string, region : string, nom : string}[] = [];   
  inputSubject: Subject<string> = new Subject<string>();  
  gouvs : Gouvernorat[] = []; 
  ad : string = ""; 
  prs! : any;  
  idAbnm! : string; 
  idPriv! : string; 
  privv! : string; 
  idLivr! : string; 
  email : string = "";   
  pass : string = ""; 
  nom : string = ""; 
  prenom : string = ""; 
  nmm : string = ""; 
  pmm : string = ""; 
  tll : string = ""; 
  tp : string = ""; 
  genree : string = ""; 
  typee : string = ""; 
  tell : string = ""; 
  file! : File; 
  id! : string; 
  tarifs! : any; 
  inpts: number[] = []; 
  lg! : number; 
  livreur! : any; 
  nb! : number; 
  filee : File | null = null;  
  cinnn : File | null = null;  
  @ViewChild('pp') pp! : ElementRef;
  @ViewChild('dt') dt! : ElementRef;
  @ViewChild('dtAbnm') dtAbnm! : ElementRef;
  @ViewChild('dtPriv') dtPriv! : ElementRef;
  @ViewChild('ajPriv') ajPriv! : ElementRef;
  @ViewChild('ajLiv') ajLiv! : ElementRef;
  @ViewChild('stAj') stAj! : ElementRef;
  @ViewChild('sttAj') sttAj! : ElementRef;
  @ViewChild('upLiv') upLiv! : ElementRef;
  @ViewChild('stUp') stUp! : ElementRef;
  @ViewChild('em') em! : ElementRef;
  @ViewChild('tpp') tpp! : ElementRef;
  @ViewChild('prAdr') prAdr! : ElementRef;
  @ViewChild('cinn') cinn! : ElementRef;

  constructor(private gouvService : GouvernoratService, private mapsService : MapsService, private typeVehiculeService : TypeVehiculeService, private intDistService : IntervalleDistanceService, private titleService : Title, private router : Router, public msgSession : MsgSessionService, private userPrivService : UserPrivilegeService, private route : ActivatedRoute, @Inject(PLATFORM_ID) private platformId: Object, private userService : UserService){
    this.inputSubject.pipe(debounceTime(50)).subscribe((value: string) => {
      this.searchAd(); 
    });
  }

  ngOnInit(): void {
    this.titleService.setTitle('WASSALI | Gestion Livreurs'); 
    if (isPlatformBrowser(this.platformId))
    {
      this.userPrivService.findPrivileges((window.localStorage.getItem("fPart") as string) + (window.localStorage.getItem("sPart") as string)).subscribe(response => {
        const map = new Map(Object.entries(response)); 
        const privileges : any[] = Array.from(map.get("reponse"));    
        if (!privileges.includes("gestion et demandes livreurs")) 
          this.navigateToLivraisons(); 
        this.userService.findLivreurs((window.localStorage.getItem("fPart") as string) + (window.localStorage.getItem("sPart") as string)).subscribe(response => {
          const map = new Map(Object.entries(response));
          this.livreurs = map.get("livreurs"); 
          this.livrs = map.get("livreurs"); 
          this.lg = this.livreurs.length; 
          this.typeVehiculeService.getTypesList().subscribe(response => {
            this.types = response;
          },
          error => {
            this.msgSession.msg = "Notre serveur rencontre actuellement un problème de traitement des requêtes mais nous nous sommes engagés pour le résoudre. Veuillez réessayer plus tard."; 
            this.router.navigate(['/connexion']);
          } 
          ); 
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

  handleInp(event : any){
    this.inputSubject.next("");
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

  ccapturer(event : any){
    this.filee = event.target.files[0]; 
  }

  passer(intDists : any, tel : string, genre : string, type : string, nb : number, cinn : any) 
  {
 
      this.intDists = intDists; 
      setTimeout(()=>{this.intDists.sort((a : {id: number, intervalleDistance : IntervalleDistance, tarif : number, user : User}, b : {id: number, intervalleDistance : IntervalleDistance, tarif : number, user : User}) => a.id - b.id)}, 5);
      this.pp.nativeElement.style.display = "block";
      setTimeout(()=> {this.pp.nativeElement.style.opacity = "1";}, 10);  
      this.dt.nativeElement.style.display = "block"; 
      this.t = tel; 
      this.genre = genre; 
      this.type = type;
      this.nb = nb;  
      this.cinnn = cinn; 
  }

  affCin() 
  { 
      this.dt.nativeElement.style.display = "none";
      this.cinn.nativeElement.style.display = "block";
      setTimeout(()=> {
        this.pp.nativeElement.style.opacity = "1"; 
    }, 10); 
  }

  deleteLivreur(id : string)  
  {
      const fData = new FormData(); 
      fData.append("token", (window.localStorage.getItem("fPart") as string) + (window.localStorage.getItem("sPart") as string)); 
      fData.append("id", id); 
      this.processing = true; 
      this.userService.deleteLivr(fData).subscribe(response => {
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

  addAbnm(id : string)  
  {
      const fData = new FormData(); 
      fData.append("token", (window.localStorage.getItem("fPart") as string) + (window.localStorage.getItem("sPart") as string)); 
      fData.append("id", id); 
      this.userService.addAbonnement(fData).subscribe(response => {
            window.location.reload(); 
      },
      error => {
        this.msgSession.msg = "Notre serveur rencontre actuellement un problème de traitement des requêtes mais nous nous sommes engagés pour le résoudre. Veuillez réessayer plus tard."; 
        this.router.navigate(['/connexion']);
      } 
    ); 
  }

  deleteAbnm()  
  {
    this.processing = true; 
    if (this.idAbnm != undefined) 
    {
      const fData = new FormData(); 
      fData.append("token", (window.localStorage.getItem("fPart") as string) + (window.localStorage.getItem("sPart") as string)); 
      fData.append("idd", this.idAbnm); 
      fData.append("id", this.idLivr);  
      this.userService.deleteAbonnement(fData).subscribe(response => {
           const map = new Map(Object.entries(response)); 
           if (map.get("reponse") == "abn") 
           {
              setTimeout(() => {
              this.processing=false; 
              }, 3000);
              setTimeout(() => {
                this.msgF_abn=true; 
              }, 2000);
              setTimeout(() => {
              this.msgF_abn=false; 
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
          this.msgF_ab=true; 
        }, 2000);
        setTimeout(() => {
        this.msgF_ab=false; 
        }, 6000);
    }
  }

  rld() 
  {
    window.location.reload(); 
  }

  cl() 
  {
    this.aj = true; 
  }
  
  deletePriv()  
  {
    this.processing = true; 
    if (this.idPriv != undefined) 
    {
      const fData = new FormData(); 
      fData.append("token", (window.localStorage.getItem("fPart") as string) + (window.localStorage.getItem("sPart") as string)); 
      fData.append("idd", this.idPriv); 
      fData.append("id", this.idLivr);  
      this.userService.deletePrivilege(fData).subscribe(response => {
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

  capturer(event : any){
    this.file = event.target.files[0]; 
  }

  ajouterPriv()  
  {
    this.processing = true; 
    if (this.privv != undefined) 
    {
      if (this.privv == "demande et suivi") 
      {
        this.processing = false; 
        this.ad = ""; 
        this.ajPriv.nativeElement.style.display = "none"; 
        this.prAdr.nativeElement.style.display = "block"; 
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
        fData.append("id", this.idLivr);  
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

  ajouterPrivAdresse() 
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
              const fData = new FormData(); 
              fData.append("token", (window.localStorage.getItem("fPart") as string) + (window.localStorage.getItem("sPart") as string)); 
              fData.append("priv", this.privv); 
              fData.append("id", this.idLivr);  
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
                 {
                    const adr = matchItem.title + "," + matchItem.lat as string + "," + matchItem.lng as string; 
                    const fData = new FormData();  
                    fData.append("adresse", adr); 
                    fData.append("id", this.idLivr); 
                    fData.append("token", (window.localStorage.getItem("fPart") as string) + (window.localStorage.getItem("sPart") as string));  
                    this.userService.addAdresse(fData).subscribe(response => {
                        window.location.reload(); 
                    },
                    error=> {
                      this.msgSession.msg = "Notre serveur rencontre actuellement un problème de traitement des requêtes mais nous nous sommes engagés pour le résoudre. Veuillez réessayer plus tard."; 
                      this.router.navigate(['/connexion']);
                    } 
                  ); 
                 }  
              },
              erro=> {
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

  findAbnms(id : string)  
  {
      const fData = new FormData(); 
      fData.append("token", (window.localStorage.getItem("fPart") as string) + (window.localStorage.getItem("sPart") as string)); 
      fData.append("id", id); 
      this.userService.getAbonnements(fData).subscribe(response => {
            const map = new Map(Object.entries(response)); 
            if (map.get("reponse")) 
            {
              this.idLivr = id; 
              this.abns = map.get("abns"); 
              this.dtAbnm.nativeElement.style.display = "block"; 
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

  findPrs(id : string)  
  {
      const fData = new FormData(); 
      fData.append("token", (window.localStorage.getItem("fPart") as string) + (window.localStorage.getItem("sPart") as string)); 
      fData.append("id", id); 
      this.userService.getPrs(fData).subscribe(response => {
            const map = new Map(Object.entries(response)); 
            if (map.get("reponse")) 
            {
              this.idLivr = id; 
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
      this.userService.getPrsAdd(fData).subscribe(response => {
            const map = new Map(Object.entries(response)); 
            if (map.get("reponse")) 
            {
              this.idLivr = id; 
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

  cnAj() 
  {
      const emailRx: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (this.email != "" && emailRx.test(this.email) && this.pass != "" && this.nom != "" && this.prenom != "") 
      {
        this.ajLiv.nativeElement.style.display = "none"; 
        this.stAj.nativeElement.style.display = "block"; 
        this.pp.nativeElement.style.display = "block"; 
        setTimeout(()=> {
            this.pp.nativeElement.style.opacity = "1"; 
        }, 10);
        this.typeVehiculeService.getTypesList().subscribe(response => {
          this.types = response; 
        },
        error => {
          this.msgSession.msg = "Notre serveur rencontre actuellement un problème de traitement des requêtes mais nous nous sommes engagés pour le résoudre. Veuillez réessayer plus tard."; 
          this.router.navigate(['/connexion']);
        } 
      ); 
      }
  }



  rtrn() 
  {
    this.return = false; 
    this.sttAj.nativeElement.style.display = "none"; 
    this.ajLiv.nativeElement.style.display = "block"; 
    setTimeout(()=> {
        this.pp.nativeElement.style.opacity = "1"; 
    }, 10);
  }

  cnnAj() 
  {
      const telRx : RegExp = /^[0-9]{8}$/;
      if (this.genre != "" && telRx.test(this.tell) && this.typee != "") 
      {
        this.stAj.nativeElement.style.display = "none"; 
        this.sttAj.nativeElement.style.display = "block"; 
        this.pp.nativeElement.style.display = "block"; 
        setTimeout(()=> {
            this.pp.nativeElement.style.opacity = "1"; 
        }, 10);
        this.return = true; 
        this.intDistService.getIntervallesDistanceList().subscribe(response => { 
          this.intsDist = response;
        },
        error => {
          this.msgSession.msg = "Notre serveur rencontre actuellement un problème de traitement des requêtes mais nous nous sommes engagés pour le résoudre. Veuillez réessayer plus tard."; 
          this.router.navigate(['/connexion']);
        } 
      ); 
      }
  }

  Mdf() 
  {
    this.processing = true; 
    var test = true; 
    var ok = true; 
    this.intDistService.getIntervallesDistanceList().subscribe(response => { 
      this.intsDist = response;
      for (let i = 0; i < this.intsDist.length; i++) {
        if (!this.inpts.hasOwnProperty(i) || this.inpts[i] == null) {
          test = false; 
          break; 
        }
      }     
      if (test) 
      {
        for (let i = 0; i < this.intsDist.length; i++) {
          if (this.inpts[i] < 0.01 || this.inpts[i] > 1000000) {
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
        const fData = new FormData();  
        fData.append("nom", this.nmm); 
        fData.append("prenom", this.pmm); 
        fData.append("tel", this.tll);  
        fData.append("type", this.tp); 
        fData.append("id", this.id); 
        fData.append("token", (window.localStorage.getItem("fPart") as string) + (window.localStorage.getItem("sPart") as string)); 
        for(let i = 0; i < this.inpts.length ;i++) 
          fData.append("tarif" + i, this.inpts[i].toString());     
        this.userService.modifierLivreur(fData).subscribe(response => { 
              window.location.reload(); 
        },
        error => {
          this.msgSession.msg = "Notre serveur rencontre actuellement un problème de traitement des requêtes mais nous nous sommes engagés pour le résoudre. Veuillez réessayer plus tard."; 
          this.router.navigate(['/connexion']);
        } 
      ); 
      }
    },
    error => {
      this.msgSession.msg = "Notre serveur rencontre actuellement un problème de traitement des requêtes mais nous nous sommes engagés pour le résoudre. Veuillez réessayer plus tard."; 
      this.router.navigate(['/connexion']);
    }
    ); 
  }

  cnMdf() 
  {
      const telRx : RegExp = /^[0-9]{8}$/;
      if (this.nmm != "" && this.pmm != "" && telRx.test(this.tll)) 
      {
        this.upLiv.nativeElement.style.display = "none"; 
        this.stUp.nativeElement.style.display = "block"; 
        this.pp.nativeElement.style.display = "block"; 
        setTimeout(()=> {
            this.pp.nativeElement.style.opacity = "1"; 
        }, 10);
      }
  }

  findLiv(livreur : any) 
  {
    this.tp = livreur.livreur.typeVehicule.type; 
    this.id = livreur.livreur.id; 
    this.tarifs = livreur.tarifs; 
    this.nmm = livreur.livreur.nom; 
    this.pmm = livreur.livreur.prenom; 
    this.tll = livreur.livreur.tel; 
    this.inpts = []; 
    setTimeout(()=>{this.tarifs.sort((a : {id: number, intervalleDistance : IntervalleDistance, tarif : number, user : User}, b : {id: number, intervalleDistance : IntervalleDistance, tarif : number, user : User}) => a.id - b.id)}, 5);
    for(let tarif of this.tarifs) 
      this.inpts.push(tarif.tarif); 
    this.upLiv.nativeElement.style.display = "block"; 
    this.pp.nativeElement.style.display = "block"; 
    setTimeout(()=> {
        this.pp.nativeElement.style.opacity = "1"; 
    }, 10);
  
  }

  ajtLiv() 
  {
    this.processing = true; 
    var test = true; 
    var ok = true; 
    this.intDistService.getIntervallesDistanceList().subscribe(response => { 
      this.intsDist = response;
    },
    error => {
      this.msgSession.msg = "Notre serveur rencontre actuellement un problème de traitement des requêtes mais nous nous sommes engagés pour le résoudre. Veuillez réessayer plus tard."; 
      this.router.navigate(['/connexion']);
    }
    ); 
    for (let i = 0; i < this.intsDist.length; i++) {
      if (!this.inpts.hasOwnProperty(i) || this.inpts[i] == null) {
        test = false; 
        break; 
      }
    }     
    if (test) 
    {
      for (let i = 0; i < this.intsDist.length; i++) {
        if (this.inpts[i] < 0.01 || this.inpts[i] > 1000000) {
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
          const fData = new FormData();  
          fData.append("email", this.email); 
          fData.append("password", this.pass); 
          fData.append("nom", this.nom); 
          fData.append("prenom", this.prenom); 
          fData.append("genre", this.genree); 
          fData.append("tel", this.tell);  
          fData.append("type", this.typee); 
          fData.append("token", (window.localStorage.getItem("fPart") as string) + (window.localStorage.getItem("sPart") as string)); 
          fData.append("photo", this.file); 
          for(let i = 0; i < this.inpts.length ;i++) 
            fData.append("tarif" + i, this.inpts[i].toString());     
          this.userService.addLivreur(fData).subscribe(response => {
              const map = new Map(Object.entries(response)); 
              if (map.get("reponse") == "livreur") 
              {
                  setTimeout(() => {
                  this.processing=false; 
                  }, 3000);
                  setTimeout(() => {
                    this.msgF_lv=true; 
                  }, 2000);
                  setTimeout(() => {
                    this.msgF_lv=false; 
                  }, 6000);
              }
              else 
              {
                  const ffData = new FormData(); 
                  ffData.append("cin", this.filee as File);
                  ffData.append("id", map.get("reponse") as string) 
                  this.userService.addCIN(ffData).subscribe(response => {
                      window.location.reload(); 
                  },
                  error => {
                    this.msgSession.msg = "Notre serveur rencontre actuellement un problème de traitement des requêtes mais nous nous sommes engagés pour le résoudre. Veuillez réessayer plus tard."; 
                    this.router.navigate(['/connexion']);
                  } 
                )
              }
          },
          error => {
            this.msgSession.msg = "Notre serveur rencontre actuellement un problème de traitement des requêtes mais nous nous sommes engagés pour le résoudre. Veuillez réessayer plus tard."; 
            this.router.navigate(['/connexion']);
          } 
        ); 
        }
    }
  }

  navigateToLivraisons() 
  {
  this.route.queryParams.subscribe(params => {
    const token = params['token']; 
    this.router.navigate(['/user/livraison/livraisons'], { queryParams : { token : token} });
  }); 
  }

  aff() 
  {
    this.livreurs = this.livrs;  
  }

  getNbs(): number[] {
    return Array(this.lg).fill(0).map((x, i) => i + 1);
  }

  affiche(event: Event): void {
    const slValue = Number((event.target as HTMLSelectElement).value); 
    this.livreurs = []; 
    for(let i = 0 ; i < slValue ; i++)
      this.livreurs[i] = this.livrs[i];
  }

  
}

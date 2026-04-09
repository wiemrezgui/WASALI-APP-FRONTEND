import { NgIf, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, HostListener, Inject, OnInit, PLATFORM_ID, ViewChild} from '@angular/core'; 
import { FormsModule } from '@angular/forms'; 
import { NgForOf } from '@angular/common';  
import { Observable, Subject, debounceTime } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Gouvernorat } from '../../models/gouvernorat';
import { UserService } from '../../services/user.service';
import { MsgSessionService } from '../../services/msg-session.service';
import { MapsService } from '../../services/maps.service';
import { GouvernoratService } from '../../services/gouvernorat.service';



@Component({
  selector: 'app-signup-client',
  standalone: true,
  imports: [FormsModule, NgIf, NgForOf],
  templateUrl: './signup-client.component.html',
  styleUrl: './signup-client.component.css'
})
export class SignupClientComponent implements OnInit{

  processing = false;     
  process = false;     
  showsgs = false;   
  msgF = false;  
  msgF_ad = false;  
  msgF_gv = false; 
  msgF_em = false;  
  msgF_e = false;  
  msgF_er = false;  
  msgF_err = false;  
  msgF_nv = false;  
  sgs : { title : string, lat : number, lng : number, codeP : number, gouv : string, region : string, nom : string}[] = [];       
  ad : string = ""; 
  prenom : string = ""; 
  inputSubject: Subject<string> = new Subject<string>();  
  dsg! : string;
  codeP! : string;  
  rg! : string;
  gouv! : string; 
  gouvs : Gouvernorat[] = []; 

  @ViewChild('pp') pp! : ElementRef;
  
  constructor(private router : Router, private userService : UserService, private route : ActivatedRoute, public msgSession : MsgSessionService, private titleService : Title, private mapsService : MapsService,  @Inject(PLATFORM_ID) private platformId: Object, private gouvService : GouvernoratService) { 
    this.inputSubject.pipe(debounceTime(50)).subscribe((value: string) => {
      this.searchAd(); 
    });
  }

  @HostListener('document:click', ['$event']) 
  onClick(event: Event) {
    this.route.queryParams.subscribe(params => {
      const session = params['session']; 
        this.userService.checkSession(session).subscribe(response => {
          if (response == false) 
          {
            this.msgSession.msg = "Session expirée!";
            this.router.navigate(['/connexion']);
          }
          else 
            this.showsgs = false;
      },
      error => {
        this.msgSession.msg = "Notre serveur rencontre un problème de traitement des requêtes mais nous nous sommes engagés pour le résoudre. Veuillez réessayer plus tard."; 
        this.router.navigate(['/connexion']);
      } 
    );
    }); 
  }

  

  ngOnInit(): void {

    this.titleService.setTitle('WASSALI | Inscription Client');
    if (isPlatformBrowser(this.platformId)) 
    {
      window.localStorage.setItem("fPart", ""); 
      window.localStorage.setItem("sPart", "");     
    }

    this.route.queryParams.subscribe(params => {
      const session = params['session']; 
      if (session == undefined) 
      {
        this.msgSession.msg = "Vous ne disposez pas de session d'inscription d'un client!"; 
        this.router.navigate(['/connexion']); 
      } 
      else 
      {
        this.userService.checkSession(session).subscribe(response => {
          if (response == false) 
          {
            this.msgSession.msg = "Session expirée ou incorrecte!";
            this.router.navigate(['/connexion']); 
          }
          else 
          {
            const map = new Map(Object.entries(response)); 
            this.prenom = map.get("reponse"); 
          }
      },
      error => {
        this.msgSession.msg = "Notre serveur rencontre un problème de traitement des requêtes mais nous nous sommes engagés pour le résoudre. Veuillez réessayer plus tard."; 
        this.router.navigate(['/connexion']);
      } 
    );
      }
    });  

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

  
  onSubmit()
  {   
    this.processing = true;   
    if (this.ad == "" || this.ad == undefined) 
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
              this.route.queryParams.subscribe(params => {
                const session = params['session'];  
                const fData = new FormData(); 
                fData.append("session_id", session); 
                const adr = matchItem.title + "," + matchItem.lat as string + "," + matchItem.lng as string ;
                fData.append("adresse", adr); 
                this.userService.createClient(fData).subscribe(response => 
                  {
                    const map = new Map(Object.entries(response));
                    if (map.get("reponse") ==  "email") 
                    {
                        setTimeout(() => {
                        this.processing=false; 
                        }, 3000);
                        setTimeout(() => {
                        this.msgF_em=true; 
                        }, 2000);
                        setTimeout(() => {
                        this.msgF_em=false; 
                        }, 6000);
                    }
                    else 
                    { 
                      const fData = new FormData(); 
                      fData.append("email", map.get("email"));  
                      this.userService.getToken(fData).subscribe(response => {
                        const map = new Map(Object.entries(response)); 
                        const token : string = map.get("token") as string; 
                        const fPart = token.substring(0, token.length / 2);  
                        const sPart = token.substring(token.length / 2, token.length);  
                        window.localStorage.setItem("fPart", fPart); 
                        window.localStorage.setItem("sPart", sPart);  
                        this.router.navigate(['/user/livraison/livraisons'], { queryParams : { token : token} });
                      }
                    ); 
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
                      }, 8000);
                  } 
                );
              });
            }
          }
          else 
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
        }
        else 
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
    }
  }

  create() 
  {
    const noComRx: RegExp = /^[^,]*$/;
    if (this.dsg != undefined && this.dsg != "" && this.rg != undefined && this.rg != "" && noComRx.test(this.rg) && this.codeP != undefined) 
    {
      this.processing = true; 
      this.route.queryParams.subscribe(params => {
        const session = params['session']; 
        const fData = new FormData(); 
        fData.append("session_id", session); 
        const adr = this.dsg + "," + this.rg + "," + this.codeP + ",Gouvernorat " + this.gouv + ",Tunisie," + window.localStorage.getItem("lat") + "," + window.localStorage.getItem("lng"); 
        fData.append("adresse", adr); 
        this.userService.createClient(fData).subscribe(response => 
        {
            const map = new Map(Object.entries(response));
            if (map.get("reponse") ==  "email") 
            {
                setTimeout(() => {
                this.processing=false; 
                }, 3000);
                setTimeout(() => {
                this.msgF_em=true; 
                }, 2000);
                setTimeout(() => {
                this.msgF_em=false; 
                }, 6000);
            }
            else 
            { 
              const fData = new FormData(); 
              fData.append("email", map.get("email"));  
              this.userService.getToken(fData).subscribe(response => {
                const map = new Map(Object.entries(response)); 
                const token : string = map.get("token") as string; 
                const fPart = token.substring(0, token.length / 2);  
                const sPart = token.substring(token.length / 2, token.length);  
                window.localStorage.setItem("fPart", fPart); 
                window.localStorage.setItem("sPart", sPart);  
                this.router.navigate(['/user/livraison/livraisons'], { queryParams : { token : token} });
              }
            ); 
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
        });
    }
  }

  getLocation() 
  {
    this.processing = true; 
    if ('geolocation' in navigator) { 
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.mapsService.getGouv(position.coords.latitude, position.coords.longitude).subscribe(response => {
            const m = (new Map(Object.entries(response))).get("features") as Map<string, any>[]; 
            if (m.length == 0) 
            {
              setTimeout(() => {
                this.processing = false; 
                }, 3000);
              setTimeout(() => {
                this.msgF_err=true; 
              }, 2000);
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
                this.processing = false; 
                 this.pp.nativeElement.style.display = "block"; 
                 setTimeout(() => {
                  this.pp.nativeElement.style.opacity = "1"; 
                 }, 10);  
                 this.gouv = gouv.split(" ")[1]; 
                 window.localStorage.setItem("lat", position.coords.latitude.toString()); 
                 window.localStorage.setItem("lng", position.coords.longitude.toString());  
              }
              else 
              {
                setTimeout(() => {
                  this.processing=false; 
                  }, 3000);
                setTimeout(() => {
                  this.msgF_gv=true; 
                }, 2000);
                setTimeout(() => {
                this.msgF_gv=false; 
                }, 6000);
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
          },
          error => {
            setTimeout(() => {
              this.processing=false; 
              }, 3000);
            setTimeout(() => {
              this.msgF_er=true; 
            }, 2000);
            setTimeout(() => {
            this.msgF_er=false; 
            }, 6000);
          } 
        ); 
        });
    }
    else 
    {
      setTimeout(() => {
        this.processing=false; 
        }, 3000);
      setTimeout(() => {
        this.msgF_nv=true; 
      }, 2000);
      setTimeout(() => {
      this.msgF_nv=false; 
      }, 6000);
    }
  }

  


}

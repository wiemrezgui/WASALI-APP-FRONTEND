import { Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core'; 
import { FormsModule } from '@angular/forms';
import { CommonModule, NgIf, isPlatformBrowser } from '@angular/common';
import { NgForOf } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { IntervalleDistance } from '../../models/intervalle-distance';
import { TypeVehicule } from '../../models/type-vehicule';
import { IntervalleDistanceService } from '../../services/intervalle-distance.service';
import { MsgSessionService } from '../../services/msg-session.service';
import { UserService } from '../../services/user.service';
import { TypeVehiculeService } from '../../services/type-vehicule.service';

@Component({
  selector: 'app-signup-livreur',
  standalone: true,
  imports: [FormsModule, NgIf, NgForOf, CommonModule],
  templateUrl: './signup-livreur.component.html',
  styleUrl: './signup-livreur.component.css'
})
export class SignupLivreurComponent implements OnInit{

  intsDist : IntervalleDistance [] = []; 
  prenom : string = ""; 
  processing = false;  
  msgF = false; 
  msgF_nm = false;  
  msgF_em = false;  
  msgF_e = false;  
  msgF_er = false;  
  msgF_err = false;  
  msgF_vh = false; 
  msgF_cin = false; 
  file : File | null = null;  
  inpts: number[] = []; 
  list: Map<string, object>[] = []; 
  vehicule! : string;   
  types : TypeVehicule[] = []; 
  

  constructor(private intDistService : IntervalleDistanceService, private titleService : Title, private route : ActivatedRoute, public msgSession : MsgSessionService, private router : Router, private userService : UserService, private typeService : TypeVehiculeService, @Inject(PLATFORM_ID) private platformId: Object){
    this.router.events.subscribe(event => {
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
      },
      error => {
        this.msgSession.msg = "Notre serveur rencontre un problème de traitement des requêtes mais nous nous sommes engagés pour le résoudre. Veuillez réessayer plus tard."; 
        this.router.navigate(['/connexion']);
      }
    );
    }); 
  }
  
  ngOnInit(): void {
    this.titleService.setTitle('WASSALI | Inscription Livreur');  
    if (isPlatformBrowser(this.platformId)) {
      window.localStorage.setItem("fPart", ""); 
      window.localStorage.setItem("sPart", "");    
    }
    
    
    this.route.queryParams.subscribe(params => {
      const session = params['session']; 
      if (session == undefined) 
      {
        this.msgSession.msg = "Vous ne disposez pas de session d'inscription d'un livreur!"; 
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
            const map_se: Map<string, object> = new Map<string, object>();
            map_se.set('session_id', { value: session }); 
            this.list.push(map_se);
            const map = new Map(Object.entries(response)); 
            this.prenom = map.get("reponse"); 
            this.intDistService.getIntervallesDistanceList().subscribe(response => { 
              this.intsDist = response;
              this.typeService.getTypesList().subscribe(response => {
                this.types = response; 
              }, 
              error => {
                  setTimeout(() => {
                  this.msgF_err = true; 
                  }, 10);  
                  setTimeout(() => {
                  this.msgF_err = false; 
                  }, 6000);
              }
            );  
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
      },
      error => {
        this.msgSession.msg = "Notre serveur rencontre un problème de traitement des requêtes mais nous nous sommes engagés pour le résoudre. Veuillez réessayer plus tard."; 
        this.router.navigate(['/connexion']);
      } 
    );
      }
    });
    
    


  }


  capturer(event : any){
    this.file = event.target.files[0]; 
  }
  
  onSubmit() 
  {
    this.processing = true; 
    this.route.queryParams.subscribe(params => {
      const session = params['session']; 
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
          if (this.vehicule != undefined) 
          {
            if (this.file == null) 
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
              var map : Map<string, object> = new Map<string, object>(); 
              for(let i = 0 ; i < this.inpts.length; i++) 
                map.set(this.intsDist[i].borneGauche + ',' + this.intsDist[i].borneDroite, {value : this.inpts[i]}); 
              this.list.push(map); 
              map = new Map<string, object>(); 
              map.set("vehicule", {value : this.vehicule});
              this.list.push(map);    
              this.userService.createLivreur(this.list).subscribe(response => {
                const map = new Map(Object.entries(response));
                if (map.get("reponse") == "email") 
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
                  fData.append("cin", this.file as File); 
                  fData.append("id", map.get("reponse"));  
                  this.userService.addCIN(fData).subscribe(response => {
                    this.route.queryParams.subscribe(params => {
                      const session = params['session']; 
                      this.router.navigate(["/attValid"], { queryParams : { session : session} });
                    }); 
                  },
                  error=> {
                    this.msgSession.msg = "Notre serveur rencontre actuellement un problème de traitement des requêtes mais nous nous sommes engagés pour le résoudre. Veuillez réessayer plus tard."; 
                    this.router.navigate(['/connexion']);
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
            }
            
          }
          else 
          {
            setTimeout(() => {
            this.processing=false; 
            }, 3000);
            setTimeout(() => {
              this.msgF_vh=true; 
            }, 2000);
            setTimeout(() => {
              this.msgF_vh=false; 
            }, 6000);
          }
        }         
    });  
    
   

}

}

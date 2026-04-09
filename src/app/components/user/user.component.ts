import { Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router, RouterModule, RouterOutlet} from '@angular/router';
import { NgForOf, NgIf, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MsgSessionService } from '../../services/msg-session.service';
import { UserService } from '../../services/user.service';
import { JwtService } from '../../services/jwt.service';
import { UserPrivilegeService } from '../../services/user-privilege.service';


@Component({
  selector: 'app-user',
  standalone: true,
  imports: [FormsModule, NgIf, NgForOf, RouterOutlet, RouterModule], 
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit{

  
  
  id! : number; 
  itemConfig! : boolean; 
  itemClients! : boolean; 
  itemLivreurs! : boolean; 
  itemAbonnements! : boolean; 
  photoUser! : any;
  admin! : boolean; 
  mas! : boolean; 
  fem! : boolean; 
  constructor(@Inject(PLATFORM_ID) private platformId: Object, private route : ActivatedRoute, private router : Router, public msgSession : MsgSessionService, private userService : UserService, private jwtService : JwtService, private userPrivService : UserPrivilegeService){}


  @HostListener('document:click', ['$event']) 
  onClick(event: Event) { 
    this.route.queryParams.subscribe(params => {
      const token = params['token']; 
      if (window.localStorage.getItem("sPart") == "" || (window.localStorage.getItem("fPart") as string) +  (window.localStorage.getItem("sPart") as string) != token) 
      {
          setTimeout(()=> {
            this.msgSession.msg = "Session expirée!"; 
            this.router.navigate(['/connexion']);
          }, 100); 
      }
      else 
      { 
        this.jwtService.checkToken((window.localStorage.getItem("fPart") as string) + (window.localStorage.getItem("sPart") as string)).subscribe(response =>{
          const map = new Map(Object.entries(response)); 
          if (map.get("reponse") =="email") 
          {
            setTimeout(()=> {
              this.msgSession.msg = "Compte plus disponible!";
              this.router.navigate(['/connexion']);
            }, 100); 
          } 
          else if (map.get("reponse") == "invalide")
          {  
            setTimeout(()=> {
              this.msgSession.msg = "Session expirée!"; 
              this.router.navigate(['/connexion']); 
            }, 100);   
          }
        },
        error => {
          this.msgSession.msg = "Notre serveur rencontre actuellement un problème de traitement des requêtes mais nous nous sommes engagés pour le résoudre. Veuillez réessayer plus tard."; 
          this.router.navigate(['/connexion']);
        } 
      ); 
      }
      });
    
    
  }
  
  ngOnInit(): void {
    if (this.route.children.length == 0)
      this.navigateToLivraisons();
    if (isPlatformBrowser(this.platformId))
    {
      this.route.queryParams.subscribe(params => {
        const token = params['token'];
        if (window.localStorage.getItem("sPart") == "" || (window.localStorage.getItem("fPart") as string) +  (window.localStorage.getItem("sPart") as string) != token) 
        {
            setTimeout(()=> {
              this.msgSession.msg = "Session expirée ou incorrecte!";
              this.router.navigate(['/connexion']);
            }, 100); 
        }
        else 
        {
            this.jwtService.checkToken((window.localStorage.getItem("fPart") as string) + (window.localStorage.getItem("sPart") as string)).subscribe(response =>{
              const map = new Map(Object.entries(response)); 
              if (map.get("reponse") =="email") 
              {
                setTimeout(()=> {
                  this.msgSession.msg = "Compte plus disponible!";
                  this.router.navigate(['/connexion']);
                }, 100); 
              } 
              else if (map.get("reponse") == "invalide")
              {
                setTimeout(()=> {
                  this.msgSession.msg = "Session expirée!"; 
                  this.router.navigate(['/connexion']);
                }, 100);   
              }
              else 
              {
                    this.userPrivService.findPrivileges((window.localStorage.getItem("fPart") as string) + (window.localStorage.getItem("sPart") as string)).subscribe(response => {
                      const map = new Map(Object.entries(response)); 
                      const privileges : any[] = Array.from(map.get("reponse"));    
                      if (privileges.includes("configuration")) 
                        this.itemConfig = true;
                      if (privileges.includes("gestion clients")) 
                        this.itemClients = true;
                      if (privileges.includes("gestion et demandes livreurs")) 
                        this.itemLivreurs = true;
                      if (privileges.includes("livraison")) 
                        this.itemAbonnements = true; 
                      this.userService.findIdUser((window.localStorage.getItem("fPart") as string) +  (window.localStorage.getItem("sPart") as string)).subscribe(response => {
                        this.id = Number(response); 
                        this.getPos(); 
                        this.userService.getPhoto((window.localStorage.getItem("fPart") as string) +  (window.localStorage.getItem("sPart") as string)).subscribe(response => {
                          const map = new Map(Object.entries(response)); 
                          if (map.get("admin") == true) 
                            this.admin = true; 
                          else if (map.get("genre") == "Masculin") 
                            this.mas = true; 
                          else if (map.get("genre") == "Feminin") 
                            this.fem = true; 
                          else 
                            this.photoUser = map.get("photo"); 
                      });
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
      },
      error => {
        this.msgSession.msg = "Notre serveur rencontre actuellement un problème de traitement des requêtes mais nous nous sommes engagés pour le résoudre. Veuillez réessayer plus tard."; 
        this.router.navigate(['/connexion']); 
      } 
    );
    }
      });
        }  
  }

  getPos() 
  {
    this.route.queryParams.subscribe(params => {
      if (window.localStorage.getItem("sPart") == "") 
      {
          this.msgSession.msg = "Session expirée!";
          this.router.navigate(['/connexion']);
      }
      else 
      {
        this.jwtService.checkToken((window.localStorage.getItem("fPart") as string) + (window.localStorage.getItem("sPart") as string)).subscribe(response =>{
          const map = new Map(Object.entries(response)); 
          if (map.get("reponse") =="email") 
          {
            this.msgSession.msg = "Compte plus disponible!";
            this.router.navigate(['/connexion']);
          } 
          else if (map.get("reponse") == "invalide")
          {
            this.msgSession.msg = "Session expirée!"; 
            this.router.navigate(['/connexion']);  
          }
          else 
          {
            this.userPrivService.checkPrivilegeLivr(this.id, (window.localStorage.getItem("fPart") as string) + (window.localStorage.getItem("sPart") as string)).subscribe(response => {
              const map = new Map(Object.entries(response)); 
              if (map.get("reponse") == true)  
              {
                if ('geolocation' in navigator) { 
                      
                  navigator.geolocation.getCurrentPosition(
                    (position) => { 
                                  const fData = new FormData(); 
                                  fData.append("id", this.id.toString());
                                  fData.append("pos", position.coords.latitude + ',' + position.coords.longitude);  
                                  if (window.localStorage.getItem("sPart") != "") 
                                    this.userService.posLivreur((window.localStorage.getItem("fPart") as string) + (window.localStorage.getItem("sPart") as string), fData).subscribe(response =>{
                                  }, 
                                  error => {
                                    this.msgSession.msg = "Notre serveur rencontre actuellement un problème de traitement des requêtes mais nous nous sommes engagés pour le résoudre. Veuillez réessayer plus tard."; 
                                    this.router.navigate(['/connexion']);
                                  }
                                  );
                              });
                      setTimeout(()=>{this.getPos();}, 5000); 
                 }
                 else  
                    this.userService.tkPosLivreur((window.localStorage.getItem("fPart") as string) + (window.localStorage.getItem("sPart") as string)).subscribe(response =>{ 
                    }, 
                    error => {
                      this.msgSession.msg = "Notre serveur rencontre actuellement un problème de traitement des requêtes mais nous nous sommes engagés pour le résoudre. Veuillez réessayer plus tard."; 
                      this.router.navigate(['/connexion']);
                    }
                  );   
              }
          }, error => {
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
    });
    
      
  }
  
  

  navigateToLivraisons() 
  {
    this.route.queryParams.subscribe(params => {
      const token = params['token']; 
      this.router.navigate(['/user/livraison/livraisons'], { queryParams : { token : token} });
    }); 
  }

  navigateToConfig() 
  {
    this.route.queryParams.subscribe(params => {
      const token = params['token']; 
      this.router.navigate(['/user/config'], { queryParams : { token : token} });
    }); 
  }

  navigateToLivreurs() 
  {
    this.route.queryParams.subscribe(params => {
      const token = params['token']; 
      this.router.navigate(['/user/livreurs'], { queryParams : { token : token} });
    }); 
  }

  navigateToAbonnements() 
  {
    this.route.queryParams.subscribe(params => {
      const token = params['token']; 
      this.router.navigate(['/user/abonnements'], { queryParams : { token : token} });
    }); 
  }

  navigateToClients() 
  {
    this.route.queryParams.subscribe(params => {
      const token = params['token']; 
      this.router.navigate(['/user/clients'], { queryParams : { token : token} });
    }); 
  }
  

  
  

}

import { Component, HostListener, Inject, PLATFORM_ID} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute} from '@angular/router'; 
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { UserService } from '../../services/user.service';
import { MsgSessionService } from '../../services/msg-session.service';


@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent{

  pass! : string; 
  passt! : string; 
  email! : string;  
  token! : string | null;    
  msgF = false; 
  msgS = false; 
  msgF_e = false; 
  processing = false;    
   
  constructor(private userService : UserService, private route : ActivatedRoute, private router : Router, private titleService : Title, public msgSession : MsgSessionService,  @Inject(PLATFORM_ID) private platformId: Object){}
  

  @HostListener('document:click', ['$event']) 
  onClick(event: Event) {
    this.route.queryParams.subscribe(params => {
      const token = params['token']; 
      this.userService.verifyToken(token).subscribe(response => {
          if (response == false) {
            this.msgSession.msg = "Session expirée ou incorrecte!"; 
            this.router.navigate(['/connexion']); 
          }
        },
        error => {
          this.msgSession.msg = "Notre serveur rencontre actuellement un problème de traitement des requêtes mais nous nous sommes engagés pour le résoudre. Veuillez réessayer plus tard."; 
          this.router.navigate(['/connexion']);
        } 
      );
      
    }); 
  }
  
  ngOnInit(): void {
    this.titleService.setTitle('WASSALI | Réinitialiser mot de passe');
    if (isPlatformBrowser(this.platformId)) {
      window.localStorage.setItem("fPart", ""); 
      window.localStorage.setItem("sPart", ""); 
    }
    this.route.queryParams.subscribe(params => {
      const token = params['token']; 
      if (token == undefined) 
      {
        this.msgSession.msg = "vous ne disposez pas de session!"; 
        this.router.navigate(['/connexion']);
      }
      else 
      {
        this.userService.verifyToken(token).subscribe(response => {
          if (response == false) {
            this.msgSession.msg = "Session expirée ou incorrecte!"; 
            this.router.navigate(['/connexion']); 
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
  
  onSubmit() 
  {
    const passRx : RegExp = /^.{8,}$/;
    if (this.pass.length >= 8 && this.pass.length <= 40 && this.passt != "" && this.passt != undefined)
    {
      this.processing = true; 
      if (this.pass != this.passt) 
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
        this.route.queryParams.subscribe(params => {
          this.token = params['token']; 
        });  
        this.userService.tokenEmail(this.token).subscribe(data => {  
          const map = new Map(Object.entries(data));  
          if (map.get("email") == false) 
          {
              this.msgSession.msg = "compte plus disponible!"; 
              this.router.navigate( ['/connexion']); 
          }
          else 
          {
            const fData = new FormData();
            fData.append("email", map.get("email")); 
            fData.append("password", this.pass); 
            this.userService.updateUser(fData).subscribe(response => {
              setTimeout(() => {
              this.processing = false; 
              }, 3000);
              setTimeout(() => {
              this.msgS = true; 
              }, 2000);
              setTimeout(() => {
              this.msgS = false; 
              }, 6000);
            },
            error => {
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
        error => {
          setTimeout(() => {
            this.msgF_e=true; 
          }, 10);
          setTimeout(() => {
          this.msgF_e=false; 
          }, 6000);
        } 
      ); 
      }
    } 

    
  }
}

import { Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { MsgSessionService } from '../../services/msg-session.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-validation-admin',
  standalone: true,
  imports: [],
  templateUrl: './validation-admin.component.html',
  styleUrl: './validation-admin.component.css'
})
export class ValidationAdminComponent implements OnInit{

  prenom : string = ""; 
  elementRef: any;


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
  
  constructor(private titleService : Title, private router : Router, private route : ActivatedRoute, public msgSession : MsgSessionService, private userService : UserService, @Inject(PLATFORM_ID) private platformId: Object  ){}
  
  ngOnInit(): void {
    this.titleService.setTitle('WASSALI | Attente Validation');
    if (isPlatformBrowser(this.platformId)) { 
           
      window.localStorage.setItem("fPart" ,""); 
      window.localStorage.setItem("sPart", "");  
    }
    this.route.queryParams.subscribe(params => {
      const session = params['session'];  
      if (session == undefined) 
      {
        this.msgSession.msg = "Vous ne disposez pas de session!";
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
            const fData = new FormData(); 
            fData.append("email", map.get("email"));  
            this.userService.checkEmail(fData).subscribe(response => {
              if (response == false) 
              {
                this.msgSession.msg = "Veuillez compléter votre inscription!"; 
                this.router.navigate(['/connexion']);
              }
              else 
              {
                  if (map.get("role") == "Client") 
                  {
                    this.msgSession.msg = "Ce compte client est déjà actif!"; 
                    this.router.navigate(['/connexion']);
                  }
              }
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

  navigateToConnexion() 
  {
    this.router.navigate(['/connexion']);
  }

 
}

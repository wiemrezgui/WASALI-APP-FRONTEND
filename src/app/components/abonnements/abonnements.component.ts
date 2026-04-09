import { NgForOf, NgIf, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UserPrivilegeService } from '../../services/user-privilege.service';
import { MsgSessionService } from '../../services/msg-session.service';

@Component({
  selector: 'app-abonnements',
  standalone: true,
  imports: [FormsModule, NgIf, NgForOf],
  templateUrl: './abonnements.component.html',
  styleUrl: './abonnements.component.css'
})
export class AbonnementsComponent implements OnInit {

  constructor(private router : Router, private route : ActivatedRoute, private titleService : Title, private userService : UserService, private userPrivService : UserPrivilegeService, private msgSession : MsgSessionService, @Inject(PLATFORM_ID) private platformId: Object){}
  

  abs! : any []; 
  abns! : any []; 
  lg! : number; 
  ngOnInit(): void {
    this.titleService.setTitle('WASSALI | Mes abonnements');
    if (isPlatformBrowser(this.platformId))
      {
        this.userPrivService.findPrivileges((window.localStorage.getItem("fPart") as string) + (window.localStorage.getItem("sPart") as string)).subscribe(response => {
          const map = new Map(Object.entries(response)); 
          const privileges : any[] = Array.from(map.get("reponse"));    
          if (!privileges.includes("livraison")) 
            this.navigateToLivraisons();
          const fData = new FormData(); 
          fData.append("token", (window.localStorage.getItem("fPart") as string) + (window.localStorage.getItem("sPart") as string)); 
          this.userService.findAbs(fData).subscribe(response => {
              this.abs = response as any[]; 
              this.abns = response as any[]; 
              this.lg = this.abns.length;  
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

  navigateToLivraisons() 
  {
  this.route.queryParams.subscribe(params => {
    const token = params['token']; 
    this.router.navigate(['/user/livraison/livraisons'], { queryParams : { token : token} });
  }); 
  }

  affiche(event: Event): void {
    const slValue = Number((event.target as HTMLSelectElement).value); 
    this.abs = []; 
    for(let i = 0 ; i < slValue ; i++)
      this.abs[i] = this.abns[i];
  }

  aff() 
  {
      this.abs = this.abns; 
  }

  getNbs(): number[] {
    return Array(this.lg).fill(0).map((x, i) => i + 1);
  }

}

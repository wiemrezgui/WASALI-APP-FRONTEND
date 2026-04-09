import { NgForOf, NgIf, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { UserPrivilegeService } from '../services/user-privilege.service';
import { GouvernoratService } from '../services/gouvernorat.service';
import { MsgSessionService } from '../services/msg-session.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Gouvernorat } from '../models/gouvernorat';

@Component({
  selector: 'app-configuration',
  standalone: true,
  imports: [FormsModule, NgIf, NgForOf],
  templateUrl: './configuration.component.html',
  styleUrl: './configuration.component.css'
})
export class ConfigurationComponent implements OnInit {

  gouvs : string [] = ['Ariana', 'Béja', 'Ben Arous', 'Bizerte', 'Gabès', 'Gafsa', 'Jendouba', 'Kairouan', 'Kasserine', 'Kébili', 'Le Kef', 'La Manouba', 'Mahdia', 'Médenine', 'Monastir', 'Nabeul', 'Sfax', 'Sidi Bouzid', 'Siliana', 'Sousse', 'Tataouine', 'Tozeur', 'Tunis', 'Zaghouan']; 
  gvs : Gouvernorat[] = []; 
  msgF = false; 
  msgF_gv = false; 
  processing = false; 

  constructor(private titleService : Title, public msgSession : MsgSessionService,  private route : ActivatedRoute, private router : Router, @Inject(PLATFORM_ID) private platformId: Object, private gouvService : GouvernoratService, private userPrivService : UserPrivilegeService){}
  
  
  ngOnInit(): void {
    this.titleService.setTitle('WASSALI | Configuration'); 

    if (isPlatformBrowser(this.platformId)) 
      {
        
        this.userPrivService.findPrivileges((window.localStorage.getItem("fPart") as string) + (window.localStorage.getItem("sPart") as string)).subscribe(response => {
          const map = new Map(Object.entries(response)); 
          const privileges : any[] = Array.from(map.get("reponse"));    
          if (!privileges.includes("configuration")) 
            this.navigateToLivraisons();     
        }, 
        error => {
          this.msgSession.msg = "Notre serveur rencontre actuellement un problème de traitement des requêtes mais nous nous sommes engagés pour le résoudre. Veuillez réessayer plus tard."; 
          this.router.navigate(['/connexion']);
        }
        );
        this.gouvService.getGouvsList().subscribe(response => { 
          this.gvs = response;
        }, 
        error => {
          setTimeout(() => {
            this.msgF=true; 
          }, 100);
          setTimeout(() => {
          this.msgF=false; 
          }, 6000);
        }        
      );  

      }   
  }

  insertGouv(gv : string) 
  {
      this.processing = true; 
      const fData = new FormData(); 
      fData.append("gv", gv); 
      fData.append("token", (window.localStorage.getItem("fPart") as string) + (window.localStorage.getItem("sPart") as string));
      this.gouvService.insertGouv(fData).subscribe(response => {
        const map = new Map(Object.entries(response)); 
        if (map.get("reponse") == "privilege") 
          this.navigateToLivraisons(); 
        else 
          window.location.reload(); 
      },
      error => {
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
    );
  }

  deleteGouv(gv : string) 
  {
      this.processing = true;
      const fData = new FormData(); 
      fData.append("gv", gv); 
      fData.append("token", (window.localStorage.getItem("fPart") as string) + (window.localStorage.getItem("sPart") as string));
      this.gouvService.deleteGouv(fData).subscribe(response => {
        const map = new Map(Object.entries(response)); 
          if (map.get("reponse") == "privilege") 
            this.navigateToLivraisons();
          else if (map.get("reponse") == "utilisé") 
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
          else
            window.location.reload(); 
      },
      error => {
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
    );
  }


  checkGouv(gv : string) 
  {
    return this.gvs.some(item => item.gouv == gv); 
  }

  navigateToLivraisons() 
  {
    this.route.queryParams.subscribe(params => {
      const token = params['token']; 
      this.router.navigate(['/user/livraison/livraisons'], { queryParams : { token : token} });
    }); 
  } 

}

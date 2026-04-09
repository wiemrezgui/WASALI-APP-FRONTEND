import { Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForOf, NgIf, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { MsgSessionService } from '../../services/msg-session.service';
import { UserPrivilegeService } from '../../services/user-privilege.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-demandes-inscription',
  standalone: true,
  imports: [FormsModule, NgIf, NgForOf],
  templateUrl: './demandes-inscription.component.html',
  styleUrl: './demandes-inscription.component.css'
})
export class DemandesInscriptionComponent implements OnInit {

  dms! : any[]; 
  ddms! : any[]; 
  intDists! : any;
  tel! : string; 
  genre! : string;  
  type! : string;
  lg! : number;   
  processing = false; 
  msgF_e = false; 
  msgF_t = false; 
  cinnn! : any; 
  @ViewChild('pp') pp! : ElementRef;
  @ViewChild('cin') cin! : ElementRef;
  @ViewChild('dts') dts! : ElementRef;
  
  constructor(private titleService : Title, private router : Router, public msgSession : MsgSessionService, private userPrivService : UserPrivilegeService, private route : ActivatedRoute, @Inject(PLATFORM_ID) private platformId: Object, private userService : UserService){}
  
  ngOnInit(): void {
    this.titleService.setTitle("WASSALI | Demandes d'inscription"); 
    if (isPlatformBrowser(this.platformId))
    {
      this.userPrivService.findPrivileges((window.localStorage.getItem("fPart") as string) + (window.localStorage.getItem("sPart") as string)).subscribe(response => {
        const map = new Map(Object.entries(response)); 
        const privileges : any[] = Array.from(map.get("reponse"));    
        if (!privileges.includes("gestion et demandes livreurs")) 
          this.navigateToLivraisons(); 
        this.userService.findDms((window.localStorage.getItem("fPart") as string) + (window.localStorage.getItem("sPart") as string)).subscribe(response => {
          this.dms = response as any[];
          this.ddms = response as any[];
          this.lg = this.dms.length; 
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
         
      }, 
      error => {
        this.msgSession.msg = "Notre serveur rencontre actuellement un problème de traitement des requêtes mais nous nous sommes engagés pour le résoudre. Veuillez réessayer plus tard."; 
        this.router.navigate(['/connexion']); 
      } 
      );
    }
  }

  validateDm(id : string) 
  {
    this.processing = true; 
    const fData = new FormData(); 
    fData.append("id", id); 
    fData.append("token", (window.localStorage.getItem("fPart") as string) + (window.localStorage.getItem("sPart") as string));  
    this.userService.validateDm(fData).subscribe(response => {
      const map = new Map(Object.entries(response)); 
      if (map.get("reponse") == "privilege") 
       this.navigateToLivraisons(); 
      else if (map.get("reponse") == "transmission")
      {
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
        window.location.reload(); 
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

  affCin(cn : any) 
  {
      this.cinnn = cn;  
      this.pp.nativeElement.style.display = "block"; 
      this.cin.nativeElement.style.display = "block";
      setTimeout(()=> {
        this.pp.nativeElement.style.opacity = "1"; 
    }, 10); 
  }

  rejectDm(id : string) 
  {
    this.processing = true; 
    const fData = new FormData(); 
    fData.append("id", id); 
    fData.append("token", (window.localStorage.getItem("fPart") as string) + (window.localStorage.getItem("sPart") as string));
    this.userService.rejectDm(fData).subscribe(response => {
      const map = new Map(Object.entries(response));
      if (map.get("reponse") == "privilege") 
        this.navigateToLivraisons(); 
       else if (map.get("reponse") == "transmission")
       {
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
         window.location.reload(); 
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

  aff() 
  {
    this.dms = this.ddms; 
  }

  affiche(event: Event): void {
    const slValue = Number((event.target as HTMLSelectElement).value); 
    this.dms = []; 
    for(let i = 0 ; i < slValue ; i++)
      this.dms[i] = this.ddms[i];
  }

  getNbs(): number[] {
    return Array(this.lg).fill(0).map((x, i) => i + 1);
  }

  

  passer(intDists : any, tel : string, genre : string, type : string) 
  {
      this.pp.nativeElement.style.display = "block"; 
      setTimeout(()=> {this.pp.nativeElement.style.opacity = "1";}, 10);  
      this.dts.nativeElement.style.display = "block"; 
      this.intDists = intDists; 
      this.tel = tel; 
      this.genre = genre; 
      this.type = type; 
  }


  navigateToLivraisons() 
  {
  this.route.queryParams.subscribe(params => {
    const token = params['token']; 
    this.router.navigate(['/user/livraison/livraisons'], { queryParams : { token : token} });
  }); 
  } 
}

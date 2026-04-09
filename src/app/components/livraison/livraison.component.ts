import { isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { UserPrivilegeService } from '../../services/user-privilege.service';
import { MsgSessionService } from '../../services/msg-session.service';
@Component({
  selector: 'app-livraison',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './livraison.component.html',
  styleUrl: './livraison.component.css'
})
export class LivraisonComponent implements OnInit {

  
  @ViewChild('nav') nav! : ElementRef;
  @ViewChild('ic') ic! : ElementRef;
  
  itemDemande = false; 
  itemLivraisons = false; 
  msgF_er = false; 
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object, private route : ActivatedRoute, private router : Router, private userPrivService : UserPrivilegeService, public msgSession : MsgSessionService){}
  

   

  
  

  
  
  ngOnInit(): void {
    if (this.route.children.length == 0)
      this.navigateToLivraisons();
    if (isPlatformBrowser(this.platformId)) 
    {

                this.userPrivService.findPrivileges((window.localStorage.getItem("fPart") as string) + (window.localStorage.getItem("sPart") as string)).subscribe(response => {
                  const map = new Map(Object.entries(response)); 
                  const privileges : any[] = Array.from(map.get("reponse"));    
                  if (privileges.includes("demande et suivi")) 
                    this.itemDemande = true; 
                  if (privileges.includes("CRUD livraisons")) 
                    this.itemLivraisons = true;        
                }, 
                error=> {
                  this.msgSession.msg = "Notre serveur rencontre actuellement un problème de traitement des requêtes mais nous nous sommes engagés pour le résoudre. Veuillez réessayer plus tard."; 
                  this.router.navigate(['/connexion']);
                } 
              ); 
    }
    
  }


  navigateToDemande() 
  {
    this.route.queryParams.subscribe(params => {
      const token = params['token']; 
      this.router.navigate(['/user/livraison/demande'], { queryParams : { token : token} });
    }); 
  }

  navigateToLivraisons() 
  {
    this.route.queryParams.subscribe(params => {
      const token = params['token']; 
      this.router.navigate(['/user/livraison/livraisons'], { queryParams : { token : token} });
    }); 
  }

  navigateToHistorique() 
  {
    this.route.queryParams.subscribe(params => {
      const token = params['token']; 
      this.router.navigate(['/user/livraison/historique'], { queryParams : { token : token} });
    }); 
  }

  navigateToDmRes() 
  {
    this.navigateToDemande(); 
    this.nav.nativeElement.style.display = "none"; 
    this.ic.nativeElement.src = "assets/icons/menu.png"; 
  }

  navigateToLivsRes() 
  {
    this.navigateToLivraisons(); 
    this.nav.nativeElement.style.display = "none";
    this.ic.nativeElement.src = "assets/icons/menu.png";
  }

  navigateToHistRes() 
  {
    this.navigateToHistorique(); 
    this.nav.nativeElement.style.display = "none";
    this.ic.nativeElement.src = "assets/icons/menu.png";
  }


  
}

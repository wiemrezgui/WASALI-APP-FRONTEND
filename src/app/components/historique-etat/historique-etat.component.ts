import { NgForOf, NgIf, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { HistoriqueEtatService } from '../../services/historique-etat.service';

@Component({
  selector: 'app-historique-etat',
  standalone: true,
  imports: [FormsModule, NgIf, NgForOf],
  templateUrl: './historique-etat.component.html',
  styleUrl: './historique-etat.component.css'
})
export class HistoriqueEtatComponent implements OnInit {

  

  constructor(private titleService : Title, private histEtatService : HistoriqueEtatService, @Inject(PLATFORM_ID) private platformId: Object){}
  
  histEtats! : any[]; 
  histEts! : any[]; 
  msgF = false;  
  lg! : number; 

  ngOnInit(): void {
    this.titleService.setTitle('WASSALI | Historique États');
    if (isPlatformBrowser(this.platformId)) 
    {
      this.histEtatService.findHistEtats((window.localStorage.getItem("fPart") as string) + (window.localStorage.getItem("sPart") as string)).subscribe(response => { 
          this.histEtats = response as any[]; 
          this.lg = this.histEtats.length; 
          this.histEts = this.histEtats; 
      },
      error => {
          setTimeout(() => {
          this.msgF = true; 
          }, 10);  
          setTimeout(() => {
          this.msgF = false; 
          }, 6000);
      } 
    );
    }

     
  }

  aff() 
  {
    this.histEtats = this.histEts; 
  }

  affiche(event: Event): void {
    const slValue = Number((event.target as HTMLSelectElement).value); 
    this.histEtats = []; 
    for(let i = 0 ; i < slValue ; i++)
      this.histEtats[i] = this.histEts[i];
  }

  getNbs(): number[] {
    return Array(this.lg).fill(0).map((x, i) => i + 1);
  }

  
}

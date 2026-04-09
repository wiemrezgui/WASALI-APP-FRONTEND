import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-livreurs',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './livreurs.component.html',
  styleUrl: './livreurs.component.css'
})
export class LivreursComponent implements OnInit {


  @ViewChild('nav') nav! : ElementRef;
  @ViewChild('ic') ic! : ElementRef;
  
  constructor(private router : Router, private route : ActivatedRoute){} 

  ngOnInit(): void {
    if (this.route.children.length == 0)
      this.navigateToGestion();
  }

  navigateToDemandesIns() 
  {
    this.route.queryParams.subscribe(params => {
      const token = params['token']; 
      this.router.navigate(['/user/livreurs/demandesIns'], { queryParams : { token : token} });
    }); 
  }

  navigateToGestion() 
  {
    this.route.queryParams.subscribe(params => {
      const token = params['token']; 
      this.router.navigate(['/user/livreurs/gestionLivreurs'], { queryParams : { token : token} });
    }); 
  }


  navigateToDmsInsRes() 
  {
    this.navigateToDemandesIns(); 
    this.nav.nativeElement.style.display = "none"; 
    this.ic.nativeElement.src = "assets/icons/menu.png"; 
  }

  navigateToGtRes() 
  {
    this.navigateToGestion(); 
    this.nav.nativeElement.style.display = "none";
    this.ic.nativeElement.src = "assets/icons/menu.png";
  }

}

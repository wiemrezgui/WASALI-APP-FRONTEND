import { Component, HostListener, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router'; 

import { isPlatformBrowser } from '@angular/common';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ResetPasswordComponent, ForgotPasswordComponent, RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent { 


  
  


}

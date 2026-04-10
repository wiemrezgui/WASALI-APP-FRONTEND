import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core'; 
import { FormsModule } from '@angular/forms'; 
import { NgIf, isPlatformBrowser } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { MsgSessionService } from '../../services/msg-session.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent implements OnInit{
  logoPath = 'assets/images/Wassali_Logo.png';
   
  processing = false; 
  msgF_em = false; 
  msgF_lm = false; 
  msgF_t = false;  
  msgS = false;
  msgF_e = false;   
  user : User = new User();  

  
  constructor(private userService : UserService, private titleService : Title, public msgSession : MsgSessionService,  @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    this.titleService.setTitle('WASSALI | Mot de passe oublié');
    if (isPlatformBrowser(this.platformId)) {
      window.localStorage.setItem("fPart", ""); 
      window.localStorage.setItem("sPart", ""); 
    } 
  }
  onSubmit() 
  { 
    const emailRx: RegExp = /^(?=.{1,256}$)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; 
    if (emailRx.test(this.user.email))
    { 
      this.processing = true;
      this.userService.sendResetMail(this.user.email)
        .subscribe(response => {
          const map = new Map(Object.entries(response));
          if (map.get("reponse") == "email") 
          {
              setTimeout(() => {
              this.processing=false; 
              }, 3000);
              setTimeout(() => {
                this.msgF_em=true; 
              }, 2000);
              setTimeout(() => {
              this.msgF_em=false; 
              }, 6000);
          }
          else if (map.get("reponse") == "limite") 
          {
              setTimeout(() => {
              this.processing=false; 
              }, 3000);
              setTimeout(() => {
                this.msgF_lm=true; 
              }, 2000);
              setTimeout(() => {
              this.msgF_lm=false; 
              }, 6000);
          }
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
          { 
              setTimeout(() => {
              this.processing=false; 
              }, 3000);
              setTimeout(() => {
                this.msgS=true; 
              }, 2000);
              setTimeout(() => {
              this.msgS=false; 
              }, 6000);
          }
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
}

  scrollToPage(page: string) {
    window.location.href = page;
  }  





}

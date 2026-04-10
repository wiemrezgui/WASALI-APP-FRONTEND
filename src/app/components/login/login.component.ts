import { Component, Inject, OnInit, PLATFORM_ID} from '@angular/core'
import { FormsModule } from '@angular/forms';  
import { NgIf, isPlatformBrowser } from '@angular/common';  
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { MsgSessionService } from '../../services/msg-session.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent implements OnInit{
  logoPath = 'assets/images/Wassali_Logo.png';
  user: User = new User();
  msgF_em = false;
  msgF_v = false;
  msgF_ses = false;    
  msgF_e = false;    
  processing = false;   
  

  

  constructor(private userService : UserService, private router : Router, private titleService : Title, public msgSession : MsgSessionService, @Inject(PLATFORM_ID) private platformId: Object){} 
  
  ngOnInit(): void { 
      this.titleService.setTitle('WASSALI | Connexion'); 
      if (isPlatformBrowser(this.platformId)) { 
           
        window.localStorage.setItem("fPart" ,""); 
        window.localStorage.setItem("sPart", ""); 
       
        
      }
      if (this.msgSession.msg != undefined && this.msgSession.msg !="") 
      { 
        setTimeout(() => {
        this.msgF_ses=true; 
        }, 1000);
        setTimeout(() => {
        this.msgF_ses=false; 
        }, 6000); 
      } 
  }
  



onSubmit(){ 
  
  const emailRx: RegExp = /^(?=.{1,256}$)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; 
  if (emailRx.test(this.user.email) && this.user.password!=undefined && this.user.password != "")
  { 
    this.processing = true;
    const fData = new FormData(); 
    fData.append("email", this.user.email); 
    fData.append("password", this.user.password); 
    this.userService.checkEmailAndPass(fData).subscribe(response => {
        const map = new Map(Object.entries(response));
        if (map.get("reponse") == "invalide") 
        {
            setTimeout(() => {
            this.processing=false; 
            }, 3000);
            setTimeout(() => {
              this.msgF_em=true; 
            }, 2000)
            setTimeout(() => {
            this.msgF_em=false; 
            }, 6000);
        }
        else if (map.get("reponse") == "validation") 
        {
            setTimeout(() => {
            this.processing=false; 
            }, 3000);
            setTimeout(() => {
              this.msgF_v=true; 
            }, 2000)
            setTimeout(() => {
            this.msgF_v=false; 
            }, 6000); 
        }
        else
        {
            const token : string = map.get("token") as string;  
            const fPart = token.substring(0, token.length / 2);  
            const sPart = token.substring(token.length / 2, token.length);   
            window.localStorage.setItem("fPart", fPart); 
            window.localStorage.setItem("sPart", sPart);  
            this.router.navigate(['/user/livraison/livraisons'], { queryParams : { token : token} });
        } 
      },
      error => {  
        setTimeout(() => {
        this.processing=false; 
        }, 3000);
        setTimeout(() => {
          this.msgF_e=true; 
        }, 2000)
        setTimeout(() => {
        this.msgF_e=false; 
        }, 8000);
      } 
    ); 

  }

  }

 scrollToPage(page: string) {
    window.location.href = page;
  }

  
}

import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { NgFor, NgIf, isPlatformBrowser } from '@angular/common'; 
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { User } from '../../models/user';
import { Role } from '../../models/role';
import { UserService } from '../../services/user.service';
import { RoleService } from '../../services/role.service';




@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent implements  OnInit {
  logoPath = 'assets/images/Wassali_Logo.png';
  user: User = new User(); 
  roles: Role [] = []; 
  msgF_em = false;  
  msgF_se = false;    
  processing = false;  
  msgF_e = false;  
  msgF_r = false;  


  constructor(private userService : UserService, private roleService : RoleService, private router : Router, private titleService : Title, @Inject(PLATFORM_ID) private platformId: Object){} 

  ngOnInit(): void {
    this.titleService.setTitle('WASSALI | Inscription');
    if (isPlatformBrowser(this.platformId)) {
      window.localStorage.setItem("fPart", ""); 
      window.localStorage.setItem("sPart", ""); 
      
    }
    this.roleService.getRolesList().subscribe((data : Role[]) => {
        var k = 0; 
        for(let i = 0 ; i < data.length ; i++) 
        {
          if (data[i].role != "Admin")
          {
            this.roles[k] = data[i]; 
            k++; 
          }
        }
    },
    error => {
        setTimeout(() => {
        this.msgF_r = true; 
        }, 10);  
        setTimeout(() => {
        this.msgF_r = false; 
        }, 6000);
    } 
  ); 
  }

  capturer(event : any){
    this.user.photo = event.target.files[0]; 
  }
  
  onSubmit() 
  {      
    const emailRx: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;  
    const telRx : RegExp = /^[0-9]{8}$/; 
    if (this.user.nom != undefined && this.user.nom != "" && this.user.prenom != undefined && this.user.prenom != "" && this.user.nom.length >= 3 && this.user.nom.length <= 40  && this.user.prenom.length >= 3 && this.user.prenom.length <= 40 && this.user.genre!=undefined && this.user.tel!=undefined && this.user.tel != "" && this.user.role!=undefined &&  emailRx.test(this.user.email) && telRx.test(this.user.tel) && this.user.password.length >= 8 && this.user.password.length <= 40)
    { 
        this.processing = true;
        const fData = new FormData(); 
        fData.append("email", this.user.email); 
        this.userService.checkEmail(fData)
          .subscribe(response => {
            if (response)
            { 
                setTimeout(() => {
                this.processing=false; 
                }, 3000);
                setTimeout(() => {
                  this.msgF_em = true; 
                  }, 2000);  
                setTimeout(() => {
                this.msgF_em=false; 
                }, 6000);
            }
            else 
            {
              const fData = new FormData();
              if (this.user.photo != null) 
                fData.append("photo", this.user.photo);
              fData.append("email", this.user.email);
              fData.append("password", this.user.password);  
              fData.append("nom", this.user.nom);  
              fData.append("prenom", this.user.prenom);  
              fData.append("tel", this.user.tel);  
              fData.append("genre", this.user.genre);  
              fData.append("role", this.user.role);     
              this.userService.createSession(fData).subscribe(response  => { 
                const map = new Map(Object.entries(response));  
                if(map.get("reponse") == "limite")
                {
                  setTimeout(() => {
                  this.processing=false; 
                  }, 3000);
                  setTimeout(() => {
                  this.msgF_se = true; 
                  }, 2000);  
                  setTimeout(() => {
                  this.msgF_se=false; 
                  }, 6000);
                }
                else  
                { 
                  const map = new Map(Object.entries(response));  
                  this.router.navigate(['/ins' + this.user.role ], { queryParams : { session : map.get('session_id')} });
                }
            }, 
            error => {
                setTimeout(() => {
                this.processing=false; 
                }, 3000);
                setTimeout(() => {
                this.msgF_e = true; 
                }, 2000);  
                setTimeout(() => {
                this.msgF_e=false; 
                }, 8000);
            }
          ); 
            } 
            },
            error => {
                setTimeout(() => {
                this.processing=false; 
                }, 3000);
                setTimeout(() => {
                this.msgF_e = true; 
                }, 2000);  
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

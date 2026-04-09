import { Routes } from '@angular/router';  
import { ConfigurationComponent } from './configuration/configuration.component';
import { LivreursComponent } from './components/livreurs/livreurs.component';
import { ClientsComponent } from './components/clients/clients.component';
import { AbonnementsComponent } from './components/abonnements/abonnements.component';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { SignupClientComponent } from './components/signup-client/signup-client.component';
import { SignupLivreurComponent } from './components/signup-livreur/signup-livreur.component';
import { ValidationAdminComponent } from './components/validation-admin/validation-admin.component';
import { UserComponent } from './components/user/user.component';
import { LivraisonComponent } from './components/livraison/livraison.component';
import { DemandeLivraisonComponent } from './components/demande-livraison/demande-livraison.component';
import { HistoriqueEtatComponent } from './components/historique-etat/historique-etat.component';
import { LivraisonsComponent } from './components/livraisons/livraisons.component';
import { DemandesInscriptionComponent } from './components/demandes-inscription/demandes-inscription.component';
import { GestionLivreursComponent } from './components/gestion-livreurs/gestion-livreurs.component';


export const routes: Routes = [
            { path: '', redirectTo: 'connexion', pathMatch:'full'},
            { path: 'connexion', component: LoginComponent },
            { path: 'inscription', component: SignUpComponent}, 
            { path: 'reset', component: ResetPasswordComponent}, 
            { path: 'forget', component: ForgotPasswordComponent}, 
            {path : 'insClient', component: SignupClientComponent},
            {path : 'insLivreur', component: SignupLivreurComponent},
            {path : 'attValid', component: ValidationAdminComponent},
            {path : 'user', component: UserComponent, 
            children : [
                {path : 'livraison', component : LivraisonComponent,
                children : [
                    {path : 'demande', component : DemandeLivraisonComponent}, 
                    {path : 'historique', component : HistoriqueEtatComponent}, 
                    {path : 'livraisons', component : LivraisonsComponent
                }]
            }, 
            {path : 'config', component : ConfigurationComponent}, 
            {path : 'clients', component : ClientsComponent}, 
            {path : 'abonnements', component : AbonnementsComponent}, 
            {path : 'livreurs', component : LivreursComponent, 
                children : [
                    {path : 'demandesIns', component : DemandesInscriptionComponent}, 
                    {path : 'gestionLivreurs', component : GestionLivreursComponent}
                ]
            }
            ]}, 
            { path: '**', redirectTo: 'connexion', pathMatch:'full'}
            
];

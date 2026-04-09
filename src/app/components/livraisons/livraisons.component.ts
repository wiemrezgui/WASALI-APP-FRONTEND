import { NgForOf, NgIf, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, HostListener, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import OLMap from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import Feature from 'ol/Feature';
import { fromLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Icon, Style } from 'ol/style';
import { Geometry, Point } from 'ol/geom';
import { Subject, debounceTime } from 'rxjs';
import { Gouvernorat } from '../../models/gouvernorat';
import { IntervalleDistance } from '../../models/intervalle-distance';
import { TypeVehicule } from '../../models/type-vehicule';
import { User } from '../../models/user';
import { MsgSessionService } from '../../services/msg-session.service';
import { MsgSessionnService } from '../../services/msg-sessionn.service';
import { UserPrivilegeService } from '../../services/user-privilege.service';
import { UserService } from '../../services/user.service';
import { LivraisonService } from '../../services/livraison.service';
import { HistoriqueEtatService } from '../../services/historique-etat.service';
import { MapsService } from '../../services/maps.service';
import { GouvernoratService } from '../../services/gouvernorat.service';
import { IntervalleDistanceService } from '../../services/intervalle-distance.service';
import { TypeVehiculeService } from '../../services/type-vehicule.service';
import { UserIntervalleService } from '../../services/user-intervalle.service';

@Component({
  selector: 'app-livraisons',
  standalone: true,
  imports: [FormsModule, NgIf, NgForOf],
  templateUrl: './livraisons.component.html',
  styleUrl: './livraisons.component.css'
})
export class LivraisonsComponent implements OnInit{

  @ViewChild('pp') pp! : ElementRef;
  @ViewChild('adds') adds! : ElementRef;
  @ViewChild('addsIns') addsIns! : ElementRef;
  @ViewChild('update') up! : ElementRef;
  @ViewChild('add') add! : ElementRef;
  @ViewChild('dp') dp! : ElementRef;
  @ViewChild('dpCl') dpCl! : ElementRef;
  @ViewChild('dppCl') dppCl! : ElementRef;
  @ViewChild('m') m! : ElementRef;
  @ViewChild('ty') ty! : ElementRef;
  @ViewChild('dvv') dvv! : ElementRef;
  @ViewChild('cin') cinn! : ElementRef;
  @ViewChild('dts') dts! : ElementRef;

  @HostListener('document:click', ['$event']) 
  onClick(event: Event) { 
    this.showsgs = false;  
    this.showsgss = false; 
  }
  
  CRUD_livraisons = false; 
  livraison = false;   
  clients = false; 
  livreurs = false;  
  msgF_ll = false; 
  msgF_rt = false; 
  msgF_dt = false; 
  msgF_df = false; 
  msgF_dn = false;  
  msgF_ec = false;  
  msgF_nbb = false;  
  msgF_abn = false;  
  msgF_cl = false; 
  msgF_g = false; 
  msgF_gd = false; 
  msgF_e = false;
  msgF_ses = false;
  msgF_S = false;  
  msgF_mp = false; 
  msgF_clm = false; 
  msgF_lvm = false; 
  msgF_tym = false; 
  msgF_t = false; 
  accepter = false; 
  full = false; 
  showsgs = false;
  showsgss = false;  
  processing = false;
  ok = false;  
  livraisons! : any[];
  livs! : any[];
  id! : number; 
  map! : OLMap; 
  markerLayer!: VectorLayer<VectorSource<Feature<Geometry>>>;
  tarif! : number; 
  retr! : string; 
  dest! : string; 
  date! : string;
  ad! : string; 
  adr! : string;
  etat! : string; 
  inputSubject: Subject<string> = new Subject<string>();
  inputSubjectt: Subject<string> = new Subject<string>();
  sgs : { title : string, lat : number, lng : number, codeP : number, gouv : string, region : string, nom : string}[] = [];
  sgss : { title : string, lat : number, lng : number, codeP : number, gouv : string, region : string, nom : string}[] = [];
  gouvs : Gouvernorat[] = [];
  distance! : number; 
  ints : IntervalleDistance[] = []; 
  idLivrs! : number;
  idLivv! : number;  
  idInt! : number;
  idLivreur! : number;
  types : TypeVehicule [] = [];   
  livrr : any; 
  depNom! : string; 
  depRegion! : string; 
  depCodeP! : string; 
  depGouv! : string;  
  nom! : string; 
  region! : string; 
  codeP! : string; 
  gouv! : string;  
  nomLivreur! : string;
  vehicule! : string;
  idVehicule! : string;
  idClient! : number;
  lg! : number;  
  nomClient! : string; 
  telClient! : string; 
  telLivreur! : string;  
  clts : User[] = [];
  cinnn! : any; 

 
  
  constructor(private titleService : Title, @Inject(PLATFORM_ID) private platformId: Object, public msgSession : MsgSessionService, public msgSessionn : MsgSessionnService, private userPrivService : UserPrivilegeService, private userService : UserService, private livraisonService : LivraisonService, private histEtatService : HistoriqueEtatService, private mapsService : MapsService, private gouvService : GouvernoratService, private intService : IntervalleDistanceService, private typeService : TypeVehiculeService, private userIntService : UserIntervalleService){
    this.inputSubjectt.pipe(debounceTime(50)).subscribe((value: string) => {
      this.searchAdd(); 
    });
    this.inputSubject.pipe(debounceTime(50)).subscribe((value: string) => {
      this.searchAd(); 
    });
  }
  

  
  
  handleInpp(event : any){
    this.inputSubjectt.next("");
  }

  handleInp(event : any){
    this.inputSubject.next("");
  }

  affiche(event: Event): void {
    const slValue = Number((event.target as HTMLSelectElement).value); 
    this.livraisons = []; 
    for(let i = 0 ; i < slValue ; i++)
      this.livraisons[i] = this.livs[i];
  }

  
  
  ngOnInit(): void {
    this.titleService.setTitle('WASSALI | Livraisons');
    setTimeout(()=> {
      if (this.msgSessionn.msg != undefined && this.msgSessionn.msg !="") 
      {  
            setTimeout(() => {
            this.msgF_ses=true; 
            }, 1000); 
            setTimeout(() => {
            this.msgF_ses=false; 
            }, 6000); 
            setTimeout(() => {
              this.msgSessionn.msg = "";  
            }, 8000); 
      }
    }, 10); 
    if (isPlatformBrowser(this.platformId)) 
    {

      this.map = new OLMap({ 
        target: 'map',
        layers: [
          new TileLayer({
            source: new XYZ({
              url: 'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'
            })
          })
        ],
        view: new View({
          center: fromLonLat([10.1815, 36.8065]),
          zoom: 17
        })
      });
          
          this.userService.findIdUser((window.localStorage.getItem("fPart") as string) + (window.localStorage.getItem("sPart") as string)).subscribe(response => {
            this.id = Number(response); 
            this.userPrivService.findPrivileges((window.localStorage.getItem("fPart") as string) + (window.localStorage.getItem("sPart") as string)).subscribe(response => {
              const map = new Map(Object.entries(response)); 
              const privileges : any[] = Array.from(map.get("reponse"));   
                if (privileges.includes("CRUD livraisons") || privileges.includes("demande et suivi") && privileges.includes("livraison"))
                { 
                  this.clients = true; 
                  this.livreurs = true; 
                }
                else if (privileges.includes("demande et suivi")) 
                  this.clients = true; 
                else if (privileges.includes("livraison")) 
                  this.livreurs = true; 
                       
                if (privileges.includes("livraison")) 
                  this.livraison = true;   
                if (privileges.includes("demande et suivi")) 
                  this.accepter = true;
                setTimeout(() => {if (privileges.includes("CRUD livraisons")) 
                {
                  this.CRUD_livraisons = true; 
                  this.dvv.nativeElement.style.marginTop = "11vh"; 
                  this.livraisonService.findAllLivraisons((window.localStorage.getItem("fPart") as string) + (window.localStorage.getItem("sPart") as string)).subscribe(response => {
                    const m = new Map(Object.entries(response)); 
                    this.livs = m.get("reponse");
                    this.livraisons = m.get("reponse");
                    this.lg = this.livraisons.length; 
                  },
                  error => {
                      setTimeout(() => {
                      this.msgF_e = true; 
                      }, 10);  
                      setTimeout(() => {
                      this.msgF_e = false; 
                      }, 6000);
                  } 
                ); 
                }
                else 
                {
                  this.dvv.nativeElement.style.marginTop = "7vh";
                  this.livraisonService.findLivraisonsUser((window.localStorage.getItem("fPart") as string) + (window.localStorage.getItem("sPart") as string)).subscribe(response => {
                    const mp = new Map(Object.entries(response));    
                    this.livs = mp.get("reponse"); 
                    this.livraisons = mp.get("reponse");
                    this.lg = this.livraisons.length;
                  },
                  error => {
                      setTimeout(() => {
                      this.msgF_e = true; 
                      }, 10);  
                      setTimeout(() => {
                      this.msgF_e = false; 
                      }, 6000);
                  } 
                ); 
                } }, 1); 
            },
            error => {
                setTimeout(() => {
                this.msgF_e = true; 
                }, 10);  
                setTimeout(() => {
                this.msgF_e = false; 
                }, 6000);
            } 
          );
          },
          error => {
              setTimeout(() => {
              this.msgF_e = true; 
              }, 10);  
              setTimeout(() => {
              this.msgF_e = false; 
              }, 6000);
          } 
        );   
    }
    
  }

  affCin() 
  {
      this.dts.nativeElement.style.display = "none"; 
      this.cinn.nativeElement.style.display = "block"; 
      setTimeout(()=> {
        this.pp.nativeElement.style.opacity = "1"; 
    }, 10);
  }

  passer(dest : string, dep : string, id : number, nom : string, region : string, codeP : number, gouv : string, depNom : string, depRegion : string, depCodeP : number, depGouv : string, idVehicule : string)
  {
    this.typeService.getTypesList().subscribe((response : TypeVehicule[]) => { 
          this.types = response; 
          var destPr : { title : string, lat : number, lng : number, codeP : number, gouv : string, region : string, nom : string} = {title : "", lat : 0, lng : 0, codeP : 0, gouv : "", region : "", nom : ""}; 
          var depPr : { title : string, lat : number, lng : number, codeP : number, gouv : string, region : string, nom : string} = {title : "", lat : 0, lng : 0, codeP : 0, gouv : "", region : "", nom : ""}; 
          destPr.title = nom + "," + region + "," + codeP + ",Gouvernorat " + gouv + ',Tunisie'; 
          depPr.title = depNom + "," + depRegion + "," + depCodeP + ",Gouvernorat " + depGouv + ',Tunisie'; 
          destPr.lat = Number(dest.split(",")[0]); 
          destPr.lng = Number(dest.split(",")[1]);
          depPr.lat = Number(dep.split(",")[0]); 
          depPr.lng = Number(dep.split(",")[1]); 
          destPr.nom = nom; 
          destPr.region = region; 
          destPr.gouv = gouv; 
          destPr.codeP = codeP; 
          depPr.nom = depNom; 
          depPr.region = depRegion; 
          depPr.gouv = depGouv; 
          depPr.codeP = depCodeP; 
          this.selectAdd(depPr);  
          this.selectAd(destPr); 
          this.sgs =[]; 
          this.sgss = []; 
          this.sgs.push(destPr); 
          this.sgss.push(depPr); 
          this.idLivrs = id; 
          this.idLivreur = 0; 
          this.nomLivreur = "";   
          this.idVehicule = idVehicule;
          const selectTy = this.ty.nativeElement as HTMLSelectElement;  
          for (let i = 0; i < selectTy.options.length; i++) {
            const option = selectTy.options[i];
            if (option.value === this.idVehicule) {
              option.selected = true;
              break;
            }
          }
          this.processing = false; 
          this.adds.nativeElement.style.display = "block"; 
          this.pp.nativeElement.style.display = "block"; 
          setTimeout(()=> {
              this.pp.nativeElement.style.opacity = "1"; 
          }, 10);  
    },
    error => {
        setTimeout(() => {
        this.processing = false; 
        }, 3000);  
        setTimeout(() => {
        this.msgF_e = true; 
        }, 2000);  
        setTimeout(() => {
        this.msgF_e = false; 
        }, 6000);
    } 
  ); 
      
  }

  searchAdd() { 
    this.showsgss = false;            
    const arabicRegex: RegExp = /[\u0600-\u06FF]/;  

     
    if (this.adr!="")
    {
      this.mapsService.searchDest(this.adr).subscribe(result => { 
        if (result.features != undefined &&  result.features.length != 0) 
        { 
          this.sgss = [];
          this.gouvService.getGouvsList().subscribe(response => {
            this.gouvs = response; 
          }); 
          result.features.forEach((itm: any) => {
           if (itm.properties.name != undefined && itm.properties.countrycode == 'TN' && itm.properties.postcode != undefined && (itm.properties.district != undefined && !arabicRegex.test(itm.properties.district) || itm.properties.county != undefined && !arabicRegex.test(itm.properties.county)) && itm.properties.state != undefined  && !arabicRegex.test(itm.properties.state) && ((itm.properties.state as string).split(' ').length == 3 && this.gouvs.some(item => item.gouv == (itm.properties.state as string).split(' ')[1] + ' ' + (itm.properties.state as string).split(' ')[2]) || this.gouvs.some(item => item.gouv == (itm.properties.state as string).split(' ')[1]))  && !this.sgss.some(it => it.nom == itm.properties.name))
           { 
              if (itm.properties.district != undefined && itm.properties.county != undefined)
                this.sgss.push({ title: itm.properties.name + ',' + itm.properties.county + ' ' + itm.properties.district + ',' + itm.properties.postcode + "," + itm.properties.state + ',Tunisie', lat: itm.geometry.coordinates[1], lng: itm.geometry.coordinates[0] , codeP : itm.properties.postcode, gouv : (itm.properties.state as string).split(' ')[1], region : itm.properties.county + ' ' + itm.properties.district, nom : itm.properties.name}); 
              else if (itm.properties.district != undefined) 
                this.sgss.push({ title: itm.properties.name + ',' + itm.properties.district + ',' + itm.properties.postcode + "," + itm.properties.state + ',Tunisie', lat: itm.geometry.coordinates[1], lng: itm.geometry.coordinates[0] , codeP : itm.properties.postcode, gouv : (itm.properties.state as string).split(' ')[1], region : itm.properties.district, nom : itm.properties.name}); 
              else 
                this.sgss.push({ title: itm.properties.name + ',' + itm.properties.county + ',' + itm.properties.postcode + "," + itm.properties.state + ',Tunisie', lat: itm.geometry.coordinates[1], lng: itm.geometry.coordinates[0] , codeP : itm.properties.postcode, gouv : (itm.properties.state as string).split(' ')[1], region : itm.properties.county, nom : itm.properties.name}); 
           }
          });  
          if (this.sgss.length > 0) 
            this.showsgss = true;
        }

      }); 
        
  
  
    }
  }
  
  searchAd() { 
    this.showsgs = false;              
    const arabicRegex: RegExp = /[\u0600-\u06FF]/;  

     
    if (this.ad!="")
    {
      this.mapsService.searchDest(this.ad).subscribe(result => { 
        if (result.features != undefined &&  result.features.length != 0) 
        { 
          this.sgs = [];
          this.gouvService.getGouvsList().subscribe(response => {
            this.gouvs = response; 
            result.features.forEach((itm: any) => {   
              if (itm.properties.name != undefined && itm.properties.countrycode == 'TN' && itm.properties.postcode != undefined && (itm.properties.district != undefined && !arabicRegex.test(itm.properties.district) || itm.properties.county != undefined && !arabicRegex.test(itm.properties.county)) && itm.properties.state != undefined  && !arabicRegex.test(itm.properties.state) && ((itm.properties.state as string).split(' ').length == 3 && this.gouvs.some(item => item.gouv == (itm.properties.state as string).split(' ')[1] + ' ' + (itm.properties.state as string).split(' ')[2]) || this.gouvs.some(item => item.gouv == (itm.properties.state as string).split(' ')[1])) && !this.sgs.some(it => it.nom == itm.properties.name))
              { 
                 if (itm.properties.district != undefined && itm.properties.county != undefined)
                   this.sgs.push({ title: itm.properties.name + ',' + itm.properties.county + ' ' + itm.properties.district + ',' + itm.properties.postcode + "," + itm.properties.state + ',' + 'Tunisie', lat: itm.geometry.coordinates[1], lng: itm.geometry.coordinates[0] , codeP : itm.properties.postcode, gouv : (itm.properties.state as string).split(' ')[1], region : itm.properties.county + ' ' + itm.properties.district, nom : itm.properties.name}); 
                 else if (itm.properties.district != undefined) 
                   this.sgs.push({ title: itm.properties.name + ',' + itm.properties.district + ',' + itm.properties.postcode + "," + itm.properties.state + ',' + 'Tunisie', lat: itm.geometry.coordinates[1], lng: itm.geometry.coordinates[0] , codeP : itm.properties.postcode, gouv : (itm.properties.state as string).split(' ')[1], region : itm.properties.district, nom : itm.properties.name}); 
                 else 
                   this.sgs.push({ title: itm.properties.name + ',' + itm.properties.county + ',' + itm.properties.postcode + "," + itm.properties.state + ',' + 'Tunisie', lat: itm.geometry.coordinates[1], lng: itm.geometry.coordinates[0] , codeP : itm.properties.postcode, gouv : (itm.properties.state as string).split(' ')[1], region : itm.properties.county, nom : itm.properties.name}); 
              }
             });      
             if (this.sgs.length > 0) 
               this.showsgs = true;
          });         
         
        }

      }); 
        
  
  
    }
  }

 
  display(event : Event) 
  { 
    if (this.sgs.length != 0 && this.ad != "" && this.sgs.some(itm => itm.title.toUpperCase().includes(this.ad.toUpperCase())))
      this.showsgs = true;
    event.stopPropagation(); 
  }

  displayy(event : Event) 
  { 
    if (this.sgss.length != 0 && this.adr != "" && this.sgss.some(itm => itm.title.toUpperCase().includes(this.adr.toUpperCase())))
      this.showsgss = true;
    event.stopPropagation(); 
  } 

  

  selectAd(address: any) { 
    this.showsgs = false;   
    this.ad = address.title;              
  }

  selectAdd(address: any) { 
    this.showsgss = false;  
    this.adr = address.title;                
  }

  franchir(id : number, button : string) 
  {
    this.processing = true;  
    const fData = new FormData();  
    fData.append("token",(window.localStorage.getItem("fPart") as string) + (window.localStorage.getItem("sPart") as string)); 
    fData.append("id", id.toString());  
    fData.append("button", button); 
    this.histEtatService.franchirEtape(fData).subscribe(response => { 
        const map = new Map(Object.entries(response));  
        if (map.get("reponse") == "non libre") 
        {
            setTimeout(() => {
            this.processing = false; 
            }, 3000);  
            setTimeout(() => {
            this.msgF_nbb=true; 
            }, 2000);
            setTimeout(() => {
              this.msgF_nbb=false; 
            }, 6000);
        }
        else 
          window.location.reload();
    },
    error => {
        setTimeout(() => {
        this.processing = false; 
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
  franchirAccepter(id : number) 
  {
    this.processing = true;  
    const fData = new FormData();  
    fData.append("token",(window.localStorage.getItem("fPart") as string) + (window.localStorage.getItem("sPart") as string)); 
    fData.append("id", id.toString());  
    this.histEtatService.franchirAccepter(fData).subscribe(response => { 
        const map = new Map(Object.entries(response));  
        if (map.get("reponse") == "non libre") 
        {
            setTimeout(() => {
            this.processing = false; 
            }, 3000);  
            setTimeout(() => {
            this.msgF_nbb=true; 
            }, 2000);
            setTimeout(() => {
              this.msgF_nbb=false; 
            }, 6000);
        }
        else if (map.get("reponse") == "abn")
        {
              setTimeout(() => {
              this.processing = false; 
              }, 3000);  
              setTimeout(() => {
              this.msgF_abn=true; 
              }, 2000);
              setTimeout(() => {
                this.msgF_abn=false; 
              }, 6000);
        }
        else 
          window.location.reload();
    },
    error => {
        setTimeout(() => {
        this.processing = false; 
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

  delete(id : number) 
  {
    this.processing = true; 
    const obj: { [key: string]: any } = {};  
    obj["id"] = id; 
    obj["token"] = (window.localStorage.getItem("fPart") as string) + (window.localStorage.getItem("sPart") as string);
    this.livraisonService.deleteLivraison((window.localStorage.getItem("fPart") as string) + (window.localStorage.getItem("sPart") as string), obj).subscribe(response => { 
      const map = new Map(Object.entries(response)); 
      if (map.get("reponse") == "en cours") 
      {
          setTimeout(() => {
          this.processing = false; 
          }, 3000);  
          setTimeout(() => {
          this.msgF_ec=true; 
          }, 2000);
          setTimeout(() => {
            this.msgF_ec=false; 
          }, 6000);
      } 
      else 
        window.location.reload();  
    },
    error => {
      setTimeout(() => {
        this.processing=true; 
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


 

  suivreLivreur(idLivreur : number, id : number){
    const markerSource = new VectorSource(); 
    const markerFeature = new Feature({
      geometry: new Point(fromLonLat([10.1815, 36.8065]))
    });
    markerFeature.setStyle(new Style({
              image: new Icon({
                src: 'assets/icons/livreur.png',
                anchor: [0.5, 1], 
                scale : 0.1
    })
    }));
   
    markerSource.addFeature(markerFeature);
    this.markerLayer = new VectorLayer({
      source: markerSource
    });
    
    
    
    this.map.addLayer(this.markerLayer);

    this.ok = true; 
     
    this.updateMap(idLivreur, id); 
    
    this.processing = true; 


    
      
     
  }

  rld()
  {
      this.livraisons = this.livs;  
  }

  updateMap(idLivreur : number, id : number)
  {
            const fData = new FormData(); 
            fData.append("id", id.toString()); 
            this.livraisonService.findEtatLivraison(fData, (window.localStorage.getItem("fPart") as string) + (window.localStorage.getItem("sPart") as string)).subscribe(response => {
              const map = new Map(Object.entries(response)); 
              if (map.get("reponse") == "effectuée") 
              {
                window.location.reload();
              } 
              else
              {
                  this.userService.locLivreur(idLivreur, (window.localStorage.getItem("fPart") as string) + (window.localStorage.getItem("sPart") as string)).subscribe(response =>{  
                            const map = new Map(Object.entries(response)); 
                            if (map.get("reponse") == "") 
                            {
                              this.m.nativeElement.style.display = "none";
                              this.pp.nativeElement.style.display = "none"; 
                              this.pp.nativeElement.style.opacity = "0"; 
                              setTimeout(() => {
                              this.processing=false; 
                              }, 3000);
                              setTimeout(() => {
                                this.msgF_mp=true; 
                              }, 2000);
                              setTimeout(() => {
                              this.msgF_mp=false; 
                              }, 6000);
                            }
                            else 
                            {  
                              const lat = Number(map.get("reponse").split(",")[0]); 
                              const lon = Number(map.get("reponse").split(",")[1]); 
                              const markerFeature = new Feature({
                              geometry: new Point(fromLonLat([lon, lat]))
                              });
                              markerFeature.setStyle(new Style({
                                image: new Icon({
                                  src: 'assets/icons/livreur.png',
                                  anchor: [0.5, 1], 
                                  scale : 0.1
                               })
                              }));
                              const markerSource = this.markerLayer.getSource();
                              if (markerSource != null) 
                              {
                                markerSource.clear();
                                markerSource.addFeature(markerFeature);
                              }
                             
                              setTimeout(() => {
                                if (this.ok) 
                                {
                                  
                                  this.m.nativeElement.style.display = "block";
                                  this.pp.nativeElement.style.display =  "block"; 
                                  setTimeout(()=> {this.pp.nativeElement.style.opacity = "1";}, 10);
                                } 
                                this.processing = false; 
                                this.ok = false; 
                                this.map.getView().setCenter(fromLonLat([lon, lat]));
                                this.updateMap(idLivreur, id)}, 10000); 
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

  view(tarif : number, etat : string, nom : string, region : string, codeP : string, gouv : string, depNom : string, depRegion : string, depCodeP : string, depGouv : string, date : string, telClient : string, telLivreur : string, cinLivreur : string) 
  {
    this.tarif = tarif; 
    this.etat = etat; 
    this.dest = nom + "," + region + "," + codeP + "," + gouv; 
    this.retr = depNom + "," + depRegion + "," + depCodeP + "," + depGouv;  
    this.date = date; 
    this.telClient = telClient; 
    this.telLivreur = telLivreur; 
    this.cinnn = cinLivreur; 
  }

  apply() 
  { 
    this.processing = true; 
    if (this.ad != "" && this.adr != "") 
    {
      if (this.sgs.length > 0 && this.sgss.length > 0) 
      {
        const adexistsInArr = this.sgs.some(item =>
           this.ad == item.title
        ); 
        const adexistsInArrOt = this.sgss.some(item =>
           this.adr == item.title
        );
        var lat1 : number; 
        var lat2 : number; 
        var lon1 : number; 
        var lon2 : number;  
        if (adexistsInArrOt) 
        {
          const matchItem = this.sgss.find(item => this.adr == item.title); 
          if (matchItem != undefined) 
          {
            lat2 = matchItem.lat; 
            lon2 = matchItem.lng;
            if (adexistsInArr)
            {
              const matchIt = this.sgs.find(item => this.ad == item.title); 
              if (matchIt != undefined) 
              {
                lat1 = matchIt.lat; 
                lon1 = matchIt.lng;
                this.depNom = matchItem.nom + "," + matchItem.lat + "," + matchItem.lng; 
                this.depRegion = matchItem.region; 
                this.depCodeP = matchItem.codeP.toString(); 
                this.depGouv = matchItem.gouv;
                this.nom = matchIt.nom + "," + matchIt.lat + "," + matchIt.lng;
                this.region = matchIt.region; 
                this.codeP = matchIt.codeP.toString(); 
                this.gouv = matchIt.gouv;
                const distance = this.calculateDist(lat1, lon1, lat2, lon2); 
                this.distance = Math.round(distance);
                if (this.distance == 0) 
                {
                  setTimeout(() => {
                  this.processing=false; 
                  }, 3000);
                  setTimeout(() => {
                    this.msgF_dn=true; 
                  }, 2000);
                  setTimeout(() => {
                  this.msgF_dn=false; 
                  }, 6000);
                } 
                else 
                {
                  this.processing = false; 
                  this.intService.getIntervallesDistanceList().subscribe(response => {
                    this.ints = response;
                    this.livrr = [];  
                    for(let i = 0; i < this.ints.length ; i++){
                      if (this.distance >= this.ints[i].borneGauche && this.distance < this.ints[i].borneDroite) 
                      { 
                          this.idInt = this.ints[i].id;   
                            const fData = new FormData(); 
                            fData.append("id", this.idInt.toString()); 
                            fData.append("vehicule", this.idVehicule);
                            fData.append("idUser", this.id.toString()); 
                            this.userIntService.findLivreurs(fData, (window.localStorage.getItem("fPart") as string) + (window.localStorage.getItem("sPart") as string)).subscribe(response => { 
                              const map = new Map(Object.entries(response)); 
                                this.livrr = map.get("livreurs");
                                this.adds.nativeElement.style.display = "none"; 
                                this.up.nativeElement.style.display = "block"; 
                                setTimeout(()=> {
                                  this.up.nativeElement.style.opacity = "1"; 
                                }, 10);
                            },
                            error => {
                              this.adds.nativeElement.style.display = "none"; 
                              this.pp.nativeElement.display = "none"; 
                              this.pp.nativeElement.opacity = "0";
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
                    },
                    error => {
                      this.adds.nativeElement.style.display = "none"; 
                      this.pp.nativeElement.display = "none"; 
                      this.pp.nativeElement.opacity = "0";
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
            }
            else 
            {
              setTimeout(() => {
              this.processing=false; 
              }, 3000);
              setTimeout(() => {
                this.msgF_dt=true; 
              }, 2000);
              setTimeout(() => {
              this.msgF_dt=false; 
              }, 6000);
            } 
          }
        }
        else 
        { 
            setTimeout(() => {
            this.processing=false; 
            }, 3000);
            setTimeout(() => {
              this.msgF_rt=true; 
            }, 2000);
            setTimeout(() => {
            this.msgF_rt=false; 
            }, 6000);
        }

      } 
      else if (this.sgss.length == 0)
      {
        setTimeout(() => {
        this.processing=false; 
        }, 3000);
        setTimeout(() => {
          this.msgF_rt=true; 
        }, 2000);
        setTimeout(() => {
        this.msgF_rt=false; 
        }, 6000);
      }
      else if (this.sgs.length == 0) 
      { 
        setTimeout(() => {
        this.processing=false; 
        }, 3000);
        setTimeout(() => {
          this.msgF_dt=true; 
        }, 2000);
        setTimeout(() => {
        this.msgF_dt=false; 
        }, 6000);
      }
    }
    else if (this.ad == "") 
    { 
        setTimeout(() => {
        this.processing=false; 
        }, 3000);
        setTimeout(() => {
          this.msgF_dt=true; 
        }, 2000);
        setTimeout(() => {
        this.msgF_dt=false; 
        }, 6000); 
      
    }
    else if (this.adr == "") 
    {
        setTimeout(() => {
        this.processing=false; 
        }, 3000);
        setTimeout(() => {
          this.msgF_rt=true; 
        }, 2000);
        setTimeout(() => {
        this.msgF_rt=false; 
        }, 6000);
    }
  }
  
  

  applyIns() 
  {
    this.processing = true; 
    if (this.ad != "" && this.adr != "") 
    {
      if (this.sgs.length > 0 && this.sgss.length > 0) 
      {
        const adexistsInArr = this.sgs.some(item =>
           this.ad == item.title
        ); 
        const adexistsInArrOt = this.sgss.some(item =>
           this.adr == item.title
        );
        var lat1 : number; 
        var lat2 : number; 
        var lon1 : number; 
        var lon2 : number;  
        if (adexistsInArrOt) 
        {
          const matchItem = this.sgss.find(item => this.adr == item.title); 
          if (matchItem != undefined) 
          {
            lat2 = matchItem.lat; 
            lon2 = matchItem.lng;
            if (adexistsInArr)
            {
              if (this.idVehicule != "") 
              {
                const matchIt = this.sgs.find(item => this.ad == item.title); 
                if (matchIt != undefined) 
                {
                  lat1 = matchIt.lat; 
                  lon1 = matchIt.lng;
                  this.depNom = matchItem.nom + "," + matchItem.lat + "," + matchItem.lng; 
                  this.depRegion = matchItem.region; 
                  this.depCodeP = matchItem.codeP.toString(); 
                  this.depGouv = matchItem.gouv;
                  this.nom = matchIt.nom + "," + matchIt.lat + "," + matchIt.lng;
                  this.region = matchIt.region; 
                  this.codeP = matchIt.codeP.toString(); 
                  this.gouv = matchIt.gouv;
                  const distance = this.calculateDist(lat1, lon1, lat2, lon2); 
                  this.distance = Math.round(distance);
                  if (this.distance == 0) 
                  {
                    setTimeout(() => {
                    this.processing=false; 
                    }, 3000);
                    setTimeout(() => {
                      this.msgF_dn=true; 
                    }, 2000);
                    setTimeout(() => {
                    this.msgF_dn=false; 
                    }, 6000);
                  } 
                  else 
                  { 
                    this.intService.getIntervallesDistanceList().subscribe(response => {
                      this.ints = response;
                      this.livrr = [];  
                      for(let i = 0; i < this.ints.length ; i++){
                        if (this.distance >= this.ints[i].borneGauche && this.distance < this.ints[i].borneDroite) 
                        { 
                            this.idInt = this.ints[i].id;   
                              const fData = new FormData(); 
                              fData.append("id", this.idInt.toString()); 
                              fData.append("vehicule", this.idVehicule);
                              fData.append("idUser", this.id.toString()); 
                              this.userIntService.findLivreurs(fData, (window.localStorage.getItem("fPart") as string) + (window.localStorage.getItem("sPart") as string)).subscribe(response => { 
                                const map = new Map(Object.entries(response)); 
                                  this.livrr = map.get("livreurs");
                                  this.clts = []; 
                                  this.userService.findClients((window.localStorage.getItem("fPart") as string) + (window.localStorage.getItem("sPart") as string)).subscribe((response) => {
                                    const m = new Map(Object.entries(response)); 
                                    this.processing = false; 
                                    this.clts = m.get("clients");
                                    this.addsIns.nativeElement.style.display = "none"; 
                                    this.add.nativeElement.style.display = "block"; 
                                    setTimeout(()=> {
                                      this.add.nativeElement.style.opacity = "1"; 
                                    }, 10);
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
              }
              else 
              {
                  setTimeout(() => {
                  this.processing=false; 
                  }, 3000);
                  setTimeout(() => {
                    this.msgF_tym=true; 
                  }, 2000);
                  setTimeout(() => {
                  this.msgF_tym=false; 
                  }, 6000);
              }
            }
            else 
            {
              setTimeout(() => {
              this.processing=false; 
              }, 3000);
              setTimeout(() => {
                this.msgF_dt=true; 
              }, 2000);
              setTimeout(() => {
              this.msgF_dt=false; 
              }, 6000);
            } 
          }
        }
        else 
        { 
            setTimeout(() => {
            this.processing=false; 
            }, 3000);
            setTimeout(() => {
              this.msgF_rt=true; 
            }, 2000);
            setTimeout(() => {
            this.msgF_rt=false; 
            }, 6000);
        }

      } 
      else if (this.sgss.length == 0)
      {
        setTimeout(() => {
        this.processing=false; 
        }, 3000);
        setTimeout(() => {
          this.msgF_rt=true; 
        }, 2000);
        setTimeout(() => {
        this.msgF_rt=false; 
        }, 6000);
      }
      else if (this.sgs.length == 0) 
      { 
        setTimeout(() => {
        this.processing=false; 
        }, 3000);
        setTimeout(() => {
          this.msgF_dt=true; 
        }, 2000);
        setTimeout(() => {
        this.msgF_dt=false; 
        }, 6000);
      }
    }
    else if (this.ad == "") 
    { 
        setTimeout(() => {
        this.processing=false; 
        }, 3000);
        setTimeout(() => {
          this.msgF_dt=true; 
        }, 2000);
        setTimeout(() => {
        this.msgF_dt=false; 
        }, 6000); 
      
    }
    else if (this.adr == "") 
    {
      this.processing = true; 
        setTimeout(() => {
        this.processing=false; 
        }, 3000);
        setTimeout(() => {
          this.msgF_rt=true; 
        }, 2000);
        setTimeout(() => {
        this.msgF_rt=false; 
        }, 6000);
    }
  }

  tgAj() 
  {
    this.ad = ""; 
    this.adr = "";
    this.idLivreur = 0; 
    this.idClient = 0; 
    this.idVehicule = ""; 
    this.nomLivreur = "";  
    this.nomClient = ""; 
    this.typeService.getTypesList().subscribe((response : TypeVehicule[]) => { 
     this.types = response; 
    });
  }
  


  calculateDist(latt1: number, lonn1: number, latt2: number, lonn2: number): number {
    const R = 6371;
    const dLatt = this.deg2radd(latt2 - latt1);
    const dLonn = this.deg2radd(lonn2 - lonn1);
    const a =
      Math.sin(dLatt / 2) * Math.sin(dLatt / 2) +
      Math.cos(this.deg2radd(latt1)) * Math.cos(this.deg2radd(latt2)) *
      Math.sin(dLonn / 2) * Math.sin(dLonn / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  }

  private deg2radd(degg: number): number {
    return degg * (Math.PI / 180);
  }



  drop() 
  {
 
    if (this.dp.nativeElement.style.display == "block") 
      this.dp.nativeElement.style.display = "none"; 
    else
      this.dp.nativeElement.style.display = "block"; 
      
  }


  dropp() 
  {
 
    if (this.dppCl.nativeElement.style.display == "block") 
      this.dppCl.nativeElement.style.display = "none"; 
    else
      this.dppCl.nativeElement.style.display = "block"; 
      
  }



  changeValue(idLivreur : number, nomLivreur : string)
  {
    this.dp.nativeElement.style.display = "none";
    this.idLivreur = idLivreur;
    this.nomLivreur = nomLivreur;   
  }
  changeValueAj(idLivreur : number, nomLivreur : string)
  {
    this.dppCl.nativeElement.style.display = "none";
    this.idLivreur = idLivreur;
    this.nomLivreur = nomLivreur;   
  }

  changeValueCl(idClient : number, nomClient : string)
  {
    this.dpCl.nativeElement.style.display = "none";
    this.idClient = idClient;
    this.nomClient = nomClient;   
  }

  dropCl() 
  {
    if (this.dpCl.nativeElement.style.display == "block") 
      this.dpCl.nativeElement.style.display = "none"; 
    else
      this.dpCl.nativeElement.style.display = "block"; 
  }



  updateLiv() 
  {
       this.processing = true;  
       if (this.idLivreur != 0) 
       {
        const fData = new FormData(); 
        fData.append("idLivreur", this.idLivreur.toString());
        fData.append("idLiv", this.idLivrs.toString()); 
        fData.append("depNom", this.depNom); 
        fData.append("depRegion", this.depRegion); 
        fData.append("depCodeP", this.depCodeP); 
        fData.append("depGouv", this.depGouv); 
        fData.append("nom", this.nom); 
        fData.append("region", this.region); 
        fData.append("codeP", this.codeP); 
        fData.append("gouv", this.gouv); 
        fData.append("token", (window.localStorage.getItem("fPart") as string) + (window.localStorage.getItem("sPart") as string)); 
        this.livraisonService.updateLiv((window.localStorage.getItem("fPart") as string) + (window.localStorage.getItem("sPart") as string), fData).subscribe(response => {
           const map = new Map(Object.entries(response)); 
           if (map.get("reponse") == "livreur") 
           {
             setTimeout(() => {
             this.processing=false; 
             }, 3000);
             setTimeout(() => {
               this.msgF_ll=true; 
             }, 2000);
             setTimeout(() => {
             this.msgF_ll=false; 
             }, 6000);
           }
           else if (map.get("reponse") == "gouvDep") 
           {
             setTimeout(() => {
             this.processing=false; 
             }, 3000);
             setTimeout(() => {
               this.msgF_g=true; 
             }, 2000);
             setTimeout(() => {
             this.msgF_g=false; 
             }, 6000);
           }
           else if (map.get("reponse") == "gouvDest") 
           {
             setTimeout(() => {
             this.processing=false; 
             }, 3000);
             setTimeout(() => {
               this.msgF_gd=true; 
             }, 2000);
             setTimeout(() => {
             this.msgF_gd=false; 
             }, 6000);
           }
           else if (map.get("reponse") == "en cours") 
           {
               setTimeout(() => {
               this.processing=false; 
               }, 3000);
               setTimeout(() => {
                 this.msgF_ec=true; 
               }, 2000);
               setTimeout(() => {
               this.msgF_ec=false; 
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
       else 
       {
        setTimeout(() => {
          this.processing=false; 
        }, 3000);
        setTimeout(() => {
          this.msgF_lvm=true; 
        }, 2000);
        setTimeout(() => {
        this.msgF_lvm=false; 
        }, 6000);
       }

  }

  insertLiv() 
  {
       this.processing = true; 
       if (this.idLivreur != 0 && this.idClient != 0) 
       {
          if (this.idLivreur == this.idClient) 
          {
              setTimeout(() => {
              this.processing=false; 
              }, 3000);
              setTimeout(() => {
                this.msgF_df=true; 
              }, 2000);
              setTimeout(() => {
              this.msgF_df=false; 
              }, 6000);
          }
          else 
          {
            const fData = new FormData(); 
            fData.append("idLivreur", this.idLivreur.toString());
            fData.append("idClient", this.idClient.toString());  
            fData.append("depNom", this.depNom); 
            fData.append("depRegion", this.depRegion); 
            fData.append("depCodeP", this.depCodeP); 
            fData.append("depGouv", this.depGouv); 
            fData.append("nom", this.nom); 
            fData.append("region", this.region); 
            fData.append("codeP", this.codeP); 
            fData.append("gouv", this.gouv); 
            fData.append("token", (window.localStorage.getItem("fPart") as string) + (window.localStorage.getItem("sPart") as string)); 
            this.livraisonService.insertLiv((window.localStorage.getItem("fPart") as string) + (window.localStorage.getItem("sPart") as string), fData).subscribe(response => {
               const map = new Map(Object.entries(response)); 
               if (map.get("reponse") == "livreur") 
               {
                 setTimeout(() => {
                 this.processing=false; 
                 }, 3000);
                 setTimeout(() => {
                   this.msgF_ll=true; 
                 }, 2000);
                 setTimeout(() => {
                 this.msgF_ll=false; 
                 }, 6000);
               }
               if (map.get("reponse") == "client") 
               {
                 setTimeout(() => {
                 this.processing=false; 
                 }, 3000);
                 setTimeout(() => {
                   this.msgF_cl=true; 
                 }, 2000);
                 setTimeout(() => {
                 this.msgF_cl=false; 
                 }, 6000);
               }
               else if (map.get("reponse") == "gouvDep") 
               {
                 setTimeout(() => {
                 this.processing=false; 
                 }, 3000);
                 setTimeout(() => {
                   this.msgF_g=true; 
                 }, 2000);
                 setTimeout(() => {
                 this.msgF_g=false; 
                 }, 6000);
               }
               else if (map.get("reponse") == "gouvDest") 
               {
                 setTimeout(() => {
                 this.processing=false; 
                 }, 3000);
                 setTimeout(() => {
                   this.msgF_gd=true; 
                 }, 2000);
                 setTimeout(() => {
                 this.msgF_gd=false; 
                 }, 6000);
               }
               else
               {
                  this.idLivv = map.get("reponse"); 
                  setTimeout(() => {
                    this.processing=false; 
                  }, 3000);
                  this.add.nativeElement.style.display = "none";  
                  this.pp.nativeElement.style.display = "none";  
                  this.pp.nativeElement.style.opacity = "0";  
                  this.msgF_S = true; 
                  setTimeout(() => {
                  this.msgF_S=false; 
                  }, 10000);
                  setTimeout(() => {
                    window.location.reload(); 
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
       else if (this.idLivreur == 0) 
       {
        setTimeout(() => {
          this.processing=false; 
        }, 3000);
        setTimeout(() => {
          this.msgF_lvm=true; 
        }, 2000);
        setTimeout(() => {
        this.msgF_lvm=false; 
        }, 6000);
       }
       else 
       {
        setTimeout(() => {
          this.processing=false; 
        }, 3000);
        setTimeout(() => {
          this.msgF_clm=true; 
        }, 2000);
        setTimeout(() => {
        this.msgF_clm=false; 
        }, 6000);
       }
        

  }

  getNbs(): number[] {
    return Array(this.lg).fill(0).map((x, i) => i + 1);
  }





  



}

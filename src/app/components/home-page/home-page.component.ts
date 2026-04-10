import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../../services/contact.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit, OnDestroy, AfterViewInit {
  menuOpen = false;
  scrolled = false;
  activeSection = 'hero';
  contactForm = {
    name: '',
    email: '',
    phone: '',
    message: ''
  };

  formSent = false;
  isLoading = false;
  errorMessage = '';
  logoPath = 'assets/images/Wassali_Logo.png';
  tickerWords = [
    'Rapide', 'Fiable', 'Sécurisé', 'Suivi en Temps Réel',
    'Livraison Express', 'Partout en Tunisie', 'Professionnel', '24/7'
  ];

  stats = [
    { value: '50K+', label: 'Livraisons effectuées' },
    { value: '98%', label: 'Taux de satisfaction' },
    { value: '2h', label: 'Délai moyen' },
    { value: '24/7', label: 'Support client' }
  ];

  services = [
    {
      icon: 'M13 10V3L4 14h7v7l9-11h-7z',
      title: 'Express',
      desc: 'Livraison en moins de 2 heures dans votre ville. Idéal pour les urgences et colis prioritaires.'
    },
    {
      icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z',
      title: 'E-commerce',
      desc: 'Solution complète pour les boutiques en ligne. Intégration API, suivi automatique et retours simplifiés.'
    },
    {
      icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
      title: 'Nationale',
      desc: 'Couverture complète de la Tunisie. Livraison inter-villes avec suivi GPS en temps réel.'
    },
    {
      icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
      title: 'Entreprise',
      desc: 'Contrats sur mesure pour les entreprises. Tarifs dégressifs, tableau de bord dédié et rapport mensuel.'
    }
  ];

  steps = [
    { num: '01', title: 'Créez votre commande', desc: 'Renseignez l\'adresse de retrait et de livraison en quelques clics sur notre app.' },
    { num: '02', title: 'Collecte du colis', desc: 'Nos livreurs passent chez vous ou au point de collecte dans les 30 minutes.' },
    { num: '03', title: 'Suivi en direct', desc: 'Suivez votre livraison sur la carte en temps réel et recevez des notifications.' },
    { num: '04', title: 'Livraison confirmée', desc: 'Le destinataire reçoit le colis et une confirmation avec photo de preuve.' }
  ];

  private tickerInterval: any;
  private visibleSections: Set<string> = new Set();
  constructor(private contactService: ContactService) {}

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled = window.scrollY > 60;
  }

  ngOnInit() { }

  ngAfterViewInit() {
    this.initIntersectionObserver();
  }

  ngOnDestroy() {
    if (this.tickerInterval) clearInterval(this.tickerInterval);
  }

  initIntersectionObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            this.activeSection = entry.target.id || this.activeSection;
          }
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll('.reveal, section[id]').forEach(el => observer.observe(el));
  }

  scrollTo(sectionId: string) {
    this.menuOpen = false;
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
  scrollToPage(page: string) {
    this.menuOpen = false;
    window.location.href = page;
  }

  submitForm() {
    // Validation du formulaire
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Création du FormData
    const formData = new FormData();
    formData.append('name', this.contactForm.name);
    formData.append('email', this.contactForm.email);
    formData.append('phone', this.contactForm.phone);
    formData.append('message', this.contactForm.message);

    // Appel au service
    this.contactService.submitContactForm(formData).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.formSent = true;
        this.resetForm();
        
        // cacher le message de succès après 6 secondes
        setTimeout(() => {
          this.formSent = false;
        }, 6000);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Une erreur est survenue. Veuillez réessayer.';
        console.error('Erreur lors de l\'envoi:', error);
        
        // cacher le message d'erreur après 6 secondes
        setTimeout(() => {
          this.errorMessage = '';
        }, 6000);
      }
    });
  }

  validateForm(): boolean {
    if (!this.contactForm.name.trim()) {
      this.errorMessage = 'Veuillez entrer votre nom complet.';
      return false;
    }
    if (!this.contactForm.email.trim()) {
      this.errorMessage = 'Veuillez entrer votre email.';
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.contactForm.email)) {
      this.errorMessage = 'Veuillez entrer un email valide.';
      return false;
    }
    if (!this.contactForm.message.trim()) {
      this.errorMessage = 'Veuillez entrer votre message.';
      return false;
    }
    return true;
  }

  resetForm() {
    this.contactForm = {
      name: '',
      email: '',
      phone: '',
      message: ''
    };
  }
}

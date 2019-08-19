import { environment } from './../../../../environments/environment';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { SidebarService } from '../../services/sidebar/sidebar.service';
import { Router, NavigationEnd } from '@angular/router';
import { SessionStorageService } from '../../services/storage/storage-service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  haveUser = false;
  show = true;
  showSidebar = false;
  showLogo = false;
  showLeftButton = false;
  imagePaths: '';
  imagePath = '';
  opcionModalidad: number;
  totalSoats = 0;
  canal = '';

  constructor(
    private sidebarService: SidebarService,
    private sessionStorageService: SessionStorageService,
    private router: Router) {

    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.displayLeftButton();
        this.sidebarService.announceSidebar(false);
      }
    });

    this.sidebarService.node$.subscribe(val => {
      this.showSidebar = !val;
    });

    this.sessionStorageService.watchStorage().subscribe((data: string) => {
      if (data) {
        this.setImagebyCanal();
      }
    });
  }

  toggleCollapse() {
    this.show = !this.show;
  }

  toggleSidebar() {
    this.sidebarService.announceSidebar(this.showSidebar);
  }

  ngOnInit() {
    this.displayLeftButton();
  }

  ngOnDestroy(): void { }

  displayLeftButton() {
    const mUser = JSON.parse(localStorage.getItem('currentUser'));
    this.haveUser = mUser !== null;
    const pn = window.location.pathname.toLowerCase();
    if (pn.indexOf('broker') !== -1) {
      this.showLeftButton = pn.indexOf('broker/login') === -1;
    }
  }

  setImagebyCanal() {
    this.showLogo = false;
    this.canal = sessionStorage.getItem('canalVentaCliente');
    if (environment.canaldeventadefault !== this.canal) {
      if (this.canal != null) {
        this.showLogo = true;
        this.imagePath = 'assets/logos_Canal/' + this.canal + '.svg';
      }
    }
    this.imagePath = 'assets/logos_Canal/' + this.canal + '.svg';
  }

}

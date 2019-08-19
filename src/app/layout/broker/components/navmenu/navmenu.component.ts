import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Features } from '../../models/features';
import { GlobalEventsManager } from '../../../../shared/services/gobal-events-manager';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse
} from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { AppConfig } from '../../../../app.config';
import { SidebarService } from '../../../../shared/services/sidebar/sidebar.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'nav-menu',
  // moduleId: module.id,
  templateUrl: 'navmenu.component.html',
  styleUrls: ['./navmenu.component.css', './navmenu.component.mobile.css']
})
export class NavMenuComponent implements OnInit {
  @ViewChild('navbarToggler', { static: true }) navbarToggler: ElementRef;
  showNavBar = false;
  featureList: Observable<Features[]>;
  menu = null;
  rutaBase = this.config.apiUrl;
  nombre = '';
  ApellidoPat = '';
  lNombre = '';
  lApellido = '';
  Iniciales = '';
  showSidebar = false;

  constructor(
    private router: Router,
    private globalEventsManager: GlobalEventsManager,
    private authenticationService: AuthenticationService,
    private config: AppConfig,
    private sidebarService: SidebarService
  ) {
    this.globalEventsManager.showNavBar.subscribe((mode: any) => {
      this.showNavBar = mode;

      if ((this.showNavBar = true)) {
        this.featureList = this.getFeatureListByLoggedInUser();
      }
    });

    this.globalEventsManager.hideNavBar.subscribe((mode: any) => {
      this.showNavBar = false;
      this.featureList = null;
    });

    this.getObtenerNombres();
    this.getObtenerIniciales();

    this.featureList = this.getFeatureListByLoggedInUser();
    this.showNavBar = true;
  }

  ngOnInit(): void {
    this.sidebarService.node$.subscribe(val => {
      this.showSidebar = val;
    });
  }

  private getObtenerNombres() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.nombre = currentUser && currentUser.firstName.toLowerCase();
    this.ApellidoPat = currentUser && currentUser.lastName.toLowerCase();
  }

  private getObtenerIniciales() {
    this.lNombre = this.nombre === null ? '' : this.nombre.substr(0, 1);
    this.lApellido = this.ApellidoPat.substr(0, 1);
    this.Iniciales = this.lNombre + this.lApellido;
  }

  private getFeatureListByLoggedInUser(): Observable<Features[]> {
    if (localStorage.getItem('currentUser') != null) {
      this.menu = JSON.parse(localStorage.getItem('currentUser'))['menu'];
    } else {
      localStorage.clear();
      this.menu = null;
    }
    return this.menu;
  }

  doLogout() {
    this.authenticationService.logout().subscribe(
      result => {
        if (result) {
          this.router.navigate(['/broker/login']);
          localStorage.clear();
        }
      },
      error => {
        console.log('error: ', error);
      }
    );
  }


  navBarTogglerIsVisible() {
    const isVisible: boolean = this.navbarToggler.nativeElement.offsetParent !== null;
    return isVisible;
  }
}

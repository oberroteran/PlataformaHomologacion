import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  EventEmitter,
  Output,
  SimpleChanges,
  SimpleChange,
  OnChanges,
  ViewChild,
  ElementRef
} from '@angular/core';
import { SidebarService } from '../../services/sidebar/sidebar.service';
import { AppConfig } from '../../../app.config';
import { Router, NavigationEnd } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  haveUser = false;
  show = false;
  showSidebar = false;
  showLeftButton = false;
  imagePaths: '';
  imagePath = '';
  opcionModalidad: number;
  totalSoats = 0;
  canal = '';

  constructor(
    private sidebarService: SidebarService,
    private appConfig: AppConfig,
    private http: HttpClient,
    private router: Router) {

    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.displayLeftButton();
        this.sidebarService.announceSidebar(false);
        this.setImagebyCanal();
      }
    });
    this.sidebarService.node$.subscribe(val => {
      this.showSidebar = !val;
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
    this.setImagebyCanal();
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

  registerTracking(pageName: string) {
  }

  setImagebyCanal() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let pageInitial = JSON.parse(localStorage.getItem('PageInitial'));
    let pageSecond = JSON.parse(localStorage.getItem('PageSecond'));
    this.canal = currentUser && currentUser['canal'];

    if (pageInitial === null || pageInitial === undefined) {
      pageInitial = 0;
    }
    if (pageSecond === null || pageSecond === undefined) {
      pageSecond = 0;
    }
    if (Number(pageInitial) === 0 && Number(pageSecond) === 1) {
      if (this.canal != null) {
        this.imagePath = 'assets/logos_Canal/' + this.canal + '.svg';
      } else {
        this.imagePath = null;
      }
    } else {
      this.imagePath = null;
    }
  }

}

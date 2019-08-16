import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-sidebar-resumen',
  templateUrl: './sidebar-resumen.component.html',
  styleUrls: ['./sidebar-resumen.component.css']
})
export class SidebarResumenComponent implements OnInit {
  @ViewChild('modalEjemploSoat', { static: true }) modalEjemploSoat;
  constructor() { }

  ngOnInit() {
  }
  verEjemploSOAT() {
    this.modalEjemploSoat.show();
  }
}

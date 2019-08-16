import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: [
    './sidebar.component.css',
    './sidebar-mobile.component.css'
  ]
})
export class SidebarComponent implements OnInit {

  @Input()
  visibleMobile: boolean = false;

  //private visibleBody1: boolean = false;
  visibleBody1: boolean = false;
  //private visibleBody2: boolean = false;
  visibleBody2: boolean = false;
  bDown1 : boolean =false;
  bDown2 : boolean =false;
  constructor() { }

  ngOnInit() {
  }

  toggleVisibleBody1() {
    this.visibleBody1 = !this.visibleBody1;
    this.bDown1= !this.bDown1;
  }

  toggleVisibleBody2() {
    this.visibleBody2 = !this.visibleBody2;
    this.bDown2= !this.bDown2;
  }
}

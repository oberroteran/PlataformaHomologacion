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

  @Input() visibleMobile = false;
  visibleBody1 = false;
  visibleBody2 = false;
  bDown1 = false;
  bDown2 = false;
  constructor() { }

  ngOnInit() {
  }

  toggleVisibleBody1() {
    this.visibleBody1 = !this.visibleBody1;
    this.bDown1 = !this.bDown1;
  }

  toggleVisibleBody2() {
    this.visibleBody2 = !this.visibleBody2;
    this.bDown2 = !this.bDown2;
  }
}

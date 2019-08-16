import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-miga-pan',
  templateUrl: './miga-pan.component.html',
  styleUrls: [
    './miga-pan.component.css',
    './miga-pan.component-mobile.css'
  ]
})
export class MigaPanComponent implements OnInit {

  @Input() paso01 = false;
  @Input() paso02 = false;
  @Input() paso03 = false;
  @Input() paso04 = false;

  constructor() { }

  ngOnInit() {
  }

}

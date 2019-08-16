import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-policy-documents',
  templateUrl: './policy-documents.component.html',
  styleUrls: ['./policy-documents.component.css']
})
export class PolicyDocumentsComponent implements OnInit {
  @Input() public reference: any;
  
  constructor() { }

  ngOnInit() {
  }

}

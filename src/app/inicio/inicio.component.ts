import { Component, OnInit } from '@angular/core';
import { SessionStorageService } from '../shared/services/storage/storage-service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css', './inicio.component.mobile.css']
})
export class InicioComponent implements OnInit {

  constructor(private sessionStorageService: SessionStorageService) { }

  ngOnInit() {
    this.sessionStorageService.clearStorage();
  }
}

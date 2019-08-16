import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit {

  id = 0;
  nombre = "";
  canal = "";

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.limpiarsession();
    localStorage.setItem("systemUser", JSON.stringify({ system: 2 }));
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    this.canal = currentUser && currentUser.canal;
    this.id = currentUser && currentUser.id;
    this.nombre = currentUser && currentUser.firstName;
    localStorage.setItem("systemUser", JSON.stringify({ system: 2 }));
  }

  limpiarsession() {
		sessionStorage.removeItem("placa");
		sessionStorage.removeItem("auto");
		sessionStorage.removeItem("contratante");
		sessionStorage.removeItem("certificado");
	}

}

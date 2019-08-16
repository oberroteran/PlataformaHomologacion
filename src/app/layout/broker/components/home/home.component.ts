import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  id = 0;
  nombre = "";
  canal = "";
  soat = "Gestionar ventas de SOAT";
  sctr = "Gestionar ventas de SCTR";



  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    this.canal = currentUser && currentUser.canal;
    this.id = currentUser && currentUser.id;
    this.nombre = currentUser && currentUser.firstName;
  }

  goToSoat() {
    this.router.navigate(["broker/salepanel"]);
  }

  goToSctr() {
    this.router.navigate(["broker/panel"]);
  }
}

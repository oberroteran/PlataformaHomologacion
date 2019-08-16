import { ChannelPointService } from '../../../../shared/services/channelpoint/channelpoint.service';
import { Component, OnInit } from '@angular/core';
import { Papel } from '../../models/papel/papel';
import { PapelService } from '../../services/papel/papel.service';
import { Router } from '@angular/router';
import { ChannelPoint } from '../../../../shared/models/channelpoint/channelpoint';
import { EmisionService } from '../../../client/shared/services/emision.service';

@Component({
  selector: 'app-sale-panel',
  templateUrl: './salepanel.component.html',
  styleUrls: ['./salepanel.component.css', './salepanel.component-mobile.css']
})
export class SalePanelComponent implements OnInit {
  Papel = new Papel();
  id = 0;
  nombre = '';
  canal = '';
  puntoVenta = '';
  indpuntoVenta = 0;
  cpLaser = 0;
  cpManual = 0;
  cpDigital = 0;
  hayComboPuntoVenta = false;
  ListChannelPoint: ChannelPoint[] = [];
  channelPoint = new ChannelPoint('', 0);

  bMostrarPuntoVentas = false;
  desLaser = false;
  desManual = false;
  desDigital = false;

  bBloqueo = false;
  mensajeBloqueoVenta = '';

  constructor(
    private router: Router,
    private channelPointService: ChannelPointService,
    private papelService: PapelService,
    private emissionService: EmisionService
  ) { }

  ngOnInit() {
    this.limpiarsession();
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.canal = currentUser && currentUser.canal;
    this.id = currentUser && currentUser.id;
    this.indpuntoVenta = currentUser && currentUser.indpuntoVenta;
    const puntoVenta = currentUser && currentUser.puntoVenta;
    this.nombre = currentUser && currentUser.firstName;
    if (this.indpuntoVenta === 0) {
      this.getVentaPapel(this.canal, 0);
    } else {
      this.getVentaPapel(this.canal, puntoVenta);
    }

    // console.log('indpuntoVenta-->' + this.indpuntoVenta);
    // console.log('puntoVenta-->' + puntoVenta);

    this.bMostrarPuntoVentas =
      this.indpuntoVenta === 0 || this.indpuntoVenta === undefined;
    // console.log('this.bMostrarPuntoVentas-->' + this.bMostrarPuntoVentas);
    if (this.bMostrarPuntoVentas) {
      this.setComboPuntoVenta();
    }
  }

  limpiarsession() {
    sessionStorage.removeItem('placa');
    sessionStorage.removeItem('auto');
    sessionStorage.removeItem('contratante');
    sessionStorage.removeItem('certificado');
  }

  validaDeshabilitados(tipo: number): boolean {
    // console.log(this.bMostrarPuntoVentas);
    // console.log(this.hayComboPuntoVenta);
    // console.log(tipo);
    let deshabilitado = false;
    if (tipo > 0) {
      if (this.bMostrarPuntoVentas) {
        if (this.hayComboPuntoVenta) {
          deshabilitado = true;
        }
      } else {
        deshabilitado = false;
      }
    } else {
      deshabilitado = false;
    }

    if (tipo > 0 && !this.bMostrarPuntoVentas) {
      deshabilitado = true;
    }
    return deshabilitado;
  }

  onComprar(tipo: number) {
    this.bBloqueo = false;
    this.mensajeBloqueoVenta = '';
    this.emissionService.validarBloqueoVenta(this.canal).subscribe(
      res => {
        // console.log(res);
        if (res.codigo === '1') {
          sessionStorage.setItem('Modalidad', JSON.stringify({ tipoCertificado: tipo }));
          this.router.navigate(['broker/step01']);
        } else {
          this.bBloqueo = true;
          this.mensajeBloqueoVenta = res.mensaje;
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  onComprarAll(tipo: number) {
    this.bBloqueo = false;
    this.mensajeBloqueoVenta = '';
    this.emissionService.validarBloqueoVenta(this.canal).subscribe(
      res => {
        // console.log(res);
        if (res.codigo === '1') {
          sessionStorage.setItem('Modalidad', JSON.stringify({ tipoCertificado: tipo }));
          this.router.navigate(['broker/stepAll']);
        } else {
          this.bBloqueo = true;
          this.mensajeBloqueoVenta = res.mensaje;
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  getVentaPapel(canal, puntoVenta) {
    return this.papelService.getVentaPapel(canal, puntoVenta).subscribe(
      result => {
        this.Papel = <Papel>result;
        this.cpLaser = Number(this.Papel.v_NTOTAL_LASER_NV);
        this.cpManual = Number(this.Papel.v_NTOTAL_MANUAL_NV);
        this.cpDigital = Number(this.Papel.v_NTOTAL_DIGITAL_NV);
        this.desDigital = this.validaDeshabilitados(this.cpDigital);
        this.desLaser = this.validaDeshabilitados(this.cpLaser);
        this.desManual = this.validaDeshabilitados(this.cpManual);
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  setComboPuntoVenta() {
    const salePoint = new ChannelPoint(this.canal, this.indpuntoVenta);
    // console.log('this.canal-->' + this.canal);
    // console.log('salePoint-->' + salePoint);
    this.channelPointService.getPostChannelPoint(salePoint).subscribe(
      data => {
        // console.log(data);
        this.ListChannelPoint = <ChannelPoint[]>data;
        // console.log('this.ListChannelPoint__>' + this.ListChannelPoint);
      },
      error => {
        console.log(error);
      }
    );
  }

  setPuntoVenta(id) {
    this.hayComboPuntoVenta = id !== undefined;
    this.getVentaPapel(this.canal, id.target.value);
    this.ActualizarLocalStorage(id);
  }

  ActualizarLocalStorage(pv: any) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    // console.log('currentUser');
    // console.log(currentUser);
    const id = currentUser && currentUser['id'];
    const username = currentUser && currentUser['token'];
    const token = currentUser && currentUser['token'];
    const firstName = currentUser && currentUser['firstName'];
    const lastName = currentUser && currentUser['lastName'];
    // const email = currentUser && currentUser['email'];
    const tipoCanal = currentUser && currentUser['tipoCanal'];
    const canal = currentUser && currentUser['canal'];
    const desCanal = currentUser && currentUser['desCanal'];
    const indpuntoVenta = 0;

    const puntoVenta = pv.target.value;
    const desPuntoVenta = pv.target.options[pv.target.selectedIndex].label;

    const menu = currentUser && currentUser['menu'];

    localStorage.setItem(
      'currentUser',
      JSON.stringify({
        id: id,
        username: username,
        token: token,
        firstName: firstName,
        lastName: lastName,
        canal: canal,
        puntoVenta: puntoVenta,
        indpuntoVenta: indpuntoVenta,
        desCanal: desCanal,
        desPuntoVenta: desPuntoVenta,
        tipoCanal: tipoCanal,
        menu: menu
      })
    );
    // const currentUser2 = JSON.parse(localStorage.getItem('currentUser'));
    // console.log('currentUser2');
    // console.log(currentUser2);
  }

  Irhistorial(): void {
    this.router.navigate(['broker/historial']);
  }
}

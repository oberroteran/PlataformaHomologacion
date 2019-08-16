import { Component, OnInit } from '@angular/core';
import { Cliente } from '../../../broker/models/cliente/cliente';
import { EmisionService } from '../../../client/shared/services/emision.service';
import { Certificado } from '../../models/certificado/certificado';
import { AppConfig } from '../../../../app.config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-res-vaucher',
  templateUrl: './res-vaucher.component.html',
  styleUrls: ['./res-vaucher.component.css']
})
export class ResVaucherComponent implements OnInit {

  bLoading = false;
  bAprobado = true;
  cliente: Cliente;
  certificado: Certificado;
  Modalidad: any;

  constructor(
    private emisionService: EmisionService,
    private router: Router) { }

  ngOnInit() {
    sessionStorage.setItem('pagefrom', 'LastStepComponent');
    const clienteSesion = sessionStorage.getItem('contratante');

    if (clienteSesion !== null) {
      this.cliente = JSON.parse(clienteSesion);
    }

    const certificadoSession = sessionStorage.getItem('certificado');

    if (certificadoSession !== null) {
      this.certificado = JSON.parse(certificadoSession);
      // console.log(this.certificado);
    }

    this.Modalidad = JSON.parse(sessionStorage.getItem('Modalidad'));

    this.limpiarSessionStorage();
  }

  onImprimir() {
    this.emisionService.generarPolizaPdf(+this.certificado.P_NPOLICY)
      .subscribe(
        res => {
          this.downloadPdf(res.fileName);
        },
        err => {
          console.log(err);
        }
      );
  }

  downloadPdf(fileName: string) {
    const url = `${AppConfig.PATH_PDF_FILES}/${fileName}`;
    const a = document.createElement('a');

    a.setAttribute('href', url);
    a.setAttribute('target', '_blank');
    a.setAttribute('style', 'display:none;');

    document.body.appendChild(a);

    a.click();
    a.remove();
  }

  limpiarSessionStorage() {
    sessionStorage.removeItem('placa');
    sessionStorage.removeItem('auto');
    sessionStorage.removeItem('contratante');
    sessionStorage.removeItem('certificado');
  }

  IrPlaca(): void {
    this.router.navigate(['broker/stepAll']);
  }
}

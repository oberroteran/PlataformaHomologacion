import { Component, OnInit, Input } from '@angular/core';
import { VisaResult } from '../../models/visaresult/visaresult';
import { AppConfig } from '../../../../app.config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-visa-result',
  templateUrl: './visa-result.component.html',
  styleUrls: ['./visa-result.component.css']
})
export class VisaResultComponent implements OnInit {
  @Input() loading: boolean; // para mostrar el componente
  @Input() resultOK: boolean; // para mostrar el componente
  @Input() result: VisaResult; // para mostrar la información en el componente
  @Input() downloadUrl: string;
  @Input() paymentUrl: string;

  verTerminos = false;

  constructor(private router: Router) {}

  ngOnInit() {}

  mostrarTerminosCondiciones() {
    // this.verTerminos = false;
    this.verTerminos = true;
  }

  downloadPdf() {
    const _iFrame = <HTMLIFrameElement>document.getElementById('ifrmPdf');

    _iFrame.src = 'about:blank';
    //console.log(this.downloadUrl);
    setTimeout(() => {
      _iFrame.src = this.downloadUrl;
    }, 250);
  }

  nuevoPago() {
    if (this.paymentUrl) {
      this.router.navigate([this.paymentUrl]);
    }
  }

  limpiarSessionStorage() {
    sessionStorage.removeItem('placa');
    sessionStorage.removeItem('auto');
    sessionStorage.removeItem('contratante');
    sessionStorage.removeItem('certificado');
  }

  IrPlaca(): void {
    this.router.navigate(['broker/step01']);
    this.limpiarSessionStorage();
  }

}

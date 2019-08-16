import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// Components
import { ClientComponent } from './client.component';
import { Step01Component } from './components/step01/step01.component';
import { Step02Component } from './components/step02/step02.component';
import { Step03Component } from './components/step03/step03.component';
import { Step04Component } from './components/step04/step04.component';
import { ResultadoVisaComponent } from './components/resultado-visa/resultado-visa.component';
import { ResultadoPagoefectivoComponent } from './components/resultado-pagoefectivo/resultado-pagoefectivo.component';
import { Step00Component } from './components/step00/step00.component';

const routes: Routes = [
  {
    path: '',
    component: ClientComponent,
    children: [
      { path: 'skip', component: Step00Component },
      { path: 'placa', component: Step01Component },
      { path: 'vehiculo', component: Step02Component },
      { path: 'contratante', component: Step03Component },
      { path: 'resumen', component: Step04Component },
      { path: 'resultadovisa/:key', component: ResultadoVisaComponent },
      { path: 'resultadope', component: ResultadoPagoefectivoComponent },
      { path: '**', redirectTo: 'placa' }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ClientRoutingModule { }

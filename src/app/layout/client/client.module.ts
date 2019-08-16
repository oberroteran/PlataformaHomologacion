import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Modules
import { ClientRoutingModule } from './client-routing.module';
import { SharedComponentsModule } from '../../shared/modules/shared-components.module';
import { ModalModules } from '../../shared/components/modal/modal.module';
// Components
import { MigaPanComponent } from './shared/components/miga-pan/miga-pan.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { TitleStepComponent } from './shared/components/title-step/title-step.component';
import { BackStepComponent } from './shared/components/back-step/back-step.component';
import { ClientComponent } from './client.component';
import { Step01Component } from './components/step01/step01.component';
import { Step02Component } from './components/step02/step02.component';
import { Step03Component } from './components/step03/step03.component';
import { Step04Component } from './components/step04/step04.component';
import { SidebarResumenComponent } from './components/sidebar-resumen/sidebar-resumen.component';
import { AddResumenComponent } from './components/add-resumen/add-resumen.component';
import { ResultadoVisaComponent } from './components/resultado-visa/resultado-visa.component';
import { ResultadoPagoefectivoComponent } from './components/resultado-pagoefectivo/resultado-pagoefectivo.component';
// Services/Providers
import { VehiculoService } from './shared/services/vehiculo.service';
import { UsoService } from '../../shared/services/uso/uso.service';
import { ConfigService } from '../../shared/services/general/config.service';
import { ApiService } from '../../shared/services/api.service';
import { ClienteService } from './shared/services/cliente.service';
import { UbigeoService } from '../../shared/services/ubigeo/ubigeo.service';
import { VisaService } from '../../shared/services/pago/visa.service';
import { PagoEfectivoService } from '../../shared/services/pago/pago-efectivo.service';
import { UtilityService } from '../../shared/services/general/utility.service';
import { EmisionService } from './shared/services/emision.service';
import { CertificadoService } from './shared/services/certificado.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ClientHttpInterceptor } from './shared/services/client-http-interceptor';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { BrokerHttpInterceptor } from '../broker/guards/broker-http-interceptor';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoggerService } from '../../shared/services/logger/logger.service';
import { Step00Component } from './components/step00/step00.component';
// import { InputDateComponent } from '../../shared/components/input-date/input-date.component';
// import { InputDateComponent } from '../../shared/components/input-date/input-date.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ClientRoutingModule,
    SharedComponentsModule,
    ModalModules,
    HttpClientModule,
    BsDatepickerModule.forRoot(),
    NgbModule
  ],
  declarations: [
    MigaPanComponent,
    SidebarComponent,
    SidebarResumenComponent,
    AddResumenComponent,
    TitleStepComponent,
    BackStepComponent,
    ClientComponent,
    Step00Component,
    Step01Component,
    Step02Component,
    Step03Component,
    Step04Component,
    ResultadoVisaComponent,
    ResultadoPagoefectivoComponent
    // InputDateComponent
  ],
  entryComponents: [],
  providers: [
    ApiService,
    ConfigService,
    CertificadoService,
    ClienteService,
    EmisionService,
    VehiculoService,
    UsoService,
    UbigeoService,
    VisaService,
    PagoEfectivoService,
    UtilityService,
    LoggerService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ClientHttpInterceptor,
      multi: true
    },
    DatePipe
  ]
})
export class ClientModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InicioComponent } from './inicio.component';
import { SharedComponentsModule } from '../shared/modules/shared-components.module';
import { InicioRoutingModule } from './inicio-routing.module';

@NgModule({
  imports: [
    CommonModule,
    InicioRoutingModule,
    SharedComponentsModule
  ],
  declarations: [
    InicioComponent
  ]
})
export class InicioModule { }

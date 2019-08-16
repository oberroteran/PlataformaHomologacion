import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('./inicio/inicio.module').then(m => m.InicioModule) },
  { path: 'client', loadChildren: () => import('./layout/client/client.module').then(m => m.ClientModule) },
  { path: 'broker', loadChildren: () => import('./layout/broker/broker.module').then(m => m.BrokerModule) },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

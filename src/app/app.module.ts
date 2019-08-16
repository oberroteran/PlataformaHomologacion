import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { LogoutDialogComponent } from './shared/logout/component/logout-dialog.component';
import { LogoutService } from './shared/logout/service/logout.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from './layout/broker/services/authentication.service';
import { AppConfig } from './app.config';
import { SidebarService } from './shared/services/sidebar/sidebar.service';

import { BsDatepickerModule } from 'ngx-bootstrap';
import { VersionCheckService } from './shared/services/check-service/version-check.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
@NgModule({
  declarations: [AppComponent, LogoutDialogComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    BsDatepickerModule.forRoot()
  ],
  providers: [
    LogoutService,
    AuthenticationService,
    AppConfig,
    SidebarService,
    VersionCheckService
  ],
  bootstrap: [AppComponent],
  entryComponents: [LogoutDialogComponent],
})
export class AppModule { }

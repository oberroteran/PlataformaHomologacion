import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../components/header/header.component';
import { FooterComponent } from '../components/footer/footer.component';
import { ButtonVisaComponent } from '../components/button-visa/button-visa.component';
import { FrameComponent } from '../components/frame/frame.component';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ItemPersonalComponent } from '../components/item-personal/item-personal.component';
import { InputDateComponent } from '../components/input-date/input-date.component';
import { PixelGoogleAnalyticsComponent } from '../components/pixel-google-analytics/pixel-google-analytics.component';
import { PixelDigilantComponent } from '../components/pixel-digilant/pixel-digilant.component';
import { PixelGoogleTagManagerComponent } from '../components/pixel-google-tag-manager/pixel-google-tag-manager.component';
import { PixelFacebookComponent } from '../components/pixel-facebook/pixel-facebook.component';
import { ItemPersonalFullComponent } from '../components/item-personal-full/item-personal-full.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BsDatepickerModule.forRoot(),
    NgbModule
  ],
  declarations: [
    HeaderComponent,
    FooterComponent,
    ButtonVisaComponent,
    FrameComponent,
    ItemPersonalComponent,
    ItemPersonalFullComponent,
    InputDateComponent,
    PixelGoogleAnalyticsComponent,
    PixelGoogleTagManagerComponent,
    PixelDigilantComponent,
    PixelFacebookComponent
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    ItemPersonalComponent,
    ItemPersonalFullComponent,
    InputDateComponent,
    PixelGoogleAnalyticsComponent,
    PixelGoogleTagManagerComponent,
    PixelDigilantComponent, PixelFacebookComponent
  ],
  entryComponents: [
    ButtonVisaComponent,
    FrameComponent,
    PixelGoogleAnalyticsComponent,
    PixelGoogleTagManagerComponent,
    PixelDigilantComponent
  ]
})
export class SharedComponentsModule { }

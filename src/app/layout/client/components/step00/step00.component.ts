import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { Router } from '@angular/router';
import { VehiculoService } from '../../shared/services/vehiculo.service';
import { EmisionService } from '../../shared/services/emision.service';
import { UtilityService } from '../../../../shared/services/general/utility.service';
import { PixelGoogleAnalyticsComponent } from '../../../../shared/components/pixel-google-analytics/pixel-google-analytics.component';
import { Auto } from '../../shared/models/auto.model';
import { Parameter } from '../../../../shared/models/parameter/parameter';
import { Campaign } from '../../../../shared/models/campaign/campaign';
import { ReferenceChannel } from '../../../../shared/models/referencechannel/referencechannel';
import { AppConfig } from '../../../../app.config';
import { LoggerService } from '../../../../shared/services/logger/logger.service';
import { Logger } from '../../../../shared/models/logger/logger';
import { environment } from '../../../../../environments/environment';


@Component({
  selector: 'app-step00',
  templateUrl: './step00.component.html',
  styleUrls: ['./step00.component.css']
})
export class Step00Component {
  constructor() { }
}


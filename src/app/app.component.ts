import { environment } from './../environments/environment';
import { Component, OnInit } from '@angular/core';
import { VersionCheckService } from './shared/services/check-service/version-check.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {


  constructor(private versionCheckService: VersionCheckService) {
  }

  ngOnInit(): void {
    if (environment.production) {
      this.versionCheckService.initVersionCheck(environment.versioncheckurl);
    }
  }

}

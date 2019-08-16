import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SharedData } from '../../../models/quotation/request/shared-data'

@Injectable({
  providedIn: 'root'
})
export class DataBridgeService {
  private sharedData: SharedData;
  constructor() { }

  setData(data: SharedData) {
    this.sharedData = data;
  }
  getData(): SharedData {
    return this.sharedData;
  }
}

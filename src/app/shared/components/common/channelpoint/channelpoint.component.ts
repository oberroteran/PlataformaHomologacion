import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { ChannelPointService } from '../../../services/channelpoint/channelpoint.service';
import { ChannelSalesService } from '../../../services/channelsales/channelsales.service';
import { ChannelPoint } from '../../../models/channelpoint/channelpoint';
import { ChannelSales } from '../../../models/channelsales/channelsales';

@Component({
  selector: 'app-channelpoint',
  templateUrl: './channelpoint.component.html',
  styleUrls: ['./channelpoint.component.css']
})
export class ChannelpointComponent implements OnInit {
  @Output() evResultChannelSales = new EventEmitter<number>();
  ResultChannelSales = 0;
  @Output() evResultChannelPoint = new EventEmitter<number>();
  ResultChannelPoint = 0;
  resultdecv = '';
  @Input() myInput;

  mensaje: string;
  ListChannelSales: any[];
  ListChannelPoint: any[];
  channelPoint = new ChannelPoint('', 0);
  channelSales: ChannelSales;
  nusercode = 0;
  canal = '';
  indpuntoVenta = 0;

  constructor(private channelPointService: ChannelPointService, private channelSalesService: ChannelSalesService) { }

  ngOnInit() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.nusercode = currentUser && currentUser.id;
    this.canal = currentUser && currentUser.canal;
    this.indpuntoVenta = currentUser && currentUser.indpuntoVenta;
    this.channelSales = new ChannelSales(this.nusercode, '0', '');
    this.channelSalesService.getPostChannelSales(this.channelSales)
      .subscribe(
        data => {
          this.ListChannelSales = <any[]>data;
        },
        error => {
          console.log(error);
        }
      );
  }

  onSelectChannelSales(channelSalesId) {
    this.throwChannelSales(channelSalesId);
    if (channelSalesId === '0') {
      this.ListChannelPoint = [];
      this.throwChannelPoint(channelSalesId);
    } else {
      const salePoint = new ChannelPoint(channelSalesId, this.indpuntoVenta);
      this.channelPointService.getPostChannelPoint(salePoint)
        .subscribe(
          data => {
            this.ListChannelPoint = <any[]>data;
          },
          error => {
            console.log(error);
          }
        );
    }
  }

  throwChannelSales(resultChannelSales: number) {
    this.evResultChannelSales.emit(resultChannelSales);
  }


  throwChannelPoint(resultChannelPoint: number) {
    this.evResultChannelPoint.emit(resultChannelPoint);
  }

  onSelectChannelPoint(channelPointId) {
    // console.log(channelPointId);
    this.ResultChannelPoint = channelPointId;
    this.throwChannelPoint(channelPointId);
  }

}

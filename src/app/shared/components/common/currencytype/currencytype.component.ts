import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CurrencyTypeService } from '../../../services/currencytype/currencytype.service';
import { TipoCurrency } from '../../../models/currencytype/currencytype';

@Component({
  selector: 'app-currencytype',
  templateUrl: './currencytype.component.html',
  styleUrls: ['./currencytype.component.css']
})
export class CurrencytypeComponent implements OnInit {
  @Output() evResultCurrencyType = new EventEmitter();
  ResultCurrencyType = 0;
  mensaje: string;
  ListCurrencyType: any[];
  currencyType = new TipoCurrency('0', '');
  constructor(private currencyTypeService: CurrencyTypeService) { }

  ngOnInit() {
    this.currencyTypeService.getPostCurrencyType(this.currencyType)
      .subscribe(
        data => {
          this.ListCurrencyType = <any[]>data;
        },
        error => {
          console.log(error);
        }
      );
  }

  throwCurrencyType(resultCurrencyType: number, resuttext: string) {
    this.evResultCurrencyType.emit({ id: resultCurrencyType, text: resuttext });
  }

  onSelectCurrencyType(event: any) {
    const currencyTypeId = event.target.value;
    const currencyTypetext = event.target.options[event.target.selectedIndex].text;
    this.ResultCurrencyType = currencyTypeId;
    this.throwCurrencyType(currencyTypeId, currencyTypetext);
  }

}

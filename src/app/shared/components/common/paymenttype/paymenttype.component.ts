import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { PaymentTypeService } from '../../../services/paymenttype/paymenttype.service';
import { PaymentType } from '../../../models/paymenttype/paymenttype';

@Component({
  selector: 'app-paymenttype',
  templateUrl: './paymenttype.component.html',
  styleUrls: ['./paymenttype.component.css']
})
export class PaymenttypeComponent implements OnInit {
  @Output() evResultPaymentType = new EventEmitter();
  ResultPaymentType = 0;
  mensaje: string;
  ListPaymentType: any[];
  paymentType = new PaymentType('0', '');
  constructor(private paymentTypeService: PaymentTypeService) { }

  ngOnInit() {
    this.paymentTypeService.getPostPaymentType(this.paymentType)
      .subscribe(
        data => {
          this.ListPaymentType = <any[]>data;
        },
        error => {
          console.log(error);
        }
      );
  }

  throwPaymentType(resultPaymentType: number, resuttext: string) {
    this.evResultPaymentType.emit({ id: resultPaymentType, text: resuttext });
  }

  onSelectPaymentType(event: any) {
    const paymentTypeId = event.target.value;
    const paymentTypetext = event.target.options[event.target.selectedIndex].text;
    this.ResultPaymentType = paymentTypeId;
    this.throwPaymentType(paymentTypeId, paymentTypetext);
  }

}

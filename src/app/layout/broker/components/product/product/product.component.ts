import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product/panel/product.service';
import { ProductByUserRQ } from '../../../models/product/panel/Request/ProductByUserRQ';
import { ProductRP } from '../../../models/product/panel/Response/ProductRP';
import { Observable } from "rxjs/Observable";
import { Features } from "../../../models/features";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  productByUser = new ProductByUserRQ();
  productList = null;
  public system = 0;

  constructor(private productService: ProductService) { }

  ngOnInit() {
    
    this.system = JSON.parse(localStorage.getItem("systemUser"))["system"];

    if (localStorage.getItem("currentUser") != null) {
      this.productByUser.P_NIDUSER = JSON.parse(localStorage.getItem("currentUser"))["id"];
      if (localStorage.getItem("productUser") != null) {
        this.productList = JSON.parse(localStorage.getItem("productUser"))["response"];
      } else {
        this.getProductByUser(this.productByUser);
      }
    }
    else {
      this.productList = null;
    }
  }

  getProductByUser(productByUser: ProductByUserRQ) {
    return this.productService.getProductByUser(productByUser).subscribe(
      res => {
        this.productList = JSON.parse(localStorage.getItem("productUser"))["response"];
      },
      err => {
        console.log(err);
      }
    );
  }

}

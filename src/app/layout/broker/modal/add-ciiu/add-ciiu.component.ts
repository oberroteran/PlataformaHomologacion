import { Component, OnInit, Input } from '@angular/core';

//Importación de servicios
import { ClientInformationService } from '../../services/shared/client-information.service';

//SweeatAlert
import swal from 'sweetalert2';

@Component({
  selector: 'app-add-ciiu',
  templateUrl: './add-ciiu.component.html',
  styleUrls: ['./add-ciiu.component.css']
})
export class AddCiiuComponent implements OnInit {
  @Input() public reference: any;
  @Input() public listaCiiu = [];
  @Input() public itemCiiu = null;

  public ciiuList: any = [];
  public InputsCiiu: any = {};
  public txtAccion = "Agregar Ciiu";
  VAL_CIIU: any = {}
  constructor(
    private clientInformationService: ClientInformationService
  ) { }

  ngOnInit() {

    this.getCiiuList();

    this.InputsCiiu.P_SORIGEN = "SCTR";
    this.InputsCiiu.P_NUSERCODE = JSON.parse(localStorage.getItem("currentUser"))["id"];

    if (this.itemCiiu != null) {
      this.txtAccion = "Guardar Ciiu";
      this.InputsCiiu.P_SDESCIIU = this.itemCiiu.P_SDESCIIU;
      this.InputsCiiu.P_NROW = this.itemCiiu.P_NROW;
      this.InputsCiiu.P_SCIIU = this.itemCiiu.P_SCIIU;
      this.InputsCiiu.P_TipOper = this.itemCiiu.P_TipOper;
      this.InputsCiiu.P_CLASS = this.itemCiiu.P_CLASS;
    } else {
      this.txtAccion = "Agregar Ciiu";
      this.InputsCiiu.P_SDESCIIU = "";
      this.InputsCiiu.P_NROW = "";
      this.InputsCiiu.P_SCIIU = null;
      this.InputsCiiu.P_TipOper = "";
      this.InputsCiiu.P_CLASS = "";
    }
    this.VAL_CIIU[0] =""

  }

  getCiiuList() {

    this.clientInformationService.getCiiuList().subscribe(
      res => {
        this.ciiuList = res;
      },
      err => {
        console.log(err);
      }
    );
  }

  onSelectCiiu(event) {

    // let selectElementText = event.target['options']
    // [event.target['options'].selectedIndex].text;

    if (event == undefined) {
      this.InputsCiiu.P_SDESCIIU = "";
      this.InputsCiiu.P_SCIIU = null;
    } else {
      this.InputsCiiu.P_SDESCIIU = event.SDESCRIPT;
      this.InputsCiiu.P_SCIIU = event.P_SCIIU;
    }
  }

  EventSave() {
    if (this.itemCiiu == null) {
      let existe = 0;
      let item = this.InputsCiiu;
      this.listaCiiu.map(function (dato) {
        if (dato.P_SCIIU == item.P_SCIIU) {
          existe = 1;
        }
      });

      if (existe == 0) {
        this.InputsCiiu.P_NROW = this.listaCiiu.length + 1;
        this.ValidarCiiu(this.InputsCiiu, "");
      } else {
        swal.fire("Información", "El ciiu ingresado ya se encuentra registrado.", "warning");
      }

    } else {
      let num = this.InputsCiiu.P_NROW;
      let existe = 0;
      let item = this.InputsCiiu;
      this.listaCiiu.map(function (dato) {
        if (dato.P_SCIIU == item.P_SCIIU &&
          dato.P_NROW !== num) {
          existe = 1;
        }
      });
      if (existe === 0) {
        this.ValidarCiiu(item, num);
      } else {
        swal.fire("Información", "El ciiu ingresado ya se encuentra registrado.", "warning");
      }
    }
  }
  
  Clear(idx) {
    this.VAL_CIIU[idx] = "";
  }

  ValidarCiiu(itemCiiu, row) {
    let mensaje = ""
  
    if (itemCiiu.P_SCIIU == null || itemCiiu.P_SCIIU == 0) {
      this.VAL_CIIU[0] ="0"
      mensaje = "La actividad económica es requerido"
    }
    if (mensaje != "") {
      swal.fire("Información", mensaje, "warning");
    } else {
      this.clientInformationService.ValCiiu(itemCiiu).subscribe(
        res => {
          if (row == "") {
            if (res.P_NCODE === 0) {
              this.listaCiiu.push(itemCiiu);
              this.reference.close();
            } else {
              swal.fire("Información", res.P_SMESSAGE, "warning");
            }
          } else {
            if (res.P_NCODE === 0) {
              this.actualizarCiiu(row)
              this.reference.close();
            } else {
              swal.fire("Información", res.P_SMESSAGE, "warning");
            }
          }
        },
        err => {
          console.log(err);
        }
      );
    }
  }

  actualizarCiiu(row) {
    let item = this.InputsCiiu;
    this.listaCiiu.map(function (dato) {
      if (dato.P_NROW == row) {
        dato.P_TipOper = "";
        dato.P_SDESCIIU = item.P_SDESCIIU;
        dato.P_SCIIU = item.P_SCIIU;
      }
    });

  }


}

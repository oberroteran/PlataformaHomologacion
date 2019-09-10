import { Component, OnInit, Input } from '@angular/core';

//Importación de servicios
import { ClientInformationService } from '../../services/shared/client-information.service';

//Importacion de modelos
import { EmailType } from '../../models/shared/client-information/email-type';

//SweeatAlert
import swal from 'sweetalert2';

@Component({
  selector: 'app-add-email',
  templateUrl: './add-email.component.html',
  styleUrls: ['./add-email.component.css']
})
export class AddEmailComponent implements OnInit {
  @Input() public reference: any;
  @Input() public listaCorreos = [];
  @Input() public itemCorreo = null;

  emailTypeList: EmailType[];
  InputsEmail: any = {};
  txtAccion = "Agregar Correo";
  VAL_EMAIL: any = {}


  constructor(
    private clientInformationService: ClientInformationService
  ) { }

  ngOnInit() {
    this.getEmailTypeList();

    this.InputsEmail.P_SORIGEN = "SCTR";
    this.InputsEmail.P_NUSERCODE = JSON.parse(localStorage.getItem("currentUser"))["id"];

    if (this.itemCorreo != null) {
      this.txtAccion = "Guardar Correo";
      this.InputsEmail.P_DESTICORREO = this.itemCorreo.P_DESTICORREO;
      this.InputsEmail.P_NROW = this.itemCorreo.P_NROW;
      this.InputsEmail.P_SE_MAIL = this.itemCorreo.P_SE_MAIL;
      this.InputsEmail.P_SRECTYPE = this.itemCorreo.P_SRECTYPE;
      this.InputsEmail.P_TipOper = this.itemCorreo.P_TipOper;
      this.InputsEmail.P_CLASS = this.itemCorreo.P_CLASS;
    } else {
      this.txtAccion = "Agregar Correo";
      this.InputsEmail.P_DESTICORREO = "";
      this.InputsEmail.P_NROW = "";
      this.InputsEmail.P_SE_MAIL = "";
      this.InputsEmail.P_SRECTYPE = "0";
      this.InputsEmail.P_TipOper = "";
      this.InputsEmail.P_CLASS = "";
    }

    this.VAL_EMAIL[0] = "";
    this.VAL_EMAIL[1] = "";
  }

  getEmailTypeList() {

    this.clientInformationService.getEmailTypeList().subscribe(
      res => {
        this.emailTypeList = res;
      },
      err => {
        console.log(err);
      }
    );
  }

  onSelectEmailType(event) {

    let selectElementText = event.target['options']
    [event.target['options'].selectedIndex].text;

    if (event.target.value == null) {
      this.InputsEmail.P_DESTICORREO = "";
      this.InputsEmail.P_SRECTYPE = "0";
    } else {
      this.InputsEmail.P_DESTICORREO = selectElementText;
      this.InputsEmail.P_SRECTYPE = event.target.value;
    }
  }

  Clear(idx) {
    this.VAL_EMAIL[idx] = "";
  }

  EventSave() {
    
    this.InputsEmail.P_SE_MAIL = this.InputsEmail.P_SE_MAIL == null ? "" : this.InputsEmail.P_SE_MAIL.toUpperCase()

    if (this.itemCorreo == null) {
      let existe = 0;
      let item = this.InputsEmail;
      this.listaCorreos.map(function (dato) {
        if (dato.P_SE_MAIL == item.P_SE_MAIL && dato.P_SRECTYPE == item.P_SRECTYPE) {
          existe = 1;
        }
      });

      if (existe == 0) {
        this.InputsEmail.P_NROW = this.listaCorreos.length + 1;
        this.ValidarCorreo(this.InputsEmail, "");
      } else {
        swal.fire("Información", "El email ingresado ya se encuentra registrado.", "warning");
      }

    } else {
      let num = this.InputsEmail.P_NROW;
      let existe = 0;
      let item = this.InputsEmail;
      this.listaCorreos.map(function (dato) {
        if (dato.P_SE_MAIL == item.P_SE_MAIL && dato.P_SRECTYPE == item.P_SRECTYPE &&
          dato.P_NROW !== num) {
          existe = 1;
        }
      });
      if (existe === 0) {
        this.ValidarCorreo(item, num);
      } else {
        swal.fire("Información", "El email ingresado ya se encuentra registrado.", "warning");
      }
    }
  }

  ValidarCorreo(itemCorreo, row) {
    let mensaje = "";
    if (itemCorreo.P_SRECTYPE == 0) {
      this.VAL_EMAIL[0] = "0";
      mensaje += "El tipo de email es requerido <br />"
    }
    if (itemCorreo.P_SE_MAIL.trim() == "") {
      this.VAL_EMAIL[1] = "1";
      mensaje += "El correo electrónico es requerido <br />"
    } else {
      if (/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(itemCorreo.P_SE_MAIL) == false) {
        this.VAL_EMAIL[1] = "1";
        mensaje += "El correo electrónico es inválido <br />";
      }
    }
    if (mensaje != "") {
      swal.fire("Información", mensaje, "warning");
    } else {
      this.clientInformationService.ValEmail(itemCorreo).subscribe(
        res => {
          if (row == "") {
            if (res.P_NCODE === 0) {
              this.listaCorreos.push(itemCorreo);
              this.reference.close();
            } else {
              swal.fire("Información", res.P_SMESSAGE, "warning");
            }
          } else {
            if (res.P_NCODE === 0) {
              this.actualizarCorreo(row)
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

  actualizarCorreo(row) {
    let item = this.InputsEmail;
    this.listaCorreos.map(function (dato) {
      if (dato.P_NROW == row) {
        dato.P_TipOper = "";
        dato.P_DESTICORREO = item.P_DESTICORREO;
        dato.P_SE_MAIL = item.P_SE_MAIL;
        dato.P_SRECTYPE = item.P_SRECTYPE;
      }
    });

  }

  valText(event: any, type) {
    // console.log(type)
    let pattern;
    switch (type) {
      case 1: { // Numericos 
        pattern = /[0-9]/;
        break;
      }
      case 2: { // Alfanumericos sin espacios
        pattern = /[0-9A-Za-zÁÉÍÓÚáéíóúÄËÏÖÜäëïöü]/;
        break;
      }
      case 3: { // Alfanumericos con espacios
        pattern = /[0-9A-Za-zÁÉÍÓÚáéíóúÄËÏÖÜäëïöü ]/;
        break;
      }
      case 4: { // LegalName
        pattern = /[a-zA-ZÁÉÍÓÚáéíóúÄËÏÖÜäëïöü0-9-,:()&$#. ]/;
        break;
      }
      case 5: { // Solo texto
        pattern = /[A-Za-zÁÉÍÓÚáéíóúÄËÏÖÜäëïöü ]/;
        break;
      }
      case 6: { // Email
        pattern = /[0-9A-Za-z._@-]/;
        break;
      }
    }

    const inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

}

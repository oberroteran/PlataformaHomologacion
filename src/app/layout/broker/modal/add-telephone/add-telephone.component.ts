import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from "@angular/forms";

//Importación de servicios
import { ClientInformationService } from '../../services/shared/client-information.service';

//Importacion de modelos
import { PhoneType } from '../../models/shared/client-information/phone-type';
import { CityCode } from '../../models/shared/client-information/city-code';

//SweeatAlert
import swal from 'sweetalert2';

@Component({
  selector: 'app-add-telephone',
  templateUrl: './add-telephone.component.html',
  styleUrls: ['./add-telephone.component.css']
})
export class AddTelephoneComponent implements OnInit {
  @Input() public reference: any;
  @Input() public listaTelefonos = [];
  @Input() public itemTelefono = null;

  public phoneTypeList: PhoneType[];
  public cityCodeList: CityCode[];
  public InputsTelephone: any = {};
  public blockCelular = true;
  public blockAnexo = true;
  public txtAccion = "Agregar Telefono";
  public maxlength = 9;
  public mensajeError = "";

  //Errores teléfono
  VAL_PHONE: any = {};

  constructor(
    private clientInformationService: ClientInformationService
  ) { }

  ngOnInit() {
    this.getPhoneTypeList();
    this.getCityCodeList();

    this.InputsTelephone.P_SORIGEN = "SCTR";
    this.InputsTelephone.P_NUSERCODE = JSON.parse(localStorage.getItem("currentUser"))["id"];

    if (this.itemTelefono != null) {
      this.txtAccion = "Guardar Teléfono";
      this.InputsTelephone.P_DESAREA = this.itemTelefono.P_DESAREA;
      this.InputsTelephone.P_DESTIPOTLF = this.itemTelefono.P_DESTIPOTLF;
      this.InputsTelephone.P_NAREA_CODE = this.itemTelefono.P_NAREA_CODE;
      this.InputsTelephone.P_NEXTENS1 = this.itemTelefono.P_NEXTENS1;
      this.InputsTelephone.P_NPHONE_TYPE = this.itemTelefono.P_NPHONE_TYPE;
      this.InputsTelephone.P_NROW = this.itemTelefono.P_NROW;
      this.InputsTelephone.P_SPHONE = this.itemTelefono.P_SPHONE;
      this.InputsTelephone.P_SNOMUSUARIO = this.itemTelefono.P_SNOMUSUARIO;
      this.InputsTelephone.P_DCOMPDATE = this.itemTelefono.P_DCOMPDATE;
      this.InputsTelephone.P_TipOper = this.itemTelefono.P_TipOper;
      this.InputsTelephone.P_CLASS = this.itemTelefono.P_CLASS;
      this.onSelectTypePhoneEdit(this.itemTelefono)
    } else {
      this.txtAccion = "Agregar Teléfono";
      this.InputsTelephone.P_DESAREA = "";
      this.InputsTelephone.P_DESTIPOTLF = "";
      this.InputsTelephone.P_NAREA_CODE = "0";
      this.InputsTelephone.P_NEXTENS1 = null;
      this.InputsTelephone.P_NPHONE_TYPE = "0";
      this.InputsTelephone.P_NROW = "";
      this.InputsTelephone.P_SPHONE = "";
      this.InputsTelephone.P_SNOMUSUARIO = "";
      this.InputsTelephone.P_DCOMPDATE = "";
      this.InputsTelephone.P_TipOper = "";
      this.InputsTelephone.P_CLASS = "";
    }

    this.VAL_PHONE[0] = ""; //Tipo de teléfono
    this.VAL_PHONE[1] = ""; //Código de área
    this.VAL_PHONE[2] = ""; //Número de teléfono
    this.VAL_PHONE[3] = ""; //Anexo


  }

  getPhoneTypeList() {

    this.clientInformationService.getPhoneTypeList().subscribe(
      res => {
        this.phoneTypeList = res;
      },
      err => {
        console.log(err);
      }
    );
  }

  getCityCodeList() {

    this.clientInformationService.getCityCodeList().subscribe(
      res => {
        this.cityCodeList = res;
      },
      err => {
        console.log(err);
      }
    );
  }

  onSelectTypePhone(event) {

    let selectElementText = event.target['options']
    [event.target['options'].selectedIndex].text;

    switch (event.target.value) {
      case "0":
        this.blockCelular = true;
        this.blockAnexo = true;
        this.InputsTelephone.P_DESTIPOTLF = "";
        this.InputsTelephone.P_NPHONE_TYPE = event.target.value;
        this.maxlength = 7;
        this.clearDocument();
        break;
      case "1":
        this.blockCelular = false;
        this.blockAnexo = false;
        this.InputsTelephone.P_DESTIPOTLF = selectElementText;
        this.InputsTelephone.P_NPHONE_TYPE = event.target.value;
        if (this.InputsTelephone.P_NAREA_CODE == "1") {
          this.maxlength = 7;
        } else {
          this.maxlength = 6;
        }
        this.clearDocument();
        break;
      case "2":
        this.blockCelular = true;
        this.blockAnexo = true;
        this.InputsTelephone.P_DESTIPOTLF = selectElementText;
        this.InputsTelephone.P_NPHONE_TYPE = event.target.value;
        this.maxlength = 9;
        this.clearDocument();
        break;
      default:
        this.blockCelular = false;
        this.blockAnexo = true;
        this.InputsTelephone.P_DESTIPOTLF = selectElementText;
        this.InputsTelephone.P_NPHONE_TYPE = event.target.value;
        this.InputsTelephone.P_NEXTENS1 = null;
        this.maxlength = 7;
        this.clearDocument();
        break;
    }
  }

  onSelectTypePhoneEdit(item) {
    //this.itemTelefono.P_NPHONE_TYPE
    // let selectElementText = event.target['options']
    // [event.target['options'].selectedIndex].text;

    switch (item.P_NPHONE_TYPE) {
      case "1":
        this.blockCelular = false;
        this.blockAnexo = false;
        this.InputsTelephone.P_DESTIPOTLF = item.P_DESTIPOTLF;
        this.InputsTelephone.P_NPHONE_TYPE = item.P_NPHONE_TYPE;
        if (this.InputsTelephone.P_NAREA_CODE == "1") {
          this.maxlength = 7;
        } else {
          this.maxlength = 6;
        }
        break;
      case "2":
        this.blockCelular = true;
        this.blockAnexo = true;
        this.InputsTelephone.P_DESTIPOTLF = item.P_DESTIPOTLF;
        this.InputsTelephone.P_NPHONE_TYPE = item.P_NPHONE_TYPE;
        this.maxlength = 9;
        this.clearDocument();
        break;
      default:
        this.blockCelular = false;
        this.blockAnexo = true;
        this.InputsTelephone.P_DESTIPOTLF = item.P_DESTIPOTLF;
        this.InputsTelephone.P_NPHONE_TYPE = item.P_NPHONE_TYPE;
        this.InputsTelephone.P_NEXTENS1 = null;
        this.maxlength = 7;
        break;
    }
  }

  clearDocument() {
    this.InputsTelephone.P_DESAREA = "";
    this.InputsTelephone.P_NAREA_CODE = "0";
    this.InputsTelephone.P_NEXTENS1 = null;
  }

  onSelectCode(event) {

    let selectElementText = event.target['options']
    [event.target['options'].selectedIndex].text;

    // if (event.target.value == "") {
    //   this.InputsTelephone.P_DESAREA = "";
    //   this.InputsTelephone.P_NAREA_CODE = null;
    // } else {
    this.InputsTelephone.P_DESAREA = selectElementText;
    this.InputsTelephone.P_NAREA_CODE = event.target.value;
    if (this.InputsTelephone.P_NAREA_CODE == 1) {
      this.maxlength = 7;
    } else {
      this.maxlength = 6;
    }
    // }

  }

  EventSave() {

    this.InputsTelephone.P_NAREA_CODE = this.InputsTelephone.P_NAREA_CODE == "0" ? null : this.InputsTelephone.P_NAREA_CODE
    this.InputsTelephone.P_NEXTENS1 = this.InputsTelephone.P_NEXTENS1 == null ? "" : this.InputsTelephone.P_NEXTENS1

    if (this.itemTelefono == null) {
      let existe = 0;
      let item = this.InputsTelephone;
      this.listaTelefonos.map(function (dato) {
        if (dato.P_NPHONE_TYPE == item.P_NPHONE_TYPE && dato.P_SPHONE == item.P_SPHONE &&
          dato.P_NAREA_CODE == item.P_NAREA_CODE && dato.P_NEXTENS1 == item.P_NEXTENS1) {
          existe = 1;
        }
      });

      if (existe == 0) {
        this.InputsTelephone.P_NROW = this.listaTelefonos.length + 1;
        this.ValidarTelefono(this.InputsTelephone, "");
      } else {
        swal.fire("Información", "El teléfono ingresado ya se encuentra registrado.", "warning");
      }

    } else {
      let num = this.InputsTelephone.P_NROW;
      let existe = 0;
      let item = this.InputsTelephone;
      this.listaTelefonos.map(function (dato) {
        if (dato.P_NPHONE_TYPE == item.P_NPHONE_TYPE && dato.P_SPHONE == item.P_SPHONE &&
          dato.P_NAREA_CODE == item.P_NAREA_CODE && dato.P_NEXTENS1 == item.P_NEXTENS1 &&
          dato.P_NROW !== num) {
          existe = 1;
        }
      });
      if (existe === 0) {
        this.ValidarTelefono(item, num);
      } else {
        swal.fire("Información", "El teléfono ingresado ya se encuentra registrado.", "warning");
      }

    }
  }

  Clear(idx) {
    this.VAL_PHONE[idx] = "";
  }

  ValidarTelefono(itemTelefono, row) {
    // console.log(this.InputsTelephone)
    let mensaje = "";
    if (this.InputsTelephone.P_NPHONE_TYPE == 0) {
      this.VAL_PHONE[0] = "0"
      mensaje += "El tipo de télefono es requerido <br>";
    }
    if (itemTelefono.P_NPHONE_TYPE == 1 || itemTelefono.P_NPHONE_TYPE == 3 || itemTelefono.P_NPHONE_TYPE == 4) {
      if (itemTelefono.P_NAREA_CODE == 0) {
        this.VAL_PHONE[1] = "1"
        mensaje += "El código de área es requerido <br>"
      } else {
        if (itemTelefono.P_SPHONE.substr(0, 1) == "0" || itemTelefono.P_SPHONE.substr(0, 1) == "1" || itemTelefono.P_SPHONE.substr(0, 1) == "8" || itemTelefono.P_SPHONE.substr(0, 1) == "9") {
          mensaje += "El télefono no puede empezar 0, 1, 8 o 9 <br>"
        }
      }
    } else if (itemTelefono.P_NPHONE_TYPE == 2 && itemTelefono.P_SPHONE != "") {
      if (itemTelefono.P_SPHONE.substr(0, 1) != "9") {
        mensaje += "El celular debe empezar 9 <br>"
      }
    }
    if (itemTelefono.P_SPHONE == "" || itemTelefono.P_SPHONE == null) {
      this.VAL_PHONE[2] = "2"
      mensaje += "El teléfono es requerido <br>"
    } else {
      if (this.maxlength > itemTelefono.P_SPHONE.length || this.maxlength < itemTelefono.P_SPHONE.length) {
        this.VAL_PHONE[2] = "2"
        mensaje += "El teléfono debe tener " + this.maxlength + " dígitos"
      }
    }

    if (itemTelefono.P_NEXTENS1 == null) {
      itemTelefono.P_NEXTENS1 = "";
    }

    if (mensaje != "") {
      swal.fire("Información", mensaje, "warning");
    } else {
      this.clientInformationService.valPhone(itemTelefono).subscribe(
        res => {
          if (row == "") {
            if (res.P_NCODE === 0) {
              this.listaTelefonos.push(itemTelefono);
              this.reference.close();
            } else {
              swal.fire("Información", res.P_SMESSAGE, "warning");
            }
          } else {
            if (res.P_NCODE === 0) {
              this.actualizarTelefono(row)
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

  actualizarTelefono(row) {
    let item = this.InputsTelephone;
    this.listaTelefonos.map(function (dato) {
      if (dato.P_NROW == row) {
        dato.P_TipOper = "";
        dato.P_DESAREA = item.P_DESAREA;
        dato.P_DESTIPOTLF = item.P_DESTIPOTLF;
        dato.P_NAREA_CODE = item.P_NAREA_CODE;
        dato.P_NPHONE_TYPE = item.P_NPHONE_TYPE;
        dato.P_SPHONE = item.P_SPHONE;
        dato.P_NEXTENS1 = item.P_NEXTENS1;
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

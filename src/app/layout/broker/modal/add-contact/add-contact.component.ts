import { Component, OnInit, Input } from '@angular/core';

//Importación de servicios
import { ClientInformationService } from '../../services/shared/client-information.service';

//Importacion de modelos
import { DocumentType } from '../../models/shared/client-information/document-type';

//SweeatAlert
import swal from 'sweetalert2';

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.css']
})
export class AddContactComponent implements OnInit {
  @Input() public reference: any;
  @Input() public listaContactos = [];
  @Input() public itemContacto = null;
  @Input() public typeContact: any = {};

  public contactTypeList = [];
  public documentTypeList: DocumentType[];
  public txtAccion = "Agregar Contacto";
  public InputsContact: any = {};
  public maxlength = 8;
  VAL_CONTACT: any = {};
  constructor(
    private clientInformationService: ClientInformationService
  ) { }

  ngOnInit() {
    this.getDocumentTypeList();
    if (this.typeContact.P_NIDDOC_TYPE != null && this.typeContact.P_SIDDOC != "") {
      this.getContactTypeList();
    } else {
      swal.fire("Información", "Debe ingresar Tipo documento y Nro de documento del contratante.", "warning");
    }

    this.InputsContact.P_SORIGEN = "SCTR";
    this.InputsContact.P_NUSERCODE = JSON.parse(localStorage.getItem("currentUser"))["id"];

    if (this.itemContacto != null) {
      this.txtAccion = "Editar Contacto";
      this.InputsContact.P_NROW = this.itemContacto.P_NROW;
      this.InputsContact.P_DESTICONTACTO = this.itemContacto.P_DESTICONTACTO;
      this.InputsContact.P_DESTIDOCUMENTO = this.itemContacto.P_DESTIDOCUMENTO;
      this.InputsContact.P_NIDDOC_TYPE = this.itemContacto.P_NIDDOC_TYPE;
      this.InputsContact.P_NTIPCONT = this.itemContacto.P_NTIPCONT;
      this.InputsContact.P_SE_MAIL = this.itemContacto.P_SE_MAIL;
      this.InputsContact.P_SIDDOC = this.itemContacto.P_SIDDOC;
      this.InputsContact.P_SNOMBRES = this.itemContacto.P_SNOMBRES;
      this.InputsContact.P_SAPEPAT = this.itemContacto.P_SAPEPAT;
      this.InputsContact.P_SAPEMAT = this.itemContacto.P_SAPEMAT;
      this.InputsContact.P_SPHONE = this.itemContacto.P_SPHONE;
      this.InputsContact.P_SNOMUSUARIO = this.itemContacto.P_SNOMUSUARIO;
      this.InputsContact.P_DCOMPDATE = this.itemContacto.P_DCOMPDATE;
      this.InputsContact.P_TipOper = this.itemContacto.P_TipOper;
      this.InputsContact.P_CLASS = this.itemContacto.P_CLASS;
    } else {
      this.txtAccion = "Agregar Contacto";
      this.InputsContact.P_NROW = "";
      this.InputsContact.P_DESTICONTACTO = "";
      this.InputsContact.P_DESTIDOCUMENTO = "";
      this.InputsContact.P_NIDDOC_TYPE = "0";
      this.InputsContact.P_NTIPCONT = "0";
      this.InputsContact.P_SE_MAIL = null;
      this.InputsContact.P_SIDDOC = null;
      this.InputsContact.P_SNOMBRES = null;
      this.InputsContact.P_SAPEPAT = null;
      this.InputsContact.P_SAPEMAT = null;
      this.InputsContact.P_SPHONE = null;
      this.InputsContact.P_SNOMUSUARIO = "";
      this.InputsContact.P_DCOMPDATE = "";
      this.InputsContact.P_TipOper = "";
      this.InputsContact.P_CLASS = "";
    }

    this.VAL_CONTACT[0] = ""
    this.VAL_CONTACT[1] = ""
    this.VAL_CONTACT[2] = ""
    this.VAL_CONTACT[3] = ""
    this.VAL_CONTACT[4] = ""
    this.VAL_CONTACT[5] = ""
    this.VAL_CONTACT[6] = ""
    this.VAL_CONTACT[7] = ""
  }
  Clear(idx) {
    this.VAL_CONTACT[idx] = "";
  }
  getContactTypeList() {

    this.clientInformationService.getContactTypeList(this.typeContact).subscribe(
      res => {
        this.contactTypeList = res;
      },
      err => {
        console.log(err);
      }
    );
  }

  getDocumentTypeList() {

    this.clientInformationService.getDocumentTypeList().subscribe(
      res => {
        this.documentTypeList = res;
      },
      err => {
        console.log(err);
      }
    );
  }

  onSelectContactType(event) {
    let selectElementText = event.target['options']
    [event.target['options'].selectedIndex].text;

    // if (event.target.value == null) {
    //   this.InputsContact.P_DESTICONTACTO = "";
    //   this.InputsContact.P_NTIPCONT = "nul";
    // } else {
    this.InputsContact.P_DESTICONTACTO = selectElementText;
    this.InputsContact.P_NTIPCONT = event.target.value;
    // }
  }

  documentNumberKeyPress(event: any) {
    let pattern;
    switch (this.InputsContact.P_NIDDOC_TYPE) {
      case "1": { //ruc 
        pattern = /[0-9]/;
        break;
      }
      case "2": { //dni 
        pattern = /[0-9]/;
        break;
      }
      case "4": { //ce
        pattern = /[0-9A-Za-z]/;
        break;
      }
      default: {
        pattern = /[0-9A-Za-z]/;
        break;
      }
    }

    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  onSelectDocumentType(event) {
    let selectElementText = event.target['options']
    [event.target['options'].selectedIndex].text;

    // if (event.target.value == null) {
    //   this.InputsContact.P_DESTIDOCUMENTO = "";
    //   this.InputsContact.P_NIDDOC_TYPE = "null";
    // } else {
    //   this.InputsContact.P_DESTIDOCUMENTO = selectElementText;
    //   this.InputsContact.P_NIDDOC_TYPE = event.target.value;
    // }

    switch (event.target.value) {
      case null:
        this.InputsContact.P_DESTIDOCUMENTO = "";
        this.InputsContact.P_NIDDOC_TYPE = "0";
        this.maxlength = 8;
        break;
      case "1":
        this.InputsContact.P_DESTIDOCUMENTO = selectElementText;
        this.InputsContact.P_NIDDOC_TYPE = event.target.value;
        this.maxlength = 11;
        break;
      case "2":
        this.InputsContact.P_DESTIDOCUMENTO = selectElementText;
        this.InputsContact.P_NIDDOC_TYPE = event.target.value;
        this.maxlength = 8;
        break;
      case "4":
        this.InputsContact.P_DESTIDOCUMENTO = selectElementText;
        this.InputsContact.P_NIDDOC_TYPE = event.target.value;
        this.maxlength = 12;
        break;
      default:
        this.InputsContact.P_DESTIDOCUMENTO = selectElementText;
        this.InputsContact.P_NIDDOC_TYPE = event.target.value;
        this.maxlength = 15;
        break;
    }
  }

  EventSave() {
    this.InputsContact.P_SNOMBRES = this.InputsContact.P_SNOMBRES == null ? "" : this.InputsContact.P_SNOMBRES.toUpperCase()
    this.InputsContact.P_SAPEPAT = this.InputsContact.P_SAPEPAT == null ? "" : this.InputsContact.P_SAPEPAT.toUpperCase()
    this.InputsContact.P_SAPEMAT = this.InputsContact.P_SAPEMAT == null ? "" : this.InputsContact.P_SAPEMAT.toUpperCase()
    this.InputsContact.P_SIDDOC = this.InputsContact.P_SIDDOC == null ? "" : this.InputsContact.P_SIDDOC.toUpperCase()
    this.InputsContact.P_SE_MAIL = this.InputsContact.P_SE_MAIL == null ? "" : this.InputsContact.P_SE_MAIL.toUpperCase()

    if (this.itemContacto == null) {
      let existe = 0;
      let item = this.InputsContact;
      this.listaContactos.map(function (dato) {
        if (dato.P_NIDDOC_TYPE === item.P_NIDDOC_TYPE && dato.P_SIDDOC === item.P_SIDDOC &&
          dato.P_SNOMBRES === item.P_SNOMBRES && dato.P_SAPEPAT === item.P_SAPEPAT &&
          dato.P_SAPEMAT === item.P_SAPEMAT && dato.P_NTIPCONT === item.P_NTIPCONT) {
          existe = 1;
        }
      });

      if (existe == 0) {
        this.InputsContact.P_NROW = this.listaContactos.length + 1;
        this.ValidarContacto(this.InputsContact, "");
      } else {
        swal.fire("Información", "El contacto ingresado ya se encuentra registrado.", "warning");
      }

    } else {
      let num = this.InputsContact.P_NROW;
      let existe = 0;
      let item = this.InputsContact;
      this.listaContactos.map(function (dato) {
        if (dato.P_NIDDOC_TYPE === item.P_NIDDOC_TYPE && dato.P_SIDDOC === item.P_SIDDOC &&
          dato.P_SNOMBRES === item.P_SNOMBRES && dato.P_SAPEPAT === item.P_SAPEPAT &&
          dato.P_SAPEMAT === item.P_SAPEMAT && dato.P_NTIPCONT === item.P_NTIPCONT &&
          dato.P_NROW !== num) {
          existe = 1;
        }
      });
      if (existe === 0) {
        this.ValidarContacto(item, num);
      } else {
        swal.fire("Información", "El contacto ingresado ya se encuentra registrado.", "warning");
      }
    }
  }

  ValidarContacto(itemContacto, row) {
    let mensaje = "";

    if (itemContacto.P_NTIPCONT == 0 || itemContacto.P_NTIPCONT == null) {
      this.VAL_CONTACT[0] = "1";
      mensaje += "El tipo de contacto es requerido <br />";
    }

    if (itemContacto.P_SNOMBRES == "" || itemContacto.P_SNOMBRES == null) {
      this.VAL_CONTACT[1] = "1";
      mensaje += "El nombre del contacto es requerido<br />";
    }

    if (itemContacto.P_SAPEPAT == "" || itemContacto.P_SAPEPAT == null) {
      this.VAL_CONTACT[2] = "1";
      mensaje += "El apellido paterno del contacto es requerido<br />";
    }
    if (itemContacto.P_NIDDOC_TYPE == 0 || itemContacto.P_NIDDOC_TYPE == null) {
      this.VAL_CONTACT[3] = "1";
      mensaje += "El tipo de documento del contacto es requerido<br />";
    }
    if (itemContacto.P_SIDDOC == "" || itemContacto.P_SIDDOC == null) {
      this.VAL_CONTACT[4] = "1";
      mensaje += "El número de documento del contacto es requerido<br />";
    }

    if ((itemContacto.P_SE_MAIL == "" && itemContacto.P_SPHONE == "") || (itemContacto.P_SE_MAIL == null && itemContacto.P_SPHONE == null) ||
      (itemContacto.P_SE_MAIL == null && itemContacto.P_SPHONE == "") || (itemContacto.P_SE_MAIL == "" && itemContacto.P_SPHONE == null)) {
      this.VAL_CONTACT[5] = "1";
      this.VAL_CONTACT[6] = "1";
      mensaje += "El correo electrónico o teléfono del contacto es requerido<br />"
    } else {
      if (itemContacto.P_SE_MAIL != "" && itemContacto.P_SE_MAIL != null) {
        if (/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(itemContacto.P_SE_MAIL) == false) {
          this.VAL_CONTACT[6] = "1";
          mensaje += "El correo electrónico es inválido <br />";
        }
        this.VAL_CONTACT[5] = "";
      }
      if (itemContacto.P_SPHONE != "" && itemContacto.P_SPHONE != null) {
        if (itemContacto.P_SPHONE.length < 6) {
          this.VAL_CONTACT[5] = "1";
          mensaje += "El teléfono debe tener mínimo 6 dígitos<br />";
        }
        this.VAL_CONTACT[6] = "";
      }
    }

    if (mensaje != "") {
      swal.fire("Información", mensaje, "warning");
    } else {
      this.clientInformationService.ValContact(itemContacto).subscribe(
        res => {
          if (row == "") {
            if (res.P_NCODE === 0) {
              this.listaContactos.push(itemContacto);
              this.reference.close();
            } else {
              swal.fire("Información", res.P_SMESSAGE, "warning");
            }
          } else {
            if (res.P_NCODE === 0) {
              this.actualizarContacto(row)
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

  actualizarContacto(row) {
    let item = this.InputsContact;
    this.listaContactos.map(function (dato) {
      if (dato.P_NROW == row) {
        dato.P_TipOper = "";
        dato.P_DESTICONTACTO = item.P_DESTICONTACTO;
        dato.P_DESTIDOCUMENTO = item.P_DESTIDOCUMENTO;
        dato.P_NIDDOC_TYPE = item.P_NIDDOC_TYPE != "0" ? item.P_NIDDOC_TYPE : null;
        dato.P_NTIPCONT = item.P_NTIPCONT;
        dato.P_SE_MAIL = item.P_SE_MAIL;
        dato.P_SIDDOC = item.P_SIDDOC;
        dato.P_SNOMBRES = item.P_SNOMBRES
        dato.P_SAPEPAT = item.P_SAPEPAT;
        dato.P_SAPEMAT = item.P_SAPEMAT;
        dato.P_SPHONE = item.P_SPHONE;
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

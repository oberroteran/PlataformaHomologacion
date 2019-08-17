import { Component, OnInit, Input } from '@angular/core';

//Importación de servicios
import { ClientInformationService } from '../../services/shared/client-information.service';
import { AddressService } from '../../services/shared/address.service';
//Importacion de modelos
import { DirectionType } from '../../models/shared/client-information/direction-type';
import { RoadType } from '../../models/shared/client-information/road-type';
import { InteriorType } from '../../models/shared/client-information/interior-type';
import { CJHTType } from '../../models/shared/client-information/CJHT-type';
import { BlockType } from '../../models/shared/client-information/block-type';
import { Country } from '../../models/shared/client-information/country';
import { Department } from '../../models/shared/address/department';
import { Province } from '../../models/shared/address/province';
import { District } from '../../models/shared/address/district';

//SweeatAlert
import swal from 'sweetalert2';

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  styleUrls: ['./add-address.component.css']
})
export class AddAddressComponent implements OnInit {
  @Input() public reference: any;
  @Input() public listaDirecciones = [];
  @Input() public itemDireccion = null;

  public directionTypeList: DirectionType[];
  public roadTypeList: RoadType[];
  public interiorTypeList: InteriorType[];
  public cjhtTypeList: CJHTType[];
  public blockTypeList: BlockType[];
  public countryList: Country[];
  public departmentList: Department[];
  public provinceList: Province[];
  public districtList: District[];
  public InputsStreet: any = {};
  public blockPais = true;
  //public mensajeError = "";
  VAL_STREET: any = {};


  //Construir Direccion
  public prefVia = "";
  public prefBloque = "";
  public prefDepar = "";
  public prefCJHT = "";
  public sDireccion = "";
  public sNumero = "";
  public sBloque = "";
  public sDepar = "";
  public sCJHT = "";
  public sEtapa = "";
  public sManzana = "";
  public sLote = "";
  public sReferencia = "";
  public sDepartamento = "";
  public sProvincia = "";
  public sDistrito = "";
  public txtAccion = "Agregar Dirección";

  constructor(
    private clientInformationService: ClientInformationService,
    private addressService: AddressService
  ) { }

  ngOnInit() {
    this.getDirectionTypeList();
    this.getRoadTypeList();
    this.getInteriorTypeList();
    this.getCJHTTypeList();
    this.getBlockTypeList();
    this.getCountryList();
    this.getDepartmentList();

    this.InputsStreet.P_SORIGEN = "SCTR";
    this.InputsStreet.P_NUSERCODE = JSON.parse(localStorage.getItem("currentUser"))["id"];

    if (this.itemDireccion != null) {
      console.log(this.itemDireccion);
      this.txtAccion = "Editar Dirección";
      this.InputsStreet.P_NROW = this.itemDireccion.P_NROW;
      this.InputsStreet.P_SDESDIREBUSQ = this.itemDireccion.P_SDESDIREBUSQ;
      this.InputsStreet.P_SBLOCKCHALET = this.itemDireccion.P_SBLOCKCHALET;
      this.InputsStreet.P_DESDEPARTAMENTO = this.itemDireccion.P_DESDEPARTAMENTO;
      this.sDepartamento = this.itemDireccion.P_DESDEPARTAMENTO + " ";
      this.InputsStreet.P_DESDISTRITO = this.itemDireccion.P_DESDISTRITO;
      this.sDistrito = this.itemDireccion.P_DESDISTRITO + " ";
      this.InputsStreet.P_DESPROVINCIA = this.itemDireccion.P_DESPROVINCIA;
      this.sProvincia = this.itemDireccion.P_DESPROVINCIA + " ";
      this.InputsStreet.P_DESTIDIRE = this.itemDireccion.P_DESTIDIRE;
      this.InputsStreet.P_SETAPA = this.itemDireccion.P_SETAPA;
      this.InputsStreet.P_SNUM_INTERIOR = this.itemDireccion.P_SNUM_INTERIOR;
      this.InputsStreet.P_SLOTE = this.itemDireccion.P_SLOTE;
      this.InputsStreet.P_SMANZANA = this.itemDireccion.P_SMANZANA;
      this.InputsStreet.P_NCOUNTRY = this.itemDireccion.P_NCOUNTRY;
      this.onSelectCountryEdit(this.itemDireccion);
      this.InputsStreet.P_NPROVINCE = this.itemDireccion.P_NPROVINCE;
      this.getProvinceList();
      this.InputsStreet.P_NLOCAL = this.itemDireccion.P_NLOCAL;
      this.getDistrictList();
      this.InputsStreet.P_NMUNICIPALITY = this.itemDireccion.P_NMUNICIPALITY;
      this.InputsStreet.P_SNUM_DIRECCION = this.itemDireccion.P_SNUM_DIRECCION;
      this.InputsStreet.P_STI_BLOCKCHALET = this.itemDireccion.P_STI_BLOCKCHALET;
      this.InputsStreet.P_STI_DIRE = this.itemDireccion.P_STI_DIRE;
      this.InputsStreet.P_STI_INTERIOR = this.itemDireccion.P_STI_INTERIOR;
      this.InputsStreet.P_STI_CJHT = this.itemDireccion.P_STI_CJHT;
      this.InputsStreet.P_SNOM_DIRECCION = this.itemDireccion.P_SNOM_DIRECCION;
      this.InputsStreet.P_SRECTYPE = this.itemDireccion.P_SRECTYPE;
      this.InputsStreet.P_SREFERENCE = this.itemDireccion.P_SREFERENCE;
      this.InputsStreet.P_SNOM_CJHT = this.itemDireccion.P_SNOM_CJHT;
      this.InputsStreet.P_SNOMUSUARIO = this.itemDireccion.P_SNOMUSUARIO;
      this.InputsStreet.P_DCOMPDATE = this.itemDireccion.P_DCOMPDATE;
      this.InputsStreet.P_TipOper = "";
      this.InputsStreet.P_CLASS = this.itemDireccion.P_CLASS;
      this.prefVia = this.itemDireccion.prefVia != undefined ? this.itemDireccion.prefVia : "";
      this.prefBloque = this.itemDireccion.prefBloque != undefined ? this.itemDireccion.prefBloque : "";
      this.prefDepar = this.itemDireccion.prefDepar != undefined ? this.itemDireccion.prefDepar : "";
      this.prefCJHT = this.itemDireccion.prefCJHT != undefined ? this.itemDireccion.prefCJHT : "";
    } else {
      this.txtAccion = "Agregar Dirección";
      this.InputsStreet.P_NROW = "";
      this.InputsStreet.P_SDESDIREBUSQ = "";
      this.InputsStreet.P_SBLOCKCHALET = ""
      this.InputsStreet.P_DESDEPARTAMENTO = "";
      this.InputsStreet.P_DESDISTRITO = "";
      this.InputsStreet.P_DESPROVINCIA = "";
      this.InputsStreet.P_DESTIDIRE = "";
      this.InputsStreet.P_SETAPA = "";
      this.InputsStreet.P_SNUM_INTERIOR = "";
      this.InputsStreet.P_SLOTE = "";
      this.InputsStreet.P_SMANZANA = "";
      this.InputsStreet.P_NCOUNTRY = 604;
      this.InputsStreet.P_NLOCAL = null;
      this.InputsStreet.P_NMUNICIPALITY = null;
      this.InputsStreet.P_NPROVINCE = null;
      this.InputsStreet.P_SNUM_DIRECCION = "";
      this.InputsStreet.P_STI_BLOCKCHALET = null;
      this.InputsStreet.P_STI_DIRE = null;
      this.InputsStreet.P_STI_INTERIOR = null;
      this.InputsStreet.P_STI_CJHT = null;
      this.InputsStreet.P_SNOM_DIRECCION = "";
      this.InputsStreet.P_SRECTYPE = null;
      this.InputsStreet.P_SREFERENCE = "";
      this.InputsStreet.P_SNOM_CJHT = "";
      this.InputsStreet.P_SNOMUSUARIO = "";
      this.InputsStreet.P_DCOMPDATE = "";
      this.InputsStreet.P_TipOper = "";
      this.InputsStreet.P_CLASS = "";
    }

    this.VAL_STREET[0] = ""
    this.VAL_STREET[1] = ""
    this.VAL_STREET[2] = ""
    this.VAL_STREET[3] = ""
    this.VAL_STREET[4] = ""
    this.VAL_STREET[5] = ""
    this.VAL_STREET[6] = ""
    this.VAL_STREET[7] = ""
    this.VAL_STREET[8] = ""
    this.VAL_STREET[9] = ""
    this.VAL_STREET[10] = ""
    this.VAL_STREET[11] = ""
    this.VAL_STREET[12] = ""
    this.VAL_STREET[13] = ""
    this.VAL_STREET[14] = ""
    this.VAL_STREET[15] = ""
    this.VAL_STREET[16] = ""
    this.VAL_STREET[17] = ""
  }

  Clear(idx) {
    this.VAL_STREET[idx] = "";
  }

  onSelectDirectionType(event) {

    // let selectElementText = event.target['options']
    // [event.target['options'].selectedIndex].text;

    if (event == undefined) {
      this.InputsStreet.P_SRECTYPE = null;
      this.InputsStreet.P_DESTIDIRE = "";
    } else {
      this.InputsStreet.P_SRECTYPE = event.SRECTYPE;
      this.InputsStreet.P_DESTIDIRE = event.SDESCRIPT;
    }
  }

  onSelectRoadType(event) {
    // let selectElementText = event.target['options']
    // [event.target['options'].selectedIndex].text;
    this.clearVal()
    if (event == undefined) {
      this.InputsStreet.P_STI_DIRE = null;
      this.prefVia = " ";
      this.InputsStreet.prefVia = "";
    } else {
      this.InputsStreet.P_STI_DIRE = event.STI_DIRE;
      this.prefVia = event.SDESCRIPT + " ";
      this.InputsStreet.prefVia = event.SDESCRIPT + " ";
    }
  }
  clearVal() {
    this.VAL_STREET[0] = ""
    this.VAL_STREET[1] = ""
    this.VAL_STREET[2] = ""
    this.VAL_STREET[3] = ""
    this.VAL_STREET[4] = ""
    this.VAL_STREET[5] = ""
    this.VAL_STREET[6] = ""
    this.VAL_STREET[7] = ""
    this.VAL_STREET[8] = ""
    this.VAL_STREET[9] = ""
    this.VAL_STREET[10] = ""
    this.VAL_STREET[11] = ""
    this.VAL_STREET[12] = ""
    this.VAL_STREET[13] = ""
  }

  onSelectInteriorType(event) {
    // let selectElementText = event.target['options']
    // [event.target['options'].selectedIndex].text;

    if (event == undefined) {
      this.InputsStreet.P_STI_INTERIOR = null;
      this.prefDepar = "";
      this.InputsStreet.prefDepar = "";
    } else {
      this.InputsStreet.P_STI_INTERIOR = event.STI_INTERIOR;
      this.prefDepar = event.SDESCRIPT + " ";
      this.InputsStreet.prefDepar = event.SDESCRIPT + " ";
    }
    console.log(this.InputsStreet.prefDepar);
  }

  onSelectCJHTType(event) {
    // let selectElementText = event.target['options']
    // [event.target['options'].selectedIndex].text;

    if (event == undefined) {
      this.InputsStreet.P_STI_CJHT = null;
      this.prefCJHT = "";
      this.InputsStreet.prefCJHT = "";
    } else {
      this.InputsStreet.P_STI_CJHT = event.STI_CJHT;
      this.prefCJHT = event.SDESCRIPT + " ";
      this.InputsStreet.prefCJHT = event.SDESCRIPT + " ";
    }
  }

  onSelectBlockType(event) {
    // let selectElementText = event.target['options']
    // [event.target['options'].selectedIndex].text;

    if (event == undefined) {
      this.InputsStreet.P_STI_BLOCKCHALET = null;
      this.prefBloque = "";
      this.InputsStreet.prefBloque = "";
    } else {
      this.InputsStreet.P_STI_BLOCKCHALET = event.STI_BLOCKCHALET;
      this.prefBloque = event.SDESCRIPT + " ";
      this.InputsStreet.prefBloque = event.SDESCRIPT + " ";
    }
  }

  onSelectConjHab(event) {
    // let selectElementText = event.target['options']
    // [event.target['options'].selectedIndex].text;

    if (event == undefined) {
      this.InputsStreet.P_STI_CJHT = null;
      this.prefBloque = "";
      this.InputsStreet.prefBloque = "";
    } else {
      this.InputsStreet.P_STI_CJHT = event.STI_CJHT;
      this.prefCJHT = event.SDESCRIPT + " ";
      this.InputsStreet.prefCJHT = event.SDESCRIPT + " ";
    }
  }

  onSelectCountry(event) {
    if (event != undefined) {
      if (event.NCOUNTRY == 604) {
        this.InputsStreet.P_NCOUNTRY = event.NCOUNTRY;
        this.blockPais = true;
      } else {
        this.InputsStreet.P_NCOUNTRY = event.NCOUNTRY;
        this.blockPais = false;
      }
    }


    this.InputsStreet.P_NPROVINCE = null;
    this.InputsStreet.P_DESDEPARTAMENTO = "";
    this.sDepartamento = "";
    this.InputsStreet.P_NLOCAL = null;
    this.InputsStreet.P_DESPROVINCIA = "";
    this.sProvincia = "";
    this.InputsStreet.P_NMUNICIPALITY = null;
    this.InputsStreet.P_DESDISTRITO = "";
    this.sDistrito = "";
    this.getProvinceList();
    this.getDistrictList();
  }

  onSelectCountryEdit(item) {
    if (item.P_NCOUNTRY == "604") {
      this.InputsStreet.P_NCOUNTRY = item.P_NCOUNTRY;
      this.blockPais = true;
    } else {
      this.InputsStreet.P_NCOUNTRY = item.P_NCOUNTRY;
      this.blockPais = false;
    }


    /*this.InputsStreet.P_NPROVINCE = null;
    this.InputsStreet.P_DESDEPARTAMENTO = "";
    this.sDepartamento = "";
    this.InputsStreet.P_NLOCAL = null;
    this.InputsStreet.P_DESPROVINCIA = "";
    this.sProvincia = "";
    this.InputsStreet.P_NMUNICIPALITY = null;
    this.InputsStreet.P_DESDISTRITO = "";
    this.sDistrito = "";
    this.getProvinceList();
    this.getDistrictList();*/
  }

  onSelectDepartment(event) {
    // console.log(event);
    // let selectElementText = event.target['options']
    // [event.target['options'].selectedIndex].text;

    if (event == undefined) {
      this.InputsStreet.P_NPROVINCE = null;
      this.InputsStreet.P_DESDEPARTAMENTO = "";
      this.sDepartamento = "";
    } else {
      this.InputsStreet.P_NPROVINCE = event.Id;
      this.InputsStreet.P_DESDEPARTAMENTO = event.Name;
      this.sDepartamento = event.Name + " ";
    }
    this.InputsStreet.P_NLOCAL = null;
    this.InputsStreet.P_DESPROVINCIA = "";
    this.sProvincia = "";
    this.InputsStreet.P_NMUNICIPALITY = null;
    this.InputsStreet.P_DESDISTRITO = "";
    this.sDistrito = "";
    this.getProvinceList();
    this.getDistrictList();
  }

  onSelectProvince(event) {
    // let selectElementText = event.target['options']
    // [event.target['options'].selectedIndex].text;

    if (event == undefined) {
      this.InputsStreet.P_NLOCAL = null;
      this.InputsStreet.P_DESPROVINCIA = "";
      this.sProvincia = "";
    } else {
      this.InputsStreet.P_NLOCAL = event.Id;
      this.InputsStreet.P_DESPROVINCIA = event.Name;
      this.sProvincia = event.Name + " ";
    }
    this.InputsStreet.P_NMUNICIPALITY = null;
    this.InputsStreet.P_DESDISTRITO = "";
    this.sDistrito = "";
    this.getDistrictList();

  }

  onSelectDistrict(event) {
    // let selectElementText = event.target['options']
    // [event.target['options'].selectedIndex].text;

    if (event == undefined) {
      this.InputsStreet.P_NMUNICIPALITY = null;
      this.InputsStreet.P_DESDISTRITO = "";
      this.sDistrito = "";
    } else {
      this.InputsStreet.P_NMUNICIPALITY = event.Id;
      this.InputsStreet.P_DESDISTRITO = event.Name;
      this.sDistrito = event.Name + " ";
    }
    // this.getDistrictList();

  }

  getDirectionTypeList() {
    this.clientInformationService.getDirectionTypeList().subscribe(
      res => {
        this.directionTypeList = res;
        // this.directionTypeList = [];
        // res.forEach(item => {
        //   if (item.SRECTYPE == 2) {
        //     this.directionTypeList.push(item);
        //   }
        // });
      },
      err => {
        console.log(err);
      }
    );
  }

  getRoadTypeList() {
    this.clientInformationService.getRoadTypeList().subscribe(
      res => {
        this.roadTypeList = res;
      },
      err => {
        console.log(err);
      }
    );
  }

  getInteriorTypeList() {
    this.clientInformationService.getInteriorTypeList().subscribe(
      res => {
        this.interiorTypeList = res;
      },
      err => {
        console.log(err);
      }
    );
  }

  getCJHTTypeList() {
    this.clientInformationService.getCJHTTypeList().subscribe(
      res => {
        this.cjhtTypeList = res;
      },
      err => {
        console.log(err);
      }
    );
  }

  getBlockTypeList() {
    this.clientInformationService.getBlockTypeList().subscribe(
      res => {
        this.blockTypeList = res;
      },
      err => {
        console.log(err);
      }
    );
  }

  getCountryList() {
    this.clientInformationService.getCountryList().subscribe(
      res => {
        this.countryList = res;
      },
      err => {
        console.log(err);
      }
    );
  }

  getDepartmentList() {
    this.addressService.getDepartmentList().subscribe(
      res => {
        this.departmentList = res;
      },
      err => {
        console.log(err);
      }
    );
  }

  getProvinceList() {
    let province = this.InputsStreet.P_NPROVINCE == null ? "0" : this.InputsStreet.P_NPROVINCE;
    return this.addressService.getProvinceList(province).subscribe(
      res => {
        this.provinceList = res;
      },
      err => {
        console.log(err);
      }
    );
  }

  getDistrictList() {
    let local = this.InputsStreet.P_NLOCAL == null ? "0" : this.InputsStreet.P_NLOCAL;
    return this.addressService.getDistrictList(local).subscribe(
      res => {
        this.districtList = res;
      },
      err => {
        console.log(err);
      }
    );
  }


  EventSave(event) {

    this.InputsStreet.P_SNOM_DIRECCION = this.InputsStreet.P_SNOMBRES == null ? "" : this.InputsStreet.P_SNOMBRES.toUpperCase()
    this.InputsStreet.P_SNUM_DIRECCION = this.InputsStreet.P_SNUM_DIRECCION == null ? "" : this.InputsStreet.P_SNUM_DIRECCION.toUpperCase()
    this.InputsStreet.P_SNUM_INTERIOR = this.InputsStreet.P_SNUM_INTERIOR == null ? "" : this.InputsStreet.P_SNUM_INTERIOR.toUpperCase()
    this.InputsStreet.P_SMANZANA = this.InputsStreet.P_SMANZANA == null ? "" : this.InputsStreet.P_SMANZANA.toUpperCase()
    this.InputsStreet.P_SLOTE = this.InputsStreet.P_SLOTE == null ? "" : this.InputsStreet.P_SLOTE.toUpperCase()
    this.InputsStreet.P_SETAPA = this.InputsStreet.P_SETAPA == null ? "" : this.InputsStreet.P_SETAPA.toUpperCase()
    this.InputsStreet.P_SNOM_CJHT = this.InputsStreet.P_SNOM_CJHT == null ? "" : this.InputsStreet.P_SNOM_CJHT.toUpperCase()
    this.InputsStreet.P_SBLOCKCHALET = this.InputsStreet.P_SBLOCKCHALET == null ? "" : this.InputsStreet.P_SBLOCKCHALET.toUpperCase()
    this.InputsStreet.P_SREFERENCE = this.InputsStreet.P_SREFERENCE == null ? "" : this.InputsStreet.P_SREFERENCE.toUpperCase()

    this.sDireccion = this.InputsStreet.P_SNOM_DIRECCION !== "" ? this.InputsStreet.P_SNOM_DIRECCION + " " : "";
    this.sNumero = this.InputsStreet.P_SNUM_DIRECCION !== "" ? this.InputsStreet.P_SNUM_DIRECCION + " " : "";
    this.sBloque = this.InputsStreet.P_SBLOCKCHALET !== "" ? this.InputsStreet.P_SBLOCKCHALET + " " : "";
    this.sDepar = this.InputsStreet.P_SNUM_INTERIOR !== "" ? this.InputsStreet.P_SNUM_INTERIOR + " " : "";
    this.sCJHT = this.InputsStreet.P_SNOM_CJHT !== "" ? this.InputsStreet.P_SNOM_CJHT + " " : "";
    this.sEtapa = this.InputsStreet.P_SETAPA !== "" ? "ETAPA " + this.InputsStreet.P_SETAPA + " " : "";
    this.sManzana = this.InputsStreet.P_SMANZANA !== "" ? "MZ " + this.InputsStreet.P_SMANZANA + " " : "";
    this.sLote = this.InputsStreet.P_SLOTE !== "" ? "LT " + this.InputsStreet.P_SLOTE + " " : "";
    this.sReferencia = this.InputsStreet.P_SREFERENCE !== "" ? this.InputsStreet.P_SREFERENCE + " " : "";
    this.InputsStreet.P_SDESDIREBUSQ = this.prefVia + this.sDireccion + this.sNumero + this.prefBloque + this.sBloque + this.prefDepar + this.sDepar + this.prefCJHT + this.sCJHT + this.sEtapa + this.sManzana + this.sLote + this.sReferencia + this.sDepartamento + this.sProvincia + this.sDistrito;
    
    if (this.itemDireccion == null) {
      let existe = 0;
      let item = this.InputsStreet;
      this.listaDirecciones.map(function (dato) {
        if (dato.P_SRECTYPE == item.P_SRECTYPE && dato.P_SDESDIREBUSQ.trim() == item.P_SDESDIREBUSQ.trim()) {
          existe = 1;
        }
      });

      if (existe == 0) {
        this.InputsStreet.P_NROW = this.listaDirecciones.length + 1;

        this.ValidarDireccion(this.InputsStreet, "");
      } else {
        swal.fire("Información", "La dirección ingresada ya se encuentra registrada.", "warning");
      }

    } else {
      let num = this.InputsStreet.P_NROW;
      let existe = 0;
      let item = this.InputsStreet;
      this.listaDirecciones.map(function (dato) {
        if (dato.P_SRECTYPE == item.P_SRECTYPE && dato.P_SDESDIREBUSQ.trim() == item.P_SDESDIREBUSQ.trim() && dato.P_NROW != num) {
          existe = 1;
        }
      });
      if (existe === 0) {
        this.ValidarDireccion(item, num);
      } else {
        swal.fire("Información", "La dirección ingresada ya se encuentra registrada.", "warning");
      }

    }
  }

  ValidarDireccion(itemDireccion, row) {
    let mensaje = ""

    if (itemDireccion.P_SRECTYPE == null || itemDireccion.P_SRECTYPE == 0) {
      this.VAL_STREET[0] = "1"
      mensaje += "El tipo de dirección es requerido <br/>"
    }
    if (itemDireccion.P_STI_DIRE == null || itemDireccion.P_STI_DIRE == 0) {
      this.VAL_STREET[1] = "1"
      mensaje += "El tipo de vía es requerido <br/>"
    } else {
      if (itemDireccion.P_STI_DIRE == "01" || itemDireccion.P_STI_DIRE == "02" ||
        itemDireccion.P_STI_DIRE == "03" || itemDireccion.P_STI_DIRE == "04" ||
        itemDireccion.P_STI_DIRE == "05" || itemDireccion.P_STI_DIRE == "06" ||
        itemDireccion.P_STI_DIRE == "88") {
        if (itemDireccion.P_SNOM_DIRECCION.trim() == "" || itemDireccion.P_SNOM_DIRECCION == null) {
          this.VAL_STREET[2] = "1"
          mensaje += "La dirección es requerido <br/>"
        }
        if (itemDireccion.P_SNUM_DIRECCION.trim() == "" || itemDireccion.P_SNUM_DIRECCION == null) {
          this.VAL_STREET[3] = "1"
          mensaje += "El número de dirección es requerido <br/>"
        }
        if (itemDireccion.P_STI_CJHT != null) {
          if (itemDireccion.P_SNOM_CJHT.trim() == "" || itemDireccion.P_SNOM_CJHT == null) {
            this.VAL_STREET[10] = "1"
            mensaje += "El nombre del conjunto habitacional es requerido <br/>"
          }
        } else {
          this.VAL_STREET[10] = ""
        }
        if (itemDireccion.P_STI_INTERIOR != null) {
          if (itemDireccion.P_SNUM_INTERIOR.trim() == "" || itemDireccion.P_SNUM_INTERIOR == null) {
            this.VAL_STREET[5] = "1"
            mensaje += "El interior es requerido <br/>"
          }
        } else {
          this.VAL_STREET[5] = ""
        }
        if (itemDireccion.P_STI_BLOCKCHALET != null) {
          if (itemDireccion.P_SBLOCKCHALET.trim() == "" || itemDireccion.P_SBLOCKCHALET == null) {
            this.VAL_STREET[12] = "1"
            mensaje += "El nombre del block o chalet es requerido <br/>"
          }
        } else {
          this.VAL_STREET[12] = ""
        }
      }
      if (itemDireccion.P_STI_DIRE == "99") {
        if (itemDireccion.P_SMANZANA.trim() == "" || itemDireccion.P_SMANZANA == null) {
          this.VAL_STREET[6] = "1"
          mensaje += "La manzana es requerido <br/>"
        }
        if (itemDireccion.P_SLOTE.trim() == "" || itemDireccion.P_SLOTE == null) {
          this.VAL_STREET[7] = "1"
          mensaje += "El lote es requerido <br/>"
        }
        if (itemDireccion.P_STI_CJHT == null) {
          this.VAL_STREET[9] = "1"
          mensaje += "El tipo de conjunto habitacional es requerido <br/>"
        }
        if (itemDireccion.P_SNOM_CJHT.trim() == "" || itemDireccion.P_SNOM_CJHT == null) {
          this.VAL_STREET[10] = "1"
          mensaje += "El nombre del conjunto habitacional es requerido <br/>"
        }
        if (itemDireccion.P_STI_INTERIOR != null) {
          if (itemDireccion.P_SNUM_INTERIOR.trim() == "" || itemDireccion.P_SNUM_INTERIOR == null) {
            this.VAL_STREET[5] = "1"
            mensaje += "El interior es requerido <br/>"
          }
        } else {
          this.VAL_STREET[5] = ""
        }
        if (itemDireccion.P_STI_BLOCKCHALET != null) {
          if (itemDireccion.P_SBLOCKCHALET.trim() == "" || itemDireccion.P_SBLOCKCHALET == null) {
            this.VAL_STREET[12] = "1"
            mensaje += "El nombre del block o chalet es requerido <br/>"
          }
        } else {
          this.VAL_STREET[12] = ""
        }
      }
    }

    if (itemDireccion.P_NCOUNTRY == null || itemDireccion.P_NCOUNTRY == "0") {
      this.VAL_STREET[14] = "1"
      mensaje += "El país es requerido <br/>";
    } else {
      if (itemDireccion.P_NCOUNTRY == "604") {
        if (itemDireccion.P_NPROVINCE == "0" || itemDireccion.P_NPROVINCE == null) {
          this.VAL_STREET[15] = "1"
          mensaje += "El departamento es requerido <br/>";
        }
        if (itemDireccion.P_NLOCAL == "0" || itemDireccion.P_NLOCAL == null) {
          this.VAL_STREET[16] = "1"
          mensaje += "El provincia es requerido <br/>";
        }
        if (itemDireccion.P_NMUNICIPALITY == "0" || itemDireccion.P_NMUNICIPALITY == null) {
          this.VAL_STREET[17] = "1"
          mensaje += "El distrito es requerido <br/>";
        }
      }
    }

    // if (this.mensajeError != "") {
    //   swal.fire("Información", this.mensajeError, "warning");
    // } else {
    if (mensaje != "") {
      swal.fire("Información", mensaje, "warning");
    } else {
      console.log(itemDireccion)
      this.clientInformationService.ValStreet(itemDireccion).subscribe(
        res => {
          console.log(res)
          if (row == "") {
            if (res.P_NCODE === 0) {
              this.listaDirecciones.push(itemDireccion);
              this.reference.close();
            } else {
              swal.fire("Información", res.P_SMESSAGE, "warning");
            }
          } else {
            if (res.P_NCODE === 0) {
              this.actualizarDireccion(row)
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

    // }
  }

  actualizarDireccion(row) {
    let item = this.InputsStreet;
    this.listaDirecciones.map(function (dato) {
      if (dato.P_NROW == row) {
        dato.P_TipOper = "";
        dato.P_SDESDIREBUSQ = item.P_SDESDIREBUSQ;
        dato.P_SBLOCKCHALET = item.P_SBLOCKCHALET;
        dato.P_DESDEPARTAMENTO = item.P_DESDEPARTAMENTO;
        dato.P_DESDISTRITO = item.P_DESDISTRITO;
        dato.P_DESPROVINCIA = item.P_DESPROVINCIA;
        dato.P_DESTIDIRE = item.P_DESTIDIRE;
        dato.P_SETAPA = item.P_SETAPA;
        dato.P_SNUM_INTERIOR = item.P_SNUM_INTERIOR;
        dato.P_SLOTE = item.P_SLOTE;
        dato.P_SMANZANA = item.P_SMANZANA;
        dato.P_NCOUNTRY = item.P_NCOUNTRY;
        dato.P_NLOCAL = item.P_NLOCAL;
        dato.P_NMUNICIPALITY = item.P_NMUNICIPALITY;
        dato.P_NPROVINCE = item.P_NPROVINCE;
        dato.P_SNUM_DIRECCION = item.P_SNUM_DIRECCION;
        dato.P_STI_BLOCKCHALET = item.P_STI_BLOCKCHALET;
        dato.P_STI_DIRE = item.P_STI_DIRE;
        dato.P_STI_INTERIOR = item.P_STI_INTERIOR;
        dato.P_STI_CJHT = item.P_STI_CJHT;
        dato.P_SNOM_DIRECCION = item.P_SNOM_DIRECCION;
        dato.P_SRECTYPE = item.P_SRECTYPE;
        dato.P_SREFERENCE = item.P_SREFERENCE;
        dato.P_SNOM_CJHT = item.P_SNOM_CJHT;
      }
    });

  }

  valText(event: any, type) {
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

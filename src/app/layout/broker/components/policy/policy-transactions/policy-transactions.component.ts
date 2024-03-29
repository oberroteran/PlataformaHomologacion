import { PolizaAsegurados } from '../../../models/polizaEmit/PolizaAsegurados';
import { PolizaEmit } from '../../../models/polizaEmit/polizaEmit';
import { PolizaEmitCab } from '../../../models/polizaEmit/PolizaEmitCab';
import { PolizaEmitComer } from '../../../models/polizaEmit/PolizaEmitComer';
import { TipoRenovacion } from '../../../models/polizaEmit/TipoRenovacion';
import { FrecuenciaPago } from '../../../models/polizaEmit/FrecuenciaPago';
import { SavedPolicyEmit } from '../../../models/polizaEmit/SavedPolicyEmit';
import { PolizaEmitDet, PolizaEmitDetAltoRiesgo, PolizaEmitDetMedianoRiesgo, PolizaEmitDetBajoRiesgo } from '../../../models/polizaEmit/PolizaEmitDet';
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { BsDatepickerConfig } from "ngx-bootstrap";
import { ActivatedRoute, Route, Router } from '@angular/router';
import { utils, write, read, readFile, WorkBook, WorkSheet } from 'xlsx';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2'
import { PolicyemitService } from '../../../services/policy/policyemit.service';
import { ClientInformationService } from '../../../services/shared/client-information.service';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from "@angular/common";
//import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ValErrorComponent } from '../../../modal/val-error/val-error.component';
//Compartido
import { AccessFilter } from './../../access-filter'
import { ModuleConfig } from './../../module.config'
import { QuotationService } from '../../../services/quotation/quotation.service';
//Modal
import { SearchBrokerComponent } from '../../../modal/search-broker/search-broker.component';

@Component({
  selector: 'app-policy-transactions',
  templateUrl: './policy-transactions.component.html',
  styleUrls: ['./policy-transactions.component.css']
})
export class PolicyTransactionsComponent implements OnInit {
  nrocotizacion: any;
  savedPolicyList: any = [];
  savedPolicyEmit: any = {};
  @Input() public reference: any;
  @ViewChild('desde', null) desde: any;
  @ViewChild('hasta', null) hasta: any;
  accept = '*'
  files: File[] = []
  flagAltoP = false;
  flagBajoP = false;
  flagMedianoP = false;
  flagTipoR = false
  lastFileAt: Date
  lastInvalids: any
  maxSize: any
  primas: any[] = []
  flagExtension = false;
  tamañoArchivo = 0;
  disabledFecha = true;
  disabledFechaFin = true;
  errorFrecPago = false;
  loading = false;
  existoso = false;
  activacion = false;
  activacionFin = false;
  factorIgv: any;
  totalSTRC = 0;
  totalSalud = 0;
  activacionExitoso = false;
  NroSalud: any;
  NroPension: any;
  ProductoPension: any;
  ProductoSalud: any;
  flagBusqueda = false;
  fechaEvento: any;
  flagFechaMenorMayor = true;
  flagFechaMenorMayorFin = true;
  clickValidarArchivos = false;
  clickValidarExcel = false;
  valcheck1 = false
  valcheck2: boolean
  valcheck3: boolean
  asegurados: any = []
  cotizacionID: string = "";
  erroresList: any = [];
  saludList: any = [];
  pensionList: any = [];
  tasasList: any = [];
  //Datos para configurar los datepicker
  bsConfig: Partial<BsDatepickerConfig>;
  igvPension = 0;
  igvSalud = 0;
  igvPensionWS: number = 0.0;
  igvSaludWS: number = 0.0;

  /** prima total neta save */
  totalNetoSaludSave = 0.0;
  totalNetoPensionSave = 0.0;
  /** igv + de save */
  igvSaludSave = 0.0;
  igvPensionSave = 0.0;
  /** prima bruta save */
  brutaTotalSaludSave = 0.0;
  brutaTotalPensionSave = 0.0;

  mensajePrimaPension = "";
  mensajePrimaSalud = "";

  isValidatedInClickButton: boolean = false;
  ValFecha: boolean = false;
  excelSubir: File;
  errorExcel = false;
  errorNroCot = false;
  excelJson: any[] = [];
  archivosJson: any[] = [];
  mensajeValidacion = "";
  indentificacion = "";
  editFlag = true;
  //flagNroCotizacion = false;
  flagColumnas = false;
  primatotalSCTR = 0;
  primatotalSalud = 0;

  validaciones = [];
  validacionIndentifacion = [];
  validacionIndentifacionRUC20 = [];
  validacionIndentifacionRUC10 = [];
  mensajeValidacionInd = "";
  objcolumnas = [];
  objcolumnasRuc20 = [];
  objcolumnasRuc10 = [];
  polizaEmit: any = {};
  polizaEmitCab: any = [];

  polizaEmitComer: any[] = [];
  polizaEmitComerDTOPrincipal: any = {};
  polizaEmitComerDTO: any = {};
  polizaEmitDet: any[] = [];
  polizaEmitComerPrincipal = [] = [];
  polizaEmitDetDTO: PolizaEmitDet = new PolizaEmitDet();
  polizaEmitDetAltoRiesgo: PolizaEmitDetAltoRiesgo = new PolizaEmitDetAltoRiesgo();
  polizaEmitDetMedianoRiesgo: PolizaEmitDetMedianoRiesgo = new PolizaEmitDetMedianoRiesgo();
  polizaEmitDetBajoRiesgo: PolizaEmitDetBajoRiesgo = new PolizaEmitDetBajoRiesgo();
  polizaAsegurados: PolizaAsegurados = new PolizaAsegurados();
  tipoRenovacion: TipoRenovacion[] = [];
  frecuenciaPago: FrecuenciaPago[] = [];
  fechaCheck: boolean = true;
  tableComer = false;
  processID = "";
  mode: String; //emitir, incluir, renovar : emit, include, renew
  title: string; //titulo del formulario

  //
  stateBrokerSalud = true;
  stateBrokerPension = true;
  statePrimaSalud = true;
  statePrimaPension = true;
  stateCotizadorSalud = true;
  stateCotizadorPension = true;
  stateBrokerTasaSalud = true;
  stateBrokerTasaPension = true;
  stateTasaSalud = true;
  stateTasaPension = true;
  //infoPolicy: any = {}
  objEdit: any = [];
  numberWH: number;
  pensionID = "120";
  saludID = "121";
  workerMin = 15;
  workerMax = 70;
  municipalityTariff = 0;
  typeMovement: string;
  resList: any = [];
  discountPension = "";
  discountSalud = "";
  activityVariationPension = "";
  activityVariationSalud = "";
  commissionPension = "";
  commissionSalud = "";
  // productos
  prodPension = false;
  prodSalud = false;
  stateWorker = false;
  messageWorker = "";
  totalTrabajadoresSalud = 0;
  totalTrabajadoresPension = 0;
  retarifa = "0";
  endosoPension: string;
  endosoSalud: string;
  questionText: string;
  responseText: string;
  retarif: number;
  facAnticipada: boolean = true;
  facVencido: boolean = true;
  annulmentList: any = [];
  annulmentID: any = null
  fechaBase: any = "";
  fechaBaseHasta: any = "";


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private policyemit: PolicyemitService,
    private quotationService: QuotationService,
    private clientInformationService: ClientInformationService,
    private datePipe: DatePipe,
    private modalService: NgbModal) {

    this.bsConfig = Object.assign(
      {},
      {
        dateInputFormat: "DD/MM/YYYY",
        locale: "es",
        showWeekNumbers: false
      }
    );
  }

  ngOnInit() {
    if (AccessFilter.hasPermission(ModuleConfig.ViewIdList["policy_emission"]) == false) this.router.navigate(['/broker/home']);
    //console.log(this.excelSubir, "excel");
    //this.polizaEmit.facturacionVencido = 0
    //this.polizaEmit.facturacionAnticipada = 0
    this.polizaEmit.facturacionVencido = false;
    this.polizaEmit.facturacionAnticipada = false;
    this.polizaEmit.workers = "";
    this.polizaEmit.P_WORKER = "";
    this.polizaEmit.comentario = "";
    this.ObtenerTipoRenovacion();
    this.MotivosAnulacion();
    this.getIGVPension();
    this.getIGVSalud();

    this.polizaEmitCab.bsValueIni = new Date();
    this.polizaEmitCab.bsValueFin = new Date();
    this.polizaEmitCab.bsValueIniMin = new Date();
    this.polizaEmitCab.bsValueFinMax = new Date();
		/*this.polizaEmitComer.push({
			"COMERCIALIZADOR": "",
			"COMISION_BR": "",
			"COMISION_PRO": "",
			"DELIMITACION": ""
		})*/

    this.polizaEmitComerDTOPrincipal.TYPE_DOC_COMER = '';
    this.polizaEmitComerDTOPrincipal.DES_DOC_COMER = 'Seleccione';
    this.polizaEmitDet.push(this.polizaEmitDetDTO);
    this.polizaEmitCab.TIPO_DOCUMENTO = "";
    this.polizaEmitCab.tipoRenovacion = '';
    this.polizaEmitCab.ACT_TECNICA = ''
    this.polizaEmitCab.COD_ACT_ECONOMICA = ''
    this.polizaEmitCab.COD_TIPO_SEDE = '';
    this.polizaEmitCab.COD_MONEDA = '';
    this.polizaEmitCab.COD_DEPARTAMENTO = ''
    this.polizaEmitCab.COD_PROVINCIA = ''
    this.polizaEmitCab.COD_DISTRITO = ''
    this.polizaEmitCab.frecuenciaPago = '';

    this.mode = this.route.snapshot.paramMap.get('mode');
    //console.log(this.mode);
    if (this.mode == "include") { // inclusion
      this.title = "Inclusión en Póliza";
      this.typeMovement = "2";
      this.questionText = "¿Deseas hacer la inclusión de asegurados?"
      this.responseText = "Se ha realizado la inclusión con constancia N° "
    } else if (this.mode == "renew") { // renovar
      this.title = "Renovar Póliza";
      this.typeMovement = "4";
      this.questionText = "¿Deseas hacer la renovación de la póliza?"
      this.responseText = "Se ha realizado la renovación con constancia N° "
    } else if (this.mode == "cancel") { // anular
      this.title = "Anular Póliza";
      this.typeMovement = "7";
      this.questionText = "¿Deseas hacer la anulación de la póliza?"
      this.responseText = "Se ha realizado la anulación con constancia N° "
    } else if (this.mode == "exclude") { // excluir
      this.title = "Excluir en Póliza";
      this.typeMovement = "3";
      this.questionText = "¿Deseas hacer la exclusión de asegurados?"
      this.responseText = "Se ha realizado la exclusión con constancia N° "
    } else if (this.mode == "endosar") { // endosar
      this.title = "Endosar Póliza";
      this.typeMovement = "8";
      this.questionText = "¿Deseas hacer el endoso de la póliza?"
      this.responseText = "Se ha realizado el endoso con constancia N° "
    } else if (this.mode == "netear") { // netear
      this.title = "Neteo de Póliza";
      this.typeMovement = "5";
      this.questionText = "¿Deseas hacer el neteo de la póliza?"
      this.responseText = "Se ha realizado el neteo con constancia N° "
    }

    this.route.queryParams
      //.filter(params => params.tipoDocumento)
      .subscribe(params => {
        //console.log(params); // {order: "popular"}
        this.nrocotizacion = params.nroCotizacion;
      });

    if (this.nrocotizacion != undefined) {
      this.buscarCotizacion();
    }
    //console.log("polizaEmitComer", this.polizaEmitComer)
  }

  getIGVPension() {
    let itemIGV: any = {};
    itemIGV.P_NBRANCH = 1;
    itemIGV.P_NPRODUCT = this.pensionID;
    itemIGV.P_TIPO_REC = "A";

    this.quotationService.getIGV(itemIGV).subscribe(
      res => {
        this.igvPensionWS = res;
      }
    );
  }

  getIGVSalud() {
    let itemIGV: any = {};
    itemIGV.P_NBRANCH = 1;
    itemIGV.P_NPRODUCT = this.saludID;
    itemIGV.P_TIPO_REC = "A";

    this.quotationService.getIGV(itemIGV).subscribe(
      res => {
        this.igvSaludWS = res;
      }
    );
  }

  getDate() {
    return new Date()
  }
  onFacturacion() {
    if (this.polizaEmit.facturacionVencido == true) {
      this.facAnticipada = true;
    } else if (this.polizaEmit.facturacionAnticipada == true) {
      this.facVencido = true;
    } else {
      this.facVencido = false;
      this.facAnticipada = false;
    }
    //console.log(this.polizaEmit.facturacionAnticipada)
  }
  changeTrabajadores(cantTrab, valor) {
    let totTrab = cantTrab != "" ? parseInt(cantTrab) : 0;
    totTrab = isNaN(totTrab) ? 0 : totTrab;
    let sumaTrabS = 0;
    let sumaTrabP = 0;
    let hayCero = false;
    this.retarifa = "1";

    if (this.saludList.length > 0) {
      this.saludList.map(function (dato) {
        if (dato.TIP_RIESGO == valor) {
          dato.NUM_TRABAJADORES = totTrab;
        }
        sumaTrabS = sumaTrabS + parseInt(dato.NUM_TRABAJADORES);
      });

      this.totalTrabajadoresSalud = sumaTrabS;

      this.saludList.forEach(element => {
        if (element.NUM_TRABAJADORES == 0) {
          hayCero = false;
        }
      });

      if (this.polizaEmit.workers == "1") {
        if (hayCero == false) {
          if (this.totalTrabajadoresSalud <= 50) {
            this.stateWorker = false;
            this.messageWorker = "";
          } else {
            this.stateWorker = true;
            this.messageWorker = "La suma de trabajadores debe ser menor o igual a 50";
          }
        }

      } else {
        if (hayCero == false) {
          if (this.totalTrabajadoresSalud > 50) {
            this.stateWorker = false;
            this.messageWorker = "";
          } else {
            this.stateWorker = true;
            this.messageWorker = "La suma de trabajadores no puede ser menor a 50";
          }
        }
      }
    }

    if (this.pensionList.length > 0) {
      this.pensionList.map(function (dato) {
        if (dato.TIP_RIESGO == valor) {
          dato.NUM_TRABAJADORES = totTrab;
        }
        sumaTrabP = sumaTrabP + parseInt(dato.NUM_TRABAJADORES);
      });

      this.totalTrabajadoresPension = sumaTrabP;

      this.pensionList.forEach(element => {
        if (element.NUM_TRABAJADORES == 0) {
          hayCero = false;
        }
      });

      if (this.polizaEmit.workers == "1") {
        if (hayCero == false) {
          if (this.totalTrabajadoresPension <= 50) {
            this.stateWorker = false;
            this.messageWorker = "";
          } else {
            this.stateWorker = true;
            this.messageWorker = "La suma de trabajadores debe ser menor o igual a 50";
          }
        }
      } else {
        if (hayCero == false) {
          if (this.totalTrabajadoresPension > 50) {
            this.stateWorker = false;
            this.messageWorker = "";
          } else {
            this.stateWorker = true;
            this.messageWorker = "La suma de trabajadores debe ser mayor a 50";
          }
        }
      }

    }

    this.Calcular();

  }
  changePlanilla(cantPlanilla, valor) {
    //console.log(cantPlanilla);
    let totPlan = cantPlanilla != "" ? parseFloat(cantPlanilla) : 0;
    totPlan = isNaN(totPlan) ? 0 : totPlan;
    let netoPension = 0;
    let netoSalud = 0;
    let self = this;
    this.retarifa = "1";

    //Lista Salud
    if (this.saludList.length > 0) {
      this.saludList.map(function (dato) {
        if (dato.TIP_RIESGO == valor) {
          dato.MONTO_PLANILLA = totPlan;
          dato.PRIMA = self.formateaValor((totPlan * parseFloat(dato.TASA_CALC)) / 100);
        }
        netoSalud = netoSalud + parseFloat(dato.PRIMA)
      });
      this.primatotalSalud = this.formateaValor(netoSalud);
      // this.igvSalud = this.formateaValor((this.totalNetoSalud * 1.03 * 1.18) - this.totalNetoSalud);
      this.igvSalud = this.formateaValor((this.primatotalSalud * this.igvSaludWS) - this.primatotalSalud);
      let totalPreviewSalud = parseFloat(this.primatotalSalud.toLocaleString()) + parseFloat(this.igvSalud.toLocaleString());
      this.totalSalud = this.formateaValor(totalPreviewSalud)

      if (parseFloat(this.primatotalSalud.toLocaleString()) < this.polizaEmitCab.MIN_SALUD) {
        this.totalNetoSaludSave = this.polizaEmitCab.MIN_SALUD
        this.igvSaludSave = this.formateaValor((this.totalNetoSaludSave * this.igvSaludWS) - this.totalNetoSaludSave);
        this.brutaTotalSaludSave = this.formateaValor(parseFloat(this.totalNetoSaludSave.toLocaleString()) + parseFloat(this.igvSaludSave.toLocaleString()));
        this.mensajePrimaSalud = "El monto calculado no supera la prima mínima, la cotización se generará con el siguiente monto S/. " + this.brutaTotalSaludSave;
      } else {
        this.mensajePrimaSalud = ""
        this.totalNetoSaludSave = this.primatotalSalud
        this.igvSaludSave = this.igvSalud;
        this.brutaTotalSaludSave = this.totalSalud;
      }
    }

    //Lista Pension
    if (this.pensionList.length > 0) {
      this.pensionList.map(function (dato) {
        if (dato.TIP_RIESGO == valor) {
          dato.MONTO_PLANILLA = totPlan;
          dato.PRIMA = self.formateaValor((totPlan * parseFloat(dato.TASA_CALC)) / 100);
        }
        netoPension = netoPension + parseFloat(dato.PRIMA)
      });
      this.primatotalSCTR = this.formateaValor(netoPension);
      this.igvPension = this.formateaValor((this.primatotalSCTR * this.igvPensionWS) - this.primatotalSCTR);
      // this.igvPension = this.formateaValor((this.totalNetoPension * 1.18) - this.totalNetoSalud);
      let totalPreviewPension = parseFloat(this.primatotalSCTR.toLocaleString()) + parseFloat(this.igvPension.toLocaleString());
      this.totalSTRC = this.formateaValor(totalPreviewPension)


      if (parseFloat(this.primatotalSCTR.toLocaleString()) < this.polizaEmitCab.MIN_PENSION) {
        this.totalNetoPensionSave = this.polizaEmitCab.MIN_PENSION
        this.igvPensionSave = this.formateaValor((this.totalNetoPensionSave * this.igvPensionWS) - this.totalNetoPensionSave);
        this.brutaTotalPensionSave = this.formateaValor(parseFloat(this.totalNetoPensionSave.toLocaleString()) + parseFloat(this.igvPensionSave.toLocaleString()));
        this.mensajePrimaPension = "El monto calculado no supera la prima mínima, la cotización se generará con el siguiente monto S/. " + this.brutaTotalPensionSave;
      } else {
        this.mensajePrimaPension = ""
        this.totalNetoPensionSave = this.primatotalSCTR
        this.igvPensionSave = this.igvPension;
        this.brutaTotalPensionSave = this.totalSTRC;
      }
    }
  }

  changeSaludPropuesta(cantComPro, valor) {
    //console.log(cantPlanilla);
    let ComProp = cantComPro != "" ? parseFloat(cantComPro) : 0;
    ComProp = isNaN(ComProp) ? 0 : ComProp;

    this.polizaEmitComer.map(function (dato) {
      if (dato.DOC_COMER == valor) {
        dato.COMISION_SALUD_PRO = ComProp;
      }
    });
  }

  changePensionPropuesta(cantComPro, valor) {
    //console.log(cantPlanilla);
    let ComProp = cantComPro != "" ? parseFloat(cantComPro) : 0;
    ComProp = isNaN(ComProp) ? 0 : ComProp;

    //Lista Pension
    this.polizaEmitComer.map(function (dato) {
      if (dato.DOC_COMER == valor) {
        dato.COMISION_PENSION_PRO = ComProp;
      }
    });
  }

  changeTasaPropuestaPension(planPro, valor) {
    //console.log(cantPlanilla);
    let planProp = planPro != "" ? parseFloat(planPro) : 0;
    planProp = isNaN(planProp) ? 0 : planProp;

    //Lista Pension
    if (this.pensionList != "") {
      this.pensionList.map(function (dato) {
        if (dato.DES_RIESGO == valor) {
          dato.TASA_PRO = planProp;
        }
      });
    }
  }

  /*modificarRenovacion() {
    this.editFlag = !this.editFlag;
    if (this.editFlag == true) {
      this.btnMod = "Habilitar campos"
    } else {
      this.btnMod = "Deshabilitar campos"
    }
  }*/

  changeTasaPropuestaSalud(planPro, valor) {
    //console.log(cantPlanilla);
    let planProp = planPro != "" ? parseFloat(planPro) : 0;
    planProp = isNaN(planProp) ? 0 : planProp;

    //Lista Salud
    if (this.saludList != "") {
      this.saludList.map(function (dato) {
        if (dato.DES_RIESGO == valor) {
          dato.TASA_PRO = planProp;
        }
      });
    }
  }

  ValidarFecha() {
    if (this.polizaEmitCab.bsValueIni > this.polizaEmitCab.bsValueFin) {
      this.ValFecha = true
      this.isValidatedInClickButton = true;
      return;
    }
    this.ValFecha = false;
    this.isValidatedInClickButton = false;
  }
  clearVal() {
    this.errorNroCot = false;
  }

  seleccionArchivos() {
    if (this.files.length === 0) {
      this.clickValidarArchivos = false;
    }
    this.clickValidarArchivos = true;
  }

  seleccionExcel(archivo: File) {
    this.excelSubir = null;
    if (!archivo) {
      this.excelSubir = null;
      this.clickValidarExcel = false;
      return;
    }
    this.excelSubir = archivo;
    this.clickValidarExcel = true;
  }


  validarExcel() {
    //console.log(this.excelSubir);
    if (this.cotizacionID != "") {
      if (this.excelSubir != undefined) {
        if (this.editFlag == true) { // Sin modificacion
          this.validarTrama();
        } else { // Con modificacion
          this.ConModificacion();
        }
      } else {
        Swal.fire("Información", "Adjunte una trama para validar", "error");
      }

    } else {
      Swal.fire("Información", "Ingrese una cotización", "error");
    }
  };

  ConModificacion() {
    let self = this;
    let dataQuotation: any = {};
    dataQuotation.P_SCLIENT = this.polizaEmitCab.SCLIENT;
    dataQuotation.P_NCURRENCY = this.polizaEmitCab.COD_MONEDA;
    dataQuotation.P_NBRANCH = 1;
    dataQuotation.P_DSTARTDATE = new Date();
    dataQuotation.P_NIDCLIENTLOCATION = "";
    dataQuotation.P_SCOMMENT = ""
    dataQuotation.P_SRUTA = "";
    dataQuotation.P_NUSERCODE = JSON.parse(localStorage.getItem("currentUser"))["id"];
    dataQuotation.QuotationDet = [];
    dataQuotation.QuotationCom = [];

    //Detalle de Cotizacion Pension
    // console.log(this.pensionList.length)
    if (this.pensionList.length > 0) {
      this.pensionList.forEach(dataPension => {
        // console.log(dataPension)
        let savedPolicyEmit: any = {};
        savedPolicyEmit.P_NID_COTIZACION = this.cotizacionID; //Cotizacion
        savedPolicyEmit.P_NBRANCH = 1;
        savedPolicyEmit.P_NPRODUCT = this.pensionID; // Pensión
        savedPolicyEmit.P_NMODULEC = dataPension.TIP_RIESGO;
        savedPolicyEmit.P_NTOTAL_TRABAJADORES = dataPension.NUM_TRABAJADORES;
        savedPolicyEmit.P_NMONTO_PLANILLA = dataPension.MONTO_PLANILLA;
        savedPolicyEmit.P_NTASA_CALCULADA = dataPension.TASA_CALC;
        savedPolicyEmit.P_NTASA_PROP = dataPension.TASA_PRO == "" ? "0" : dataPension.TASA_PRO;
        savedPolicyEmit.P_NPREMIUM_MENSUAL = dataPension.PRIMA;
        savedPolicyEmit.P_NPREMIUM_MIN = this.polizaEmitCab.MIN_PENSION;
        savedPolicyEmit.P_NPREMIUM_MIN_PR = this.polizaEmitCab.MIN_PENSION_PR == "" ? "0" : this.polizaEmitCab.MIN_PENSION_PR;
        savedPolicyEmit.P_NPREMIUM_END = this.endosoPension == null ? "0" : this.endosoPension;
        savedPolicyEmit.P_NSUM_PREMIUMN = this.totalNetoPensionSave;
        savedPolicyEmit.P_NSUM_IGV = this.igvPensionSave;
        savedPolicyEmit.P_NSUM_PREMIUM = this.brutaTotalPensionSave;
        savedPolicyEmit.P_NRATE = dataPension.rateDet == null ? "0" : dataPension.rateDet;
        savedPolicyEmit.P_NDISCOUNT = this.discountPension == "" ? "0" : this.discountPension;
        savedPolicyEmit.P_NACTIVITYVARIATION = this.activityVariationPension == "" ? "0" : this.activityVariationPension;
        savedPolicyEmit.P_FLAG = this.retarifa;
        dataQuotation.QuotationDet.push(savedPolicyEmit);
      });
    }

    //Detalle de Cotizacion Salud
    // console.log(this.saludList.length)
    if (this.saludList.length > 0) {
      this.saludList.forEach(dataSalud => {
        let savedPolicyEmit: any = {};
        savedPolicyEmit.P_NID_COTIZACION = this.cotizacionID; //Cotizacion
        savedPolicyEmit.P_NBRANCH = 1;
        savedPolicyEmit.P_NPRODUCT = this.saludID; // Pensión
        savedPolicyEmit.P_NMODULEC = dataSalud.TIP_RIESGO;
        savedPolicyEmit.P_NTOTAL_TRABAJADORES = dataSalud.NUM_TRABAJADORES;
        savedPolicyEmit.P_NMONTO_PLANILLA = dataSalud.MONTO_PLANILLA;
        savedPolicyEmit.P_NTASA_CALCULADA = dataSalud.TASA_CALC;
        savedPolicyEmit.P_NTASA_PROP = dataSalud.TASA_PRO == "" ? "0" : dataSalud.TASA_PRO;
        savedPolicyEmit.P_NPREMIUM_MENSUAL = dataSalud.PRIMA;
        savedPolicyEmit.P_NPREMIUM_MIN = this.polizaEmitCab.MIN_SALUD;
        savedPolicyEmit.P_NPREMIUM_MIN_PR = this.polizaEmitCab.MIN_SALUD_PR == "" ? "0" : this.polizaEmitCab.MIN_SALUD_PR;
        savedPolicyEmit.P_NPREMIUM_END = this.endosoSalud == null ? "0" : this.endosoSalud;
        savedPolicyEmit.P_NSUM_PREMIUMN = this.totalNetoSaludSave;
        savedPolicyEmit.P_NSUM_IGV = this.igvSaludSave;
        savedPolicyEmit.P_NSUM_PREMIUM = this.brutaTotalSaludSave;
        savedPolicyEmit.P_NRATE = dataSalud.rateDet == null ? "0" : dataSalud.rateDet;
        savedPolicyEmit.P_NDISCOUNT = this.discountSalud == "" ? "0" : this.discountSalud;
        savedPolicyEmit.P_NACTIVITYVARIATION = this.activityVariationSalud == "" ? "0" : this.activityVariationSalud;
        savedPolicyEmit.P_FLAG = this.retarifa;
        dataQuotation.QuotationDet.push(savedPolicyEmit);
      });
    }

    //Comercializador Principal
    let itemQuotationComMain: any = {};
    itemQuotationComMain.P_NID_COTIZACION = this.cotizacionID; //Cotizacion
    itemQuotationComMain.P_NIDTYPECHANNEL = this.polizaEmitComerDTOPrincipal.TIPO_CANAL;
    itemQuotationComMain.P_NINTERMED = this.polizaEmitComerDTOPrincipal.CANAL;
    itemQuotationComMain.P_SCLIENT_COMER = this.polizaEmitComerDTOPrincipal.SCLIENT;
    itemQuotationComMain.P_NCOMISION_SAL = self.saludList.length > 0 ? this.polizaEmitComerDTOPrincipal.COMISION_SALUD == "" ? "0" : this.polizaEmitComerDTOPrincipal.COMISION_SALUD : "0";
    itemQuotationComMain.P_NCOMISION_SAL_PR = self.saludList.length > 0 ? this.polizaEmitComerDTOPrincipal.COMISION_SALUD_PRO == "" ? "0" : this.polizaEmitComerDTOPrincipal.COMISION_SALUD_PRO : "0";
    itemQuotationComMain.P_NCOMISION_PEN = self.pensionList.length > 0 ? this.polizaEmitComerDTOPrincipal.COMISION_PENSION == "" ? "0" : this.polizaEmitComerDTOPrincipal.COMISION_PENSION : "0";
    itemQuotationComMain.P_NCOMISION_PEN_PR = self.pensionList.length > 0 ? this.polizaEmitComerDTOPrincipal.COMISION_PENSION_PRO == "" ? "0" : this.polizaEmitComerDTOPrincipal.COMISION_PENSION_PRO : "0";
    itemQuotationComMain.P_NPRINCIPAL = this.polizaEmitComerDTOPrincipal.PRINCIPAL;
    dataQuotation.QuotationCom.push(itemQuotationComMain);

    //Comercializadores secundarios
    if (this.polizaEmitComer.length > 0) {
      this.polizaEmitComer.forEach(dataBroker => {
        let itemQuotationCom: any = {};
        itemQuotationCom.P_NID_COTIZACION = this.cotizacionID; //Cotizacion
        itemQuotationCom.P_NIDTYPECHANNEL = dataBroker.TIPO_CANAL;
        itemQuotationCom.P_NINTERMED = dataBroker.CANAL; // Produccion
        itemQuotationCom.P_SCLIENT_COMER = dataBroker.SCLIENT;
        itemQuotationCom.P_NCOMISION_SAL = self.saludList.length > 0 ? dataBroker.COMISION_SALUD == "" ? "0" : dataBroker.COMISION_SALUD : "0";
        itemQuotationCom.P_NCOMISION_SAL_PR = self.saludList.length > 0 ? dataBroker.COMISION_SALUD_PRO == "" ? "0" : dataBroker.COMISION_SALUD_PRO : "0";
        itemQuotationCom.P_NCOMISION_PEN = self.pensionList.length > 0 ? dataBroker.COMISION_PENSION == "" ? "0" : dataBroker.COMISION_PENSION : "0";
        itemQuotationCom.P_NCOMISION_PEN_PR = self.pensionList.length > 0 ? dataBroker.COMISION_PENSION_PRO == "" ? "0" : dataBroker.COMISION_PENSION_PRO : "0";
        itemQuotationCom.P_NPRINCIPAL = dataBroker.PRINCIPAL;
        dataQuotation.QuotationCom.push(itemQuotationCom);
      });
    }
    console.log(dataQuotation)
    /*let myFormData: FormData = new FormData()
    if (this.files.length > 0) {
      this.files.forEach(file => {
        myFormData.append("adjuntos", file, file.name);
      });
    }*/
    this.loading = false;
    // console.log(dataQuotation);
    //myFormData.append("objeto", JSON.stringify(dataQuotation));
    Swal.fire({
      title: "Información",
      text: "Se tomará en cuenta los datos ingresados hasta este momento para validar la trama, asegurese de haber hecho las modificaciones correspondientes ¿Desea continuar?",
      type: "question",
      showCancelButton: true,
      confirmButtonText: 'Validar',
      allowOutsideClick: false,
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        self.loading = true;
        this.policyemit.renewMod(dataQuotation).subscribe(
          res => {
            // console.log(res);
            self.loading = false;
            if (res.P_COD_ERR == 0) {
              //this.clearInsert()
              this.validarTrama();

            } else {
              self.loading = false;
              Swal.fire("Información", res.P_MESSAGE, "error");
            }
          },
          err => {
            self.loading = false;
            //console.log(err);
            Swal.fire("Información", "Hubo un error con el servidor", "error");
          }
        );
      }
    });
  }

  validarTrama() {
    this.errorExcel = false;
    this.loading = true;
    //Fecha Inicio
    let dayIni = this.polizaEmitCab.bsValueIni.getDate() < 10 ? "0" + this.polizaEmitCab.bsValueIni.getDate() : this.polizaEmitCab.bsValueIni.getDate();
    let monthPreviewIni = this.polizaEmitCab.bsValueIni.getMonth() + 1;
    let monthIni = monthPreviewIni < 10 ? "0" + monthPreviewIni : monthPreviewIni;
    let yearIni = this.polizaEmitCab.bsValueIni.getFullYear();

    let myFormData: FormData = new FormData();
    myFormData.append("dataFile", this.excelSubir);
    myFormData.append("codUser", JSON.parse(localStorage.getItem("currentUser"))["id"]);
    myFormData.append("nroCotizacion", this.cotizacionID);
    myFormData.append("type_mov", this.typeMovement);
    myFormData.append("retarif", this.retarifa);
    myFormData.append("date", dayIni + "/" + monthIni + "/" + yearIni);
    //console.log(this.excelSubir)
    // console.log(this.cotizacionID)
    this.policyemit.valGestorList(myFormData).subscribe(
      res => {
        this.erroresList = res.C_TABLE;
        this.loading = false;
        //console.log(res);
        if (this.erroresList != null) {
          if (this.erroresList.length > 0) {
            this.processID = "";
            let modalRef = this.modalService.open(ValErrorComponent, { size: 'lg', backdropClass: 'light-blue-backdrop', backdrop: 'static', keyboard: false });
            modalRef.componentInstance.formModalReference = modalRef;
            modalRef.componentInstance.erroresList = this.erroresList;
          } else {
            this.processID = res.P_NID_PROC;
            //console.log(this.processID);
            Swal.fire("Información", "Se validó correctamente la trama", "success");
          }
        } else {
          Swal.fire("Información", "El archivo enviado contiene errores", "error");
        }

      },
      err => {
        this.loading = false;
        console.log(err);
      }
    );
  }

  limpiar() {
    this.activacionExitoso = false;
    this.validaciones = [];
    this.validacionIndentifacion = [];
    this.validacionIndentifacionRUC20 = [];
    this.validacionIndentifacionRUC10 = [];
    this.objcolumnas = [];
    this.objcolumnasRuc20 = [];
    this.objcolumnasRuc10 = [];
  }

  onSelectWorker() {
    //this.retarifa = "1";
    switch (this.polizaEmit.workers) {
      case "1":
        this.polizaEmit.P_WORKER = this.workerMin;
        this.equivalentMuni();
        break;
      case "2":
        this.polizaEmit.P_WORKER = this.workerMax;
        this.equivalentMuni();
        break;
    }
  }

  equivalentMuni() {
    if (this.polizaEmitCab.DES_ACT_ECONOMICA != null && this.polizaEmitCab.COD_DISTRITO != null) {
      this.quotationService.equivalentMunicipality(this.polizaEmitCab.COD_DISTRITO).subscribe(
        res => {
          //console.log(res);
          this.municipalityTariff = res;
          this.GetTarifario();
        }
      );
    }
  }

  GetTarifario() {
    //this.stateWorker = false;
    //this.messageWorker = "";
    this.retarifa = "0";
    if (this.polizaEmitCab.DES_ACT_ECONOMICA != null && this.polizaEmitCab.COD_DISTRITO != null) {
      let data: any = {};
      //PRIMER JUEGO CON EL CLIENTE COMO COMODÍN
      data.activity = this.polizaEmitCab.ACT_TECNICA // Actividad Economica
      data.workers = this.polizaEmit.P_WORKER;
      data.zipCode = this.municipalityTariff.toString(); //this.InputsQuotation.P_NMUNICIPALITY; // Ubicación
      data.queryDate = ""; // Fecha
      data.channel = []; //

      //Agregando el clientId
      let client: any = {};
      client.clientId = this.polizaEmitCab.SCLIENT; // Cliente Contratante
      data.channel.push(client);

      //Agregando los brokerId y middlemanId | Lista de comercializadores
      if (this.polizaEmitComer.length > 0) {
        this.polizaEmitComer.forEach(broker => {
          if (broker.TIPO_CANAL == "6") {
            let brokerItem: any = {};
            brokerItem.brokerId = broker.CANAL;
            data.channel.push(brokerItem);
          } else {
            let middlemanItem: any = {};
            middlemanItem.middlemanId = broker.CANAL;
            data.channel.push(middlemanItem);
          }
        });
      }

      //Agregando los brokerId y middlemanId | Comercializador principal
      if (this.polizaEmitComerDTOPrincipal.TIPO_CANAL == "6") {
        let brokerItem: any = {};
        brokerItem.brokerId = this.polizaEmitComerDTOPrincipal.CANAL;
        data.channel.push(brokerItem);
      } else {
        let middlemanItem: any = {};
        middlemanItem.middlemanId = this.polizaEmitComerDTOPrincipal.CANAL;
        data.channel.push(middlemanItem);
      }

      // console.log(JSON.stringify(data));
      //return;
      this.clientInformationService.getTariff(data).subscribe(
        res => {
          // console.log(res)
          if (res.fields !== null) {
            this.resList = res;
            let self = this;
            this.resList.fields.forEach(item => {
              switch (item.fieldEquivalenceCore) {
                case this.pensionID: // Pension
                  if (item.enterprise[0].netRate != undefined) {
                    this.polizaEmitComerDTOPrincipal.COMISION_PENSION = "";
                    this.polizaEmitComerDTOPrincipal.COMISION_PENSION_PRO = "";
                    item.enterprise[0].netRate.map(function (dato) {
                      // dato.premiumMonth = 0;
                      // dato.planilla = 0;
                      // dato.planProp = 0;
                      // dato.totalWorkes = 0;
                      dato.TIP_RIESGO = dato.id;
                      dato.TASA_CALC = self.formateaValor(parseFloat(dato.rate) * 100);
                      dato.ID_PRODUCTO = self.saludID;
                      dato.DES_RIESGO = dato.description;
                      dato.TASA_PRO = 0; // tasa propuesta
                      dato.NUM_TRABAJADORES = 0; // total trabajadores
                      dato.PRIMA = 0; // prima mensual
                      dato.MONTO_PLANILLA = 0; //planilla
                    });
                  }
                  if (item.enterprise[0].riskRate != undefined) {
                    item.enterprise[0].riskRate.forEach(net => {
                      item.enterprise[0].netRate.map(function (dato) {
                        if (net.id == dato.id) {
                          dato.rateDet = self.formateaValor(parseFloat(net.rate) * 100);
                        }
                      });
                    });
                  }

                  if (item.enterprise[0].netRate != null) {
                    this.pensionList = item.enterprise[0].netRate;
                  } else {
                    this.pensionList = []
                  }
                  /*this.P_TOTAL_TRAB = {};
                  this.P_TOTAL_PLAN = {};*/

                  break;
                case this.saludID:  // Salud
                  if (item.enterprise[0].netRate != undefined) {
                    this.polizaEmitComerDTOPrincipal.COMISION_SALUD = "";
                    this.polizaEmitComerDTOPrincipal.COMISION_SALUD_PRO = "";
                    item.enterprise[0].netRate.map(function (dato) {
                      //dato.premiumMonth = 0; // Prima
                      //dato.planilla = 0; //Monto planilla
                      //dato.planProp = 0; // Tasa
                      //dato.totalWorkes = 0; // num trabajadores
                      dato.TIP_RIESGO = dato.id;
                      dato.TASA_CALC = self.formateaValor(parseFloat(dato.rate) * 100);
                      dato.ID_PRODUCTO = self.saludID;
                      dato.DES_RIESGO = dato.description;
                      dato.TASA_PRO = 0; // tasa propuesta
                      dato.NUM_TRABAJADORES = 0; // total trabajadores
                      dato.PRIMA = 0; // prima mensual
                      dato.MONTO_PLANILLA = 0; //planilla
                    });
                  }

                  if (item.enterprise[0].riskRate != undefined) {
                    item.enterprise[0].riskRate.forEach(net => {
                      item.enterprise[0].netRate.map(function (dato) {
                        if (net.id == dato.id) {
                          dato.rateDet = self.formateaValor(parseFloat(net.rate) * 100);
                        }
                      });
                    });
                  }
                  if (item.enterprise[0].netRate != null) {
                    this.saludList = item.enterprise[0].netRate;
                  } else {
                    this.saludList = []
                  }
                  /*this.P_TOTAL_TRAB = {};
                  this.P_TOTAL_PLAN = {};*/
                  break;
              }
            });

            //let sumWorkers = 0;

            if (this.pensionList.length > 0) {
              this.tasasList = this.pensionList;
            } else if (this.saludList.length > 0) {
              this.tasasList = this.saludList;
            } else {
              this.tasasList = [];
            }

            if (this.saludList.length > 0 || this.pensionList.length > 0) {
              if (this.prodPension == true && this.prodSalud == true) {
                this.Calcular();
              } else if (this.prodPension == true && this.prodSalud == false) {
                this.saludList = [];
                this.Calcular();
              } else if (this.prodPension == false && this.prodSalud == true) {
                this.pensionList = [];
                this.Calcular();
              } else {
                this.clearTariff();
                Swal.fire("Información", "La tarifa no está configurada correctamente", "error");
                return;
              }
            } else {
              this.clearTariff();
              Swal.fire("Información", "La combinación ingresada no cuenta con tarifas configuradas", "error");
            }
          } else {
            this.clearTariff();
            Swal.fire("Información", "La combinación ingresada no cuenta con tarifas configuradas", "error");
          }
        },
        err => {
          this.clearTariff();
          Swal.fire("Información", "La combinación ingresada no cuenta con tarifas configuradas", "error");
          // Swal.fire("Información", "Ocurrió un problema al solicitar la tarifa", "error");
        }
      );
    } else {

    }

  }

  Calcular() {
    if (this.resList != "") {
      let self = this;
      self.objEdit = []
      this.resList.fields.forEach(item => {
        switch (item.fieldEquivalenceCore) {
          case this.pensionID: // Pension
            self.discountPension = item.discount == null ? "0" : item.discount;
            self.activityVariationPension = item.activityVariation == null ? "0" : item.activityVariation;
            self.commissionPension = item.commission == null ? "0" : item.commission;
            if (item.enterprise[0].netRate != undefined) {
              let netoPension = 0;
              item.enterprise[0].netRate.map(function (dato) {
                if (self.pensionList != "") {
                  self.pensionList.forEach(item => {
                    if (item.TIP_RIESGO == dato.TIP_RIESGO) {
                      dato.PRIMA = self.formateaValor((parseFloat(dato.MONTO_PLANILLA) * parseFloat(dato.TASA_CALC))); // prima mensual
                    }
                  });
                  netoPension = netoPension + parseFloat(dato.MONTO_PLANILLA)
                }
              });

              if (self.pensionList != "") {
                // console.log(item.enterprise[0].netRate);
                this.pensionList = item.enterprise[0].netRate;
                this.polizaEmitCab.MIN_PENSION = item.enterprise[0].minimumPremium == null ? "0" : item.enterprise[0].minimumPremium;
                this.polizaEmitCab.MIN_PENSION_PR = ""
                this.endosoPension = item.enterprise[0].minimumPremiumEndoso == null ? "0" : item.enterprise[0].minimumPremiumEndoso;
              }
              this.totalNetoPensionSave = this.formateaValor(netoPension);
              this.igvPensionSave = this.formateaValor((this.totalNetoPensionSave * this.igvPensionWS) - this.totalNetoPensionSave); // IGV + CE
              let totalPreviewPension = parseFloat(this.totalNetoPensionSave.toString()) + parseFloat(this.igvPensionSave.toString());
              this.brutaTotalPensionSave = this.formateaValor(totalPreviewPension)

              // this.totalNetoPensionSave = self.formateaValor(item.NSUM_PREMIUMN);
              // this.igvPensionSave = self.formateaValor(item.NSUM_IGV);
              // this.brutaTotalPensionSave = self.formateaValor(item.NSUM_PREMIUM);

              if (item.channelDistributions != undefined) {
                item.channelDistributions.forEach(channel => {
                  if (channel.roleId == this.polizaEmitComerDTOPrincipal.CANAL) {
                    this.polizaEmitComerDTOPrincipal.COMISION_PENSION = (parseFloat(self.commissionPension) * parseFloat(channel.distribution)) / 100;
                  }
                });

                item.channelDistributions.forEach(channel => {
                  this.polizaEmitComer.forEach(broker => {
                    if (channel.roleId == broker.CANAL) { //Produccion
                      //  if (channel.roleId == broker.COD_CANAL) {
                      broker.COMISION_PENSION = (parseFloat(self.commissionPension) * parseFloat(channel.distribution)) / 100;
                    }
                  });
                });
              }

              // Comision en veremos //
              if (this.polizaEmitComerDTOPrincipal.COMISION_PENSION == "") {
                this.polizaEmitComerDTOPrincipal.COMISION_PENSION = "0";
              }


            }
            // this.InputsQuotation.P_COMISSION_BROKER_PENSION = item.channelCommissions[0].commission;
            break;
          case this.saludID: // Salud
            self.discountSalud = item.discount == null ? "0" : item.discount;
            self.activityVariationSalud = item.activityVariation == null ? "0" : item.activityVariation;
            self.commissionSalud = item.commission == null ? "0" : item.commission;
            if (item.enterprise[0].netRate != undefined) {
              let netoSalud = 0;
              item.enterprise[0].netRate.map(function (dato) {
                if (self.saludList != "") {
                  self.saludList.forEach(item => {
                    if (item.TIP_RIESGO == dato.TIP_RIESGO) {
                      dato.PRIMA = self.formateaValor((parseFloat(dato.MONTO_PLANILLA) * parseFloat(dato.TASA_CALC))); // prima mensual
                    }
                  });
                  netoSalud = netoSalud + parseFloat(dato.MONTO_PLANILLA)
                }
              });

              if (self.saludList != "") {
                this.saludList = item.enterprise[0].netRate;
                this.polizaEmitCab.MIN_SALUD = item.enterprise[0].minimumPremium == null ? "0" : item.enterprise[0].minimumPremium;
                this.polizaEmitCab.MIN_SALUD_PR = ""
                this.endosoSalud = item.enterprise[0].minimumPremiumEndoso == null ? "0" : item.enterprise[0].minimumPremiumEndoso;
              }

              this.totalNetoSaludSave = this.formateaValor(netoSalud);
              this.igvSaludSave = this.formateaValor((this.totalNetoSaludSave * this.igvSaludWS) - this.totalNetoSaludSave); // Solo IGV 
              let totalPreviewSalud = parseFloat(this.totalNetoSaludSave.toLocaleString()) + parseFloat(this.igvSaludSave.toLocaleString());
              this.brutaTotalSaludSave = this.formateaValor(totalPreviewSalud)

              // this.totalNetoSaludSave = self.formateaValor(item.NSUM_PREMIUMN);
              // this.igvSaludSave = self.formateaValor(item.NSUM_IGV);
              // this.brutaTotalSaludSave = self.formateaValor(item.NSUM_PREMIUM);

              if (item.channelDistributions != undefined) {
                if (item.channelDistributions != undefined) {
                  item.channelDistributions.forEach(channel => {
                    if (channel.roleId == this.polizaEmitComerDTOPrincipal.CANAL) {
                      this.polizaEmitComerDTOPrincipal.COMISION_SALUD = (parseFloat(self.commissionSalud) * parseFloat(channel.distribution)) / 100;
                    }
                  });

                  item.channelDistributions.forEach(channel => {
                    this.polizaEmitComer.forEach(broker => {
                      if (channel.roleId == broker.CANAL) { //Produccion 
                        broker.COMISION_SALUD = (parseFloat(self.commissionSalud) * parseFloat(channel.distribution)) / 100;
                      }
                    });
                  });
                }
              }

              // Comision en veremos //
              if (this.polizaEmitComerDTOPrincipal.COMISION_SALUD == "") {
                this.polizaEmitComerDTOPrincipal.COMISION_SALUD = "0";
              }
            }
            break;
        }
      });
    }
  }

  clearTariff() {
    this.tasasList = [];
    this.retarifa = "0";
    this.pensionList = []
    this.saludList = []
    this.polizaEmitComer.forEach(item => {
      item.COMISION_SALUD_PRO = "0";
      item.COMISION_PENSION_PRO = "0";
    });
    // this.P_TOTAL_TRAB = {}
    // this.P_TOTAL_PLAN = {}
    // this.P_PLAN_PRO = {}
    // this.P_PLAN_PRO_PEN = {}
    // this.P_COM_SAL_PRO = {}
    // this.P_COM_PEN_PRO = {}
    this.polizaEmitComerDTOPrincipal.COMISION_SALUD = ""; // Comision salud web service
    this.polizaEmitComerDTOPrincipal.COMISION_SALUD_PRO = ""; // Comision salud propuesta
    this.polizaEmitComerDTOPrincipal.COMISION_PENSION = ""; // Comision pension web service
    this.polizaEmitComerDTOPrincipal.COMISION_PENSION_PRO = ""; // Comision pension propuesta
    this.polizaEmitCab.MIN_SALUD = ""; // Prima minima salud
    this.polizaEmitCab.MIN_SALUD_PR = ""; // Prima minima salud propuesta
    this.polizaEmitCab.MIN_PENSION = ""; // Prima minima pension
    this.polizaEmitCab.MIN_PENSION_PR = ""; // Prima minima pension propuesta
    this.totalNetoPensionSave = 0.00
    this.totalNetoSaludSave = 0.00
    this.igvPensionSave = 0.00
    this.igvSaludSave = 0.00
    this.brutaTotalPensionSave = 0.00
    this.brutaTotalSaludSave = 0.00
  }

  AddBroker() {
    let modalRef = this.modalService.open(SearchBrokerComponent, { size: 'lg', backdropClass: 'light-blue-backdrop', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.formModalReference = modalRef;
    modalRef.componentInstance.listaBroker = this.polizaEmitComer;

    modalRef.result.then((BrokerData) => {
      BrokerData.COMISION_SALUD = 0;
      BrokerData.COMISION_SALUD_PRO = 0;
      BrokerData.COMISION_PENSION = 0;
      BrokerData.COMISION_PENSION_PRO = 0;

      BrokerData.CANAL = BrokerData.COD_CANAL.toString()
      BrokerData.COMERCIALIZADOR = BrokerData.RAZON_SOCIAL
      BrokerData.DES_DOC_COMER = BrokerData.NTIPDOC == "1" ? "RUC" : "DNI"
      BrokerData.DOC_COMER = BrokerData.NNUMDOC
      BrokerData.PRINCIPAL = 0
      // BrokerData.SCLIENT= BrokerData.SCLIENT
      BrokerData.TIPO_CANAL = BrokerData.NTYPECHANNEL
      BrokerData.TYPE_DOC_COMER = BrokerData.NTIPDOC
      //console.log(BrokerData)
      this.polizaEmitComer.push(BrokerData);
      //console.log(this.polizaEmitComer)
      this.equivalentMuni();
      //console.log(BorkerData);
    }, (reason) => {
    });
  }

  deleteBroker(row) {
    Swal.fire({
      title: "Eliminar Broker",
      text: "¿Estás seguro que deseas eliminar este broker?",
      type: "info",
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      allowOutsideClick: false,
      cancelButtonText: 'Cancelar'
    })
      .then((result) => {
        if (result.value) {
          this.polizaEmitComer.splice(row, 1);
          this.equivalentMuni();
        }
      });
  }

  buscarCotizacion() {
    this.cotizacionID = "";
    this.NroPension = "";
    this.NroSalud = "";
    this.flagBusqueda = false;
    this.pensionList = [];
    this.saludList = [];
    this.tasasList = [];

    if (this.nrocotizacion != undefined && this.nrocotizacion != 0) {
      //Cabeza Cotizacion | Datos de la póliza
      let self = this;
      this.policyemit.getPolicyEmitCab(this.nrocotizacion, this.typeMovement)
        .subscribe((res: any) => {
          let self = this;
          this.cotizacionID = this.nrocotizacion;
          if (res.GenericResponse !== null) {
            if (res.GenericResponse.COD_ERR == 0) {
              //res.GenericResponse.bsValueIni = this.polizaEmitCab.bsValueIni
              //res.GenericResponse.bsValueFin = this.polizaEmitCab.bsValueFin
              res.GenericResponse.tipoRenovacion = this.polizaEmitCab.tipoRenovacion
              res.GenericResponse.frecuenciaPago = this.polizaEmitCab.frecuenciaPago
              this.polizaEmitCab = res.GenericResponse;
              this.polizaEmitCab.MINA = res.GenericResponse.MINA == "1" ? true : false;
              this.polizaEmitCab.DELIMITACION = res.GenericResponse.DELIMITACION == "1" ? true : false;
              this.flagBusqueda = true;

              //Detalle de comercializadores
              this.policyemit.getPolicyEmitComer(this.nrocotizacion)
                .subscribe((res: any) => {
                  // console.log(res)
                  this.tableComer = true
                  this.polizaEmitComer = [];
                  if (res.length > 0 && res !== null) {
                    self.objEdit.polizaCom = [];
                    res.forEach(com => {
                      if (com.PRINCIPAL == 1) {
                        //Cambio Comercialziador
                        this.polizaEmitComerDTOPrincipal = com;
                        let item: any = {};
                        item.main = 1;
                        item.SCLIENT = com.SCLIENT;
                        item.COM_PRO_PEN = com.COMISION_PENSION_PRO;
                        item.COM_PRO_SAL = com.COMISION_SALUD_PRO;
                        self.objEdit.polizaCom.push(item)
                      } else {
                        this.polizaEmitComer.push(com);
                        let item: any = {};
                        item.main = 0;
                        item.SCLIENT = com.SCLIENT;
                        item.COM_PRO_PEN = com.COMISION_PENSION_PRO;
                        item.COM_PRO_SAL = com.COMISION_SALUD_PRO;
                        self.objEdit.polizaCom.push(item)
                      }
                    });
                    this.flagBusqueda = true;
                  } else {
                    this.polizaEmitComerDTOPrincipal = {};
                    this.polizaEmitComer = [];
                  }
                })

              //Detalle de cotizacion
              this.policyemit.getPolicyEmitDet(this.nrocotizacion)
                .subscribe((res: any) => {

                  if (res.length > 0) {
                    this.primatotalSCTR = 0;
                    this.primatotalSalud = 0;
                    // console.log(res)
                    res.forEach(item => {
                      if (item.ID_PRODUCTO == this.pensionID) {
                        item.PRIMA = self.formateaValor(item.PRIMA)
                        this.pensionList.push(item);
                        this.prodPension = true;
                        // let primaTotal = parseFloat(this.primatotalSCTR.toString()) + parseFloat(item.PRIMA)
                        // this.primatotalSCTR = self.formateaValor(parseFloat(primaTotal.toString()))
                        this.activityVariationPension = item.VARIACION_TASA;
                        // this.primatotalSCTR = self.formateaValor(item.NSUM_PREMIUMN);
                        // this.igvPension = self.formateaValor(item.NSUM_IGV);
                        // this.totalSTRC = self.formateaValor(item.NSUM_PREMIUM);

                        this.totalNetoPensionSave = self.formateaValor(item.NSUM_PREMIUMN);
                        this.igvPensionSave = self.formateaValor(item.NSUM_IGV);
                        this.brutaTotalPensionSave = self.formateaValor(item.NSUM_PREMIUM);
                        // console.log(this.primatotalSCTR)
                      }
                      if (item.ID_PRODUCTO == this.saludID) {
                        item.PRIMA = self.formateaValor(item.PRIMA)
                        this.saludList.push(item);
                        this.prodSalud = true;
                        // let primaTotal = parseFloat(this.primatotalSalud.toString()) + parseFloat(item.PRIMA)
                        // this.primatotalSalud = self.formateaValor(parseFloat(primaTotal.toString()))
                        this.activityVariationSalud = item.VARIACION_TASA;
                        // this.primatotalSalud = self.formateaValor(item.NSUM_PREMIUMN);
                        // this.igvSalud = self.formateaValor(item.NSUM_IGV);
                        // this.totalSalud = self.formateaValor(item.NSUM_PREMIUM);

                        this.totalNetoSaludSave = self.formateaValor(item.NSUM_PREMIUMN);
                        this.igvSaludSave = self.formateaValor(item.NSUM_IGV);
                        this.brutaTotalSaludSave = self.formateaValor(item.NSUM_PREMIUM);
                      }
                    });

                    let sumWorkers = 0;
                    if (this.pensionList.length > 0) {
                      // console.log(this.pensionList)
                      this.tasasList = this.pensionList;
                      this.pensionList.map(function (dato) {
                        dato.TASA_PRO = "";
                        self.endosoPension = dato.PRIMA_END;
                        dato.rateDet = dato.TASA_RIESGO;
                        sumWorkers = sumWorkers + parseFloat(dato.NUM_TRABAJADORES);
                      });
                    } else if (this.saludList.length > 0) {
                      this.tasasList = this.saludList;
                      this.saludList.map(function (dato) {
                        dato.TASA_PRO = "";
                        self.endosoSalud = dato.PRIMA_END;
                        dato.rateDet = dato.TASA_RIESGO;
                        sumWorkers = sumWorkers + parseFloat(dato.NUM_TRABAJADORES);
                      });
                    } else {
                      this.tasasList = [];
                    }
                    this.polizaEmit.P_WORKER = sumWorkers;

                    if (sumWorkers <= 50) {
                      this.polizaEmit.workers = "1";
                    }

                    if (sumWorkers > 50) {
                      this.polizaEmit.workers = "2";
                    }

                    //this.factorIgv = parseFloat(res[0].FACTOR_IGV);

                    // this.igvPension = this.formateaValor((this.primatotalSCTR * this.igvPensionWS) - this.primatotalSCTR);
                    // this.totalSTRC = this.formateaValor(parseFloat(this.primatotalSCTR.toString()) + parseFloat(this.igvPension.toString()));

                    // this.igvSalud = this.formateaValor((this.primatotalSalud * this.igvSaludWS) - this.primatotalSalud)
                    // this.totalSalud = this.formateaValor(parseFloat(this.primatotalSalud.toString()) + parseFloat(this.igvSalud.toString()));

                    //this.igvPension = this.formateaValor((this.primatotalSCTR * this.factorIgv) / 100);
                    //this.igvSalud = this.formateaValor((this.primatotalSalud * this.factorIgv) / 100);
                    //this.totalSalud = this.formateaValor(parseFloat(this.primatotalSalud.toString()) + parseFloat(this.igvSalud.toString()));
                    //this.totalSTRC = this.formateaValor(parseFloat(this.primatotalSCTR.toString()) + parseFloat(this.igvPension.toString()));
                  } else {
                    this.primatotalSCTR = 0;
                    this.primatotalSalud = 0;
                    this.igvPension = 0;
                    this.igvSalud = 0;
                    this.totalSalud = 0;
                    this.totalSTRC = 0;
                  }
                })

              //Detalle de cotización como póliza
              this.policyemit.getPolicyCot(this.nrocotizacion)
                .subscribe((res: any) => {
                  this.NroPension = res[0].POL_PEN;
                  this.NroSalud = res[0].POL_SAL;
                  this.polizaEmitCab.tipoRenovacion = res[0].TIP_RENOV;
                  if (this.mode == "renew") {
                    //console.log(res[0].HASTA)
                    let fechaInicio = new Date(res[0].HASTA);
                    fechaInicio.setDate(fechaInicio.getDate() + 1);
                    this.fechaBase = fechaInicio;
                    // console.log(this.fechaBase)
                    this.polizaEmitCab.bsValueIni = new Date(fechaInicio);
                    this.polizaEmitCab.bsValueIniMin = new Date(fechaInicio);
                    // console.log(this.polizaEmitCab.bsValueIniMin)
                    this.fechaFin(this.polizaEmitCab.tipoRenovacion, res[0].HASTA)
                  } else {
                    this.fechaBaseHasta = res[0].HASTA;
                    this.polizaEmitCab.bsValueIni = new Date();
                    this.polizaEmitCab.bsValueIniMin = new Date();
                    this.polizaEmitCab.bsValueFinMax = new Date(res[0].HASTA);
                    this.polizaEmitCab.bsValueFin = new Date(res[0].HASTA);
                  }

                  this.cargarFrecuencia();
                  this.polizaEmit.facturacionVencido = res[0].FACT_MES_VENC == 0 ? false : true;
                  this.polizaEmit.facturacionAnticipada = res[0].FACT_ANTI == 0 ? false : true;
                  this.polizaEmitCab.frecuenciaPago = res[0].FREC_PAGO;

                })

              if (this.mode == "renew") {
                Swal.fire({
                  title: "Renovación",
                  text: "¿Desea generar renovación con modificación de datos?",
                  type: "info",
                  showCancelButton: true,
                  confirmButtonText: 'SÍ',
                  allowOutsideClick: false,
                  cancelButtonText: 'NO'
                })
                  .then((result) => {
                    if (result.value) {
                      this.editFlag = false;
                      if (this.polizaEmit.facturacionVencido == true) {
                        this.facVencido = false;
                        this.facAnticipada = true;
                      }

                      if (this.polizaEmit.facturacionAnticipada == true) {
                        this.facVencido = true;
                        this.facAnticipada = false;
                      }

                      if (this.polizaEmit.facturacionVencido == false && this.polizaEmit.facturacionAnticipada == false) {
                        this.facVencido = false;
                        this.facAnticipada = false;
                      }
                      //this.router.navigate(['/broker/add-contracting'], { queryParams: { typeDocument: this.InputsQuotation.P_NIDDOC_TYPE, document: this.InputsQuotation.P_SIDDOC, receiver: "quotation" } });
                    } else {
                      this.editFlag = true;
                    }
                  });
              }

              if (this.mode == "endosar") {
                this.editFlag = false;
                if (this.polizaEmit.facturacionVencido == true) {
                  this.facVencido = false;
                  this.facAnticipada = true;
                }

                if (this.polizaEmit.facturacionAnticipada == true) {
                  this.facVencido = true;
                  this.facAnticipada = false;
                }
              }

              if (this.mode == "include" || this.mode == "exclude" || this.mode == "netear") {
                this.disabledFecha = false;
                this.disabledFechaFin = true;
                // if (this.polizaEmit.facturacionVencido == true) {
                //   this.facVencido = false;
                //   this.facAnticipada = true;
                // }

                // if (this.polizaEmit.facturacionAnticipada == true) {
                //   this.facVencido = true;
                //   this.facAnticipada = false;
                // }
              }


            } else {
              Swal.fire("Información", res.GenericResponse.MENSAJE, "error");
              this.polizaEmitCab = {};
              this.polizaEmitCab.bsValueIni = new Date();
              this.polizaEmitCab.bsValueFin = new Date();
              this.polizaEmitCab.bsValueIniMin = new Date();
              this.polizaEmitCab.bsValueFinMax = new Date();
              this.polizaEmitCab.TIPO_DOCUMENTO = "";
              this.polizaEmitCab.tipoRenovacion = '';
              this.polizaEmitCab.ACT_TECNICA = ''
              this.polizaEmitCab.COD_ACT_ECONOMICA = ''
              this.polizaEmitCab.COD_TIPO_SEDE = '';
              this.polizaEmitCab.COD_MONEDA = '';
              this.polizaEmitCab.COD_DEPARTAMENTO = ''
              this.polizaEmitCab.COD_PROVINCIA = ''
              this.polizaEmitCab.COD_DISTRITO = ''
              this.polizaEmitCab.frecuenciaPago = '';
            }


          }
          else {
            this.polizaEmitCab = {};
            this.polizaEmitCab.bsValueIni = new Date();
            this.polizaEmitCab.bsValueFin = new Date();
            this.polizaEmitCab.bsValueIniMin = new Date();
            this.polizaEmitCab.bsValueFinMax = new Date();
            this.polizaEmitCab.TIPO_DOCUMENTO = "";
            this.polizaEmitCab.tipoRenovacion = '';
            this.polizaEmitCab.ACT_TECNICA = ''
            this.polizaEmitCab.COD_ACT_ECONOMICA = ''
            this.polizaEmitCab.COD_TIPO_SEDE = '';
            this.polizaEmitCab.COD_MONEDA = '';
            this.polizaEmitCab.COD_DEPARTAMENTO = ''
            this.polizaEmitCab.COD_PROVINCIA = ''
            this.polizaEmitCab.COD_DISTRITO = ''
            this.polizaEmitCab.frecuenciaPago = '';
          }

        })
    }
    else {
      Swal.fire("Información", "Ingresar nro de cotización", "error");
    }
  }

  formateaValor(valor) {
    // si no es un número devuelve el valor, o lo convierte a número con 2 decimales
    return isNaN(valor) ? valor : parseFloat(valor).toFixed(2);
  }

  ObtenerTipoRenovacion() {
    let requestTypeRen: any = {}
		requestTypeRen.P_NUSERCODE = JSON.parse(localStorage.getItem("currentUser"))["id"]
    this.policyemit.getTipoRenovacion(requestTypeRen)
      .subscribe((res: any) => {
        this.tipoRenovacion = res;
        //console.log("tipo", this.polizaEmitCab.tipoRenovacion)
        if (this.polizaEmitCab.tipoRenovacion !== "") {
          this.policyemit.getFrecuenciaPago(this.polizaEmitCab.tipoRenovacion)
            .subscribe((res: any) => {
              this.polizaEmitCab.frecuenciaPago = "";
              this.frecuenciaPago = res;
              //console.log(this.frecuenciaPago);
            })
        }
      })
  }

  MotivosAnulacion() {
    this.policyemit.GetAnnulment()
      .subscribe((res: any) => {
        // console.log(res)
        this.annulmentList = res;
      })
  }

  downloadExcel() {
    parent.location.href = "http://10.10.1.51/WSPlataforma/Files/Example/Ejemplo.xls";
  }

	/*eventoCotizacion() {
		this.flagNroCotizacion = false

		if (isNaN(this.nrocotizacion)) {
			this.flagNroCotizacion = true
			this.flagBusqueda = false;
		}

	}*/
  cambioFecha() {
    this.errorFrecPago = false;
  }


  GenerarPoliza(forma: NgForm) {
    let mensaje = "";
    if (this.cotizacionID == "") {
      this.errorNroCot = true;
      mensaje = "Debe ingresar una cotización <br />";
    }
    if (this.polizaEmitCab.frecuenciaPago == "" || this.polizaEmitCab.frecuenciaPago == "0") {
      this.errorFrecPago = true;
      mensaje += "Debe ingresar una frecuencia de pago <br />";
    }
    if (this.polizaEmitCab.tipoRenovacion == "" || this.polizaEmitCab.tipoRenovacion == "0") {
      this.flagTipoR = true;
      mensaje += "Debe ingresar un tipo de renovación <br />";
    }
    if (this.mode != "endosar" && this.mode != "cancel") {
      if (this.excelSubir === undefined) {
        this.errorExcel = true;
        mensaje += "Debe subir un archivo excel para su validación <br />";
      } else {
        if (this.erroresList.length > 0 || this.processID == "") {
          this.errorExcel = true;
          mensaje += "No se ha procesado la validación de forma correcta <br />";
        }
      }
    }

    if (this.tasasList.length == 0) {
      mensaje += "Para generar una cotización debe tener un producto <br>"
    } else {
      if (this.tasasList.length > 0) {
        let countWorker = 0;
        let countPlanilla = 0;
        this.tasasList.forEach(item => {
          if (item.NUM_TRABAJADORES == 0) {
            countWorker++
          } else {
            if (item.MONTO_PLANILLA == 0) {
              mensaje += "Debe ingresar un monto en el campo planilla de la categoría " + item.DES_RIESGO + " <br>"
            }
          }

          if (item.MONTO_PLANILLA == 0) {
            countPlanilla++;
          } else {
            if (item.NUM_TRABAJADORES == 0) {
              mensaje += "Debe ingresar trabajadores de la categoría " + item.DES_RIESGO + " <br>"
            }
          }
        });

        if (countPlanilla == this.tasasList.length) {
          if (countWorker == this.tasasList.length) {
            mensaje += "Debe ingresar trabajadores al menos en un tipo de riesgo <br>";
          }
        }


        if (countWorker == this.tasasList.length) {
          if (countPlanilla == this.tasasList.length) {
            mensaje += "Debe ingresar planilla al menos en un tipo de riesgo <br>";
          }
        }

      }
    }

    if (this.mode == "cancel") {
      if (this.annulmentID == null) {
        mensaje += "Debe ingresar el motivo de anulación <br />"
      }
    }

    if (this.stateWorker == true) {
      mensaje += "La cantidad de trabajadores no es la correcta <br />";
    }

    if (mensaje == "") {
      Swal.fire({
        title: "Información",
        text: this.questionText,
        type: "question",
        showCancelButton: true,
        confirmButtonText: 'Generar',
        allowOutsideClick: false,
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.value) {
          if (this.mode == "endosar") {
            this.EndososarPolicy();
          } else {
            this.CreateJob()
          }
        }
      });
    } else {
      Swal.fire("Información", mensaje, "error");
    }
  }

  EndososarPolicy() {
    let self = this;
    self.loading = true;
    let dataQuotation: any = {};
    dataQuotation.P_SCLIENT = this.polizaEmitCab.SCLIENT;
    dataQuotation.P_NCURRENCY = this.polizaEmitCab.COD_MONEDA;
    dataQuotation.P_NBRANCH = 1;
    dataQuotation.P_DSTARTDATE = new Date();
    dataQuotation.P_NIDCLIENTLOCATION = "";
    dataQuotation.P_SCOMMENT = ""
    dataQuotation.P_SRUTA = "";
    dataQuotation.P_NUSERCODE = JSON.parse(localStorage.getItem("currentUser"))["id"];
    dataQuotation.QuotationDet = [];
    dataQuotation.QuotationCom = [];

    //Detalle de Cotizacion Pension
    // console.log(this.pensionList.length)
    if (this.pensionList.length > 0) {
      this.pensionList.forEach(dataPension => {
        // console.log(dataPension)
        let savedPolicyEmit: any = {};
        savedPolicyEmit.P_NID_COTIZACION = this.cotizacionID; //Cotizacion
        savedPolicyEmit.P_NBRANCH = 1;
        savedPolicyEmit.P_NPRODUCT = this.pensionID; // Pensión
        savedPolicyEmit.P_NMODULEC = dataPension.TIP_RIESGO;
        savedPolicyEmit.P_NTOTAL_TRABAJADORES = dataPension.NUM_TRABAJADORES;
        savedPolicyEmit.P_NMONTO_PLANILLA = dataPension.MONTO_PLANILLA;
        savedPolicyEmit.P_NTASA_CALCULADA = dataPension.TASA_CALC;
        savedPolicyEmit.P_NTASA_PROP = dataPension.TASA_PRO == "" ? "0" : dataPension.TASA_PRO;
        savedPolicyEmit.P_NPREMIUM_MENSUAL = dataPension.PRIMA;
        savedPolicyEmit.P_NPREMIUM_MIN = this.polizaEmitCab.MIN_PENSION;
        savedPolicyEmit.P_NPREMIUM_MIN_PR = this.polizaEmitCab.MIN_PENSION_PR == "" ? "0" : this.polizaEmitCab.MIN_PENSION_PR;
        savedPolicyEmit.P_NPREMIUM_END = this.endosoPension == null ? "0" : this.endosoPension;
        savedPolicyEmit.P_NSUM_PREMIUMN = this.totalNetoPensionSave;
        savedPolicyEmit.P_NSUM_IGV = this.igvPensionSave;
        savedPolicyEmit.P_NSUM_PREMIUM = this.brutaTotalPensionSave;
        savedPolicyEmit.P_NRATE = dataPension.rateDet == null ? "0" : dataPension.rateDet;
        savedPolicyEmit.P_NDISCOUNT = this.discountPension == "" ? "0" : this.discountPension;
        savedPolicyEmit.P_NACTIVITYVARIATION = this.activityVariationPension == "" ? "0" : this.activityVariationPension;
        savedPolicyEmit.P_FLAG = this.retarifa;
        dataQuotation.QuotationDet.push(savedPolicyEmit);
      });
    }

    //Detalle de Cotizacion Salud
    if (this.saludList.length > 0) {
      this.saludList.forEach(dataSalud => {
        let savedPolicyEmit: any = {};
        savedPolicyEmit.P_NID_COTIZACION = this.cotizacionID; //Cotizacion
        savedPolicyEmit.P_NBRANCH = 1;
        savedPolicyEmit.P_NPRODUCT = this.saludID; // Pensión
        savedPolicyEmit.P_NMODULEC = dataSalud.TIP_RIESGO;
        savedPolicyEmit.P_NTOTAL_TRABAJADORES = dataSalud.NUM_TRABAJADORES;
        savedPolicyEmit.P_NMONTO_PLANILLA = dataSalud.MONTO_PLANILLA;
        savedPolicyEmit.P_NTASA_CALCULADA = dataSalud.TASA_CALC;
        savedPolicyEmit.P_NTASA_PROP = dataSalud.TASA_PRO == "" ? "0" : dataSalud.TASA_PRO;
        savedPolicyEmit.P_NPREMIUM_MENSUAL = dataSalud.PRIMA;
        savedPolicyEmit.P_NPREMIUM_MIN = this.polizaEmitCab.MIN_SALUD;
        savedPolicyEmit.P_NPREMIUM_MIN_PR = this.polizaEmitCab.MIN_SALUD_PR == "" ? "0" : this.polizaEmitCab.MIN_SALUD_PR;
        savedPolicyEmit.P_NPREMIUM_END = this.endosoSalud == null ? "0" : this.endosoSalud;
        savedPolicyEmit.P_NSUM_PREMIUMN = this.totalNetoSaludSave;
        savedPolicyEmit.P_NSUM_IGV = this.igvSaludSave;
        savedPolicyEmit.P_NSUM_PREMIUM = this.brutaTotalSaludSave;
        savedPolicyEmit.P_NRATE = dataSalud.rateDet == null ? "0" : dataSalud.rateDet;
        savedPolicyEmit.P_NDISCOUNT = this.discountSalud == "" ? "0" : this.discountSalud;
        savedPolicyEmit.P_NACTIVITYVARIATION = this.activityVariationSalud == "" ? "0" : this.activityVariationSalud;
        savedPolicyEmit.P_FLAG = this.retarifa;
        dataQuotation.QuotationDet.push(savedPolicyEmit);
      });
    }

    //Comercializador Principal
    let itemQuotationComMain: any = {};
    itemQuotationComMain.P_NID_COTIZACION = this.cotizacionID; //Cotizacion
    itemQuotationComMain.P_NIDTYPECHANNEL = this.polizaEmitComerDTOPrincipal.TIPO_CANAL;
    itemQuotationComMain.P_NINTERMED = this.polizaEmitComerDTOPrincipal.CANAL;
    itemQuotationComMain.P_SCLIENT_COMER = this.polizaEmitComerDTOPrincipal.SCLIENT;
    itemQuotationComMain.P_NCOMISION_SAL = self.saludList.length > 0 ? this.polizaEmitComerDTOPrincipal.COMISION_SALUD == "" ? "0" : this.polizaEmitComerDTOPrincipal.COMISION_SALUD : "0";
    itemQuotationComMain.P_NCOMISION_SAL_PR = self.saludList.length > 0 ? this.polizaEmitComerDTOPrincipal.COMISION_SALUD_PRO == "" ? "0" : this.polizaEmitComerDTOPrincipal.COMISION_SALUD_PRO : "0";
    itemQuotationComMain.P_NCOMISION_PEN = self.pensionList.length > 0 ? this.polizaEmitComerDTOPrincipal.COMISION_PENSION == "" ? "0" : this.polizaEmitComerDTOPrincipal.COMISION_PENSION : "0";
    itemQuotationComMain.P_NCOMISION_PEN_PR = self.pensionList.length > 0 ? this.polizaEmitComerDTOPrincipal.COMISION_PENSION_PRO == "" ? "0" : this.polizaEmitComerDTOPrincipal.COMISION_PENSION_PRO : "0";
    itemQuotationComMain.P_NPRINCIPAL = this.polizaEmitComerDTOPrincipal.PRINCIPAL;
    dataQuotation.QuotationCom.push(itemQuotationComMain);

    //Comercializadores secundarios
    if (this.polizaEmitComer.length > 0) {
      this.polizaEmitComer.forEach(dataBroker => {
        let itemQuotationCom: any = {};
        itemQuotationCom.P_NID_COTIZACION = this.cotizacionID; //Cotizacion
        itemQuotationCom.P_NIDTYPECHANNEL = dataBroker.TIPO_CANAL;
        itemQuotationCom.P_NINTERMED = dataBroker.CANAL; // Produccion
        itemQuotationCom.P_SCLIENT_COMER = dataBroker.SCLIENT;
        itemQuotationCom.P_NCOMISION_SAL = self.saludList.length > 0 ? dataBroker.COMISION_SALUD == "" ? "0" : dataBroker.COMISION_SALUD : "0";
        itemQuotationCom.P_NCOMISION_SAL_PR = self.saludList.length > 0 ? dataBroker.COMISION_SALUD_PRO == "" ? "0" : dataBroker.COMISION_SALUD_PRO : "0";
        itemQuotationCom.P_NCOMISION_PEN = self.pensionList.length > 0 ? dataBroker.COMISION_PENSION == "" ? "0" : dataBroker.COMISION_PENSION : "0";
        itemQuotationCom.P_NCOMISION_PEN_PR = self.pensionList.length > 0 ? dataBroker.COMISION_PENSION_PRO == "" ? "0" : dataBroker.COMISION_PENSION_PRO : "0";
        itemQuotationCom.P_NPRINCIPAL = dataBroker.PRINCIPAL;
        dataQuotation.QuotationCom.push(itemQuotationCom);
      });
    }
    console.log(dataQuotation)
    this.policyemit.renewMod(dataQuotation).subscribe(
      res => {
        console.log(res)
        if (res.P_COD_ERR == 0) {
          self.CreateJob();
        } else {
          self.loading = false;
          Swal.fire("Información", res.P_MESSAGE, "error");
        }
      },
      err => {
        self.loading = false;
        //console.log(err);
        Swal.fire("Información", "Hubo un error con el servidor", "error");
      }
    );
  }

  CreateJob() {
    let myFormData: FormData = new FormData()
    this.loading = true;
    if (this.files.length > 0) {
      this.files.forEach(file => {
        myFormData.append("adjuntos", file, file.name);
      });
    }

    //Fecha Inicio
    let dayIni = this.polizaEmitCab.bsValueIni.getDate() < 10 ? "0" + this.polizaEmitCab.bsValueIni.getDate() : this.polizaEmitCab.bsValueIni.getDate();
    let monthPreviewIni = this.polizaEmitCab.bsValueIni.getMonth() + 1;
    let monthIni = monthPreviewIni < 10 ? "0" + monthPreviewIni : monthPreviewIni;
    let yearIni = this.polizaEmitCab.bsValueIni.getFullYear();

    //Fecha Fin
    let dayFin = this.polizaEmitCab.bsValueFin.getDate() < 10 ? "0" + this.polizaEmitCab.bsValueFin.getDate() : this.polizaEmitCab.bsValueFin.getDate();
    let monthPreviewFin = this.polizaEmitCab.bsValueFin.getMonth() + 1;
    let monthFin = monthPreviewFin < 10 ? "0" + monthPreviewFin : monthPreviewFin;
    let yearFin = this.polizaEmitCab.bsValueFin.getFullYear();


    let renovacion: any = {};
    renovacion.P_NID_COTIZACION = this.cotizacionID // nro cotizacion
    renovacion.P_DEFFECDATE = dayIni + "/" + monthIni + "/" + yearIni; //Fecha Inicio
    renovacion.P_DEXPIRDAT = dayFin + "/" + monthFin + "/" + yearFin; // Fecha hasta
    renovacion.P_NUSERCODE = JSON.parse(localStorage.getItem("currentUser"))["id"] // Fecha hasta
    renovacion.P_NTYPE_TRANSAC = this.typeMovement // tipo de movimiento
    renovacion.P_NID_PROC = this.processID // codigo de proceso (Validar trama)
    renovacion.P_FACT_MES_VENCIDO = this.polizaEmit.facturacionVencido == true ? 1 : 0 // Facturacion Vencida
    renovacion.P_SFLAG_FAC_ANT = this.polizaEmit.facturacionAnticipada == true ? 1 : 0 // Facturacion Anticipada
    renovacion.P_SCOLTIMRE = this.polizaEmitCab.tipoRenovacion // Tipo de renovacion
    renovacion.P_NPAYFREQ = this.polizaEmitCab.frecuenciaPago // Frecuencia Pago
    renovacion.P_NMOV_ANUL = 0 // Movimiento de anulacion
    renovacion.P_NNULLCODE = this.annulmentID == null ? 0 : this.annulmentID // Motivo anulacion
    renovacion.P_SCOMMENT = this.polizaEmit.comentario.toUpperCase() // Frecuencia Pago

    myFormData.append("objeto", JSON.stringify(renovacion));

    this.policyemit.transactionPolicy(myFormData).subscribe(
      res => {
        // console.log(res);
        //this.erroresList = res.C_TABLE;
        console.log(res)
        this.loading = false;
        if (res.P_COD_ERR == 0) {
          Swal.fire({
            title: "Información",
            text: this.responseText + res.P_NCONSTANCIA,
            type: "success",
            confirmButtonText: 'OK',
            allowOutsideClick: false,
          }).then((result) => {
            if (result.value) {
              this.router.navigate(['/broker/policy-transactions']);
            }
          });
        } else {
          Swal.fire({
            title: "Información",
            text: res.P_MESSAGE,
            type: "error",
            confirmButtonText: 'OK',
            allowOutsideClick: false,
          })
        }
      },
      err => {
        this.loading = false;
        console.log(err);
      }
    );
  }
  validarArchivos() {
    this.clickValidarArchivos = false;
    this.archivosJson = [];
    this.tamañoArchivo = 0;
    this.flagExtension = false;
    for (let i = 0; i < this.files.length; i++) {
      let size = (this.files[i].size / 1024 / 1024).toFixed(3);
      let sizeNumber = Number.parseFloat(size);
      this.tamañoArchivo = this.tamañoArchivo + sizeNumber;
      var extensiones_permitidas = [".jpeg", ".jpg", ".png", ".bmp", ".pdf", ".txt", ".doc", ".xls", ".xlsx", ".docx", ".xlsm", ".xltx", ".xltm", ".xlsb", ".xlam", ".docm", ".dotx", ".dotm", ".pptx", ".pptm", ".potx", ".potm", ".ppam", ".ppsx", ".ppsm", ".sldx", ".sldm", ".thmx", ".zip", ".rar"];
      var rutayarchivo = this.files[i].name;
      var ultimo_punto = this.files[i].name.lastIndexOf(".");
      var extension = rutayarchivo.slice(ultimo_punto, rutayarchivo.length);
      if (this.flagExtension === false) {
        if (extensiones_permitidas.indexOf(extension) == -1) {
          this.flagExtension = true;
        }
      }

    }
    if (this.flagExtension) {
      this.archivosJson.push({
        error: 'Solo se aceptan imagenes y documentos'
      })

      return;
    }
    if (this.tamañoArchivo > 10) {
      this.archivosJson.push({
        error: 'Los archivos en total no deben de tener mas de 10 mb'
      })

      return;
    }
  }

  primaPropuesta(id) {
    switch (id) {
      case 1:
        this.stateBrokerSalud = !this.stateBrokerSalud;
        if (this.stateBrokerPension != true) {
          this.polizaEmitComerDTOPrincipal.COMISION_SALUD_PRO = "";
        } else {
          this.objEdit.polizaCom.forEach(item => {
            if (item.main == 1) {
              this.polizaEmitComerDTOPrincipal.COMISION_SALUD_PRO = item.COM_PRO_SAL;
            }
          });
        }
        break;
      case 2:
        this.stateBrokerPension = !this.stateBrokerPension;
        if (this.stateBrokerPension != true) {
          this.polizaEmitComerDTOPrincipal.COMISION_PENSION_PRO = "";
        } else {
          this.objEdit.polizaCom.forEach(item => {
            if (item.main == 1) {
              this.polizaEmitComerDTOPrincipal.COMISION_PENSION_PRO = item.COM_PRO_PEN;
            }
          });
        }
        break;
      case 3:
        this.statePrimaSalud = !this.statePrimaSalud;
        if (this.statePrimaSalud != true) {
          this.polizaEmitCab.MIN_SALUD_PR = "";
        } else {
          this.polizaEmitCab.MIN_SALUD_PR = this.objEdit.PRIMA_MIN_SAL;
        }
        break;
      case 4:
        this.statePrimaPension = !this.statePrimaPension;
        if (this.statePrimaPension != true) {
          this.polizaEmitCab.MIN_PENSION_PR = "";
        } else {
          this.polizaEmitCab.MIN_PENSION_PR = this.objEdit.PRIMA_MIN_PEN;
        }
        break;
      case 5:
        this.stateTasaSalud = !this.stateTasaSalud;
        this.saludList.forEach(item => {
          item.TASA_PRO = "";
        });
        break;
      case 6:
        this.stateTasaPension = !this.stateTasaPension
        this.pensionList.forEach(item => {
          item.TASA_PRO = "";
        });
        break;
      case 7:
        this.stateBrokerTasaSalud = !this.stateBrokerTasaSalud;
        if (this.stateBrokerTasaSalud != true) {
          this.polizaEmitComer.forEach(item => {
            item.COMISION_SALUD_PRO = "";
          });
        } else {
          this.objEdit.polizaCom.forEach(item => {
            if (item.main == 0) {
              this.polizaEmitComer.forEach(item2 => {
                if (item2.SCLIENT == item.SCLIENT) {
                  item2.COMISION_SALUD_PRO = item.COM_PRO_SAL;
                }
              });
            }
          });
        }
        break;
      case 8:
        this.stateBrokerTasaPension = !this.stateBrokerTasaPension;
        if (this.stateBrokerTasaPension != true) {
          this.polizaEmitComer.forEach(item => {
            item.COMISION_PENSION_PRO = "";
          });
        } else {
          this.objEdit.polizaCom.forEach(item => {
            if (item.main == 0) {
              this.polizaEmitComer.forEach(item2 => {
                if (item2.SCLIENT == item.SCLIENT) {
                  item2.COMISION_PENSION_PRO = item.COM_PRO_PEN;
                }
              });
            }
          });
        }
        break;
    }
  }

  fechaFin(tipoRen: string, fechaDesde: string) {
    let fechaFin = new Date(fechaDesde);

    if (tipoRen == "5") {
      fechaFin.setMonth(fechaFin.getMonth() + 1);
      fechaFin.setDate(fechaFin.getDate());
      this.polizaEmitCab.bsValueFin = new Date(fechaFin);
      this.flagFechaMenorMayorFin = true;
    }

    if (tipoRen == "4") {
      fechaFin.setMonth(fechaFin.getMonth() + 2);
      fechaFin.setDate(fechaFin.getDate());
      this.polizaEmitCab.bsValueFin = new Date(fechaFin);
      this.flagFechaMenorMayorFin = true;

    }

    if (tipoRen == "3") {
      fechaFin.setMonth(fechaFin.getMonth() + 2);
      fechaFin.setDate(fechaFin.getDate());
      this.polizaEmitCab.bsValueFin = new Date(fechaFin);
      this.flagFechaMenorMayorFin = true;
    }

    if (tipoRen == "2") {
      fechaFin.setMonth(fechaFin.getMonth() + 6);
      fechaFin.setDate(fechaFin.getDate());
      this.polizaEmitCab.bsValueFin = new Date(fechaFin);
      this.flagFechaMenorMayorFin = true;
    }

    if (tipoRen == "1") {
      fechaFin.setFullYear(fechaFin.getFullYear() + 1)
      fechaFin.setDate(fechaFin.getDate());
      this.polizaEmitCab.bsValueFin = new Date(fechaFin);
      this.flagFechaMenorMayorFin = true;
    }
  }

  validarTipoRenovacion(event: any) {
    var fechadesde = this.desde.nativeElement.value.split("/");
    var fechahasta = this.hasta.nativeElement.value.split("/");
    var fechaDes = (fechadesde[1]) + "/" + fechadesde[0] + "/" + fechadesde[2];
    var fechaHas = (fechahasta[1]) + "/" + fechahasta[0] + "/" + fechahasta[2];
    let fechad = new Date(fechaDes);
    let fechah = new Date(fechaHas);

    if (this.polizaEmitCab.tipoRenovacion == "6") {
      fechad.setDate(fechad.getDate() + 1);
      this.polizaEmitCab.bsValueFinMin = new Date(fechad);
      this.polizaEmitCab.bsValueIniMin = new Date(this.fechaBase)
      if (fechad.getTime() > fechah.getTime()) {
        this.polizaEmitCab.bsValueFin = new Date(fechad);
      }
      this.disabledFecha = false;
      this.disabledFechaFin = false;

      this.fechaFinEspecial();
    }
    if (this.polizaEmitCab.tipoRenovacion == "7") {
      fechad.setDate(fechad.getDate() + 1);
      this.polizaEmitCab.bsValueFinMin = new Date(fechad);
      this.polizaEmitCab.bsValueIniMin = new Date(this.fechaBase)
      if (fechad.getTime() > fechah.getTime()) {
        this.polizaEmitCab.bsValueFin = new Date(fechad);
      }
      this.disabledFecha = false;
      this.disabledFechaFin = false;

      this.fechaFinEspecial()
    }
    if (this.polizaEmitCab.tipoRenovacion === "5") {
      // this.fechaBase = fechaInicio;
      //console.log(this.fechaBase)
      this.polizaEmitCab.bsValueIni = new Date(this.fechaBase)
      this.polizaEmitCab.bsValueIniMin = new Date(this.fechaBase)
      fechad.setMonth(fechad.getMonth() + 1);
      fechad.setDate(fechad.getDate() - 1);
      this.polizaEmitCab.bsValueFin = new Date(fechad);
      this.flagFechaMenorMayorFin = true;

      this.fechaFinEspecial()
    }
    if (this.polizaEmitCab.tipoRenovacion === "4") {
      this.polizaEmitCab.bsValueIni = new Date(this.fechaBase)
      this.polizaEmitCab.bsValueIniMin = new Date(this.fechaBase)
      fechad.setMonth(fechad.getMonth() + 2);
      fechad.setDate(fechad.getDate() - 1);
      this.polizaEmitCab.bsValueFin = new Date(fechad);
      this.flagFechaMenorMayorFin = true;

      this.fechaFinEspecial()
    }
    if (this.polizaEmitCab.tipoRenovacion === "3") {
      this.polizaEmitCab.bsValueIni = new Date(this.fechaBase)
      this.polizaEmitCab.bsValueIniMin = new Date(this.fechaBase)
      fechad.setMonth(fechad.getMonth() + 2);
      fechad.setDate(fechad.getDate() - 1);
      this.polizaEmitCab.bsValueFin = new Date(fechad);
      this.flagFechaMenorMayorFin = true;
      this.fechaFinEspecial()
    }
    if (this.polizaEmitCab.tipoRenovacion === "2") {
      this.polizaEmitCab.bsValueIni = new Date(this.fechaBase)
      this.polizaEmitCab.bsValueIniMin = new Date(this.fechaBase)
      fechad.setMonth(fechad.getMonth() + 6);
      fechad.setDate(fechad.getDate() - 1);
      this.polizaEmitCab.bsValueFin = new Date(fechad);
      this.flagFechaMenorMayorFin = true;
      this.fechaFinEspecial()
    }

    if (this.polizaEmitCab.tipoRenovacion === "1") {
      this.polizaEmitCab.bsValueIni = new Date(this.fechaBase)
      this.polizaEmitCab.bsValueIniMin = new Date(this.fechaBase)
      fechad.setFullYear(fechad.getFullYear() + 1)
      fechad.setDate(fechad.getDate() - 1);
      this.polizaEmitCab.bsValueFin = new Date(fechad);
      this.flagFechaMenorMayorFin = true;
      this.fechaFinEspecial()

    }
  }

  fechaFinEspecial() {
    if (this.mode == "include" || this.mode == "exclude" || this.mode == "netear") {
      this.polizaEmitCab.bsValueIni = new Date();
      this.polizaEmitCab.bsValueIniMin = new Date();
      this.polizaEmitCab.bsValueFinMax = new Date(this.fechaBaseHasta);
      this.polizaEmitCab.bsValueFin = new Date(this.fechaBaseHasta);
    }
  }

  cargarFrecuencia() {
    this.policyemit.getFrecuenciaPago(this.polizaEmitCab.tipoRenovacion)
      .subscribe((res: any) => {
        //this.polizaEmitCab.frecuenciaPago = "0";
        this.frecuenciaPago = res;
      })
  }


  habilitarFechas() {
    /*this.flagTipoR = false;
    if (this.polizaEmitCab.bsValueFin.toString() === "Invalid date" || this.polizaEmitCab.bsValueIni.toString() === "Invalid date")
      return;
    this.activacion = false;*/
    // console.log("3")
    this.polizaEmitCab.frecuenciaPago = "0";
    this.disabledFecha = true;
    this.disabledFechaFin = true;

    this.cargarFrecuencia();

    var fechadesde = this.desde.nativeElement.value.split("/");
    var fechahasta = this.hasta.nativeElement.value.split("/");
    var fechaDes = (fechadesde[1]) + "/" + fechadesde[0] + "/" + fechadesde[2];
    var fechaHas = (fechahasta[1]) + "/" + fechahasta[0] + "/" + fechahasta[2];
    let fechad = new Date(fechaDes);
    let fechah = new Date(fechaHas);

    if (this.polizaEmitCab.tipoRenovacion === "6") {
      this.disabledFecha = false;
      this.disabledFechaFin = false;
      this.polizaEmitCab.bsValueIniMin = new Date(this.polizaEmitCab.bsValueIni);
      //this.polizaEmitCab.bsValueFinMax = new Date(this.polizaEmitCab.bsValueFin)
      this.polizaEmitCab.bsValueIni = new Date(this.polizaEmitCab.bsValueIni);
      this.polizaEmitCab.bsValueFin = new Date(this.polizaEmitCab.bsValueFin);
    }
    if (this.polizaEmitCab.tipoRenovacion === "7") {
      this.polizaEmitCab.bsValueIniMin = new Date(this.polizaEmitCab.bsValueIni);
      //this.polizaEmitCab.bsValueFinMax = new Date(this.polizaEmitCab.bsValueFin)
      this.polizaEmitCab.bsValueIni = new Date(this.polizaEmitCab.bsValueIni);
      this.polizaEmitCab.bsValueFin = new Date(this.polizaEmitCab.bsValueFin);
      this.disabledFecha = false;
      this.disabledFechaFin = false;
    }


    // if (this.flagFechaMenorMayor || this.flagFechaMenorMayorFin) {
    //var fechafin = this.desde.nativeElement.value.split("/");
    //var fechafines = (fechafin[1]) + "/" + fechafin[0] + "/" + fechafin[2];
    // let fechad = new Date(this.polizaEmitCab.bsValueIni);

    if (this.polizaEmitCab.tipoRenovacion === "5") {
      this.polizaEmitCab.bsValueIni = new Date(this.fechaBase)
      this.polizaEmitCab.bsValueIniMin = new Date(this.fechaBase)
      fechad.setMonth(fechad.getMonth() + 1);
      fechad.setDate(fechad.getDate() - 1);
      this.polizaEmitCab.bsValueFin = new Date(fechad);
      this.flagFechaMenorMayorFin = true;
    }

    if (this.polizaEmitCab.tipoRenovacion === "4") {
      this.polizaEmitCab.bsValueIni = new Date(this.fechaBase)
      this.polizaEmitCab.bsValueIniMin = new Date(this.fechaBase)
      fechad.setMonth(fechad.getMonth() + 2);
      fechad.setDate(fechad.getDate() - 1);
      this.polizaEmitCab.bsValueFin = new Date(fechad);
      this.flagFechaMenorMayorFin = true;
    }

    if (this.polizaEmitCab.tipoRenovacion === "3") {
      this.polizaEmitCab.bsValueIni = new Date(this.fechaBase)
      this.polizaEmitCab.bsValueIniMin = new Date(this.fechaBase)
      fechad.setMonth(fechad.getMonth() + 3);
      fechad.setDate(fechad.getDate() - 1);
      this.polizaEmitCab.bsValueFin = new Date(fechad);
      this.flagFechaMenorMayorFin = true;
    }

    if (this.polizaEmitCab.tipoRenovacion === "2") {
      this.polizaEmitCab.bsValueIni = new Date(this.fechaBase)
      this.polizaEmitCab.bsValueIniMin = new Date(this.fechaBase)
      fechad.setMonth(fechad.getMonth() + 6);
      fechad.setDate(fechad.getDate() - 1);
      this.polizaEmitCab.bsValueFin = new Date(fechad);
      this.flagFechaMenorMayorFin = true;
    }

    if (this.polizaEmitCab.tipoRenovacion === "1") {
      this.polizaEmitCab.bsValueIni = new Date(this.fechaBase)
      this.polizaEmitCab.bsValueIniMin = new Date(this.fechaBase)
      fechad.setFullYear(fechad.getFullYear() + 1)
      fechad.setDate(fechad.getDate() - 1);
      this.polizaEmitCab.bsValueFin = new Date(fechad);
      this.flagFechaMenorMayorFin = true;
    }
    // }
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
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { forkJoin } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
//Importación de servicios
import { PolicyemitService } from '../../../services/policy/policyemit.service';
import { QuotationService } from '../../../services/quotation/quotation.service';
import { OthersService } from '../../../services/shared/others.service';

//Importacion de modelos
import { QuotationStatusChange } from '../../../models/quotation/request/quotation-status-change';
import { AuthorizedRate } from '../../../models/quotation/request/authorized-rate';
import { Status } from '../../../models/quotation/response/status';
import { Reason } from '../../../models/quotation/response/reason';
import { QuotationTracking } from '../../../models/quotation/response/quotation-tracking'

//SweetAlert 
import swal from 'sweetalert2';
//Configuración
import { CommonMethods } from './../../common-methods';
import { AccessFilter } from './../../access-filter'
import { QuotationTrackingSearch } from '../../../models/quotation/request/quotation-tracking-search';
import { FilePickerComponent } from '../../../modal/file-picker/file-picker.component';
import { QuotationBroker } from '../../../models/quotation/request/quotation-modification/quotation-broker';
import { QuotationModification } from '../../../models/quotation/request/quotation-modification/quotation-modification';
import { QuotationRisk } from '../../../models/quotation/request/quotation-modification/quotation-risk';
import { Broker } from '../../../models/quotation/request/broker';
import { BrokerProduct } from '../../../models/quotation/request/broker-product';
import { BsDatepickerConfig } from 'ngx-bootstrap';

@Component({
  selector: 'app-policy-evaluation',
  templateUrl: './policy-evaluation.component.html',
  styleUrls: ['./policy-evaluation.component.css']
})
export class PolicyEvaluationComponent implements OnInit {

  /**
     * Variables de paginación
     */
  public rotate = true; //Si rotar las páginas cuando maxSize > el número de páginas generado 
  public maxSize = 15; // cantidad de paginas que se mostrarán en el html del paginado
  public totalItems = 0; //total de items encontrados
  /**Datos de filtro para la búsqueda de cambios de estado de la cotización */
  filter = new QuotationTrackingSearch();
  /**Lista de resultados de búsqueda de cambios de estado de la cotización */
  statusChangeList: QuotationTracking[];

  quotationNumber: string;  //Número de cotización
  policyNumber: string;  //Número de poliza
  nroProcess: string;  //Número de poliza
  statusChangeRequest = new QuotationStatusChange();  //Objeto principal a enviar en la operación de cambio de estado
  pensionAuthorizedRate: boolean = false;  //habilitar los campos de tasa autorizada de SCTR pensión
  saludAuthorizedRate: boolean = false;  //habilitar los campos de tasa autorizada de SCTR salud

  bsConfig: Partial<BsDatepickerConfig>;

  // isPensionProposedRateEnabled: boolean = false;
  // isHealthProposedRateEnabled: boolean = false;
  estimatedWorkerQuantity: string;
  /**Código equivalente del código del distrito */
  zipCode: string;

  reasonList: Status[] = []; //Lista de razones para el cambio de estado
  statusList: Reason[] = []; //Lista de estados de cotización

  files: File[] = []; //Lista de archivos cargados para subirse
  lastFileAt: Date; //Variable de componente FILES para ordenar por fecha
  filesMaxSize = 10485760;  //Limite del total de tamaño de archivos   

  /**Modo: evaluar, solover, recotizar, emitir */
  mode: string;
  isLoading: Boolean = false; //true:mostrar | false:ocultar pantalla de carga
  public mainFormGroup: FormGroup;

  public InputsQuotation: any = {}; //Datos de cotización que se carga para evaluar la cotización

  //Mensaje de manejo de errores
  genericServerErrorMessage: string = "Ha ocurrido un error inesperado, contáctese con soporte.";
  redirectionMessage: string = "Usted será redireccionado a la página anterior."
  /**Puede aprobar cotizaciones? */
  canApproveQuotation: boolean;
  /**Puede proponer tasa? */
  canProposeRate: boolean;
  /**Puede ver tasa de riesgo? */
  canSeeRiskRate: boolean;

  /**Comisión ORIGINAL propuesta de salud del broker principal */
  originalHealthMainPropComission: number;
  /**Comisión ORIGINAL propuesta de pensión del broker principal */
  originalPensionMainPropComission: number;
  /**Comisión ORIGINAL autorizada de pensión del broker principal */
  originalPensionMainAuthComission: number;
  /**Comisión ORIGINAL autorizada de salud del broker principal */
  originalHealthMainAuthComission: number;
  /**Prima ORIGINAL mínima propuesta de salud */
  originalHealthMinPropPremium: number;
  /**Prima ORIGINAL mínima propuesta de pensión */
  originalPensionMinPropPremium: number;
  /**Prima ORIGINAL mínima autorizada de pensión */
  originalPensionMinAuthPremium: number;
  /**Prima ORIGINAL mínima autorizada de salud */
  originalHealthMinAuthPremium: number;

  /**Flag para habilitar/deshabilitar las tasas propuestas de pensión */
  enabledPensionProposedRate: boolean;
  /**Flag para habilitar/deshabilitar las tasas propuestas de salud */
  enabledHealthProposedRate: boolean;
  /**Flag para habilitar/deshabilitar las tasas autorizadas de pensión */
  enabledPensionAuthorizedRate: boolean;
  /**Flag para habilitar/deshabilitar las tasas autorizadas de salud */
  enabledHealthAuthorizedRate: boolean;

  /**Flag para habilitar/deshabilitar el campo de prima mínima propuesta de salud */
  enabledHealthMinPropPremium: boolean;
  /**Flag para habilitar/deshabilitar el campo de prima mínima autorizada de salud */
  enabledHealthAuthorizedPremium: boolean;
  /**Flag para habilitar/deshabilitar el campo de prima mínima propuesta de pensión */
  enabledPensionMinPropPremium: boolean;
  /**Flag para habilitar/deshabilitar el campo de prima mínima autorizada de pensión */
  enabledPensionAuthorizedPremium: boolean;

  /**Flag para habilitar/deshabilitar el campo de comisión propuesta de salud del broker principal */
  enabledHealthMainPropCommission: boolean;
  /**Flag para habilitar/deshabilitar el campo de comisión autorizada de salud del broker principal */
  enabledHealthMainAuthCommission: boolean;
  /**Flag para habilitar/deshabilitar el campo de comisión propuesta de pensión del broker principal*/
  enabledPensionMainPropCommission: boolean;
  /**Flag para habilitar/deshabilitar el campo de comisión autorizada de pensión del broker principal */
  enabledPensionMainAuthCommission: boolean;
  /**Flag para habilitar/deshabilitar el campo de comisión propuesta de salud de broker secundarios*/
  enabledHealthSecondaryPropCommission: boolean;
  /**Flag para habilitar/deshabilitar el campo de comisión propuesta de pensión de broker secundarios*/
  enabledPensionSecondaryPropCommission: boolean;
  /**Flag para habilitar/deshabilitar el campo de comisión autorizada de salud de broker secundarios*/
  enabledHealthSecondaryAuthCommission: boolean;
  /**Flag para habilitar/deshabilitar el campo de comisión autorizada de pensión de broker secundarios*/
  enabledPensionSecondaryAuthCommission: boolean;
  /**Nombre de botón principal */
  buttonName: string;
  /**Etiqueta de evaluación */
  evaluationLabel: string;

  /**IGV para Salud */
  healthIGV: number;
  /**IGV para Pensión */
  pensionIGV: number;

  /**Id de producto Salud */
  healthProductId: string;
  /**Id de producto Pensión */
  pensionProductId: string;
  /**Prima total neta recalculada que se muestra cuando la prima neta actual es menor a la prima mínima*/
  pensionMessage: string;
  /**Es la prima neta menor a la prima mínima de salud? */
  isNetPremiumLessThanMinHealthPremium: boolean;
  /**Es la prima neta menor a la prima mínima de pensión? */
  isNetPremiumLessThanMinPensionPremium: boolean;
  /**Prima total neta recalculada que se muestra cuando la prima neta actual es menor a la prima mínima*/
  healthMessage: string;
  /** Tipo de transaccion */
  typeTransac: string;
  tipoRenovacion: any;
  frecuenciaPago: any;
  canBillMonthly: boolean;
  canBillInAdvance: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private policyService: PolicyemitService,
    private quotationService: QuotationService,
    private mainFormBuilder: FormBuilder,
    private domSanitizer: DomSanitizer,
    private othersService: OthersService,
    private ngbModal: NgbModal
  ) {
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
    this.createFormControl();
    this.initializeForm();
    this.healthProductId = JSON.parse(localStorage.getItem("saludID"))["id"];
    this.pensionProductId = JSON.parse(localStorage.getItem("pensionID"))["id"];
    let policyData = JSON.parse(sessionStorage.getItem("cs-quotation"));
    // sessionStorage.removeItem('cs-quotation');
    if (policyData == null || policyData === undefined) this.router.navigate(['/broker/policy-request']);
    else {
      this.policyNumber = policyData.PolicyNumber;
      this.quotationNumber = policyData.QuotationNumber;
      this.mode = policyData.Mode;
      this.nroProcess = policyData.NroProcess;
      this.typeTransac = policyData.TypeTransac;

      this.obtenerTipoRenovacion();

      if (this.quotationNumber == null || this.quotationNumber === undefined || this.mode == null || this.mode === undefined) this.router.navigate(['/broker/policy-request']);
      else {
        this.evaluationLabel = "Evaluación";
        this.buttonName = "EVALUAR";
      }

      this.canProposeRate = AccessFilter.hasPermission("13");
      this.canSeeRiskRate = AccessFilter.hasPermission("36");
      this.canBillMonthly = AccessFilter.hasPermission("16");
      this.canBillInAdvance = AccessFilter.hasPermission("17");

      this.isLoading = true;
      this.getIGVData();
      this.getStatusList();

      this.filter.QuotationNumber = this.quotationNumber;
      this.filter.PageNumber = 1;
      this.filter.LimitPerPage = 5;
      this.firstSearch();
    }
  }

  obtenerTipoRenovacion() {
    let requestTypeRen: any = {}
    requestTypeRen.P_NUSERCODE = JSON.parse(localStorage.getItem("currentUser"))["id"]
    this.policyService.getTipoRenovacion(requestTypeRen)
      .subscribe((res: any) => {
        this.tipoRenovacion = res;
      })
  }

  cargarFrecuencia() {
    this.policyService.getFrecuenciaPago(this.InputsQuotation.tipoRenovacion)
      .subscribe((res: any) => {
        this.frecuenciaPago = res;
        if (res != null && res.length == 1) this.InputsQuotation.frecuenciaPago = res[0].COD_TIPO_FRECUENCIA; //Si solo hay una frecuencia de pago, está se seleccionará automáticamente
      })
  }

  createFormControl() { //Crear "mainFormGroup"
    this.mainFormGroup = this.mainFormBuilder.group({
      reason: [""], //Razón de cambio de estado
      status: ["", [Validators.required]],  //Nuevo estado de cotización
      comment: [""] //Comentario adicional para el cambio de estado de cotización
    });
  }

  initializeForm() {  //Inicializar "mainFormGroup"
    this.mainFormGroup.controls.reason.setValue("");
    this.mainFormGroup.controls.status.setValue("");
    this.mainFormGroup.controls.comment.setValue("");
  }
  getDate() {
    return new Date()
  }

  getSafeUrl(unsafeUrl: string) { //Este método transforma una url "insegura" en una "segura" para evitar la alteración del "sanitizer de html"
    return this.domSanitizer.bypassSecurityTrustResourceUrl(unsafeUrl);
  }

  downloadFile(filePath: string) {  //Descargar archivos de cotización
    this.othersService.downloadFile(filePath).subscribe(
      res => {
        if (res.StatusCode == 1) {
          swal.fire('Información', this.listToString(res.ErrorMessageList), 'error');
        } else {
          //Es necesario crear un objeto BLOB con el tipo MIME (mime-type) explícitamente configurado
          //de otra manera chrome solo funcionaría como debería
          var newBlob = new Blob([res], { type: "application/pdf" });

          //IE no permite usar un objeto BLOB directamente como un link href
          //Por el contrario, es necesario usar msSaveOrOpenBlob
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(newBlob);
            return;
          }

          // Para otros navegadores: 
          //Crea un link apuntando al ObjectURL que contiene el BLOB.
          const data = window.URL.createObjectURL(newBlob);

          var link = document.createElement('a');
          link.href = data;

          link.download = filePath.substring(filePath.lastIndexOf("\\") + 1);
          //Esto es necesario si link.click() no funciona en la ultima versión de firefox
          link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

          setTimeout(function () {
            //Para Firefox es necesario retrasar la revocación del objectURL
            window.URL.revokeObjectURL(data);
            link.remove();
          }, 100);
        }

      },
      err => {
        swal.fire('Información', 'Error inesperado, por favor contáctese con soporte.', 'error');
      }
    );
  }

  /**Obtiene el IGV para Salud y el IGV x Derecho de emisión para Pensión */
  getIGVData() {
    this.isLoading = true;

    let health: any = {};
    health.P_NBRANCH = 1;
    health.P_NPRODUCT = JSON.parse(localStorage.getItem("saludID"))["id"];
    health.P_TIPO_REC = "A";

    let pension: any = {};
    pension.P_NBRANCH = 1;
    pension.P_NPRODUCT = JSON.parse(localStorage.getItem("pensionID"))["id"];
    pension.P_TIPO_REC = "A";

    forkJoin(
      this.quotationService.getIGV(pension),
      this.quotationService.getIGV(health)
    ).subscribe(
      (res: any) => {
        this.pensionIGV = res[0];
        this.healthIGV = res[1];

        this.getQuotationData();
      },
      error => {
        this.isLoading = false;
        swal.fire("Información", this.genericServerErrorMessage, "error");
      });
  }

  /**
   * Obtiene una lista de estados de cotización
   */
  getStatusList() {
    this.quotationService.getStatusList("2").subscribe(
      res => {
        res.forEach(element => {
          if (element.Id == "1" || element.Id == "2" || element.Id == "3") this.statusList.push(element);
        });
      },
      error => {

      }
    );
  }
  // /**
  //  * Obtiene una lista de motivos por estado escogido
  //  */
  // getReasonList() {
  //   this.quotationService.getReasonList(this.mainFormGroup.controls.status.value).subscribe(
  //     res => {

  //       this.reasonList = res;
  //     },
  //     error => {

  //     }
  //   );
  // }


  /**
   * Obtiene el monto de planilla según el tipo de riesgo
   * @param riskTypeId id de tipo de riesgo
   */
  getPayrollAmount(riskTypeId: string) {
    let payRollAmount;
    this.InputsQuotation.SharedDetailsList.forEach(element => {
      if (element.RiskTypeId == riskTypeId) payRollAmount = element.PayrollAmount;
    });
    return payRollAmount;
  }

  /**
   * Calcula la prima
   * @param payrollAmount monto de planilla
   * @param rate tasa
   */
  calculatePremium(payrollAmount: number, rate: number) {
    // return parseFloat(payrollAmount.toString()) * parseFloat(rate.toString());
    return parseFloat(payrollAmount.toString()) * parseFloat(rate.toString()) / 100;
  }

  /**
   * Calcula la nueva prima según la tasa autorizada ingresada
   * Calcula la nueva prima total neta, IGV a la prima neta y la prima total bruta.
   * @param authorizedRate valor de ngModel de tasa autorizada
   * @param riskTypeId - Id de tipo de riesgo
   * @param productId Id de producto
   */
  calculateNewPremiums(authorizedRate: any, riskTypeId: string, productId: string) {
    if (isNaN(authorizedRate) || authorizedRate.toString().trim() == "") authorizedRate = 0; //Si el input está limpio, lo convertimos a 0

    let newPremium = this.FormatValue(this.calculatePremium(this.getPayrollAmount(riskTypeId), authorizedRate)); //cálculo de prima nueva con la tasa autorizada
    if (productId == JSON.parse(localStorage.getItem("pensionID"))["id"]) { //Si el producto es pensión
      let pensionNewNetAmount = 0.00; //nueva prima total neta de Pensión, con la tasa autorizada
      this.InputsQuotation.PensionDetailsList.forEach((element, key) => {
        if (element.RiskTypeId == riskTypeId) {
          this.InputsQuotation.PensionDetailsList[key].NewPremium = newPremium;
          pensionNewNetAmount = parseFloat(pensionNewNetAmount.toString()) + parseFloat(newPremium.toString());
        } else pensionNewNetAmount = parseFloat(pensionNewNetAmount.toString()) + parseFloat(element.NewPremium.toString());

      });
      //Cálculo de nueva prima total neta de Pensión
      this.InputsQuotation.PensionNewNetAmount = this.FormatValue(pensionNewNetAmount);
      //Cálculo de IGV de la nueva prima total neta de Pensión
      this.InputsQuotation.PensionNewCalculatedIGV = this.FormatValue((this.InputsQuotation.PensionNewNetAmount * this.pensionIGV) - this.InputsQuotation.PensionNewNetAmount);
      //Cálculo de nueva prima total bruta de Pensión
      this.InputsQuotation.PensionNewGrossAmount = this.FormatValue(parseFloat(this.InputsQuotation.PensionNewCalculatedIGV) + parseFloat(this.InputsQuotation.PensionNewNetAmount));

      this.checkMinimunPremiumForAuthorizedAmounts(this.pensionProductId);
    }

    if (productId == JSON.parse(localStorage.getItem("saludID"))["id"]) { //Si el producto es Salud
      let saludNewNetAmount = 0.00; //prima prima total neta de Salud, según la tasa autorizada
      this.InputsQuotation.SaludDetailsList.forEach((element, key) => {
        if (element.RiskTypeId == riskTypeId) {
          this.InputsQuotation.SaludDetailsList[key].NewPremium = newPremium;
          saludNewNetAmount = parseFloat(saludNewNetAmount.toString()) + parseFloat(newPremium.toString());
        } else saludNewNetAmount = parseFloat(saludNewNetAmount.toString()) + parseFloat(element.NewPremium.toString());
      });
      //Cálculo de nueva prima total neta de Salud
      this.InputsQuotation.SaludNewNetAmount = this.FormatValue(saludNewNetAmount);
      //Cálculo de IGV de la nueva prima total neta de Salud
      this.InputsQuotation.SaludNewCalculatedIGV = this.FormatValue((this.InputsQuotation.SaludNewNetAmount * this.healthIGV) - this.InputsQuotation.SaludNewNetAmount);
      //Cálculo de nueva prima total bruta de Salud
      this.InputsQuotation.SaludNewGrossAmount = this.FormatValue(parseFloat(this.InputsQuotation.SaludNewCalculatedIGV) + parseFloat(this.InputsQuotation.SaludNewNetAmount));

      this.checkMinimunPremiumForAuthorizedAmounts(this.healthProductId);
    }
  }
  /**
   * Calcula la prima según la tasa propuesta ingresada
   * Calcula la prima total neta, IGV a la prima neta y la prima total bruta.
   * @param rate valor de ngModel de tasa propuesta
   * @param riskTypeId - Id de tipo de riesgo
   * @param productId Id de producto
   */
  calculatePremiums(rate: any, riskTypeId: string, productId: string) {
    if (isNaN(rate) || rate.toString().trim() == "") rate = 0; //Si el input está limpio, lo convertimos a 0

    let newPremium = this.FormatValue(this.calculatePremium(this.getPayrollAmount(riskTypeId), rate)); //cálculo de prima nueva con la tasa autorizada
    if (productId == JSON.parse(localStorage.getItem("pensionID"))["id"]) { //Si el producto es pensión
      let pensionTotalNetAmount = 0.00; //nueva prima total neta de Pensión, con la tasa autorizada
      this.InputsQuotation.PensionDetailsList.forEach((element, key) => {
        if (element.RiskTypeId == riskTypeId) {
          this.InputsQuotation.PensionDetailsList[key].Premium = newPremium;
          pensionTotalNetAmount = parseFloat(pensionTotalNetAmount.toString()) + parseFloat(newPremium.toString());
        } else pensionTotalNetAmount = parseFloat(pensionTotalNetAmount.toString()) + parseFloat(element.NewPremium.toString());

      });
      //Cálculo de nueva prima total neta de Pensión
      this.InputsQuotation.PensionNetAmount = this.FormatValue(pensionTotalNetAmount);
      //Cálculo de IGV de la nueva prima total neta de Pensión
      this.InputsQuotation.PensionCalculatedIGV = this.FormatValue((this.InputsQuotation.PensionNetAmount * this.pensionIGV) - this.InputsQuotation.PensionNetAmount);
      //Cálculo de nueva prima total bruta de Pensión
      this.InputsQuotation.PensionGrossAmount = this.FormatValue(parseFloat(this.InputsQuotation.PensionCalculatedIGV) + parseFloat(this.InputsQuotation.PensionNetAmount));
    }
    if (productId == JSON.parse(localStorage.getItem("saludID"))["id"]) { //Si el producto es Salud
      let saludTotalNetAmount = 0.00; //prima prima total neta de Salud, según la tasa autorizada
      this.InputsQuotation.SaludDetailsList.forEach((element, key) => {
        if (element.RiskTypeId == riskTypeId) {
          this.InputsQuotation.SaludDetailsList[key].Premium = newPremium;
          saludTotalNetAmount = parseFloat(saludTotalNetAmount.toString()) + parseFloat(newPremium.toString());
        } else saludTotalNetAmount = parseFloat(saludTotalNetAmount.toString()) + parseFloat(element.NewPremium.toString());
      });
      //Cálculo de nueva prima total neta de Salud
      this.InputsQuotation.SaludNetAmount = this.FormatValue(saludTotalNetAmount);
      //Cálculo de IGV de la nueva prima total neta de Salud
      this.InputsQuotation.SaludCalculatedIGV = this.FormatValue((this.InputsQuotation.SaludNetAmount * this.healthIGV) - this.InputsQuotation.SaludNetAmount);
      //Cálculo de nueva prima total bruta de Salud
      this.InputsQuotation.SaludGrossAmount = this.FormatValue(parseFloat(this.InputsQuotation.SaludCalculatedIGV) + parseFloat(this.InputsQuotation.SaludNetAmount));
    }

    if (parseFloat(this.InputsQuotation.SaludNetAmount) < parseFloat(this.InputsQuotation.SaludMinPremium)) {
      this.isNetPremiumLessThanMinHealthPremium = true;
      let premium = (this.InputsQuotation.SaludPropMinPremium != null && this.InputsQuotation.SaludPropMinPremium !== undefined && parseFloat(this.InputsQuotation.SaludPropMinPremium) > 0) ? this.InputsQuotation.SaludPropMinPremium : this.InputsQuotation.SaludMinPremium;
      this.healthMessage = "El monto calculado no supera la prima mínima, la cotización se generará con el siguiente monto S /. " + premium * this.healthIGV;
    } else {
      this.isNetPremiumLessThanMinHealthPremium = false;
      this.healthMessage = "";
    }

    if (parseFloat(this.InputsQuotation.PensionNetAmount) < parseFloat(this.InputsQuotation.PensionMinPremium)) {
      this.isNetPremiumLessThanMinPensionPremium = true;
      let premium = (this.InputsQuotation.PensionPropMinPremium != null && this.InputsQuotation.PensionPropMinPremium !== undefined && parseFloat(this.InputsQuotation.PensionPropMinPremium) > 0) ? this.InputsQuotation.PensionPropMinPremium : this.InputsQuotation.PensionMinPremium;
      this.pensionMessage = "El monto calculado no supera la prima mínima, la cotización se generará con el siguiente monto S /. " + premium * this.pensionIGV;
    } else {
      this.isNetPremiumLessThanMinPensionPremium = false;
      this.pensionMessage = "";
    }

  }
  /**
   * Obtener los datos de la cotización, para ello se llama a 3 procedimientos
   * getPolicyEmitCab: Obtiene los datos principales de cotización, cliente, sede.
   * getPolicyEmitComer: Obtiene los brokers incluidos en la cotización
   * getPolicyEmitDet: Obtiene detalles de la cotización como montos de planilla, total de trabajadores, primas, tasas según producto y riesgo
   */
  getQuotationData() {  //Obtener datos de cotización: cabecera, brokers y detalles.
    this.isLoading = true;
    let self = this;

    forkJoin(this.policyService.getPolicyEmitCab(this.quotationNumber, this.typeTransac, JSON.parse(localStorage.getItem("currentUser"))["id"]),
      this.policyService.getPolicyEmitComer(this.quotationNumber),
      this.policyService.getPolicyEmitDetTX(this.nroProcess, this.typeTransac, JSON.parse(localStorage.getItem("currentUser"))["id"]),
      this.policyService.getPolicyCot(this.quotationNumber)).subscribe(
        (res: any) => {
          if (res[0].GenericResponse == null || res[1].length == 0 || res[2].length == 0) { //Verificamos si todos los datos de las 3 peticiones han sido obtenidos
            swal.fire("Información", "No se encontraron los datos necesarios para esta cotización. " + this.redirectionMessage, "error");
            this.router.navigate(['/broker/request-status']);
          } else {
            if (res[0].StatusCode == 2) {
              swal.fire("Información", this.listToString(res[0].ErrorMessageList), "warning");
            }
            //Datos de cotización
            this.InputsQuotation.Date = res[0].GenericResponse.FECHA; //

            //Datos de contratante
            this.InputsQuotation.DocumentTypeId = res[0].GenericResponse.TIPO_DOCUMENTO;
            this.InputsQuotation.DocumentTypeName = res[0].GenericResponse.TIPO_DES_DOCUMENTO;
            this.InputsQuotation.DocumentNumber = res[0].GenericResponse.NUM_DOCUMENTO;
            this.InputsQuotation.P_SNOMBRES = res[0].GenericResponse.NOMBRE_RAZON;
            this.InputsQuotation.P_SDESDIREBUSQ = res[0].GenericResponse.DIRECCION;
            this.InputsQuotation.P_SE_MAIL = res[0].GenericResponse.CORREO;

            //Datos de cotización - sede
            this.InputsQuotation.CurrencyId = res[0].GenericResponse.COD_MONEDA;
            this.InputsQuotation.CurrencyName = res[0].GenericResponse.DES_MONEDA;
            this.InputsQuotation.LocationId = res[0].GenericResponse.COD_TIPO_SEDE;
            this.InputsQuotation.LocationName = res[0].GenericResponse.DES_TIPO_SEDE;

            this.InputsQuotation.EconomicActivityId = res[0].GenericResponse.COD_ACT_ECONOMICA;
            this.InputsQuotation.EconomicActivityName = res[0].GenericResponse.DES_ACT_ECONOMICA;
            this.InputsQuotation.TechnicalActivityId = res[0].GenericResponse.ACT_TECNICA;
            this.InputsQuotation.TechnicalActivityName = res[0].GenericResponse.DES_ACT_TECNICA;
            this.InputsQuotation.HasDelimiter = parseInt(res[0].GenericResponse.DELIMITACION) == 0 ? false : true;
            this.InputsQuotation.IsMining = parseInt(res[0].GenericResponse.MINA) == 0 ? false : true;
            this.InputsQuotation.DepartmentId = res[0].GenericResponse.COD_DEPARTAMENTO;
            this.InputsQuotation.DepartmentName = res[0].GenericResponse.DES_DEPARTAMENTO;
            this.InputsQuotation.ProvinceId = res[0].GenericResponse.COD_PROVINCIA;
            this.InputsQuotation.ProvinceName = res[0].GenericResponse.DES_PROVINCIA;
            this.InputsQuotation.DistrictId = res[0].GenericResponse.COD_DISTRITO;
            this.InputsQuotation.DistrictName = res[0].GenericResponse.DES_DISTRITO;

            this.InputsQuotation.Comment = res[0].GenericResponse.COMENTARIO;
            this.InputsQuotation.FilePathList = res[0].GenericResponse.RUTAS;

            this.InputsQuotation.SaludPropMinPremium = res[0].GenericResponse.MIN_SALUD_PR;
            this.originalHealthMinPropPremium = res[0].GenericResponse.MIN_SALUD_PR;
            this.InputsQuotation.HealthAuthMinPremium = res[0].GenericResponse.MIN_SALUD_AUT;
            this.originalHealthMinAuthPremium = this.InputsQuotation.HealthAuthMinPremium;
            this.InputsQuotation.SaludMinPremium = res[0].GenericResponse.MIN_SALUD;
            this.InputsQuotation.PensionPropMinPremium = res[0].GenericResponse.MIN_PENSION_PR;
            this.originalPensionMinPropPremium = res[0].GenericResponse.MIN_PENSION_PR;
            this.InputsQuotation.PensionMinPremium = res[0].GenericResponse.MIN_PENSION;
            this.InputsQuotation.PensionAuthMinPremium = res[0].GenericResponse.MIN_PENSION_AUT;
            this.originalPensionMinAuthPremium = this.InputsQuotation.PensionAuthMinPremium;

            //Datos de brokers
            this.InputsQuotation.SecondaryBrokerList = [];
            res[1].forEach(item => {
              item.COMISION_SALUD_PRO = CommonMethods.ConvertToReadableNumber(item.COMISION_SALUD_PRO);
              item.COMISION_PENSION_PRO = CommonMethods.ConvertToReadableNumber(item.COMISION_PENSION_PRO);
              item.COMISION_SALUD_AUT = CommonMethods.ConvertToReadableNumber(item.COMISION_SALUD_AUT);
              item.COMISION_PENSION_AUT = CommonMethods.ConvertToReadableNumber(item.COMISION_PENSION_AUT);
              item.COMISION_SALUD = CommonMethods.ConvertToReadableNumber(item.COMISION_SALUD);
              item.COMISION_PENSION = CommonMethods.ConvertToReadableNumber(item.COMISION_PENSION);

              item.OriginalHealthPropCommission = item.COMISION_SALUD_PRO;
              item.OriginalPensionPropCommission = item.COMISION_PENSION_PRO;
              item.OriginalHealthAuthCommission = item.COMISION_SALUD_AUT;
              item.OriginalPensionAuthCommission = item.COMISION_PENSION_AUT;
              self.InputsQuotation.SecondaryBrokerList.push(item);
            });

            //Detalles de cotización
            this.InputsQuotation.SharedDetailsList = []; //Lista compartida que contiene Nro de trabajadores y Monto de planilla
            this.InputsQuotation.PensionDetailsList = []; //Lista de detalles de Pensión, cada registro contiene: riesgo, tasa, prima, tasa propuesta
            this.InputsQuotation.SaludDetailsList = []; //Lista de detalles de Salud, cada registro contiene: riesgo, tasa, prima, tasa propuesta

            this.InputsQuotation.SaludNetAmount = 0.00; //Prima total neta de Salud
            this.InputsQuotation.SaludGrossAmount = 0.00; //Prima total bruta de Salud
            this.InputsQuotation.SaludCalculatedIGV = 0.00; //Igv de prima total neta de Salud

            this.InputsQuotation.PensionNetAmount = 0.00; //Prima total neta de Pensión
            this.InputsQuotation.PensionGrossAmount = 0.00; //Prima total bruta de Pensión
            this.InputsQuotation.PensionCalculatedIGV = 0.00; //Igv de prima total neta de Pensión

            this.InputsQuotation.SaludNewNetAmount = 0.00;  //Nueva Prima total neta de Salud, correspondiente a las primas nuevas generadas por tasas autorizadas
            this.InputsQuotation.SaludNewGrossAmount = 0.00;  //Nueva Prima total bruta de Salud, correspondiente a las primas nuevas generadas por tasas autorizadas
            this.InputsQuotation.SaludNewCalculatedIGV = 0.00;  //Nuevo Igv de prima total neta de Salud, correspondiente a las primas nuevas generadas por tasas autorizadas

            this.InputsQuotation.PensionNewNetAmount = 0.00;  //Nueva Prima total neta de Pensión, correspondiente a las primas nuevas generadas por tasas autorizadas
            this.InputsQuotation.PensionNewGrossAmount = 0.00;  //Nueva Prima total bruta de Pensión, correspondiente a las primas nuevas generadas por tasas autorizadas
            this.InputsQuotation.PensionNewCalculatedIGV = 0.00;  //Nuevo Igv de prima total neta de Pensión, correspondiente a las primas nuevas generadas por tasas autorizadas

            res[2].forEach(element => {
              if (element.ID_PRODUCTO == JSON.parse(localStorage.getItem("pensionID"))["id"]) { //Si es un elemento de pensión
                let item: any = {};
                item.RiskRate = element.TASA_RIESGO;
                item.RiskTypeId = element.TIP_RIESGO; //Id tipo de riesgo
                item.RiskTypeName = element.DES_RIESGO; //Nombre de tipo de riesgo
                item.Rate = element.TASA_CALC;  //Tasa
                item.Premium = element.PRIMA; //Prima
                item.ProposedRate = element.TASA_PRO; //Tasa propuesta
                item.OriginalProposedRate = element.TASA_PRO; //Tasa propuesta original
                item.OriginalAuthorizedRate = element.TASA; //tasa autorizada original
                item.AuthorizedRate = element.TASA;
                item.NewPremium = element.AUT_PRIMA;
                item.EndorsmentPremium = element.PRIMA_END; //Prima de endoso
                item.Discount = element.DESCUENTO; //Descuento
                item.Variation = element.VARIACION_TASA; //Variación de la tasa

                self.InputsQuotation.PensionDetailsList.push(item);
                self.InputsQuotation.PensionNewNetAmount = self.FormatValue(parseFloat(self.InputsQuotation.PensionNewNetAmount) + parseFloat(element.AUT_PRIMA));

                self.InputsQuotation.PensionNetAmount = element.NSUM_PREMIUMN;
                self.InputsQuotation.PensionCalculatedIGV = element.NSUM_IGV;
                self.InputsQuotation.PensionGrossAmount = element.NSUM_PREMIUM;

                item.WorkersCount = element.NUM_TRABAJADORES;
                item.PayrollAmount = element.MONTO_PLANILLA;
              }
              if (element.ID_PRODUCTO == JSON.parse(localStorage.getItem("saludID"))["id"]) { //Si es un elemento de pensión
                let item: any = {};
                item.RiskRate = element.TASA_RIESGO;
                item.RiskTypeId = element.TIP_RIESGO; //Id tipo de riesgo
                item.RiskTypeName = element.DES_RIESGO; //Nombre de tipo de riesgo
                item.Rate = element.TASA_CALC;  //Tasa
                item.Premium = element.PRIMA; //Prima
                item.ProposedRate = element.TASA_PRO; //Tasa propuesta
                item.OriginalProposedRate = element.TASA_PRO; //Tasa propuesta original
                item.OriginalAuthorizedRate = element.TASA; //tasa autorizada original
                item.AuthorizedRate = element.TASA; //tasa autorizada
                item.NewPremium = element.AUT_PRIMA //Nueva prima calculada con la nueva tasa autorizada
                item.EndorsmentPremium = element.PRIMA_END; //Prima de endoso
                item.Discount = element.DESCUENTO; //Descuento
                item.Variation = element.VARIACION_TASA; //Variación de la tasa

                self.InputsQuotation.SaludDetailsList.push(item);
                self.InputsQuotation.SaludNewNetAmount = self.FormatValue(parseFloat(self.InputsQuotation.SaludNewNetAmount) + parseFloat(element.AUT_PRIMA));

                self.InputsQuotation.SaludNetAmount = element.NSUM_PREMIUMN;
                self.InputsQuotation.SaludCalculatedIGV = element.NSUM_IGV;
                self.InputsQuotation.SaludGrossAmount = element.NSUM_PREMIUM;

                item.WorkersCount = element.NUM_TRABAJADORES;
                item.PayrollAmount = element.MONTO_PLANILLA;
              }

              let add = true;
              self.InputsQuotation.SharedDetailsList.forEach(subelement => {
                if (subelement.RiskTypeId == element.TIP_RIESGO) add = false;
              });
              if (add == true) self.InputsQuotation.SharedDetailsList.push({ "RiskTypeId": element.TIP_RIESGO, "RiskTypeName": element.DES_RIESGO, "WorkersCount": element.NUM_TRABAJADORES, "PayrollAmount": element.MONTO_PLANILLA });
            });
            this.InputsQuotation.tipoRenovacion = res[3][0].TIP_RENOV;
            this.InputsQuotation.frecuenciaPago = res[3][0].FREC_PAGO;
            this.InputsQuotation.desde = new Date(res[3][0].DESDE);
            this.InputsQuotation.hasta = new Date(res[3][0].HASTA);
            this.InputsQuotation.facturacionVencido = res[3][0].FACT_MES_VENC == 0 ? false : true;
            this.InputsQuotation.facturacionAnticipada = res[3][0].FACT_ANTI == 0 ? false : true;
            this.cargarFrecuencia();

            this.InputsQuotation.PensionNewCalculatedIGV = this.FormatValue((this.InputsQuotation.PensionNewNetAmount * this.pensionIGV) - this.InputsQuotation.PensionNewNetAmount);
            this.InputsQuotation.PensionNewGrossAmount = this.FormatValue(parseFloat(this.InputsQuotation.PensionNewCalculatedIGV) + parseFloat(this.InputsQuotation.PensionNewNetAmount));

            this.InputsQuotation.SaludNewCalculatedIGV = this.FormatValue((this.InputsQuotation.SaludNewNetAmount * this.healthIGV) - this.InputsQuotation.SaludNewNetAmount);
            this.InputsQuotation.SaludNewGrossAmount = this.FormatValue(parseFloat(this.InputsQuotation.SaludNewCalculatedIGV) + parseFloat(this.InputsQuotation.SaludNewNetAmount));

            this.InputsQuotation.SharedDetailsList.sort(function (obj1, obj2) { //ordenamos según el riesgo
              return obj2.RiskTypeId - obj1.RiskTypeId;
            });
            this.InputsQuotation.PensionDetailsList.sort(function (obj1, obj2) { //ordenamos según el riesgo
              return obj2.RiskTypeId - obj1.RiskTypeId;
            });
            this.InputsQuotation.SaludDetailsList.sort(function (obj1, obj2) {  //ordenamos según el riesgo
              return obj2.RiskTypeId - obj1.RiskTypeId;
            });

            if (this.mode == "recotizar") {
              this.checkMinimunPremiumForOriginals(this.healthProductId);
              this.checkMinimunPremiumForOriginals(this.pensionProductId);
            } else {
              this.checkMinimunPremiumForAuthorizedAmounts(this.healthProductId);
              this.checkMinimunPremiumForAuthorizedAmounts(this.pensionProductId);
            }

          }


          this.isLoading = false;
        },
        (error) => {
          this.isLoading = false;
          swal.fire("Información", this.genericServerErrorMessage + " " + this.redirectionMessage, "error");
          this.router.navigate(['/broker/request-status']);
        }
      );
  }

  /**
   * Calcula la primas neta total, IGV de prima neta total y la prima bruta total para las tasas autorizadas y primas mínimas autorizadas por producto 
   * @param productId Id de producto
   */
  checkMinimunPremiumForAuthorizedAmounts(productId: string) {
    if (productId == this.healthProductId) {
      this.InputsQuotation.HealthAuthMinPremium = CommonMethods.ConvertToReadableNumber(this.InputsQuotation.HealthAuthMinPremium);
      let NetPremium = 0;
      this.InputsQuotation.SaludDetailsList.map(function (item) {
        NetPremium = NetPremium + parseFloat(item.NewPremium);
      });

      if (NetPremium < this.InputsQuotation.HealthAuthMinPremium) {
        this.InputsQuotation.SaludNewNetAmount = this.InputsQuotation.HealthAuthMinPremium;
        this.healthMessage = "El monto calculado no supera la prima mínima, la cotización se generará con el siguiente monto S /. " + this.FormatValue(this.InputsQuotation.HealthAuthMinPremium * this.healthIGV);
      } else {
        this.InputsQuotation.SaludNewNetAmount = NetPremium;
        this.healthMessage = "";
      }
      this.InputsQuotation.SaludNewCalculatedIGV = this.FormatValue((this.InputsQuotation.SaludNewNetAmount * parseFloat(this.healthIGV.toString())) - this.InputsQuotation.SaludNewNetAmount);
      this.InputsQuotation.SaludNewGrossAmount = this.FormatValue(parseFloat(this.InputsQuotation.SaludNewCalculatedIGV) + parseFloat(this.InputsQuotation.SaludNewNetAmount));

    } else if (productId == this.pensionProductId) {
      this.InputsQuotation.PensionAuthMinPremium = CommonMethods.ConvertToReadableNumber(this.InputsQuotation.PensionAuthMinPremium);
      let NetPremium = 0;
      this.InputsQuotation.PensionDetailsList.map(function (item) {
        NetPremium = NetPremium + parseFloat(item.NewPremium);
      });
      if (NetPremium < this.InputsQuotation.PensionAuthMinPremium) {
        this.InputsQuotation.PensionNewNetAmount = this.InputsQuotation.PensionAuthMinPremium;
        this.pensionMessage = "El monto calculado no supera la prima mínima, la cotización se generará con el siguiente monto S /. " + this.FormatValue(this.InputsQuotation.PensionAuthMinPremium * this.pensionIGV);
      } else {
        this.InputsQuotation.PensionNewNetAmount = NetPremium;
        this.pensionMessage = "";
      }
      this.InputsQuotation.PensionNewCalculatedIGV = this.FormatValue((this.InputsQuotation.PensionNewNetAmount * parseFloat(this.pensionIGV.toString())) - this.InputsQuotation.PensionNewNetAmount);
      //Cálculo de nueva prima total bruta de Pensión
      this.InputsQuotation.PensionNewGrossAmount = this.FormatValue(parseFloat(this.InputsQuotation.PensionNewCalculatedIGV) + parseFloat(this.InputsQuotation.PensionNewNetAmount));
    }
  }
  checkMinimunPremiumForOriginals(productId: string) {
    if (productId == this.healthProductId) {
      let healthPremiumToBeCompared = (this.InputsQuotation.SaludPropMinPremium != null && this.InputsQuotation.SaludPropMinPremium !== undefined && parseFloat(this.InputsQuotation.SaludPropMinPremium) > 0) ? this.InputsQuotation.SaludPropMinPremium : this.InputsQuotation.SaludMinPremium;
      let originalNetPremium = 0;
      this.InputsQuotation.SaludDetailsList.map(function (item) {
        originalNetPremium = originalNetPremium + parseFloat(item.Premium);
      });

      if (originalNetPremium < healthPremiumToBeCompared) { //Si hay tasa propuesta
        this.isNetPremiumLessThanMinHealthPremium = true;
        //Cálculo de nueva prima total neta de Salud
        this.InputsQuotation.SaludNetAmount = healthPremiumToBeCompared;
        this.healthMessage = "El monto calculado no supera la prima mínima, la cotización se generará con el siguiente monto S /. " + this.FormatValue(healthPremiumToBeCompared * this.healthIGV);
      } else {
        this.isNetPremiumLessThanMinHealthPremium = false;
        //Cálculo de nueva prima total neta de Salud
        this.InputsQuotation.SaludNetAmount = originalNetPremium;
        this.healthMessage = "";
      }
      //Cálculo de IGV de la nueva prima total neta de Salud
      this.InputsQuotation.SaludCalculatedIGV = this.FormatValue((this.InputsQuotation.SaludNetAmount * parseFloat(this.healthIGV.toString())) - this.InputsQuotation.SaludNetAmount);
      //Cálculo de nueva prima total bruta de Salud
      this.InputsQuotation.SaludGrossAmount = this.FormatValue(parseFloat(this.InputsQuotation.SaludCalculatedIGV) + parseFloat(this.InputsQuotation.SaludNetAmount));

    } else if (productId == this.pensionProductId) {
      let pensionPremiumToBeCompared = (this.InputsQuotation.PensionPropMinPremium != null && this.InputsQuotation.PensionPropMinPremium !== undefined && parseFloat(this.InputsQuotation.PensionPropMinPremium) > 0) ? this.InputsQuotation.PensionPropMinPremium : this.InputsQuotation.PensionMinPremium;
      let originalNetPremium = 0;
      this.InputsQuotation.PensionDetailsList.map(function (item) {
        originalNetPremium = originalNetPremium + parseFloat(item.Premium);
      });
      if (originalNetPremium < pensionPremiumToBeCompared) {
        this.isNetPremiumLessThanMinPensionPremium = true;
        //Cálculo de nueva prima total neta de Pensión
        this.InputsQuotation.PensionNetAmount = pensionPremiumToBeCompared;
        this.pensionMessage = "El monto calculado no supera la prima mínima, la cotización se generará con el siguiente monto S /. " + this.FormatValue(pensionPremiumToBeCompared * this.pensionIGV);
      } else {
        this.isNetPremiumLessThanMinPensionPremium = false;
        this.InputsQuotation.PensionNetAmount = originalNetPremium;
        this.pensionMessage = "";
      }
      //Cálculo de IGV de la nueva prima total neta de Pensión
      this.InputsQuotation.PensionCalculatedIGV = this.FormatValue((this.InputsQuotation.PensionNetAmount * parseFloat(this.pensionIGV.toString())) - this.InputsQuotation.PensionNetAmount);
      //Cálculo de nueva prima total bruta de Pensión
      this.InputsQuotation.PensionGrossAmount = this.FormatValue(parseFloat(this.InputsQuotation.PensionCalculatedIGV) + parseFloat(this.InputsQuotation.PensionNetAmount));
    }
  }

  /**
   * Convierte una lista en un texto html para ser mostrado en los pop-up de alerta
   * @param list lista ingresada
   * @returns  string en html
   */
  listToString(list: String[]): string {
    let output = "";
    if (list != null) {
      list.forEach(function (item) {
        output = output + item + " <br>"
      });
    }
    return output;
  }

  /**
   * Convierte a número con 2 decimales, si no es un número devuelve el mismo valor
   * @param valor valor ingresado
   */
  FormatValue(valor) {
    return isNaN(valor) ? valor : parseFloat(valor).toFixed(2);
  }

  /**
   * Envia la petición de cambio de estado de la cotización e inserción de tasas autorizadas con las primas autorizadas
   */
  AddStatusChange() {
    let errorList = this.areAuthorizedRatesValid();
    // errorList = errorList.concat(this.validateAuthorizedCommmissions());
    // errorList = errorList.concat(this.validateAuthorizedPremiums());
    if (this.mainFormGroup.valid == true && (errorList == null || errorList.length == 0)) {
      // console.log("ada")
      let self = this;
      this.isLoading = true;
      // let formData = new FormData();
      // this.files.forEach(function (file) { //anexamos todos los archivos al formData
      //   formData.append(file.name, file, file.name)
      // });

      // this.statusChangeRequest.QuotationNumber = this.quotationNumber;  //Número de cotización
      // this.statusChangeRequest.Status = this.mainFormGroup.controls.status.value; //Nuevo estado
      // this.statusChangeRequest.Reason = this.mainFormGroup.controls.reason.value; //Motivo
      // this.statusChangeRequest.Comment = this.mainFormGroup.controls.comment.value; //Comentario
      // this.statusChangeRequest.User = JSON.parse(localStorage.getItem("currentUser"))["id"];  //Usuario


      // //Preparación de tasas autorizadas y primas recalculadas a enviar
      // self.statusChangeRequest.saludAuthorizedRateList = [];
      // self.statusChangeRequest.pensionAuthorizedRateList = [];
      // this.statusChangeRequest.BrokerList = [];

      // this.InputsQuotation.SecondaryBrokerList.forEach(element => {
      //   let item = new Broker();
      //   item.Id = element.CANAL;
      //   item.ProductList = [];
      //   if (self.InputsQuotation.PensionDetailsList != null && self.InputsQuotation.PensionDetailsList.length > 0) {
      //     let obj = new BrokerProduct();
      //     obj.Product = self.pensionProductId;
      //     obj.AuthorizedCommission = element.COMISION_PENSION_AUT;
      //     item.ProductList.push(obj);
      //   }
      //   if (self.InputsQuotation.SaludDetailsList != null && self.InputsQuotation.SaludDetailsList.length > 0) {
      //     let obj = new BrokerProduct();
      //     obj.Product = self.healthProductId;
      //     obj.AuthorizedCommission = element.COMISION_SALUD_AUT;
      //     item.ProductList.push(obj);
      //   }
      //   self.statusChangeRequest.BrokerList.push(item);
      // });

      // this.InputsQuotation.PensionDetailsList.forEach((element) => {
      //   let item = new AuthorizedRate();
      //   item.ProductId = JSON.parse(localStorage.getItem("pensionID"))["id"];
      //   item.RiskTypeId = element.RiskTypeId;
      //   item.AuthorizedRate = element.AuthorizedRate;
      //   item.AuthorizedPremium = element.NewPremium;
      //   item.AuthorizedMinimunPremium = self.InputsQuotation.PensionAuthMinPremium;

      //   self.statusChangeRequest.pensionAuthorizedRateList.push(item);
      // });
      // this.InputsQuotation.SaludDetailsList.forEach((element) => {
      //   let item = new AuthorizedRate();
      //   item.ProductId = JSON.parse(localStorage.getItem("saludID"))["id"];
      //   item.RiskTypeId = element.RiskTypeId;
      //   item.AuthorizedRate = element.AuthorizedRate;
      //   item.AuthorizedPremium = element.NewPremium;
      //   item.AuthorizedMinimunPremium = self.InputsQuotation.HealthAuthMinPremium;

      //   self.statusChangeRequest.saludAuthorizedRateList.push(item);
      // });

      // formData.append("statusChangeData", JSON.stringify(this.statusChangeRequest));

      let savedPolicy: any = {};
      savedPolicy.P_NID_COTIZACION = this.quotationNumber
      savedPolicy.P_NUSERCODE = JSON.parse(localStorage.getItem("currentUser"))["id"]
      savedPolicy.P_NTYPE_TRANSAC = this.typeTransac
      savedPolicy.P_NID_PROC = this.nroProcess
      savedPolicy.P_SCOMMENT = this.mainFormGroup.controls.comment.value == "" ? "" : this.mainFormGroup.controls.comment.value.toUpperCase(); //Comentario
      savedPolicy.P_SASIGNAR = "A"
      savedPolicy.P_SAPROBADO = this.mainFormGroup.controls.status.value == 2 ? "A" : "R"
      // console.log(savedPolicy)
      // this.isLoading = false;
      // return
      this.policyService.savedPolicyTransac(savedPolicy).subscribe(
        res => {
          if (res.P_NCODE == 0) {
            swal.fire("Información", "Operación exitosa.", "success");
            this.router.navigate(['/broker/policy-request']);
          } else if (res.P_NCODE == 1) { //Error de validación
            swal.fire("Información", this.listToString(res.ErrorMessageList), "error");
          } else {  //Error no controlado en el servicio
            swal.fire("Información", this.genericServerErrorMessage, "error");  //Use las herramientas de desarrollador de su navegador para ver el error en esta petición peticiones
          }
          this.isLoading = false;
        },
        err => {
          swal.fire("Información", this.genericServerErrorMessage, "error");  //Use las herramientas de desarrollador de su navegador para ver el error en esta petición peticiones
          this.isLoading = false;
        }
      );
    } else {

      if (this.mainFormGroup.controls.status.hasError('required')) errorList.push("El estado es obligatorio.");
      swal.fire("Información", this.listToString(errorList), "error");
    }

  }

  /**Modificar cotización | recotizar */
  // modifyQuotation() {
  //   let errorList = this.areProposedRatesValid();
  //   if (errorList == null || errorList.length == 0) {
  //     let self = this;
  //     let quotation = new QuotationModification();
  //     quotation.Number = this.quotationNumber;
  //     quotation.Branch = "1";
  //     quotation.User = JSON.parse(localStorage.getItem("currentUser"))["id"];

  //     this.statusChangeRequest.QuotationNumber = this.quotationNumber;  //Número de cotización
  //     this.statusChangeRequest.Status = "1"; //Nuevo estado
  //     this.statusChangeRequest.Reason = null; //Motivo
  //     this.statusChangeRequest.Comment = this.mainFormGroup.controls.comment.value; //Comentario
  //     this.statusChangeRequest.User = JSON.parse(localStorage.getItem("currentUser"))["id"];  //Usuario

  //     quotation.StatusChangeData = this.statusChangeRequest;
  //     quotation.RiskList = [];
  //     this.InputsQuotation.PensionDetailsList.forEach((element) => {
  //       let item = new QuotationRisk();
  //       item.RiskTypeId = element.RiskTypeId;
  //       item.ProductTypeId = JSON.parse(localStorage.getItem("pensionID"))["id"];
  //       item.ProposedRate = CommonMethods.ConvertToReadableNumber(element.ProposedRate);
  //       item.WorkersCount = CommonMethods.ConvertToReadableNumber(element.WorkersCount);
  //       item.PayrollAmount = CommonMethods.ConvertToReadableNumber(element.PayrollAmount);
  //       item.CalculatedRate = CommonMethods.ConvertToReadableNumber(element.Rate);
  //       item.PremimunPerRisk = CommonMethods.ConvertToReadableNumber(element.Premium);
  //       item.MinimunPremium = CommonMethods.ConvertToReadableNumber(self.InputsQuotation.PensionMinPremium);
  //       item.ProposedMinimunPremium = CommonMethods.ConvertToReadableNumber(self.InputsQuotation.PensionPropMinPremium);
  //       item.EndorsmentPremium = CommonMethods.ConvertToReadableNumber(element.EndorsmentPremium);

  //       item.NetPremium = CommonMethods.ConvertToReadableNumber(self.InputsQuotation.PensionNetAmount);
  //       item.GrossPremium = CommonMethods.ConvertToReadableNumber(self.InputsQuotation.PensionGrossAmount);
  //       item.PremiumIGV = CommonMethods.ConvertToReadableNumber(self.InputsQuotation.PensionCalculatedIGV);

  //       item.RiskRate = CommonMethods.ConvertToReadableNumber(element.RiskRate);
  //       item.Discount = element.Discount;
  //       item.Variation = element.Variation;
  //       item.TariffFlag = "3";

  //       quotation.RiskList.push(item);
  //     });
  //     this.InputsQuotation.SaludDetailsList.forEach((element) => {
  //       let item = new QuotationRisk();
  //       item.RiskTypeId = element.RiskTypeId;
  //       item.ProductTypeId = JSON.parse(localStorage.getItem("saludID"))["id"];
  //       item.ProposedRate = CommonMethods.ConvertToReadableNumber(element.ProposedRate);
  //       item.WorkersCount = CommonMethods.ConvertToReadableNumber(element.WorkersCount);
  //       item.PayrollAmount = CommonMethods.ConvertToReadableNumber(element.PayrollAmount);
  //       item.CalculatedRate = CommonMethods.ConvertToReadableNumber(element.Rate);
  //       item.PremimunPerRisk = CommonMethods.ConvertToReadableNumber(element.Premium);
  //       item.MinimunPremium = CommonMethods.ConvertToReadableNumber(self.InputsQuotation.SaludMinPremium);
  //       item.ProposedMinimunPremium = CommonMethods.ConvertToReadableNumber(self.InputsQuotation.SaludPropMinPremium);
  //       item.EndorsmentPremium = CommonMethods.ConvertToReadableNumber(element.EndorsmentPremium);

  //       item.NetPremium = CommonMethods.ConvertToReadableNumber(self.InputsQuotation.SaludNetAmount);
  //       item.GrossPremium = CommonMethods.ConvertToReadableNumber(self.InputsQuotation.SaludGrossAmount);
  //       item.PremiumIGV = CommonMethods.ConvertToReadableNumber(self.InputsQuotation.SaludCalculatedIGV);

  //       item.RiskRate = CommonMethods.ConvertToReadableNumber(element.RiskRate);
  //       item.Discount = element.Discount;
  //       item.Variation = element.Variation;
  //       item.TariffFlag = "3";

  //       quotation.RiskList.push(item);
  //     });

  //     quotation.BrokerList = [];

  //     this.InputsQuotation.SecondaryBrokerList.forEach((element) => {
  //       let item = new QuotationBroker();
  //       item.ChannelTypeId = element.TIPO_CANAL;
  //       item.ChannelId = element.CANAL;
  //       item.ClientId = element.SCLIENT;

  //       item.HealthProposedCommission = CommonMethods.isNumber(element.COMISION_SALUD_PRO) ? element.COMISION_SALUD_PRO : 0;
  //       item.HealthCommission = CommonMethods.isNumber(element.COMISION_SALUD) ? element.COMISION_SALUD : 0;
  //       item.PensionProposedCommission = CommonMethods.isNumber(element.COMISION_PENSION_PRO) ? element.COMISION_PENSION_PRO : 0;
  //       item.PensionCommission = CommonMethods.isNumber(element.COMISION_PENSION) ? element.COMISION_PENSION : 0;
  //       item.IsPrincipal = false;
  //       // item.SharedCommission = CommonMethods.isNumber(element.NSHARE) ? element.NSHARE : 0;
  //       item.SharedCommission = 0;
  //       quotation.BrokerList.push(item);
  //     });

  //     let formData = new FormData();
  //     this.files.forEach(function (file) { //anexamos todos los archivos al formData
  //       formData.append(file.name, file, file.name)
  //     });

  //     formData.append("quotationModification", JSON.stringify(quotation));
  //     this.quotationService.modifyQuotation(formData).subscribe(
  //       res => {
  //         if (res.P_COD_ERR == 0) {
  //           if (res.P_SAPROBADO == 'S') {
  //             self.isLoading = false;
  //             if (res.P_NCODE == 0) {
  //               swal.fire({
  //                 title: "Información",
  //                 text: "¿Desea emitir la cotización N° " + res.P_NID_COTIZACION + " de forma directa?",
  //                 type: "question",
  //                 showCancelButton: true,
  //                 confirmButtonText: 'Sí',
  //                 allowOutsideClick: false,
  //                 cancelButtonText: 'No'
  //               })
  //                 .then((result) => {
  //                   if (result.value) {
  //                     self.isLoading = false;
  //                     this.router.navigate(['/broker/policy/emit'], { queryParams: { quotationNumber: res.P_NID_COTIZACION } });
  //                   }
  //                 });
  //             } else {
  //               self.isLoading = false;
  //               swal.fire("Información", "Se ha recotizado correctamente la cotización N° " + res.P_NID_COTIZACION + ",  para emitir debe esperar su aprobación.", "success");
  //               this.router.navigate(['/broker/request-status']);
  //             }
  //           } else {
  //             self.isLoading = false;
  //             swal.fire("Información", "Se ha recotizado correctamente la cotización N° " + res.P_NID_COTIZACION + ",  para emitir debe esperar su aprobación. " + res.P_SMESSAGE, "success");
  //             this.router.navigate(['/broker/request-status']);
  //           }
  //         } else {
  //           self.isLoading = false;
  //           swal.fire("Información", res.P_MESSAGE, "error");
  //         }
  //       },
  //       error => {
  //         swal.fire("Información", this.genericServerErrorMessage, "error");
  //       }
  //     );
  //   } else {
  //     swal.fire("Información", CommonMethods.listToString(errorList), "error")
  //   }

  // }

  /**Decide que operación hacer de acuerdo al modo de esta vista */
  manageOperation() {
    this.AddStatusChange();
    // switch (this.mode) {
    //   case "recotizar":
    //     this.modifyQuotation();
    //     break;
    //   case "evaluar":
    //     this.AddStatusChange();
    //     break;
    //   case "emitir":
    //     this.router.navigate(['/broker/policy/emit'], { queryParams: { quotationNumber: this.quotationNumber } });
    //     break;
    //   default:
    //     break;
    // }
  }

  /**Primera búsqueda de cambios de estado de cotización */
  firstSearch() {
    this.filter.PageNumber = 1;
    this.searchTracking();
  }
  /**Búsqueda de estados de la cotización accionados por el cambio de página */
  pageChanged(event) {
    this.searchTracking();
  }
  /**Proceso de búsqueda de cambios de estado de la cotización */
  searchTracking() {
    this.policyService.getPolicyTrackingList(this.filter).subscribe(
      res => {
        this.totalItems = res.TotalRowNumber;
        if (res.TotalRowNumber > 0) {
          this.statusChangeList = res.GenericResponse;
          this.isLoading = false;
        } else {
          this.totalItems = 0;
          this.statusChangeList = [];
          this.isLoading = false;
        }
      },
      err => {
        swal.fire("Información", this.genericServerErrorMessage, "error");
      }
    );
  }

  openFilePicker(fileList: string[]) {
    if (fileList != null && fileList.length > 0) {
      const modalRef = this.ngbModal.open(FilePickerComponent, { size: "lg", backdropClass: 'light-blue-backdrop', backdrop: 'static', keyboard: false });
      modalRef.componentInstance.fileList = fileList;
      modalRef.componentInstance.ngbModalRef = modalRef;
    } else {
      swal.fire("Información", "La lista de archivos está vacía.", "warning")
    }

  }

  /**Muestra las comisión propuesta original de salud */
  switchHealthPropCommissionValue() {
    if (!this.enabledHealthMainPropCommission) this.InputsQuotation.BrokerSaludPropBounty = this.originalHealthMainPropComission;
  }
  /**Muestra las comisión autorizada original de salud */
  switchHealthAuthCommissionValue() {
    if (!this.enabledHealthMainAuthCommission) this.InputsQuotation.BrokerSaludAuthBounty = this.originalHealthMainAuthComission;
  }
  /**Muestra las comisión propuesta original de pensión */
  switchPensionPropCommissionValue() {
    if (!this.enabledPensionMainPropCommission) this.InputsQuotation.BrokerPensionPropBounty = this.originalPensionMainPropComission;
  }
  /**Muestra las comisión autorizada original de pensión */
  switchPensionAuthCommissionValue() {
    if (!this.enabledPensionMainAuthCommission) this.InputsQuotation.BrokerPensionAuthBounty = this.originalPensionMainAuthComission;
  }

  /**Muestra las prima mínima propuesta original de salud */
  switchHealthMinPropPremiumValue() {
    if (!this.enabledHealthMinPropPremium) this.InputsQuotation.SaludPropMinPremium = this.originalHealthMinPropPremium;
    this.checkMinimunPremiumForOriginals(this.healthProductId);
  }
  /**Muestra las prima mínima propuesta original de pensión */
  switchPensionMinPropPremiumValue() {
    if (!this.enabledPensionMinPropPremium) this.InputsQuotation.PensionPropMinPremium = this.originalPensionMinPropPremium;
    this.checkMinimunPremiumForOriginals(this.pensionProductId);
  }
  /**Muestra las prima mínima autorizada original de pensión */
  switchPensionMinAuthPremiumValue() {
    if (!this.enabledPensionAuthorizedPremium) this.InputsQuotation.PensionAuthMinPremium = this.originalPensionMinAuthPremium;
    this.checkMinimunPremiumForAuthorizedAmounts(this.pensionProductId);
  }
  /**Muestra las prima mínima autorizada original de salud */
  switchHealthMinAuthPremiumValue() {
    if (!this.enabledHealthAuthorizedPremium) this.InputsQuotation.HealthAuthMinPremium = this.originalHealthMinAuthPremium;
    this.checkMinimunPremiumForAuthorizedAmounts(this.healthProductId);
  }

  /**Muestra las tasas propuestas originales de salud */
  switchHealthProposedRateValues() {
    if (!this.enabledHealthProposedRate) {
      this.InputsQuotation.SaludDetailsList.map(function (item) {
        return item.ProposedRate = item.OriginalProposedRate;
      });
    }
  }
  /**Muestra las tasas propuestas originales de pensión */
  switchPensionProposedRateValues() {
    if (!this.enabledPensionProposedRate) {
      this.InputsQuotation.PensionDetailsList.map(function (item) {
        return item.ProposedRate = item.OriginalProposedRate;
      });
    }
  }
  /**Muestra las tasas autorizadas originales de salud */
  switchHealthAuthorizedRateValues() {
    let self = this;
    if (!this.enabledHealthAuthorizedRate) {
      this.InputsQuotation.SaludDetailsList.map(function (item) {
        self.calculateNewPremiums(item.OriginalAuthorizedRate, item.RiskTypeId, self.healthProductId);
        return item.AuthorizedRate = item.OriginalAuthorizedRate;
      });

    }
  }
  /**Muestra las tasas autorizadas originales de pensión */
  switchPensionAuthorizedRateValues() {
    let self = this;
    if (!this.enabledPensionAuthorizedRate) {
      this.InputsQuotation.PensionDetailsList.map(function (item) {
        self.calculateNewPremiums(item.OriginalAuthorizedRate, item.RiskTypeId, self.pensionProductId);
        return item.AuthorizedRate = item.OriginalAuthorizedRate;
      });
    }
  }
  /**Muestra la comisión propuesta original para salud*/
  switchHealthSecondaryPropCommissionValue() {
    let self = this;
    if (!this.enabledHealthSecondaryPropCommission) {
      self.InputsQuotation.SecondaryBrokerList.map(function (item) {
        return item.COMISION_SALUD_PRO = item.OriginalHealthPropCommission;
      });
    }
  }
  /**Muestra la comisión autorizada original para salud*/
  switchHealthSecondaryAuthCommissionValue() {
    let self = this;
    if (!this.enabledHealthSecondaryAuthCommission) {
      self.InputsQuotation.SecondaryBrokerList.map(function (item) {
        return item.COMISION_SALUD_AUT = item.OriginalHealthAuthCommission;
      });
    }
  }
  /**Muestra la comisión autorizada original para pensión*/
  switchPensionSecondaryAuthCommissionValue() {
    let self = this;
    if (!this.enabledPensionSecondaryAuthCommission) {
      self.InputsQuotation.SecondaryBrokerList.map(function (item) {
        return item.COMISION_PENSION_AUT = item.OriginalPensionAuthCommission;
      });
    }
  }
  /**Muestra la comisión propuesta original para pensión*/
  switchPensionSecondaryPropCommissionValue() {
    let self = this;
    if (!this.enabledPensionSecondaryPropCommission) {
      self.InputsQuotation.SecondaryBrokerList.map(function (item) {
        return item.COMISION_PENSION_PRO = item.OriginalPensionPropCommission;
      });
    }
  }

  /**Valida las tasas propuestas */
  areProposedRatesValid(): string[] {
    let errorList = [];
    if (this.InputsQuotation.PensionDetailsList != null && this.InputsQuotation.PensionDetailsList.length > 0) {
      this.InputsQuotation.PensionDetailsList.map(element => {
        element.Premium = CommonMethods.ConvertToReadableNumber(element.Premium);
        element.WorkersCount = CommonMethods.ConvertToReadableNumber(element.WorkersCount);

        if (element.WorkersCount <= 0) {
          element.ProposedRate = CommonMethods.ConvertToReadableNumber(element.ProposedRate);
          if (element.ProposedRate > 0) errorList.push("No puedes proponer tasas en la categoría " + element.RiskTypeName + " de Pensión.");
        }
        else {
          if (CommonMethods.isNumber(element.ProposedRate) == false) errorList.push("La tasa propuesta en la categoría " + element.RiskTypeName + " de Pensión no es válida.");
        }
        return element;
      });
    }

    if (this.InputsQuotation.SaludDetailsList != null && this.InputsQuotation.SaludDetailsList.length > 0) {
      this.InputsQuotation.SaludDetailsList.map(element => {
        element.Premium = CommonMethods.ConvertToReadableNumber(element.Premium);
        element.WorkersCount = CommonMethods.ConvertToReadableNumber(element.WorkersCount);

        if (element.WorkersCount <= 0) {
          element.ProposedRate = CommonMethods.ConvertToReadableNumber(element.ProposedRate);
          if (element.ProposedRate > 0) errorList.push("No puedes proponer tasas en la categoría " + element.RiskTypeName + " de Salud.");
        }
        else {
          if (CommonMethods.isNumber(element.ProposedRate) == false) errorList.push("La tasa propuesta en la categoría " + element.RiskTypeName + " de Salud no es válida.");
        }
        return element;
      });
    }

    return errorList;
  }

  /**Valida las comisiones autorizadas */
  validateAuthorizedCommmissions(): string[] {
    let self = this;
    let errorList = [];
    this.InputsQuotation.SecondaryBrokerList.map(function (item) {
      if (item.CANAL != "2015000002") {
        if (self.InputsQuotation.SaludDetailsList != null && self.InputsQuotation.SaludDetailsList.length > 0) {
          if (CommonMethods.isNumber(item.COMISION_SALUD_AUT) == false) errorList.push("La comisión autorizada de salud de " + item.COMERCIALIZADOR + " no es válida.");
          else if (item.COMISION_SALUD_AUT <= 0 && self.mainFormGroup.get('status').value == "2" && (JSON.parse(localStorage.getItem("currentUser"))["idProfile"] == "5" || JSON.parse(localStorage.getItem("currentUser"))["idProfile"] == "137")) errorList.push("La comisión autorizada de salud de " + item.COMERCIALIZADOR + " debe ser mayor a cero.");
        }
        if (self.InputsQuotation.PensionDetailsList != null && self.InputsQuotation.PensionDetailsList.length > 0) {
          if (CommonMethods.isNumber(item.COMISION_PENSION_AUT) == false) errorList.push("La comisión autorizada de pensión de " + item.COMERCIALIZADOR + " no es válida.");
          else if (item.COMISION_PENSION_AUT <= 0 && self.mainFormGroup.get('status').value == "2" && (JSON.parse(localStorage.getItem("currentUser"))["idProfile"] == "5" || JSON.parse(localStorage.getItem("currentUser"))["idProfile"] == "137")) errorList.push("La comisión autorizada de pensión de " + item.COMERCIALIZADOR + " debe ser mayor a cero.");
        }
      }
    });
    return errorList;
  }
  /**Valida las primas autorizadas */
  validateAuthorizedPremiums(): string[] {
    let errorList = [];
    if (CommonMethods.isNumber(this.InputsQuotation.HealthAuthMinPremium) == false) errorList.push("La prima mínima autorizada de salud no es válida.");
    else if (this.InputsQuotation.HealthAuthMinPremium <= 0 && this.mainFormGroup.get('status').value == "2" && (JSON.parse(localStorage.getItem("currentUser"))["idProfile"] == "5" || JSON.parse(localStorage.getItem("currentUser"))["idProfile"] == "137")) errorList.push("La prima mínima autorizada de salud debe ser mayor a cero.");

    if (CommonMethods.isNumber(this.InputsQuotation.PensionAuthMinPremium) == false) errorList.push("La prima mínima autorizada de pensión no es válida.");
    else if (this.InputsQuotation.PensionAuthMinPremium <= 0 && this.mainFormGroup.get('status').value == "2" && (JSON.parse(localStorage.getItem("currentUser"))["idProfile"] == "5" || JSON.parse(localStorage.getItem("currentUser"))["idProfile"] == "137")) errorList.push("La prima mínima autorizada de pensión debe ser mayor a cero.");

    return errorList;
  }
  /**Valida las tasas autorizadas */
  areAuthorizedRatesValid(): string[] {
    let errorList = [];
    if (this.InputsQuotation.PensionDetailsList != null && this.InputsQuotation.PensionDetailsList.length > 0) {
      this.InputsQuotation.PensionDetailsList.map(element => {
        element.WorkersCount = CommonMethods.ConvertToReadableNumber(element.WorkersCount);
        element.Premium = CommonMethods.ConvertToReadableNumber(element.Premium);
        element.AuthorizedRate = CommonMethods.ConvertToReadableNumber(element.AuthorizedRate);
        if (element.WorkersCount > 0 && element.AuthorizedRate == 0 && this.mainFormGroup.get('status').value == "2" && (JSON.parse(localStorage.getItem("currentUser"))["idProfile"] == "5" || JSON.parse(localStorage.getItem("currentUser"))["idProfile"] == "137")) errorList.push("La tasa autorizada en la categoría " + element.RiskTypeName + " de Pensión debe ser mayor a cero.");
        return element;
      });
    }
    if (this.InputsQuotation.SaludDetailsList != null && this.InputsQuotation.SaludDetailsList.length > 0) {
      this.InputsQuotation.SaludDetailsList.map(element => {
        element.WorkersCount = CommonMethods.ConvertToReadableNumber(element.WorkersCount);
        element.Premium = CommonMethods.ConvertToReadableNumber(element.Premium);
        element.AuthorizedRate = CommonMethods.ConvertToReadableNumber(element.AuthorizedRate);
        if (element.WorkersCount > 0 && element.AuthorizedRate == 0 && this.mainFormGroup.get('status').value == "2" && (JSON.parse(localStorage.getItem("currentUser"))["idProfile"] == "5" || JSON.parse(localStorage.getItem("currentUser"))["idProfile"] == "137")) errorList.push("La tasa autorizada en la categoría " + element.RiskTypeName + " de Salud debe ser mayor a cero.");
        return element;
      });

    }
    return errorList;
  }
}

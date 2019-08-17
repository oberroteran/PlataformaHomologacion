import { Component, OnInit } from '@angular/core';
import { BsDatepickerConfig } from "ngx-bootstrap";
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
//import { RequestStatus } from "./../../../../broker/models/requeststatus";
import { UtilityService } from "../../../../../shared/services/general/utility.service";
import { Router } from "@angular/router";
import { DatePipe } from "@angular/common";
import { isNumeric } from 'rxjs/internal-compatibility';
import Swal from 'sweetalert2';
import { NgbModal, ModalDismissReasons, NgbModalRef, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
//SERVICES
import { AgencyService } from '../../../services/maintenance/agency/agency.service';
import { QuotationService } from '../../../services/quotation/quotation.service';
import { ClientInformationService } from '../../../services/shared/client-information.service';
import { OthersService } from '../../../services/shared/others.service';
import { PolicyemitService } from '../../../services/policy/policyemit.service';
//MODELOS
import { QuotationSearch } from '../../../models/quotation/request/quotation-search';
import { QuotationTrackingComponent } from '../quotation-tracking/quotation-tracking.component';
import { QuotationTracking } from '../../../models/quotation/response/quotation-tracking';
//Configuración
import { GlobalValidators } from './../../global-validators';
import { ModuleConfig } from './../../module.config';
import { AccessFilter } from './../../access-filter'

@Component({
    selector: 'app-request-status',
    templateUrl: './request-status.component.html',
    styleUrls: ['./request-status.component.css']
})
export class RequestStatusComponent implements OnInit {
    isLoading: boolean = false;  //True para mostrar pantalla de carga, false para ocultarla
    // datepicker
    bsConfig: Partial<BsDatepickerConfig>;
    bsValueIni: Date = ModuleConfig.StartDate;  //Fecha inicial del componente
    bsValueFin: Date = ModuleConfig.EndDate;  //Fecha final del componente
    /**
     * Variables de paginación
     */
    public rotate = true; //Si rotar las páginas cuando maxSize > el número de páginas generado 
    public maxSize = 10; // cantidad de paginas que se mostrarán en el html del paginado
    public totalItems = 0; //total de items encontrados
    public foundResults: any = [];  //Lista de registros encontrados durante la búsqueda
    filter: QuotationSearch = new QuotationSearch(); //Objeto con datos de búsqueda que se llena en la primera búsqueda y que quedará en memoria para los cambios de página, el atributo PageNumber (Nro de página) está enlazado con el elemento de paginado del HTML y se actualiza automaticamente

    brokerDocumentMaxLength = 0;  //Cantidad de caracteres que se puede insertar en el campo Nro de documento de Broker
    contractorDocumentMaxLength = 0;  //Cantidad de caracteres que se puede insertar en el campo Nro de documento de Contratante
    isValidatedInClickButton: boolean = false;  //Flag que indica si el formulario ha sido validado por la acción BUSCAR. Este flag nos sirve para hacer la validación al momento de accionar la búsqueda.
    mainFormGroup: FormGroup;

    statusList: any[] = []; //Lista de estados de cotización
    productTypeList: any[] = [];  //Lista de tipos de producto
    documentTypeList: any[];  //Lista de tipos de documento
    searchModeList: any[] = [{ "Id": "1", "Name": "Nro. de Documento" }, { "Id": "2", "Name": "Nombres" }];
    personTypeList: any[] = [{ "Id": "1", "Name": "Persona Natural" }, { "Id": "2", "Name": "Persona Jurídica" }];

    notfoundMessage = ModuleConfig.NotFoundMessage;
    genericErrorMessage = ModuleConfig.GenericErrorMessage; //Mensaje de error genérico
    redirectionMessage = ModuleConfig.RedirectionMessage;
    invalidStartDateMessage = ModuleConfig.InvalidStartDateMessage;
    invalidEndDateMessage = ModuleConfig.InvalidEndDateMessage;
    invalidStartDateOrderMessage = ModuleConfig.InvalidStartDateOrderMessage;
    invalidEndDateOrderMessage = ModuleConfig.InvalidEndDateOrderMessage;

    /**Es un usuario externo? */
    isExternalUser: boolean;
    /**Nombre de broker (Si es usuario externo) */
    brokerName: string;
    /**Puede aprobar cotizaciones? */
    canApproveQuotation: boolean;
    /**Puede recotizar? */
    canModifyQuotation: boolean;

    constructor(
        private mainFormBuilder: FormBuilder,
        private policyService: PolicyemitService,
        public utilityService: UtilityService,
        private clientInformationService: ClientInformationService,
        private quotationService: QuotationService,
        private modalService: NgbModal,
        private router: Router
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
        if (AccessFilter.hasPermission(ModuleConfig.ViewIdList["quotation_request"]) == false) this.router.navigate(['/broker/home']);
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        this.isExternalUser = !AccessFilter.hasPermission("11");
        if (this.isExternalUser) this.brokerName = JSON.parse(localStorage.getItem("currentUser"))["desCanal"];
        console.log(this.isExternalUser)
        this.canApproveQuotation = AccessFilter.hasPermission("12");
        this.canModifyQuotation = AccessFilter.hasPermission("37");

        this.filter.User = JSON.parse(localStorage.getItem("currentUser"))["id"];
        this.filter.LimitPerPage = 5;
        this.createForm();
        this.initializeForm();
        this.getDocumentTypeList();
        this.getProductTypeList();
        this.getStatusList();
    }
    /**
     * Crea el formulario
     */
    private createForm() {
        this.mainFormGroup = this.mainFormBuilder.group({
            product: [""],  //Producto
            status: [""],  //estado de cotización
            startDate: [ModuleConfig.StartDate, [Validators.required]], //Fecha inferior para búsqueda
            endDate: [ModuleConfig.EndDate, [Validators.required]], //Fecha superior para búsqueda
            quotationNumber: ["", [Validators.maxLength(10), GlobalValidators.onlyNumberValidator]], //Número de póliza

            contractorSearchMode: ["1"],  //Modo de búsqueda de contratante
            contractorDocumentType: [""],  //Tipo de documento de contratante
            contractorDocumentNumber: ["", [Validators.maxLength(0), GlobalValidators.onlyNumberValidator]],  //Número de documento de contratante
            contractorPersonType: ["1"], //Tipo de persona de contratante
            contractorFirstName: ["", [Validators.maxLength(19), Validators.pattern(GlobalValidators.getLatinTextPattern())]],  //Nombre de contratante
            contractorPaternalLastName: ["", [Validators.maxLength(19), Validators.pattern(GlobalValidators.getLatinTextPattern())]], //Apellido paterno de contratante
            contractorMaternalLastName: ["", [Validators.maxLength(19), Validators.pattern(GlobalValidators.getLatinTextPattern())]],  //Apellido materno de contratante
            contractorLegalName: ["", [Validators.maxLength(60), Validators.pattern(GlobalValidators.getLegalNamePattern())]],  //Razón social de contratante

            brokerSearchMode: ["1"],  //Modo de búsqueda de contratante
            brokerDocumentType: [""],  //Tipo de documento de contratante
            brokerDocumentNumber: ["", [Validators.maxLength(0), GlobalValidators.onlyNumberValidator]],  //Número de documento de contratante
            brokerPersonType: ["1"], //Tipo de persona de contratante
            brokerFirstName: ["", [Validators.maxLength(19), Validators.pattern(GlobalValidators.getLatinTextPattern())]],  //Nombre de broker
            brokerPaternalLastName: ["", [Validators.maxLength(19), Validators.pattern(GlobalValidators.getLatinTextPattern())]], //Apellido paterno de broker
            brokerMaternalLastName: ["", [Validators.maxLength(19), Validators.pattern(GlobalValidators.getLatinTextPattern())]], //Apellido materno de broker
            brokerLegalName: ["", [Validators.maxLength(60), Validators.pattern(GlobalValidators.getLegalNamePattern())]] //Razón social de broker
        });
    }
    private initializeForm() {
        this.mainFormGroup.setValidators([GlobalValidators.dateSort]);
    }
    /**
     * Obtener lista de estados
     */
    getStatusList() {
        this.quotationService.getStatusList().subscribe(
            res => {
                this.statusList = res;
            },
            error => {

            }
        );
    }
    /**
    * Obtiene los tipos de producto
    */
    getProductTypeList() {
        this.policyService.getProductTypeList().subscribe(
            res => {
                this.productTypeList = res.GenericResponse;
            },
            error => {
                Swal.fire("Información", this.genericErrorMessage, "error")
            }
        );
    }

    /**
    * 
    */
    cleanValidation() {
        this.isValidatedInClickButton = false;
    }

    /**
     * Previene ingreso de datos en el campo [número de documento] según el tipo de documento
     * @param event Evento activador, este objeto contiene el valor ingresado
     * @param documentType Tipo de documento seleccionado
     */
    documentNumberKeyPress(event: any, documentType: string) {
        let pattern;
        switch (documentType) {
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
            case "6": { //pasaporte
                pattern = /[0-9A-Za-z]/;
                break;
            }
            default: {  //otros tipos de documento
                pattern = /[0-9A-Za-z]/;
                break;
            }
        }

        const inputChar = String.fromCharCode(event.charCode);

        if (!pattern.test(inputChar)) {
            event.preventDefault();
        }
        if (documentType == "") Swal.fire("Información", "Debes seleccionar un tipo de documento", "error");
        // console.log(this.mainFormGroup.controls.contractorDocumentNumber.value);
        // console.log(this.mainFormGroup.controls.brokerDocumentNumber.value);
    }

    /**
     * Limpiar campos y cambiar la propiedad MaxLength de los campos de CONTRATANTE
     */
    contractorDocumentTypeChanged() {
        switch (this.mainFormGroup.controls.contractorDocumentType.value) {
            case "1": { //ruc 
                this.contractorDocumentMaxLength = 11;
                this.mainFormGroup.controls.contractorDocumentNumber.setValidators([Validators.minLength(11), Validators.maxLength(11), GlobalValidators.onlyNumberValidator, GlobalValidators.rucNumberValidator]);
                this.mainFormGroup.controls.contractorDocumentNumber.updateValueAndValidity();
                break;
            }
            case "2": { //dni 
                this.contractorDocumentMaxLength = 8;
                this.mainFormGroup.controls.contractorDocumentNumber.setValidators([Validators.minLength(8), Validators.maxLength(8), GlobalValidators.onlyNumberValidator]);
                this.mainFormGroup.controls.contractorDocumentNumber.updateValueAndValidity();
                break;
            }
            case "4": { //ce
                this.contractorDocumentMaxLength = 12;
                this.mainFormGroup.controls.contractorDocumentNumber.setValidators([Validators.maxLength(12), Validators.pattern(GlobalValidators.getCePattern())]);
                this.mainFormGroup.controls.contractorDocumentNumber.updateValueAndValidity();
                break;
            }
            case "6": { //pasaporte
                this.contractorDocumentMaxLength = 12;
                this.mainFormGroup.controls.contractorDocumentNumber.setValidators([Validators.maxLength(12), Validators.pattern(GlobalValidators.getCePattern())]);
                this.mainFormGroup.controls.contractorDocumentNumber.updateValueAndValidity();
                break;
            }
            default: {  //otros tipos de documento
                this.contractorDocumentMaxLength = 15;
                this.mainFormGroup.controls.contractorDocumentNumber.setValidators([Validators.maxLength(15)]);
                this.mainFormGroup.controls.contractorDocumentNumber.updateValueAndValidity();
                break;
            }
        }
        this.cleanContractorInputs();
    }

    /**
     * Limpia campos de broker
     */
    cleanBrokerInputs() {
        this.mainFormGroup.controls.brokerDocumentNumber.patchValue("");
        this.mainFormGroup.controls.brokerFirstName.patchValue("");
        this.mainFormGroup.controls.brokerPaternalLastName.patchValue("");
        this.mainFormGroup.controls.brokerMaternalLastName.patchValue("");
        this.mainFormGroup.controls.brokerLegalName.patchValue("");
    }
    /**
     * Limpia campos de contratante
     */
    cleanContractorInputs() {
        this.mainFormGroup.controls.contractorDocumentNumber.patchValue("");
        this.mainFormGroup.controls.contractorFirstName.patchValue("");
        this.mainFormGroup.controls.contractorPaternalLastName.patchValue("");
        this.mainFormGroup.controls.contractorMaternalLastName.patchValue("");
        this.mainFormGroup.controls.contractorLegalName.patchValue("");
    }

    /**
     * Limpia campos y cambia la propiedad MaxLength del campo Nro de documento del broker
     */
    brokerDocumentTypeChanged() {
        switch (this.mainFormGroup.controls.brokerDocumentType.value) {
            case "1": { //ruc 
                this.brokerDocumentMaxLength = 11;
                this.mainFormGroup.controls.brokerDocumentNumber.setValidators([Validators.minLength(11), Validators.maxLength(11), GlobalValidators.onlyNumberValidator, GlobalValidators.rucNumberValidator]);
                this.mainFormGroup.controls.brokerDocumentNumber.updateValueAndValidity();
                break;
            }
            case "2": { //dni 
                this.brokerDocumentMaxLength = 8;
                this.mainFormGroup.controls.brokerDocumentNumber.setValidators([Validators.minLength(8), Validators.maxLength(8), GlobalValidators.onlyNumberValidator]);
                this.mainFormGroup.controls.brokerDocumentNumber.updateValueAndValidity();
                break;
            }
            case "4": { //ce
                this.brokerDocumentMaxLength = 12;
                this.mainFormGroup.controls.brokerDocumentNumber.setValidators([Validators.maxLength(12), Validators.pattern(GlobalValidators.getCePattern())]);
                this.mainFormGroup.controls.brokerDocumentNumber.updateValueAndValidity();
                break;
            }
            case "6": { //pasaporte
                this.brokerDocumentMaxLength = 12;
                this.mainFormGroup.controls.brokerDocumentNumber.setValidators([Validators.maxLength(12), Validators.pattern(GlobalValidators.getCePattern())]);
                this.mainFormGroup.controls.brokerDocumentNumber.updateValueAndValidity();
                break;
            }
            default: {  //otros tipos de documento
                this.brokerDocumentMaxLength = 15;
                this.mainFormGroup.controls.brokerDocumentNumber.setValidators([Validators.maxLength(15)]);
                this.mainFormGroup.controls.brokerDocumentNumber.updateValueAndValidity();
                break;
            }
        }
        this.cleanBrokerInputs();
    }

    /**
     * Lista tipos de documento
     */
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

    /**
     * Realiza la primera búsqueda accionada por el botón buscar o la tecla ENTER
     */
    firstSearch() {
        this.isValidatedInClickButton = true;
        if (this.mainFormGroup.valid) {
            //Preparación de datos
            this.filter.ProductType = this.mainFormGroup.controls.product.value;
            this.filter.Status = this.mainFormGroup.controls.status.value;
            this.filter.StartDate = this.mainFormGroup.controls.startDate.value;
            this.filter.EndDate = this.mainFormGroup.controls.endDate.value;
            this.filter.QuotationNumber = this.mainFormGroup.controls.quotationNumber.value;
            this.filter.PageNumber = 1;

            this.filter.ContractorSearchMode = this.mainFormGroup.controls.contractorSearchMode.value;

            if (this.mainFormGroup.controls.contractorSearchMode.value == "1") {
                this.filter.ContractorDocumentType = this.mainFormGroup.controls.contractorDocumentType.value;
                this.filter.ContractorDocumentNumber = this.mainFormGroup.controls.contractorDocumentNumber.value;
                this.filter.ContractorPaternalLastName = "";
                this.filter.ContractorMaternalLastName = "";
                this.filter.ContractorFirstName = "";
                this.filter.ContractorLegalName = "";
            } else if (this.mainFormGroup.controls.contractorSearchMode.value == "2" && this.mainFormGroup.controls.contractorPersonType.value == "1") {
                this.filter.ContractorDocumentType = "";
                this.filter.ContractorDocumentNumber = "";
                this.filter.ContractorPaternalLastName = this.mainFormGroup.controls.contractorPaternalLastName.value;
                this.filter.ContractorMaternalLastName = this.mainFormGroup.controls.contractorMaternalLastName.value;
                this.filter.ContractorFirstName = this.mainFormGroup.controls.contractorFirstName.value;
                this.filter.ContractorLegalName = "";
            } else if (this.mainFormGroup.controls.contractorSearchMode.value == "2" && this.mainFormGroup.controls.contractorPersonType.value == "2") {
                this.filter.ContractorDocumentType = "";
                this.filter.ContractorDocumentNumber = "";
                this.filter.ContractorPaternalLastName = "";
                this.filter.ContractorMaternalLastName = "";
                this.filter.ContractorFirstName = "";
                this.filter.ContractorLegalName = this.mainFormGroup.controls.contractorLegalName.value;
            } else {
                this.filter.ContractorDocumentType = "";
                this.filter.ContractorDocumentNumber = "";
                this.filter.ContractorPaternalLastName = "";
                this.filter.ContractorMaternalLastName = "";
                this.filter.ContractorFirstName = "";
                this.filter.ContractorLegalName = "";
            }

            this.filter.BrokerSearchMode = this.mainFormGroup.controls.brokerSearchMode.value;

            if (this.mainFormGroup.controls.brokerSearchMode.value == "1") {
                this.filter.BrokerDocumentType = this.mainFormGroup.controls.brokerDocumentType.value;
                this.filter.BrokerDocumentNumber = this.mainFormGroup.controls.brokerDocumentNumber.value;
                this.filter.BrokerPaternalLastName = "";
                this.filter.BrokerMaternalLastName = "";
                this.filter.BrokerFirstName = "";
                this.filter.BrokerLegalName = "";
            } else if (this.mainFormGroup.controls.brokerSearchMode.value == "2" && this.mainFormGroup.controls.brokerPersonType.value == "1") {
                this.filter.BrokerDocumentType = "";
                this.filter.BrokerDocumentNumber = "";
                this.filter.BrokerPaternalLastName = this.mainFormGroup.controls.brokerPaternalLastName.value;
                this.filter.BrokerMaternalLastName = this.mainFormGroup.controls.brokerMaternalLastName.value;
                this.filter.BrokerFirstName = this.mainFormGroup.controls.brokerFirstName.value;
                this.filter.BrokerLegalName = "";
            } else if (this.mainFormGroup.controls.brokerSearchMode.value == "2" && this.mainFormGroup.controls.brokerPersonType.value == "2") {
                this.filter.BrokerDocumentType = "";
                this.filter.BrokerDocumentNumber = "";
                this.filter.BrokerPaternalLastName = "";
                this.filter.BrokerMaternalLastName = "";
                this.filter.BrokerFirstName = "";
                this.filter.BrokerLegalName = this.mainFormGroup.controls.brokerLegalName.value;
            } else {
                this.filter.BrokerDocumentType = "";
                this.filter.BrokerDocumentNumber = "";
                this.filter.BrokerPaternalLastName = "";
                this.filter.BrokerMaternalLastName = "";
                this.filter.BrokerFirstName = "";
                this.filter.BrokerLegalName = "";
            }

            //modificar el objeto filter para adapatarse al SP
            if (this.mainFormGroup.controls.contractorDocumentNumber.value.toString().trim() == "" && this.mainFormGroup.controls.contractorSearchMode.value == "1") {
                this.filter.ContractorSearchMode = "3";
            }
            if (this.mainFormGroup.controls.brokerDocumentNumber.value.toString().trim() == "" && this.mainFormGroup.controls.brokerSearchMode.value == "1") {
                this.filter.BrokerSearchMode = "3";
            }
            this.search();
        } else {
            this.identifyAndShowErrors();
        }
    }

    /**
     * Identifica y muestra los errores
     */
    identifyAndShowErrors() {
        let error = [];
        if (this.mainFormGroup.hasError("datesNotSortedCorrectly")) error.push(this.invalidStartDateOrderMessage);
        if (this.mainFormGroup.controls.product.valid == false) error.push("El producto no es válido.");
        if (this.mainFormGroup.controls.status.valid == false) error.push("El estado no es válido.");
        if (this.mainFormGroup.controls.quotationNumber.valid == false) error.push("El número de cotización no es válido.");

        if (this.mainFormGroup.controls.contractorDocumentNumber.valid == false) error.push("El número de documento del contratante no es válido.");
        if (this.mainFormGroup.controls.contractorFirstName.valid == false) error.push("El nombre del contratante no es válido.");
        if (this.mainFormGroup.controls.contractorPaternalLastName.valid == false) error.push("El apellido paterno del contratante no es válido.");
        if (this.mainFormGroup.controls.contractorMaternalLastName.valid == false) error.push("El apellido materno del contratante no es válido.");

        if (this.mainFormGroup.controls.brokerDocumentNumber.valid == false) error.push("El número de documento del broker no es válido.");
        if (this.mainFormGroup.controls.brokerFirstName.valid == false) error.push("El nombre del broker no es válido.");
        if (this.mainFormGroup.controls.brokerPaternalLastName.valid == false) error.push("El apellido del broker paterno no es válido.");
        if (this.mainFormGroup.controls.brokerMaternalLastName.valid == false) error.push("El apellido del broker materno no es válido.");

        if (this.mainFormGroup.controls.startDate.valid == false) {
            if (this.mainFormGroup.controls.startDate.hasError('required')) error.push("La fecha inicial es requerida.");
            else error.push(this.invalidStartDateOrderMessage);
        }
        if (this.mainFormGroup.controls.endDate.valid == false) {
            if (this.mainFormGroup.controls.endDate.hasError('required')) error.push("La fecha final es requerida.");
            else error.push(this.invalidEndDateOrderMessage);
        }


        Swal.fire("Información", this.listToString(error), "error");
    }


    /**
     * Realiza la búsqueda accionada por el cambio de página en el paginador
     * @param page número de página seleccionado en el paginador
     */
    pageChanged(page: number) {
        this.search();
    }

    /**
    * extrae los datos que provee el servicio
    */
    search() {
        this.isLoading = true;

        this.quotationService.getQuotationList(this.filter).subscribe(
            res => {
                this.foundResults = res.GenericResponse;

                if (this.foundResults != null && this.foundResults.length > 0) this.totalItems = res.TotalRowNumber;
                else {
                    this.totalItems = 0;
                    Swal.fire("Información", this.notfoundMessage, "warning");
                }
                this.isLoading = false;
            },
            err => {
                this.foundResults = [];
                this.totalItems = 0;
                this.isLoading = false;
                Swal.fire("Información", this.genericErrorMessage, "error");

            }
        );
    }

    /**
    * Mostrar modal de tracking
    */
    seeTracking(quotationNumber: string) {
        const modalRef = this.modalService.open(QuotationTrackingComponent, { size: 'lg', backdropClass: 'light-blue-backdrop', backdrop: 'static', keyboard: false });
        modalRef.componentInstance.formModalReference = modalRef; //Enviamos la referencia al modal
        modalRef.componentInstance.quotationNumber = quotationNumber; //Enviamos el número de cotización

    }

    /**
     * Cargamos el formulario de cotización en modo EVALUAR
     * @param quotationNumber 
     */
    evaluate(quotationNumber: string) {
        this.router.navigate(['/broker/quotation-evaluation'], { queryParams: { quotationNumber: quotationNumber, mode: "evaluar" } });
    }
    /**
     * Cargamos el formulario de cotización en modo VISTA
     * @param quotationNumber 
     */
    justWatch(quotationNumber: string) {
        this.router.navigate(['/broker/quotation-evaluation'], { queryParams: { quotationNumber: quotationNumber, mode: "solover" } });
    }
    /**
     * Cargamos el formulario de modificación de cotización
     * @param quotationNumber 
     */
    modifyQuotation(quotationNumber: string) {
        // this.router.navigate(['/broker/quotation-evaluation'], { queryParams: { quotationNumber: quotationNumber, mode: "recotizar" } });
        this.router.navigate(['/broker/quotation'], { queryParams: { quotationNumber: quotationNumber, mode: "recotizar" } });

    }

    /**
     * Convierte una lista en un texto html para ser mostrado en los pop-up de alerta
     * @param list lista ingresada
     * @returns  string en html
     */
    listToString(list: String[]): string {
        let output = "";
        if (list != null && list.length > 0) {
            list.forEach(function (item) {
                output = output + item + " <br>"
            });
        }
        return output;
    }

    /**
     * Bloquea los otros campos cuando el campo de número de cotización no está vacío; en caso contrario, los desbloquea
     */
    quotationNumberChanged(event: any) {
        if (!/[0-9]/.test(event.key) && event.key != 'Backspace' && event.key != 'Delete') {
            event.preventDefault();
        } else {
            if (this.mainFormGroup.controls.quotationNumber.value != null && this.mainFormGroup.controls.quotationNumber.value != "") {
                this.mainFormGroup.controls.product.disable();
                this.mainFormGroup.controls.status.disable();
                this.mainFormGroup.controls.startDate.disable();
                this.mainFormGroup.controls.endDate.disable();

                this.mainFormGroup.controls.contractorSearchMode.disable();
                this.mainFormGroup.controls.contractorPersonType.disable();
                this.mainFormGroup.controls.contractorDocumentType.disable();
                this.mainFormGroup.controls.contractorDocumentNumber.disable();
                this.mainFormGroup.controls.contractorPaternalLastName.disable();
                this.mainFormGroup.controls.contractorMaternalLastName.disable();
                this.mainFormGroup.controls.contractorFirstName.disable();
                this.mainFormGroup.controls.contractorLegalName.disable();

                this.mainFormGroup.controls.brokerSearchMode.disable();
                this.mainFormGroup.controls.brokerPersonType.disable();
                this.mainFormGroup.controls.brokerDocumentType.disable();
                this.mainFormGroup.controls.brokerDocumentNumber.disable();
                this.mainFormGroup.controls.brokerPaternalLastName.disable();
                this.mainFormGroup.controls.brokerMaternalLastName.disable();
                this.mainFormGroup.controls.brokerFirstName.disable();
                this.mainFormGroup.controls.brokerLegalName.disable();

                this.mainFormGroup.setValidators(null);

            } else {
                this.mainFormGroup.controls.product.enable();
                this.mainFormGroup.controls.status.enable();
                this.mainFormGroup.controls.startDate.enable();
                this.mainFormGroup.controls.endDate.enable();

                this.mainFormGroup.controls.contractorSearchMode.enable();
                this.mainFormGroup.controls.contractorPersonType.enable();
                this.mainFormGroup.controls.contractorDocumentType.enable();
                this.mainFormGroup.controls.contractorDocumentNumber.enable();
                this.mainFormGroup.controls.contractorPaternalLastName.enable();
                this.mainFormGroup.controls.contractorMaternalLastName.enable();
                this.mainFormGroup.controls.contractorFirstName.enable();
                this.mainFormGroup.controls.contractorLegalName.enable();

                this.mainFormGroup.controls.brokerSearchMode.enable();
                this.mainFormGroup.controls.brokerPersonType.enable();
                this.mainFormGroup.controls.brokerDocumentType.enable();
                this.mainFormGroup.controls.brokerDocumentNumber.enable();
                this.mainFormGroup.controls.brokerPaternalLastName.enable();
                this.mainFormGroup.controls.brokerMaternalLastName.enable();
                this.mainFormGroup.controls.brokerFirstName.enable();
                this.mainFormGroup.controls.brokerLegalName.enable();
                this.mainFormGroup.setValidators([GlobalValidators.dateSort]);
            }
            this.mainFormGroup.updateValueAndValidity();
        }
    }
    onPaste(event: ClipboardEvent) {
        //let clipboardData = event.clipboardData || window.clipboardData;
        let clipboardData = event.clipboardData;
        let pastedText = clipboardData.getData('text');
        if (!isNumeric(pastedText)) {
            event.preventDefault()
        } else {
            if (pastedText != null && pastedText.toString().trim() != "") {
                this.mainFormGroup.controls.product.disable();
                this.mainFormGroup.controls.status.disable();
                this.mainFormGroup.controls.startDate.disable();
                this.mainFormGroup.controls.endDate.disable();

                this.mainFormGroup.controls.contractorSearchMode.disable();
                this.mainFormGroup.controls.contractorPersonType.disable();
                this.mainFormGroup.controls.contractorDocumentType.disable();
                this.mainFormGroup.controls.contractorDocumentNumber.disable();
                this.mainFormGroup.controls.contractorPaternalLastName.disable();
                this.mainFormGroup.controls.contractorMaternalLastName.disable();
                this.mainFormGroup.controls.contractorFirstName.disable();
                this.mainFormGroup.controls.contractorLegalName.disable();

                this.mainFormGroup.controls.brokerSearchMode.disable();
                this.mainFormGroup.controls.brokerPersonType.disable();
                this.mainFormGroup.controls.brokerDocumentType.disable();
                this.mainFormGroup.controls.brokerDocumentNumber.disable();
                this.mainFormGroup.controls.brokerPaternalLastName.disable();
                this.mainFormGroup.controls.brokerMaternalLastName.disable();
                this.mainFormGroup.controls.brokerFirstName.disable();
                this.mainFormGroup.controls.brokerLegalName.disable();

                this.mainFormGroup.setValidators(null);
            }
        }

    }

    openDetails(item: any) {
        this.router.navigate(['/broker/quotation-evaluation'], { queryParams: { quotationNumber: item.QuotationNumber, mode: item.Mode } });
    }
}

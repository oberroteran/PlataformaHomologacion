import { Component, OnInit } from '@angular/core';
import { BsDatepickerConfig } from "ngx-bootstrap";
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from "@angular/router";
import { DatePipe } from "@angular/common";

//Importación de servicios
import { ClientInformationService } from '../../../services/shared/client-information.service';
import { QuotationService } from '../../../services/quotation/quotation.service';
import { ContractorLocationIndexService } from '../../../services/maintenance/contractor-location/contractor-location-index/contractor-location-index.service';
import { AddressService } from '../../../services/shared/address.service';
import { PolicyemitService } from '../../../services/policy/policyemit.service';

//Importacion de modelos
import { DocumentType } from '../../../models/shared/client-information/document-type';
import { Currency } from '../../../models/shared/client-information/currency-type';
import { ClientDataToSearch } from '../../../models/shared/client-information/client-data-to-search';
import { ContractorLocation } from '../../../models/maintenance/contractor-location/contractor-location';
import { EconomicActivity } from '../../../models/shared/client-information/economic-activity';
import { Department } from '../../../models/shared/address/department';
import { Province } from '../../../models/shared/address/province';
import { District } from '../../../models/shared/address/district';
import { Tariff } from '../../../models/shared/client-information/tariff';
import { Channel } from '../../../models/shared/client-information/channel';
//Crear Sedes
import { ContractorLocationFormComponent } from '../../maintenance/contractor-location/contractor-location-form/contractor-location-form.component';

//componentes para ser usados como MODAL
import { SearchContractingComponent } from '../../../modal/search-contracting/search-contracting.component';
import { SearchBrokerComponent } from '../../../modal/search-broker/search-broker.component';
import { AccessFilter } from './../../access-filter';
import { ModuleConfig } from './../../module.config'
//SweetAlert 
import swal from 'sweetalert2';

@Component({
    selector: 'app-quotation',
    templateUrl: './quotation.component.html',
    styleUrls: ['./quotation.component.css']
})
export class QuotationComponent implements OnInit {

    isLoading: boolean = false;

    public bsValueIni = "01/01/1950";
    public bsConfig: Partial<BsDatepickerConfig>;
    stateBrokerSalud = true;
    stateBrokerPension = true;
    statePrimaSalud = true;
    statePrimaPension = true;
    stateSalud = false;
    statePension = false;
    stateQuotation = true;
    stateTasaSalud = false;
    stateTasaPension = false;
    stateBrokerTasaSalud = true;
    stateBrokerTasaPension = true;
    blockDoc = true;
    blockSearch = true;
    stateSearch = false;
    stateWorker = false;
    messageWorker = "";
    maxlength = 8;
    minlength = 8;
    typeDocument = 0;
    documentTypeList: DocumentType[];
    currencyList: Currency[];
    economicActivityList: any[];
    technicalList: any = [];
    departmentList: Department[];
    provinceList: Province[];
    districtList: District[];
    sedesList: any = [];
    InputsQuotation: any = {};
    listaComercializador: any = {};
    itemComercializador: any = {};
    files: File[] = [];
    lastFileAt: Date;
    itemConsulta = {};
    ContractorId = "";
    userId = 0;
    canal = "0";
    maxSize = 10485760;
    totalTrabajadoresSalud = 0;
    totalTrabajadoresPension = 0;
    totalPlanillaSalud = 0.0;
    totalPlanillaPension = 0.0;
    totalNetoSalud = 0.0;
    totalNetoPension = 0.0;
    igvSalud = 0.0;
    igvPension = 0.0;
    brutaTotalSalud = 0.0;
    brutaTotalPension = 0.0;
    disabledFlat: any = [];
    /** prima total neta save */
    totalNetoSaludSave = 0.0;
    totalNetoPensionSave = 0.0;
    /** igv + de save */
    igvSaludSave = 0.0;
    igvPensionSave = 0.0;
    /** prima bruta save */
    brutaTotalSaludSave = 0.0;
    brutaTotalPensionSave = 0.0;

    resList: any = [];
    listaTasasSalud: any = [];
    listaTasasPension: any = [];
    productList: any = [];
    EListClient: any = [];
    brokerList: any = [];
    tasasList: any = [];
    pensionID = JSON.parse(localStorage.getItem("pensionID"))["id"];
    saludID = JSON.parse(localStorage.getItem("saludID"))["id"];
    workerMin = 0;
    workerMax = 70;
    municipalityTariff = 0;
    desBroker = "";
    discountPension = "";
    discountSalud = "";
    activityVariationPension = "";
    activityVariationSalud = "";
    commissionPension = "";
    commissionSalud = "";
    COM_SAL_PRO: boolean = false
    COM_PEN_PRO: boolean = false
    PRIM_MIN_PEN: boolean = false
    PRIM_MIN_SAL: boolean = false
    igvPensionWS: number = 0.0;
    igvSaludWS: number = 0.0;
    mensajePrimaPension = "";
    mensajePrimaSalud = "";
    items: string[];
    config: any;
    VAL_QUOTATION: any = {}; // total de trabajadores
    P_TOTAL_TRAB: any = {}; // total de trabajadores
    P_TOTAL_PLAN: any = {}; // Total de planilla
    P_PLAN_PRO: any = {}; // tasa salud propuesta
    P_PLAN_PRO_PEN: any = {}; // tasa pension propuesta
    P_COM_SAL_PRO: any = {}; // comision salud propuesta | broker
    P_COM_PEN_PRO: any = {}; // comision pension propuesta | broker
    sedeContractor = "";
    reloadTariff = false;
    /** Perfil externo */
    perfil = '134';
    /** Codigo FLAT */
    codFlat = '2rJ3BaQk95sPqFFmvrHWY8'
    /** Puede proponer comisión? */
    canProposeComission: boolean;
    /** Puede agregar brokers secundarios? */
    canAddSecondaryBroker: boolean;
    /** Puede proponer prima mínima? */
    canProposeMinimunPremium: boolean;
    /** Puede proponer tasa? */
    canProposeRate: boolean;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private modalService: NgbModal,
        private quotationService: QuotationService,
        private clientInformationService: ClientInformationService,
        private addressService: AddressService,
        private contractorLocationIndexService: ContractorLocationIndexService,
        private datePipe: DatePipe,
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
        if (AccessFilter.hasPermission(ModuleConfig.ViewIdList["quotation"]) == false) this.router.navigate(['/broker/home']);
        this.canProposeComission = AccessFilter.hasPermission("6");
        this.canAddSecondaryBroker = AccessFilter.hasPermission("7");
        this.canProposeMinimunPremium = AccessFilter.hasPermission("8");
        this.canProposeRate = AccessFilter.hasPermission("9");

        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        this.userId = currentUser["id"];

        let self = this

        for (var i = 0; i < 10; i++) {
            let item: any = {};
            item.id = i.toString();
            item.value = false;
            self.disabledFlat.push(item)
        }

        this.getDocumentTypeList();
        this.getCurrencyList();
        this.getTechnicalActivityList();
        this.getDepartmentList();
        this.getProductList();
        this.getIGVPension();
        this.getIGVSalud();

        this.VAL_QUOTATION[0] = ""; // Tipo Documento
        this.VAL_QUOTATION[1] = ""; // Nro Documento
        this.VAL_QUOTATION[2] = ""; // Sede
        this.VAL_QUOTATION[3] = ""; // Actividad Economica
        this.VAL_QUOTATION[4] = ""; // Departamento
        this.VAL_QUOTATION[5] = ""; // Provincia
        this.VAL_QUOTATION[6] = ""; // Distrito
        this.VAL_QUOTATION[7] = ""; // Min Producto
        this.VAL_QUOTATION[8] = ""; // Trabajadore
        this.VAL_QUOTATION[9] = ""; // Planilla
        this.VAL_QUOTATION[10] = ""; // Sum Archivos
        this.VAL_QUOTATION[11] = ""; // Productos
        this.VAL_QUOTATION[12] = ""; // Actividad tecnica
        this.InputsQuotation.P_TYPE_SEARCH = "1"; // Tipo de busqueda
        this.InputsQuotation.P_PERSON_TYPE = "1"; // Tipo persona
        // this.InputsQuotation.P_CANT_WORKER = "1";
        this.InputsQuotation.P_WORKER = this.workerMin;

        this.route.queryParams
            .subscribe(params => {
                this.InputsQuotation.P_NIDDOC_TYPE = params.typeDocument;
                this.InputsQuotation.P_SIDDOC = params.document;
            });
        if (this.InputsQuotation.P_NIDDOC_TYPE != undefined && this.InputsQuotation.P_SIDDOC != undefined && this.InputsQuotation.P_NIDDOC_TYPE != "" && this.InputsQuotation.P_SIDDOC != "") {
            this.buscarContratante();
            this.onSelectTypeDocument(this.InputsQuotation.P_NIDDOC_TYPE);
            this.changeSDOC(this.InputsQuotation.P_SIDDOC);
        } else {
            //Datos Contratante
            this.InputsQuotation.P_NIDDOC_TYPE = "-1"; // Tipo de documento
            this.InputsQuotation.P_SIDDOC = ""; // Nro de documento
            this.InputsQuotation.P_SFIRSTNAME = ""; // Nombre 
            this.InputsQuotation.P_SLASTNAME = ""; // Apellido Paterno
            this.InputsQuotation.P_SLASTNAME2 = ""; // Apellido Materno
            this.InputsQuotation.P_SLEGALNAME = ""; // Razon social
            this.InputsQuotation.P_SE_MAIL = ""; // Email
            this.InputsQuotation.P_SDESDIREBUSQ = ""; // Direccion

            //Datos Cotización
            this.InputsQuotation.P_NPRODUCT = "-1"; //Producto
            this.InputsQuotation.P_NCURRENCY = "1"; // Moneda
            this.InputsQuotation.P_NIDSEDE = null; // Sede
            this.InputsQuotation.P_NTECHNICAL = null; // Actividad tecnica
            this.InputsQuotation.P_NECONOMIC = null; // Actividad Economica
            this.InputsQuotation.P_DELIMITER = ""; // Delimitación check
            this.InputsQuotation.P_MINA = false; // Delimitación check
            this.InputsQuotation.P_SDELIMITER = "0"; // Delimitacion  1 o 0
            this.InputsQuotation.P_NPROVINCE = null;
            this.InputsQuotation.P_NLOCAL = null;
            this.InputsQuotation.P_NMUNICIPALITY = null;
        }
        console.log(JSON.parse(localStorage.getItem("currentUser")))
        //Datos del comercializador
        let brokerMain: any = {}
        brokerMain.NTYPECHANNEL = JSON.parse(localStorage.getItem("currentUser"))["tipoCanal"];
        // brokerMain.CODCANAL = ""
        brokerMain.COD_CANAL = JSON.parse(localStorage.getItem("currentUser"))["canal"];
        brokerMain.NCORREDOR = JSON.parse(localStorage.getItem("currentUser"))["brokerId"];
        brokerMain.NTIPDOC = JSON.parse(localStorage.getItem("currentUser"))["sclient"].substr(1, 1);
        brokerMain.NNUMDOC = JSON.parse(localStorage.getItem("currentUser"))["sclient"].substr(3);
        brokerMain.RAZON_SOCIAL = JSON.parse(localStorage.getItem("currentUser"))["desCanal"];
        brokerMain.PROFILE = JSON.parse(localStorage.getItem("currentUser"))["idProfile"];
        brokerMain.SCLIENT = JSON.parse(localStorage.getItem("currentUser"))["sclient"];

        brokerMain.P_NPRINCIPAL = 0;

        if(brokerMain.PROFILE == this.perfil){
            brokerMain.BLOCK = 1;
        }else{
            brokerMain.BLOCK = 0;                                       
        }

        brokerMain.P_COM_SALUD = 0;
        brokerMain.P_COM_SALUD_PRO = 0;
        brokerMain.P_COM_PENSION = 0;
        brokerMain.P_COM_PENSION_PRO = 0;
        this.brokerList.push(brokerMain);

        // this.InputsQuotation.P_COMERCIALIZADOR_LIST = this.listaComercializador; // Lista de comercializador
        //this.InputsQuotation.P_NIDDOC_TYPE_COM = currentUser["sclient"].substr(1, 1);
        //this.InputsQuotation.P_SIDDOC_COM = currentUser["sclient"].substr(3);
        //this.InputsQuotation.P_SFIRSTNAME_COM = currentUser["desCanal"];
        //this.canal = currentUser["canal"];

        //Cotizador
        this.InputsQuotation.P_SCTR_SALUD = false; // Delimitacion  1 o 0
        this.InputsQuotation.P_SCTR_PENSION = false; // Delimitacion  1 o 0
        this.InputsQuotation.P_COMISSION_BROKER_SALUD = ""; // Comision salud web service
        this.InputsQuotation.P_COMISSION_BROKER_SALUD_PRO = ""; // Comision salud propuesta
        this.InputsQuotation.P_COMISSION_BROKER_PENSION = ""; // Comision pension web service
        this.InputsQuotation.P_COMISSION_BROKER_PENSION_PRO = ""; // Comision pension propuesta
        this.InputsQuotation.P_PRIMA_MIN_SALUD = ""; // Prima minima salud
        this.InputsQuotation.P_PRIMA_MIN_SALUD_PRO = ""; // Prima minima salud propuesta
        this.InputsQuotation.P_PRIMA_END_SALUD = ""; // Prima endoso salud
        this.InputsQuotation.P_PRIMA_MIN_PENSION = ""; // Prima minima pension
        this.InputsQuotation.P_PRIMA_MIN_PENSION_PRO = ""; // Prima minima pension propuesta
        this.InputsQuotation.P_PRIMA_END_PENSION = ""; // Prima endoso pension

        //Comentario
        this.InputsQuotation.P_SCOMMENT = "";
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

    getTechnicalActivityList() {
        this.clientInformationService.getTechnicalActivityList().subscribe(
            res => {
                this.technicalList = res;
            },
            err => {
                console.log(err);
            }
        );
    }
    getQuotationData() {

    }

    getProductList() {
        this.clientInformationService.getProductList().subscribe(
            res => {
                this.productList = res;
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

    getCurrencyList() {
        this.clientInformationService.getCurrencyList().subscribe(
            res => {
                this.currencyList = res;
            },
            err => {
                console.log(err);
            }
        );
    }

    getEconomicActivityList() {
        this.clientInformationService.getEconomicActivityList(this.InputsQuotation.P_NTECHNICAL).subscribe(
            res => {
                this.economicActivityList = res;
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
        let province = this.InputsQuotation.P_NPROVINCE == null ? "0" : this.InputsQuotation.P_NPROVINCE;
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
        let local = this.InputsQuotation.P_NLOCAL == null ? "0" : this.InputsQuotation.P_NLOCAL;
        return this.addressService.getDistrictList(local).subscribe(
            res => {
                this.districtList = res;
            },
            err => {
                console.log(err);
            }
        );
    }

    primaPropuesta(id) {
        switch (id) {
            case 1:
                this.stateBrokerSalud = !this.stateBrokerSalud;
                this.InputsQuotation.P_COMISSION_BROKER_SALUD_PRO = "";
                break;
            case 2:
                this.stateBrokerPension = !this.stateBrokerPension;
                this.InputsQuotation.P_COMISSION_BROKER_PENSION_PRO = "";
                break;
            case 3:
                this.statePrimaSalud = !this.statePrimaSalud;
                this.InputsQuotation.P_PRIMA_MIN_SALUD_PRO = "";

                if (parseFloat(this.totalNetoSalud.toString()) < this.InputsQuotation.P_PRIMA_MIN_SALUD) {
                    this.totalNetoSaludSave = this.InputsQuotation.P_PRIMA_MIN_SALUD
                    this.igvSaludSave = this.formateaValor((this.totalNetoSaludSave * this.igvSaludWS) - this.totalNetoSaludSave);
                    this.brutaTotalSaludSave = this.formateaValor(parseFloat(this.totalNetoSaludSave.toString()) + parseFloat(this.igvSaludSave.toString()));
                    this.mensajePrimaSalud = "* Se aplica prima mínima en esta ocasión";
                } else {
                    this.mensajePrimaSalud = ""
                    this.totalNetoSaludSave = this.totalNetoSalud
                    this.igvSaludSave = this.igvSalud;
                    this.brutaTotalSaludSave = this.brutaTotalSalud;
                }


                break;
            case 4:
                this.statePrimaPension = !this.statePrimaPension;
                this.InputsQuotation.P_PRIMA_MIN_PENSION_PRO = "";

                if (parseFloat(this.totalNetoPension.toString()) < this.InputsQuotation.P_PRIMA_MIN_PENSION) {
                    this.totalNetoPensionSave = this.InputsQuotation.P_PRIMA_MIN_PENSION
                    this.igvPensionSave = this.formateaValor((this.totalNetoPensionSave * this.igvPensionWS) - this.totalNetoPensionSave);
                    this.brutaTotalPensionSave = this.formateaValor(parseFloat(this.totalNetoPensionSave.toString()) + parseFloat(this.igvPensionSave.toString()));
                    this.mensajePrimaPension = "* Se aplica prima mínima en esta ocasión";
                } else {
                    this.mensajePrimaPension = ""
                    this.totalNetoPensionSave = this.totalNetoPension
                    this.igvPensionSave = this.igvPension;
                    this.brutaTotalPensionSave = this.brutaTotalPension;
                }


                break;
            case 5:
                this.stateTasaSalud = !this.stateTasaSalud;
                this.P_PLAN_PRO = [];
                break;
            case 6:
                this.stateTasaPension = !this.stateTasaPension
                this.P_PLAN_PRO_PEN = [];
                break;
            case 7:
                this.stateBrokerTasaSalud = !this.stateBrokerTasaSalud
                this.P_COM_SAL_PRO = [];
                break;
            case 8:
                this.stateBrokerTasaPension = !this.stateBrokerTasaPension
                this.P_COM_PEN_PRO = [];
                break;
        }
    }

    buscarContratante() {
        let self = this;
        let msg = "";
        if (this.InputsQuotation.P_TYPE_SEARCH == 1) {
            if (this.InputsQuotation.P_NIDDOC_TYPE == -1) {
                msg += "Debe ingresar tipo de documento <br />"
            }
            if (this.InputsQuotation.P_SIDDOC.trim() == "") {
                msg += "Debe ingresar número de documento <br />"
            }
        } else {
            if (this.InputsQuotation.P_PERSON_TYPE == 1) {
                if (this.InputsQuotation.P_SFIRSTNAME.trim() == "") {
                    msg += "Debe ingresar nombre del contratante <br />"
                }
                if (this.InputsQuotation.P_SLASTNAME.trim() == "") {
                    msg += "Debe ingresar apellido paterno del contratante <br />"
                }
            }
            else {
                if (this.InputsQuotation.P_SLEGALNAME.trim() == "") {
                    msg += "Debe ingresar razón social <br />"
                }
            }
        }

        if (msg != "") {
            swal.fire("Información", msg, "error");
            return
        }

        if (this.InputsQuotation.P_NIDDOC_TYPE == 1 && this.InputsQuotation.P_SIDDOC.trim().length > 1) {
            if (this.InputsQuotation.P_SIDDOC.substr(0, 2) != "10" && this.InputsQuotation.P_SIDDOC.substr(0, 2) != "15" && this.InputsQuotation.P_SIDDOC.substr(0, 2) != "17" && this.InputsQuotation.P_SIDDOC.substr(0, 2) != "20") {
                swal.fire("Información", "El número de RUC no es válido, debe empezar con 10, 15, 17, 20", "error");
                return
            }
        }
        self.isLoading = true;
        let data = new ClientDataToSearch();
        data.P_CodAplicacion = "SCTR";
        data.P_TipOper = "CON";
        data.P_NUSERCODE = JSON.parse(localStorage.getItem("currentUser"))["id"];
        data.P_NIDDOC_TYPE = this.InputsQuotation.P_NIDDOC_TYPE != "-1" ? this.InputsQuotation.P_NIDDOC_TYPE : "";
        data.P_SIDDOC = this.InputsQuotation.P_SIDDOC.toUpperCase();
        data.P_SFIRSTNAME = this.InputsQuotation.P_SFIRSTNAME != null ? this.InputsQuotation.P_SFIRSTNAME.toUpperCase() : "";
        data.P_SLASTNAME = this.InputsQuotation.P_SLASTNAME != null ? this.InputsQuotation.P_SLASTNAME.toUpperCase() : "";
        data.P_SLASTNAME2 = this.InputsQuotation.P_SLASTNAME2 != null ? this.InputsQuotation.P_SLASTNAME2.toUpperCase() : "";
        data.P_SLEGALNAME = this.InputsQuotation.P_SLEGALNAME != null ? this.InputsQuotation.P_SLEGALNAME.toUpperCase() : "";

        this.clientInformationService.getClientInformation(data).subscribe(
            res => {
                if (res.P_NCODE == 0) {
                    if (res.EListClient.length == 0) {
                        this.stateQuotation = true;
                        this.economicActivityList = null;
                        if (this.InputsQuotation.P_SIDDOC != "") {
                            this.clearInputsQuotation();
                            if (AccessFilter.hasPermission("34") == true) {
                                swal.fire({
                                    title: "Información",
                                    text: "No existe contratante con el número de documento ingresado",
                                    type: "info",
                                    showCancelButton: true,
                                    confirmButtonText: 'Crear Contratante',
                                    allowOutsideClick: false,
                                    cancelButtonText: 'Cancelar'
                                })
                                    .then((result) => {
                                        if (result.value) {
                                            this.router.navigate(['/broker/add-contracting'], { queryParams: { typeDocument: this.InputsQuotation.P_NIDDOC_TYPE, document: this.InputsQuotation.P_SIDDOC, receiver: "quotation" } });
                                        }
                                    });
                            } else swal.fire("Información", "No hay información con los datos ingresados", "error");
                        } else {
                            swal.fire("Información", "No hay información con los datos ingresados", "error");
                        }

                    } else {
                        if (res.EListClient[0].P_SCLIENT == null) {
                            this.stateQuotation = true;
                            if (AccessFilter.hasPermission("34") == true) {
                                swal.fire({
                                    title: "Información",
                                    text: "No existe contratante con el número de documento ingresado",
                                    type: "info",
                                    showCancelButton: true,
                                    confirmButtonText: 'Crear Contratante',
                                    allowOutsideClick: false,
                                    cancelButtonText: 'Cancelar'
                                })
                                    .then((result) => {
                                        if (result.value) {
                                            this.router.navigate(['/broker/add-contracting'], { queryParams: { typeDocument: this.InputsQuotation.P_NIDDOC_TYPE, document: this.InputsQuotation.P_SIDDOC, receiver: "quotation" } });
                                        }
                                    });
                            } else swal.fire("Información", "No hay información con los datos ingresados", "error");
                        } else {

                            if (res.EListClient.length == 1) {
                                this.onSelectEconomicActivity();
                                this.sedeContractor = res.EListClient[0].P_SCLIENT;
                                this.InputsQuotation.P_TYPE_SEARCH = "1"; // Tipo de busqueda
                                this.InputsQuotation.P_PERSON_TYPE = "1";
                                this.InputsQuotation.P_SLEGALNAME = "";
                                this.InputsQuotation.P_SFIRSTNAME = "";
                                this.InputsQuotation.P_SLASTNAME = "";
                                this.InputsQuotation.P_SLASTNAME2 = "";
                                this.blockSearch = true;
                                this.stateSearch = false;
                                this.ContractorId = res.EListClient[0].P_SCLIENT;
                                this.InputsQuotation.P_NIDDOC_TYPE = res.EListClient[0].P_NIDDOC_TYPE;
                                this.InputsQuotation.P_SIDDOC = res.EListClient[0].P_SIDDOC;
                                if (res.EListClient[0].P_NIDDOC_TYPE == 1 && res.EListClient[0].P_SIDDOC.length > 1) {
                                    if (res.EListClient[0].P_SIDDOC.substr(0, 2) == "10" || res.EListClient[0].P_SIDDOC.substr(0, 2) == "15" || res.EListClient[0].P_SIDDOC.substr(0, 2) == "17") {
                                        this.blockDoc = true;
                                    } else {
                                        this.blockDoc = false;
                                    }
                                }
                                this.InputsQuotation.P_SFIRSTNAME = res.EListClient[0].P_SFIRSTNAME;
                                this.InputsQuotation.P_SLEGALNAME = res.EListClient[0].P_SLEGALNAME;
                                this.InputsQuotation.P_SLASTNAME = res.EListClient[0].P_SLASTNAME;
                                this.InputsQuotation.P_SLASTNAME2 = res.EListClient[0].P_SLASTNAME2;
                                if (res.EListClient[0].EListAddresClient.length > 0) {
                                    this.InputsQuotation.P_SDESDIREBUSQ = res.EListClient[0].EListAddresClient[0].P_SDESDIREBUSQ;
                                }
                                if (res.EListClient[0].EListEmailClient.length > 0) {
                                    this.InputsQuotation.P_SE_MAIL = res.EListClient[0].EListEmailClient[0].P_SE_MAIL;
                                }
                                this.getContractorLocationList(this.ContractorId);
                            } else {
                                this.EListClient = res.EListClient;
                                const modalRef = this.modalService.open(SearchContractingComponent, { size: 'lg', backdropClass: 'light-blue-backdrop', backdrop: 'static', keyboard: false });
                                modalRef.componentInstance.formModalReference = modalRef;
                                modalRef.componentInstance.EListClient = this.EListClient;

                                modalRef.result.then((ContractorData) => {
                                    if (ContractorData != undefined) {
                                        this.onSelectEconomicActivity();
                                        this.InputsQuotation.P_TYPE_SEARCH = "1"; // Tipo de busqueda
                                        this.InputsQuotation.P_PERSON_TYPE = "1";
                                        this.InputsQuotation.P_SLEGALNAME = "";
                                        this.InputsQuotation.P_SFIRSTNAME = "";
                                        this.InputsQuotation.P_SLASTNAME = "";
                                        this.InputsQuotation.P_SLASTNAME2 = "";
                                        this.stateQuotation = false;
                                        this.blockSearch = true;
                                        this.stateSearch = false;
                                        this.ContractorId = ContractorData.P_SCLIENT;
                                        this.InputsQuotation.P_NIDDOC_TYPE = ContractorData.P_NIDDOC_TYPE;
                                        this.InputsQuotation.P_SIDDOC = ContractorData.P_SIDDOC;
                                        if (ContractorData.P_NIDDOC_TYPE == 1 && ContractorData.P_SIDDOC.length > 1) {
                                            if (ContractorData.P_SIDDOC.substr(0, 2) == "10" || ContractorData.P_SIDDOC.substr(0, 2) == "15" || ContractorData.P_SIDDOC.substr(0, 2) == "17") {
                                                this.blockDoc = true;
                                            } else {
                                                this.blockDoc = false;
                                            }
                                        }
                                        this.InputsQuotation.P_SFIRSTNAME = ContractorData.P_SFIRSTNAME;
                                        this.InputsQuotation.P_SLEGALNAME = ContractorData.P_SLEGALNAME;
                                        this.InputsQuotation.P_SLASTNAME = ContractorData.P_SLASTNAME;
                                        this.InputsQuotation.P_SLASTNAME2 = ContractorData.P_SLASTNAME2;
                                        if (ContractorData.EListAddresClient.length > 0) {
                                            this.InputsQuotation.P_SDESDIREBUSQ = ContractorData.EListAddresClient[0].P_SDESDIREBUSQ;
                                        }
                                        if (ContractorData.EListEmailClient.length > 0) {
                                            this.InputsQuotation.P_SE_MAIL = ContractorData.EListEmailClient[0].P_SE_MAIL;
                                        }
                                        this.getContractorLocationList(this.ContractorId);
                                    }
                                }, (reason) => {
                                });
                            }

                        }
                    }
                } else if (res.P_NCODE == 3) {

                    this.stateQuotation = true;
                    this.clearInputsQuotation();
                    if (AccessFilter.hasPermission("34") == true) {
                        swal.fire({
                            title: "Información",
                            text: "No existe contratante con el número de documento ingresado",
                            type: "info",
                            showCancelButton: true,
                            confirmButtonText: 'Crear Contratante',
                            allowOutsideClick: false,
                            cancelButtonText: 'Cancelar'
                        })
                            .then((result) => {
                                if (result.value) {
                                    this.router.navigate(['/broker/add-contracting'], { queryParams: { typeDocument: this.InputsQuotation.P_NIDDOC_TYPE, document: this.InputsQuotation.P_SIDDOC, receiver: "quotation" } });
                                }
                            });
                    } else swal.fire("Información", "No hay información con los datos ingresados", "error");

                } else {
                    swal.fire("Información", res.P_SMESSAGE, "error");
                }
                self.isLoading = false;
            },
            err => {
                self.isLoading = false;
                swal.fire("Información", "Ocurrió un problema al solicitar su petición", "error");
            }

        );
    }

    getContractorLocationList(contractorId: string) {
        this.contractorLocationIndexService.getContractorLocationList(contractorId, 999, 1).subscribe(
            res => {
                let list: any = [];
                let sedeID = null;
                let departamento = null;
                let provincia = null;
                let municipalidad = null;

                if (res.GENERICLIST.length > 0) {
                    this.stateQuotation = false;

                    res.GENERICLIST.forEach(sede => {
                        if (sede.State == "Activo") {
                            list.push(sede);

                            if (sede.Type == "PRINCIPAL") {
                                sedeID = parseInt(sede.Id);
                                departamento = parseInt(sede.Departament);
                                provincia = parseInt(sede.Province);
                                municipalidad = parseInt(sede.Municipality);
                            }
                        }
                    });

                    this.sedesList = list;
                    this.InputsQuotation.P_NPRODUCT = "-1"; //Producto
                    this.InputsQuotation.P_NIDSEDE = sedeID;
                    this.InputsQuotation.P_NPROVINCE = departamento;
                    this.InputsQuotation.P_NLOCAL = provincia
                    this.InputsQuotation.P_NMUNICIPALITY = municipalidad;
                    this.equivalentMuni();
                    this.onSelectSede();
                    this.getProvinceList();
                    this.getDistrictList();
                } else {
                    this.InputsQuotation.P_NPRODUCT = "-1";
                    this.stateQuotation = true;
                }


            },
            err => {
                console.log(err);
            }
        );
    }

    onSelectSede() {
        switch (this.InputsQuotation.P_NIDSEDE) {
            case null:
                this.InputsQuotation.P_NTECHNICAL = null;
                this.InputsQuotation.P_NECONOMIC = null;
                this.InputsQuotation.P_NPROVINCE = null;
                this.InputsQuotation.P_NLOCAL = null;
                this.InputsQuotation.P_NMUNICIPALITY = null;
                break;
            case 0:
                this.VAL_QUOTATION[2] = "";
                this.InputsQuotation.P_NTECHNICAL = null;
                this.InputsQuotation.P_NECONOMIC = null;
                this.InputsQuotation.P_NPROVINCE = null;
                this.InputsQuotation.P_NLOCAL = null;
                this.InputsQuotation.P_NMUNICIPALITY = null
                this.validarSedes();
                break;
            default:
                this.VAL_QUOTATION[2] = "";
                this.economicValue(this.InputsQuotation.P_NIDSEDE);
                break;
        }
    }
    onSelectDepartment() {
        this.VAL_QUOTATION[4] = "";
        this.InputsQuotation.P_NLOCAL = null;
        this.InputsQuotation.P_NMUNICIPALITY = null;
        this.getProvinceList();
        this.getDistrictList();
    }
    onSelectTypeSearch() {
        this.clearInputsQuotation();
        switch (this.InputsQuotation.P_TYPE_SEARCH) {
            case "1":
                this.blockSearch = true;
                this.InputsQuotation.P_NIDDOC_TYPE = "-1";
                this.InputsQuotation.P_SIDDOC = "";
                this.InputsQuotation.P_PERSON_TYPE = "1";
                this.stateSearch = false;
                this.blockDoc = true;

                break;

            case "2":
                this.blockSearch = false;
                this.InputsQuotation.P_NIDDOC_TYPE = "-1";
                this.InputsQuotation.P_SIDDOC = "";
                this.InputsQuotation.P_PERSON_TYPE = "1";
                this.stateSearch = true;
                this.blockDoc = true;
                break;

        }
    }

    onSelectProvince() {
        this.VAL_QUOTATION[5] = "";
        this.InputsQuotation.P_NMUNICIPALITY = null;
        this.getDistrictList();

    }

    onSelectDistrict() {
        if (this.InputsQuotation.P_NMUNICIPALITY == null) {
        } else {
            this.VAL_QUOTATION[6] = "";
            this.equivalentMuni();
        }
    }

    calcularTarifa() {
        let countWorker = 0;
        let countPlanilla = 0;
        let msg = "";

        this.tasasList.forEach(item => {
            if (item.totalWorkes == 0) {
                this.VAL_QUOTATION[8] = "8";
                countWorker++
            } else {
                if (item.planilla == 0) {
                    msg += "Debe ingresar monto de planilla del riesgo " + item.description + " <br>"
                }
            }

            if (item.planilla == 0) {
                this.VAL_QUOTATION[9] = "9";
                countPlanilla++;
            } else {
                if (item.totalWorkes == 0) {
                    msg += "Debe ingresar trabajadores en el riesgo " + item.description + " <br>"
                }
            }
        });

        if (msg != "") {
            swal.fire("Información", msg, "error");
            return;
        } else {

            if (countPlanilla == this.tasasList.length) {
                msg += "Debe ingresar un monto de planilla en al menos un riesgo <br>"
            }

            if (countWorker == this.tasasList.length) {
                msg += "Debe ingresar trabajadores en al menos un riesgo <br>"
            }

            if (msg != "") {
                swal.fire("Información", msg, "error");
                return;
            }

            this.reloadTariff = true
            this.equivalentMuni()
        }
    }

    equivalentMuni() {
        // this.tasasList = [];
        this.listaTasasSalud = [];
        this.listaTasasPension = [];
        // console.log(this.disabledFlat)
        this.mensajePrimaPension = ""
        this.mensajePrimaSalud = ""

        if (this.InputsQuotation.P_NMUNICIPALITY != null && this.InputsQuotation.P_NTECHNICAL != null) {
            this.quotationService.equivalentMunicipality(this.InputsQuotation.P_NMUNICIPALITY).subscribe(
                res => {
                    this.municipalityTariff = res;
                    this.getTarifario();
                }
            );
        }
    }
    getDate() {
        return new Date()
    }
    economicValue(sedeID) {
        let activityTech = null;
        let activityID = null;
        let delimiter = "0";
        let departamento = null;
        let provincia = null;
        let municipalidad = null;
        this.sedesList.map(function (dato) {
            if (dato.Id == sedeID) {
                activityTech = dato.IdTechnical;
                activityID = dato.IdActivity;
                delimiter = dato.Delimiter;
                departamento = parseInt(dato.Departament);
                provincia = parseInt(dato.Province);
                municipalidad = parseInt(dato.Municipality);
            }
        });
        this.InputsQuotation.P_NTECHNICAL = activityTech; // falta agregar
        this.InputsQuotation.P_NECONOMIC = activityID;
        this.InputsQuotation.P_SDELIMITER = delimiter;
        this.InputsQuotation.P_NPROVINCE = departamento;
        this.InputsQuotation.P_NLOCAL = provincia;
        this.InputsQuotation.P_NMUNICIPALITY = municipalidad;
        this.getEconomicActivityList();
        delimiter == "0" ? this.InputsQuotation.P_DELIMITER = "" : this.InputsQuotation.P_DELIMITER = "* La actividad cuenta con delimitación";
        this.getProvinceList();
        this.getDistrictList();
        this.equivalentMuni();
    }

    validarSedes() {
        this.contractorLocationIndexService.getSuggestedLocationType(this.ContractorId, this.userId).subscribe(
            res => {
                if (res.P_NCODE == 1) {
                    swal.fire('Información', this.listToString(this.stringToList(res.P_SMESSAGE)), 'error');
                } else {
                    let _location = new ContractorLocation(); //solo para enviar el ID de contratante
                    _location.ContractorId = this.ContractorId; //solo para enviar el ID de contratante
                    if (res.P_NCODE == 2) this.openLocationModal(_location, false, '2'); //crear sucursal
                    else if (res.P_NCODE == 3) this.openLocationModal(_location, false, '1'); //crear principal
                }
            },
            err => {
                swal.fire('Información', err, 'error');
            }
        );
    }

    openLocationModal(contractorLocation: ContractorLocation, openModalInEditMode: boolean, suggestedLocationType: string) {
        const modalRef = this.modalService.open(ContractorLocationFormComponent, { size: 'lg', backdropClass: 'light-blue-backdrop', backdrop: 'static', keyboard: false });
        modalRef.componentInstance.formModalReference = modalRef;
        modalRef.componentInstance.contractorLocationData = contractorLocation;
        modalRef.componentInstance.openedInEditMode = openModalInEditMode;
        modalRef.componentInstance.suggestedLocationType = suggestedLocationType;
        modalRef.componentInstance.willBeSaved = true;

        modalRef.result.then((shouldToUpdateLocationTable) => {
            if (shouldToUpdateLocationTable == true) { // debemos actualizar tabla de SEDES?
                this.getContractorLocationList(this.ContractorId);
            } else {
                this.getContractorLocationList(this.ContractorId);
            }
        });

    }

    listToString(inputList: String[]): string {
        let output = "";
        inputList.forEach(function (item) {
            output = output + item + " <br>"
        });
        return output;
    }
    stringToList(inputString: string): string[] {
        let isFirst: Boolean = true;
        let responseList: string[] = [];
        while (inputString.search("-") != -1) {
            if (isFirst == true) {
                isFirst = false;
                inputString = inputString.substring(inputString.search("-") + 1);
            } else {
                responseList.push(inputString.substring(0, inputString.search("-")));
                inputString = inputString.substring(inputString.search("-") + 1);
            }
        }
        return responseList;
    }

    onSelectTechnicalActivity() {
        this.economicActivityList = null;
        this.InputsQuotation.P_DELIMITER = "";
        this.InputsQuotation.P_NECONOMIC = null
        if (this.InputsQuotation.P_NTECHNICAL != null) {
            this.getEconomicActivityList();
        } else {
            this.VAL_QUOTATION[3] = "";
        }
    }

    onSelectEconomicActivity() {
        if (this.InputsQuotation.P_NECONOMIC != null) {
            let delimiter = this.economicActivityList[0].Delimiter;
            delimiter == "0" ? this.InputsQuotation.P_DELIMITER = "" : this.InputsQuotation.P_DELIMITER = "* La actividad cuenta con delimitación";
            this.equivalentMuni();
        } else {
            this.InputsQuotation.P_DELIMITER = "";
            this.VAL_QUOTATION[3] = "";
        }
    }

    clearText(idx) {
        this.VAL_QUOTATION[idx] = "";
    }

    onSelectTypeDocument(typeDocumentID) {
        this.blockDoc = true;
        this.clearInputsQuotation();
        switch (typeDocumentID) {
            case "-1":
                this.InputsQuotation.P_NIDDOC_TYPE = "-1";
                this.typeDocument = 0;
                this.maxlength = 8;
                this.minlength = 8;
                break;
            case "1":
                this.InputsQuotation.P_NIDDOC_TYPE = typeDocumentID;
                this.typeDocument = typeDocumentID;
                this.maxlength = 11;
                this.minlength = 11;
                this.VAL_QUOTATION[0] = "";
                break;
            case "2":
                this.InputsQuotation.P_NIDDOC_TYPE = typeDocumentID;
                this.typeDocument = typeDocumentID;
                this.maxlength = 8;
                this.minlength = 8;
                this.VAL_QUOTATION[0] = "";
                break;
            case "4":
                this.InputsQuotation.P_NIDDOC_TYPE = typeDocumentID;
                this.typeDocument = typeDocumentID;
                this.maxlength = 12;
                this.minlength = 8;
                this.VAL_QUOTATION[0] = "";
                break;
            case "6":
                this.InputsQuotation.P_NIDDOC_TYPE = typeDocumentID;
                this.maxlength = 12;
                this.minlength = 8;
                break;
            default:
                this.InputsQuotation.P_NIDDOC_TYPE = typeDocumentID;
                this.typeDocument = typeDocumentID;
                this.maxlength = 15;
                this.minlength = 8;
                this.VAL_QUOTATION[0] = "";
                break;
        }
    }
    onSelectTypePerson(typePersonID) {

        this.clearInputsQuotation();
        switch (typePersonID) {
            case "1":
                this.blockDoc = true;
                break;
            case "2":
                this.blockDoc = false;
                break;
        }
    }

    clearInputsQuotation() {
        // Contratistas
        this.InputsQuotation.P_SFIRSTNAME = "";
        this.InputsQuotation.P_SLEGALNAME = "";
        this.InputsQuotation.P_SLASTNAME = "";
        this.InputsQuotation.P_SLASTNAME2 = "";
        this.InputsQuotation.P_SDESDIREBUSQ = "";
        this.InputsQuotation.P_SE_MAIL = "";
        this.reloadTariff = false;

        // Cotizacion    
        this.InputsQuotation.P_NIDSEDE = null;
        this.InputsQuotation.P_NCURRENCY = "1";
        this.InputsQuotation.P_NTECHNICAL = null;
        this.InputsQuotation.P_NECONOMIC = null;
        this.InputsQuotation.P_DELIMITER = "";
        this.InputsQuotation.P_SDELIMITER = "0";
        this.InputsQuotation.P_NLOCAL = null;
        this.InputsQuotation.P_NMUNICIPALITY = null;
        this.InputsQuotation.P_NPROVINCE = null;
        this.InputsQuotation.P_NPRODUCT = "-1";

        // Sedes
        this.sedesList = [];
        this.stateQuotation = true;
        this.provinceList = [];
        this.districtList = [];
        this.listaTasasPension = [];
        this.listaTasasSalud = [];
        this.InputsQuotation.P_COMISSION_BROKER_SALUD = "";
        this.InputsQuotation.P_COMISSION_BROKER_SALUD_PRO = "";
        this.InputsQuotation.P_COMISSION_BROKER_PENSION = "";
        this.InputsQuotation.P_COMISSION_BROKER_PENSION_PRO = "";

        this.clearTariff()
    }

    changeSDOC(sdoc) {
        this.stateQuotation = true;
        this.clearInputsQuotation();
        if (this.typeDocument == 1 && sdoc.length > 1) {
            if (sdoc.substr(0, 2) == "10" || sdoc.substr(0, 2) == "15" || sdoc.substr(0, 2) == "17") {
                this.blockDoc = true;
                this.InputsQuotation.P_SLEGALNAME = "";
            } else {
                this.blockDoc = false;
                this.InputsQuotation.P_SFIRSTNAME = "";
                this.InputsQuotation.P_SLASTNAME = "";
                this.InputsQuotation.P_SLASTNAME2 = "";
            }
        }
        if (sdoc.length > 0) {
            this.VAL_QUOTATION[1] = "";
        }
    }

    onSelectProducto(event) {
        if (this.InputsQuotation.P_NPRODUCT != "-1") {
            this.equivalentMuni();
        } else {
            this.clearTariff();
        }
    }

    // Onchange Trabajadores
    changeTrabajadores(cantTrab, valor, row) {
        let totTrab = cantTrab != "" ? parseInt(cantTrab) : 0;
        totTrab = isNaN(totTrab) ? 0 : totTrab;
        let sumaTrabS = 0;
        let sumaTrabP = 0;
        let self = this;
        self.reloadTariff = true

        self.tasasList.map(function (dato) {
            if (dato.id == valor) {
                dato.totalWorkes = totTrab;
            }
        });

        if (self.listaTasasSalud.length > 0) {
            self.listaTasasSalud.map(function (dato) {
                if (dato.id == valor) {
                    dato.totalWorkes = totTrab;
                }
                sumaTrabS = sumaTrabS + parseInt(dato.totalWorkes);
            });

            // self.reloadTariff = true;
            self.stateWorker = true;
            self.messageWorker = "* Para continuar debe calcular nuevamente";
            self.listaTasasSalud.forEach(item => {
                //item.planProp = 0;
                item.rate = self.formateaValor(0)
                item.premiumMonth = self.formateaValor((parseFloat(item.planilla) * parseFloat(item.rate)) / 100);
            });

            self.totalTrabajadoresSalud = sumaTrabS;
            self.InputsQuotation.P_WORKER = self.totalTrabajadoresSalud;

            this.InputsQuotation.P_PRIMA_MIN_SALUD = "0" // Prima minima
            this.InputsQuotation.P_PRIMA_END_SALUD = "0" // Prima endosa

            this.InputsQuotation.P_COMISSION_BROKER_SALUD = "0" // Comision del broker principal
            this.brokerList.forEach(broker => {
                broker.P_COM_SALUD = 0; // Comision de los broker secundarios
            });

            this.totalNetoSaludSave = this.formateaValor(0);
            this.igvSaludSave = this.formateaValor(0); // Solo IGV 
            this.brutaTotalSaludSave = this.formateaValor(0)
            this.mensajePrimaSalud = ""
        }

        if (self.listaTasasPension.length > 0) {
            self.listaTasasPension.map(function (dato) {
                if (dato.id == valor) {
                    dato.totalWorkes = totTrab;
                }
                sumaTrabP = sumaTrabP + parseInt(dato.totalWorkes);
            });

            // self.reloadTariff = true;
            self.stateWorker = true;
            self.messageWorker = "* Para continuar debe calcular nuevamente";
            self.listaTasasPension.forEach(item => {
                //item.planProp = 0;
                item.rate = self.formateaValor(0);
                item.premiumMonth = self.formateaValor((parseFloat(item.planilla) * parseFloat(item.rate)) / 100);
            });

            self.totalTrabajadoresPension = sumaTrabP;
            self.InputsQuotation.P_WORKER = self.totalTrabajadoresPension;

            this.InputsQuotation.P_PRIMA_MIN_PENSION = "0" // Prima minima
            this.InputsQuotation.P_PRIMA_END_PENSION = "0" // Prima endosa

            this.InputsQuotation.P_COMISSION_BROKER_PENSION = "0" // Comision del broker principal
            this.brokerList.forEach(broker => {
                broker.P_COM_PENSION = 0; // Comision de los broker secundarios
            });

            this.totalNetoPensionSave = this.formateaValor(0);
            this.igvPensionSave = this.formateaValor(0); // Solo IGV 
            this.brutaTotalPensionSave = this.formateaValor(0)
            this.mensajePrimaPension = ""
        }


        let sumPlanilla = 0;
        self.tasasList.forEach(item => {
            sumPlanilla = sumPlanilla + item.planilla;
        });

        let sumPropSalud = 0;
        self.listaTasasSalud.forEach(item => {
            sumPropSalud = sumPropSalud + item.planProp;
        });

        let sumPropPension = 0;
        self.listaTasasPension.forEach(item => {
            sumPropPension = sumPropPension + item.planProp;
        });

        if (self.InputsQuotation.P_WORKER > 0) {
            if (self.codFlat == valor) {
                self.disabledFlat.forEach(disable => {
                    disable.value = true;
                    self.disabledFlat[row].value = false;
                });
            } else {
                self.disabledFlat.forEach(disable => {
                    if (disable.id == self.codFlat) {
                        disable.value = true;
                    }
                });
            }
        } else {
            if (sumPlanilla == 0 && sumPropSalud == 0 && sumPropPension == 0) {
                self.disabledFlat.forEach(disable => {
                    disable.value = false;
                });
            }
        }

    }

    changePensionPropuesta(cantComPro, valor) {
        let ComProp = cantComPro != "" ? parseFloat(cantComPro) : 0;
        ComProp = isNaN(ComProp) ? 0 : ComProp;

        this.brokerList.map(function (dato) {
            if (dato.SCLIENT == valor) {
                dato.P_COM_PENSION_PRO = ComProp;
            }
        });
    }

    changeSaludPropuesta(cantComPro, valor) {
        let ComProp = cantComPro != "" ? parseFloat(cantComPro) : 0;
        ComProp = isNaN(ComProp) ? 0 : ComProp;

        this.brokerList.map(function (dato) {
            if (dato.SCLIENT == valor) {
                dato.P_COM_SALUD_PRO = ComProp;
            }
        });
    }

    // Onchange Planilla
    changePlanilla(cantPlanilla, valor, row) {
        let totPlan = cantPlanilla != "" ? parseFloat(cantPlanilla) : 0;
        totPlan = isNaN(totPlan) ? 0 : totPlan;
        let netoPension = 0;
        let netoSalud = 0;
        let self = this;

        this.tasasList.map(function (dato) {
            if (dato.id == valor) {
                dato.planilla = totPlan;
            }
        });

        //Lista Salud
        if (this.listaTasasSalud.length > 0) {
            this.listaTasasSalud.map(function (dato) {
                if (dato.id == valor) {
                    dato.planilla = totPlan;
                    dato.premiumMonth = self.formateaValor((totPlan * parseFloat(dato.rate)) / 100);
                }
                netoSalud = netoSalud + parseFloat(dato.premiumMonth)
            });
            this.totalNetoSalud = this.formateaValor(netoSalud);
            this.igvSalud = this.formateaValor((this.totalNetoSalud * this.igvSaludWS) - this.totalNetoSalud);
            let totalPreviewSalud = parseFloat(this.totalNetoSalud.toString()) + parseFloat(this.igvSalud.toString());
            this.brutaTotalSalud = this.formateaValor(totalPreviewSalud)
            if (parseFloat(this.totalNetoSalud.toString()) > 0) {
                if (parseFloat(this.totalNetoSalud.toString()) < this.InputsQuotation.P_PRIMA_MIN_SALUD) {
                    this.totalNetoSaludSave = this.formateaValor(this.InputsQuotation.P_PRIMA_MIN_SALUD)
                    this.igvSaludSave = this.formateaValor((this.totalNetoSaludSave * this.igvSaludWS) - this.totalNetoSaludSave);
                    this.brutaTotalSaludSave = this.formateaValor(parseFloat(this.totalNetoSaludSave.toString()) + parseFloat(this.igvSaludSave.toString()));
                    this.mensajePrimaSalud = "* Se aplica prima mínima en esta ocasión";
                } else {
                    this.mensajePrimaSalud = ""
                    this.totalNetoSaludSave = this.totalNetoSalud
                    this.igvSaludSave = this.igvSalud;
                    this.brutaTotalSaludSave = this.brutaTotalSalud;
                }
            } else {
                this.mensajePrimaSalud = ""
                this.totalNetoSaludSave = this.totalNetoSalud
                this.igvSaludSave = this.igvSalud;
                this.brutaTotalSaludSave = this.brutaTotalSalud;
            }

        }

        //Lista Pension
        if (this.listaTasasPension.length > 0) {
            this.listaTasasPension.map(function (dato) {
                if (dato.id == valor) {
                    dato.planilla = totPlan;
                    dato.premiumMonth = self.formateaValor((totPlan * parseFloat(dato.rate)) / 100);
                }
                netoPension = netoPension + parseFloat(dato.premiumMonth)
            });
            this.totalNetoPension = this.formateaValor(netoPension);
            this.igvPension = this.formateaValor((this.totalNetoPension * this.igvPensionWS) - this.totalNetoPension);
            let totalPreviewPension = parseFloat(this.totalNetoPension.toString()) + parseFloat(this.igvPension.toString());
            this.brutaTotalPension = this.formateaValor(totalPreviewPension)

            if (parseFloat(this.totalNetoPension.toString())) {
                if (parseFloat(this.totalNetoPension.toString()) < this.InputsQuotation.P_PRIMA_MIN_PENSION) {
                    this.totalNetoPensionSave = this.formateaValor(this.InputsQuotation.P_PRIMA_MIN_PENSION)
                    this.igvPensionSave = this.formateaValor((this.totalNetoPensionSave * this.igvPensionWS) - this.totalNetoPensionSave);
                    this.brutaTotalPensionSave = this.formateaValor(parseFloat(this.totalNetoPensionSave.toString()) + parseFloat(this.igvPensionSave.toString()));
                    this.mensajePrimaPension = "* Se aplica prima mínima en esta ocasión";
                } else {
                    this.mensajePrimaPension = ""
                    this.totalNetoPensionSave = this.totalNetoPension
                    this.igvPensionSave = this.igvPension;
                    this.brutaTotalPensionSave = this.brutaTotalPension;
                }
            } else {
                this.mensajePrimaPension = ""
                this.totalNetoPensionSave = this.totalNetoPension
                this.igvPensionSave = this.igvPension;
                this.brutaTotalPensionSave = this.brutaTotalPension;
            }

        }

        let sumPlanilla = 0;
        self.tasasList.forEach(item => {
            sumPlanilla = sumPlanilla + item.planilla;
        });

        let sumPropSalud = 0;
        self.listaTasasSalud.forEach(item => {
            sumPropSalud = sumPropSalud + item.planProp;
        });

        let sumPropPension = 0;
        self.listaTasasPension.forEach(item => {
            sumPropPension = sumPropPension + item.planProp;
        });

        if (sumPlanilla > 0) {
            if (self.codFlat == valor) {
                self.disabledFlat.forEach(disable => {
                    disable.value = true;
                    self.disabledFlat[row].value = false;
                });
            } else {
                self.disabledFlat.forEach(disable => {
                    if (disable.id == self.codFlat) {
                        disable.value = true;
                    }
                });
            }
        } else {
            if (self.InputsQuotation.P_WORKER == 0 && sumPropSalud == 0 && sumPropPension == 0) {
                self.disabledFlat.forEach(disable => {
                    disable.value = false;
                });
            }
        }

        //this.calcular();
    }

    changePrimaPropuesta(cantPrima, valor) {
        let totPrima = cantPrima != "" ? parseFloat(cantPrima) : 0;
        totPrima = isNaN(totPrima) ? 0 : totPrima;
        let self = this;

        //Lista Salud
        if (this.listaTasasSalud.length > 0) {
            if (totPrima > 0 && this.saludID == valor) {
                if (parseFloat(this.totalNetoSalud.toString()) < totPrima) {
                    this.totalNetoSaludSave = totPrima
                    this.igvSaludSave = this.formateaValor((this.totalNetoSaludSave * this.igvSaludWS) - this.totalNetoSaludSave);
                    this.brutaTotalSaludSave = this.formateaValor(parseFloat(this.totalNetoSaludSave.toString()) + parseFloat(this.igvSaludSave.toString()));
                    this.mensajePrimaSalud = "* Se aplica prima mínima en esta ocasión";
                } else {
                    this.mensajePrimaSalud = ""
                    this.totalNetoSaludSave = this.totalNetoSalud
                    this.igvSaludSave = this.igvSalud;
                    this.brutaTotalSaludSave = this.brutaTotalSalud;
                }
            } else {
                if (this.saludID == valor) {
                    if (parseFloat(this.totalNetoSalud.toString()) < this.InputsQuotation.P_PRIMA_MIN_SALUD) {
                        this.totalNetoSaludSave = this.InputsQuotation.P_PRIMA_MIN_SALUD
                        this.igvSaludSave = this.formateaValor((this.totalNetoSaludSave * this.igvSaludWS) - this.totalNetoSaludSave);
                        this.brutaTotalSaludSave = this.formateaValor(parseFloat(this.totalNetoSaludSave.toString()) + parseFloat(this.igvSaludSave.toString()));
                        this.mensajePrimaSalud = "* Se aplica prima mínima en esta ocasión";
                    } else {
                        this.mensajePrimaSalud = ""
                        this.totalNetoSaludSave = this.totalNetoSalud
                        this.igvSaludSave = this.igvSalud;
                        this.brutaTotalSaludSave = this.brutaTotalSalud;
                    }
                }
            }
        }

        //Lista Pension
        if (this.listaTasasPension.length > 0) {
            if (totPrima > 0 && this.pensionID == valor) {
                if (parseFloat(this.totalNetoPension.toString()) < totPrima) {
                    this.totalNetoPensionSave = totPrima
                    this.igvPensionSave = this.formateaValor((this.totalNetoPensionSave * this.igvPensionWS) - this.totalNetoPensionSave);
                    this.brutaTotalPensionSave = this.formateaValor(parseFloat(this.totalNetoPensionSave.toString()) + parseFloat(this.igvPensionSave.toString()));
                    this.mensajePrimaPension = "* Se aplica prima mínima en esta ocasión";
                } else {
                    this.mensajePrimaPension = ""
                    this.totalNetoPensionSave = this.totalNetoPension
                    this.igvPensionSave = this.igvPension;
                    this.brutaTotalPensionSave = this.brutaTotalPension;
                }
            } else {
                if (this.pensionID == valor) {
                    if (parseFloat(this.totalNetoPension.toString()) < this.InputsQuotation.P_PRIMA_MIN_PENSION) {
                        this.totalNetoPensionSave = this.InputsQuotation.P_PRIMA_MIN_PENSION
                        this.igvPensionSave = this.formateaValor((this.totalNetoPensionSave * this.igvPensionWS) - this.totalNetoPensionSave);
                        this.brutaTotalPensionSave = this.formateaValor(parseFloat(this.totalNetoPensionSave.toString()) + parseFloat(this.igvPensionSave.toString()));
                        this.mensajePrimaPension = "* Se aplica prima mínima en esta ocasión"
                    } else {
                        this.mensajePrimaPension = ""
                        this.totalNetoPensionSave = this.totalNetoPension
                        this.igvPensionSave = this.igvPension;
                        this.brutaTotalPensionSave = this.brutaTotalPension;
                    }
                }
            }

        }

        //this.calcular();
    }

    changeTasaPropuestaSalud(planPro, valor, row) {
        let planProp = planPro != "" ? parseFloat(planPro) : 0;
        planProp = isNaN(planProp) ? 0 : planProp;
        let self = this;

        //Lista Salud
        let sumPropSalud = 0;
        if (this.listaTasasSalud.length > 0) {
            self.listaTasasSalud.forEach(item => {
                if (item.id == valor) {
                    item.planProp = planProp;
                }
                sumPropSalud = sumPropSalud + item.planProp;
            });
        }

        let sumPlanilla = 0;
        self.tasasList.forEach(item => {
            sumPlanilla = sumPlanilla + item.planilla;
        });

        let sumPropPension = 0;
        self.listaTasasPension.forEach(item => {
            sumPropPension = sumPropPension + item.planProp;
        });


        if (sumPropSalud > 0) {
            if (self.codFlat == valor) {
                self.disabledFlat.forEach(disable => {
                    disable.value = true;
                    self.disabledFlat[row].value = false;
                });
            } else {
                self.disabledFlat.forEach(disable => {
                    if (disable.id == self.codFlat) {
                        disable.value = true;
                    }
                });
            }
        } else {
            if (sumPlanilla == 0 && sumPropPension == 0 && self.InputsQuotation.P_WORKER == 0) {
                self.disabledFlat.forEach(disable => {
                    disable.value = false;
                });
            }
        }
        // this.calcular();
    }

    changeTasaPropuestaPension(planPro, valor, row) {
        let planProp = planPro != "" ? parseFloat(planPro) : 0;
        planProp = isNaN(planProp) ? 0 : planProp;
        let self = this;

        //Lista Pension
        let sumPropPension = 0;
        if (this.listaTasasPension.length > 0) {
            self.listaTasasPension.forEach(item => {
                if (item.id == valor) {
                    item.planProp = planProp;
                }
                sumPropPension = sumPropPension + item.planProp;
            });
        }

        let sumPlanilla = 0;
        self.tasasList.forEach(item => {
            sumPlanilla = sumPlanilla + item.planilla;
        });

        let sumPropSalud = 0;
        self.listaTasasSalud.forEach(item => {
            sumPropSalud = sumPropSalud + item.planProp;
        });

        if (sumPropPension > 0) {
            if (self.codFlat == valor) {
                self.disabledFlat.forEach(disable => {
                    disable.value = true;
                    self.disabledFlat[row].value = false;
                });
            } else {
                self.disabledFlat.forEach(disable => {
                    if (disable.id == self.codFlat) {
                        disable.value = true;
                    }
                });
            }
        } else {
            if (sumPlanilla == 0 && self.InputsQuotation.P_WORKER == 0 && sumPropSalud == 0) {
                self.disabledFlat.forEach(disable => {
                    disable.value = false;
                });
            }
        }

        //this.calcular();
    }

    getTarifario() {
        this.InputsQuotation.P_SCTR_SALUD = false
        this.InputsQuotation.P_SCTR_PENSION = false
        this.stateBrokerSalud = true;
        this.stateBrokerPension = true;
        this.stateWorker = false;
        this.messageWorker = "";
        if (this.InputsQuotation.P_NTECHNICAL != null && this.InputsQuotation.P_NMUNICIPALITY != null && this.InputsQuotation.P_NPRODUCT != "-1") {
            let data = new Tariff();
            data.activity = this.InputsQuotation.P_NTECHNICAL; // Actividad Economica
            data.workers = this.InputsQuotation.P_WORKER;
            data.zipCode = this.municipalityTariff.toString(); // Ubigeo Equivalente
            data.queryDate = ""; // Fecha
            data.channel = []; //

            //Agregando el clientId
            if (this.ContractorId != "") {
                let client = new Channel();
                client.clientId = this.ContractorId; // Cliente Contratante
                data.channel.push(client);
            }

            //Agregando los brokerId y middlemanId | Lista de comercializadores
            if (this.brokerList.length > 0) {
                this.brokerList.forEach(broker => {
                    if (broker.NTYPECHANNEL == "6" || broker.NTYPECHANNEL == "8") {
                        let brokerItem = new Channel();
                        brokerItem.brokerId = broker.NCORREDOR.toString();
                        data.channel.push(brokerItem);
                    } else {
                        let middlemanItem = new Channel();
                        middlemanItem.middlemanId = broker.COD_CANAL.toString();
                        data.channel.push(middlemanItem);
                    }
                });
            }

            // //Agregando los brokerId y middlemanId | Comercializador principal
            // if (JSON.parse(localStorage.getItem("currentUser"))["tipoCanal"] == 6 || JSON.parse(localStorage.getItem("currentUser"))["tipoCanal"] == 8) {
            //     let brokerItem = new Channel();
            //     brokerItem.brokerId = JSON.parse(localStorage.getItem("currentUser"))["ncorredor"].toString();
            //     data.channel.push(brokerItem);
            // } else {
            //     let middlemanItem = new Channel();
            //     middlemanItem.middlemanId = JSON.parse(localStorage.getItem("currentUser"))["canal"].toString();
            //     data.channel.push(middlemanItem);
            // }

            this.clientInformationService.getTariff(data).subscribe(
                res => {
                    if (res.fields !== null) {
                        this.resList = res;
                        let self = this;
                        this.COM_SAL_PRO = false
                        this.COM_PEN_PRO = false
                        this.P_PLAN_PRO = [];
                        this.P_PLAN_PRO_PEN = [];
                        this.P_COM_SAL_PRO = [];
                        this.stateBrokerTasaPension = true;
                        this.stateBrokerTasaSalud = true;
                        this.PRIM_MIN_SAL = false;
                        this.PRIM_MIN_PEN = false;
                        this.statePrimaSalud = true;
                        this.statePrimaPension = true;
                        this.InputsQuotation.P_PRIMA_MIN_SALUD_PRO = "";
                        this.InputsQuotation.P_PRIMA_MIN_PENSION_PRO = "";

                        this.resList.fields.forEach(item => {
                            switch (item.fieldEquivalenceCore) {
                                case this.pensionID: // Pension
                                    if (item.enterprise[0].netRate != undefined) {
                                        this.InputsQuotation.P_COMISSION_BROKER_PENSION_PRO = "";
                                        item.enterprise[0].netRate.map(function (dato) {
                                            dato.rate = self.formateaValor(parseFloat(dato.rate) * 100);
                                            dato.premiumMonth = self.formateaValor(parseFloat("0"));
                                            dato.planilla = 0;
                                            dato.planProp = 0;
                                            dato.totalWorkes = 0;
                                            if (self.reloadTariff == false) {
                                                dato.rate = self.formateaValor(0)
                                            }
                                        });
                                    }

                                    if (item.enterprise[0].riskRate != undefined) {
                                        item.enterprise[0].riskRate.forEach(net => {
                                            item.enterprise[0].netRate.map(function (dato) {
                                                if (net.id == dato.id) {
                                                    dato.rateDet = self.formateaValor(parseFloat(net.rate) * 100);;
                                                }
                                            });
                                        });
                                    }

                                    if (item.enterprise[0].netRate != null) {
                                        let activeFlat = false;
                                        item.enterprise[0].netRate.map(function (dato) {
                                            dato.status = 0;
                                        });

                                        var num = 0
                                        item.enterprise[0].netRate.forEach(item => {
                                            self.disabledFlat[num].id = item.id
                                            if (self.reloadTariff == false) {
                                                self.disabledFlat[num].value = false
                                            }
                                            num++
                                        });

                                        if (this.perfil == JSON.parse(localStorage.getItem("currentUser"))["idProfile"]) {
                                            item.enterprise[0].netRate.forEach(risk => {
                                                if (risk.id == this.codFlat) {
                                                    risk.status = 1;
                                                    activeFlat = true;
                                                    num++
                                                }
                                            });

                                            if (activeFlat == false) {
                                                item.enterprise[0].netRate.forEach(risk => {
                                                    risk.status = 1;
                                                });
                                            }

                                            this.listaTasasPension = item.enterprise[0].netRate;

                                        } else {
                                            item.enterprise[0].netRate.forEach(risk => {
                                                risk.status = 1;
                                            });

                                            this.listaTasasPension = item.enterprise[0].netRate;
                                        }

                                    } else {
                                        this.listaTasasPension = []
                                    }

                                    this.P_TOTAL_TRAB = {};
                                    this.P_TOTAL_PLAN = {};

                                    break;
                                case this.saludID:  // Salud
                                    if (item.enterprise[0].netRate != undefined) {
                                        this.InputsQuotation.P_COMISSION_BROKER_SALUD_PRO = "";
                                        item.enterprise[0].netRate.map(function (dato) {
                                            dato.rate = self.formateaValor(parseFloat(dato.rate) * 100);
                                            dato.premiumMonth = self.formateaValor(parseFloat("0"));
                                            dato.planilla = 0;
                                            dato.planProp = 0;
                                            dato.totalWorkes = 0;
                                            if (self.reloadTariff == false) {
                                                dato.rate = self.formateaValor(0)
                                            }
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
                                        let activeFlat = false;

                                        item.enterprise[0].netRate.map(function (dato) {
                                            dato.status = 0;
                                        });

                                        var num = 0
                                        item.enterprise[0].netRate.forEach(item => {
                                            self.disabledFlat[num].id = item.id
                                            if (self.reloadTariff == false) {
                                                self.disabledFlat[num].value = false
                                            }
                                            num++
                                        });

                                        if (this.perfil == JSON.parse(localStorage.getItem("currentUser"))["idProfile"]) {
                                            item.enterprise[0].netRate.forEach(risk => {
                                                if (risk.id == this.codFlat) {
                                                    risk.status = 1;
                                                    activeFlat = true;
                                                    num++
                                                }
                                            });

                                            if (activeFlat == false) {
                                                item.enterprise[0].netRate.forEach(risk => {
                                                    risk.status = 1;
                                                });
                                            }

                                            this.listaTasasSalud = item.enterprise[0].netRate;

                                        } else {

                                            item.enterprise[0].netRate.forEach(risk => {
                                                risk.status = 1;
                                            });

                                            this.listaTasasSalud = item.enterprise[0].netRate;
                                        }
                                        // this.listaTasasSalud = item.enterprise[0].netRate;
                                    } else {
                                        this.listaTasasSalud = []
                                    }

                                    this.P_TOTAL_TRAB = {};
                                    this.P_TOTAL_PLAN = {};
                                    break;
                            }
                        });
                        if (this.listaTasasSalud.length > 0 || this.listaTasasPension.length > 0) {
                            switch (this.InputsQuotation.P_NPRODUCT) {
                                case "-1": // Seleccione
                                    this.clearTariff();
                                    return;
                                    break;
                                case "0": // Ambos
                                    if (this.listaTasasSalud.length == this.listaTasasPension.length) {
                                        this.InputsQuotation.P_COMISSION_BROKER_SALUD = ""; // Comision salud web service
                                        this.InputsQuotation.P_COMISSION_BROKER_SALUD_PRO = ""; // Comision salud propuesta
                                        this.InputsQuotation.P_COMISSION_BROKER_PENSION = ""; // Comision pension web service
                                        this.InputsQuotation.P_COMISSION_BROKER_PENSION_PRO = ""; // Comision pension propuesta
                                        this.InputsQuotation.P_PRIMA_MIN_SALUD = ""; // Prima minima salud
                                        this.InputsQuotation.P_PRIMA_MIN_SALUD_PRO = ""; // Prima minima salud propuesta
                                        this.InputsQuotation.P_PRIMA_MIN_PENSION = ""; // Prima minima pension
                                        this.InputsQuotation.P_PRIMA_MIN_PENSION_PRO = ""; // Prima minima pension propuesta
                                        if (this.tasasList.length == 0) {
                                            this.tasasList = this.listaTasasPension;
                                        }
                                        this.calcular();
                                    } else {
                                        this.clearTariff();
                                        swal.fire("Información", "La tarifa no está configurada correctamente", "error");
                                        return;
                                    }
                                    break;
                                case this.pensionID:
                                    if (this.listaTasasPension.length > 0) {
                                        this.InputsQuotation.P_COMISSION_BROKER_SALUD = ""; // Comision salud web service
                                        this.InputsQuotation.P_COMISSION_BROKER_SALUD_PRO = ""; // Comision salud propuesta;
                                        this.InputsQuotation.P_PRIMA_MIN_SALUD = ""; // Prima minima salud
                                        this.InputsQuotation.P_PRIMA_MIN_SALUD_PRO = ""; // Prima minima salud propuesta
                                        if (this.tasasList.length == 0) {
                                            this.tasasList = this.listaTasasPension;
                                        }
                                        this.listaTasasSalud = [];
                                        this.calcular();
                                    } else {
                                        this.clearTariff();
                                        swal.fire("Información", "La tarifa no está configurada correctamente", "error");
                                        return;
                                    }
                                    break;
                                case this.saludID:
                                    if (this.listaTasasSalud.length > 0) {
                                        this.InputsQuotation.P_COMISSION_BROKER_PENSION = ""; // Comision pension web service
                                        this.InputsQuotation.P_COMISSION_BROKER_PENSION_PRO = ""; // Comision pension propuesta
                                        this.InputsQuotation.P_PRIMA_MIN_PENSION = ""; // Prima minima pension
                                        this.InputsQuotation.P_PRIMA_MIN_PENSION_PRO = ""; // Prima minima pension propuesta
                                        if (this.tasasList.length == 0) {
                                            this.tasasList = this.listaTasasSalud;
                                        }
                                        this.listaTasasPension = [];
                                        this.calcular();
                                    } else {
                                        this.clearTariff();
                                        swal.fire("Información", "La tarifa no está configurada correctamente", "error");
                                        return;
                                    }
                                    break;
                            }
                        } else {
                            this.clearTariff();
                            swal.fire("Información", "La combinación ingresada no cuenta con tarifas configuradas", "error");
                        }
                    } else {
                        this.clearTariff();
                        swal.fire("Información", "La combinación ingresada no cuenta con tarifas configuradas", "error");
                    }
                },
                err => {
                    this.clearTariff();
                    swal.fire("Información", "La combinación ingresada no cuenta con tarifas configuradas", "error");
                }
            );
        } else {

        }

    }

    formateaValor(valor) {
        // si no es un número devuelve el valor, o lo convierte a número con 2 decimales
        return isNaN(valor) ? valor : parseFloat(valor).toFixed(2);
    }

    calcular() {
        let self = this;
        if (self.reloadTariff == false) {
            this.stateWorker = true;
            this.messageWorker = "* Para continuar debe presionar el botón calcular";
        }

        if (this.resList != "") {
            this.resList.fields.forEach(item => {
                switch (item.fieldEquivalenceCore) {
                    case this.pensionID: // Pension
                        if (self.listaTasasPension.length > 0) {
                            self.discountPension = item.discount == null ? "0" : item.discount;
                            self.activityVariationPension = item.activityVariation == null ? "0" : item.activityVariation;
                            self.commissionPension = item.commission == null ? "0" : item.commission;
                            if (item.enterprise[0].netRate != undefined) {
                                let netoPension = 0;

                                self.listaTasasPension.forEach(item => {
                                    self.tasasList.forEach(dato => {
                                        if (item.id == dato.id) {
                                            item.totalWorkes = dato.totalWorkes;
                                            item.planilla = dato.planilla;
                                            item.planProp = 0;
                                            item.premiumMonth = self.formateaValor((parseFloat(dato.planilla) * parseFloat(item.rate)) / 100);
                                        }
                                    });
                                    netoPension = netoPension + parseFloat(item.premiumMonth)
                                });

                                // item.enterprise[0].netRate.map(function (dato) {
                                //     if (self.listaTasasPension != "") {
                                //         self.listaTasasPension.forEach(item => {
                                //             if (item.id == dato.id) {
                                //                 dato.totalWorkes = item.totalWorkes;
                                //                 dato.planilla = item.planilla;
                                //                 dato.planProp = item.planProp;
                                //                 dato.premiumMonth = self.formateaValor((parseFloat(dato.planilla) * parseFloat(dato.rate)) / 100);
                                //             }
                                //         });
                                //         netoPension = netoPension + parseFloat(dato.premiumMonth)
                                //     }
                                // });

                                if (self.listaTasasPension.length > 0) {
                                    //this.listaTasasPension = item.enterprise[0].netRate;
                                    if (self.reloadTariff == true) {
                                        this.InputsQuotation.P_PRIMA_MIN_PENSION = item.enterprise[0].minimumPremium == null ? "0" : item.enterprise[0].minimumPremium;
                                        this.InputsQuotation.P_PRIMA_END_PENSION = item.enterprise[0].minimumPremiumEndoso == null ? "0" : item.enterprise[0].minimumPremiumEndoso;
                                    }
                                }

                                this.totalNetoPension = this.formateaValor(netoPension);
                                this.igvPension = this.formateaValor((this.totalNetoPension * this.igvPensionWS) - this.totalNetoPension); // IGV + CE
                                let totalPreviewPension = parseFloat(this.totalNetoPension.toString()) + parseFloat(this.igvPension.toString());
                                this.brutaTotalPension = this.formateaValor(totalPreviewPension)

                                if (parseFloat(this.totalNetoPension.toString()) < this.InputsQuotation.P_PRIMA_MIN_PENSION) {
                                    this.totalNetoPensionSave = this.formateaValor(this.InputsQuotation.P_PRIMA_MIN_PENSION)
                                    this.igvPensionSave = this.formateaValor((this.totalNetoPensionSave * this.igvPensionWS) - this.totalNetoPensionSave);
                                    this.brutaTotalPensionSave = this.formateaValor(parseFloat(this.totalNetoPensionSave.toString()) + parseFloat(this.igvPensionSave.toString()));
                                    this.mensajePrimaPension = "* Se aplica prima mínima en esta ocasión";
                                } else {
                                    this.mensajePrimaPension = ""
                                    this.totalNetoPensionSave = this.formateaValor(this.totalNetoPension)
                                    this.igvPensionSave = this.formateaValor(this.igvPension);
                                    this.brutaTotalPensionSave = this.formateaValor(this.brutaTotalPension);
                                }

                                if (item.channelDistributions != undefined) {
                                    item.channelDistributions.forEach(channel => {
                                        if (channel.roleId == JSON.parse(localStorage.getItem("currentUser"))["canal"].toString()) {
                                            this.InputsQuotation.P_COMISSION_BROKER_PENSION = (parseFloat(self.commissionPension) * parseFloat(channel.distribution)) / 100;
                                        }
                                    });

                                    item.channelDistributions.forEach(channel => {
                                        this.brokerList.forEach(broker => {
                                            if (channel.roleId == broker.COD_CANAL) {
                                                broker.P_COM_PENSION = (parseFloat(self.commissionPension) * parseFloat(channel.distribution)) / 100;
                                            }
                                        });
                                    });
                                }

                                // Comision en veremos //
                                if (this.InputsQuotation.P_COMISSION_BROKER_PENSION == "") {
                                    this.InputsQuotation.P_COMISSION_BROKER_PENSION = "0";
                                }
                            }
                        }
                        break;
                    case this.saludID: // Salud
                        if (self.listaTasasSalud.length > 0) {
                            self.discountSalud = item.discount == null ? "0" : item.discount;
                            self.activityVariationSalud = item.activityVariation == null ? "0" : item.activityVariation;
                            self.commissionSalud = item.commission == null ? "0" : item.commission;
                            if (item.enterprise[0].netRate != undefined) {
                                let netoSalud = 0;

                                self.listaTasasSalud.forEach(item => {
                                    self.tasasList.forEach(dato => {
                                        if (item.id == dato.id) {
                                            item.totalWorkes = dato.totalWorkes;
                                            item.planilla = dato.planilla;
                                            item.planProp = 0;
                                            item.premiumMonth = self.formateaValor((parseFloat(dato.planilla) * parseFloat(item.rate)) / 100);
                                        }
                                    });
                                    netoSalud = netoSalud + parseFloat(item.premiumMonth)
                                });


                                // item.enterprise[0].netRate.map(function (dato) {
                                //     if (self.listaTasasSalud != "") {
                                //         self.listaTasasSalud.forEach(item => {
                                //             if (item.id == dato.id) {
                                //                 dato.totalWorkes = item.totalWorkes;
                                //                 dato.planilla = item.planilla;
                                //                 dato.planProp = item.planProp;
                                //                 dato.premiumMonth = self.formateaValor((parseFloat(dato.planilla) * parseFloat(dato.rate)) / 100);
                                //             }
                                //         });
                                //         netoSalud = netoSalud + parseFloat(dato.premiumMonth)
                                //     }
                                // });

                                if (self.listaTasasSalud.length > 0) {
                                    // this.listaTasasSalud = item.enterprise[0].netRate;
                                    if (self.reloadTariff == true) {
                                        this.InputsQuotation.P_PRIMA_MIN_SALUD = item.enterprise[0].minimumPremium == null ? "0" : item.enterprise[0].minimumPremium;
                                        this.InputsQuotation.P_PRIMA_END_SALUD = item.enterprise[0].minimumPremiumEndoso == null ? "0" : item.enterprise[0].minimumPremiumEndoso;
                                    }
                                }

                                this.totalNetoSalud = this.formateaValor(netoSalud);
                                this.igvSalud = this.formateaValor((this.totalNetoSalud * this.igvSaludWS) - this.totalNetoSalud); // Solo IGV 
                                let totalPreviewSalud = parseFloat(this.totalNetoSalud.toString()) + parseFloat(this.igvSalud.toString());
                                this.brutaTotalSalud = this.formateaValor(totalPreviewSalud)

                                if (parseFloat(this.totalNetoSalud.toString()) < this.InputsQuotation.P_PRIMA_MIN_SALUD) {
                                    this.totalNetoSaludSave = this.formateaValor(this.InputsQuotation.P_PRIMA_MIN_SALUD)
                                    this.igvSaludSave = this.formateaValor((this.totalNetoSaludSave * this.igvSaludWS) - this.totalNetoSaludSave);
                                    this.brutaTotalSaludSave = this.formateaValor(parseFloat(this.totalNetoSaludSave.toString()) + parseFloat(this.igvSaludSave.toString()));
                                    this.mensajePrimaSalud = "* Se aplica prima mínima en esta ocasión";
                                } else {
                                    this.mensajePrimaSalud = ""
                                    this.totalNetoSaludSave = this.totalNetoSalud
                                    this.igvSaludSave = this.formateaValor(this.igvSalud);
                                    this.brutaTotalSaludSave = this.formateaValor(this.brutaTotalSalud);
                                }

                                if (item.channelDistributions != undefined) {
                                    item.channelDistributions.forEach(channel => {
                                        if (channel.roleId == JSON.parse(localStorage.getItem("currentUser"))["canal"].toString()) {
                                            this.InputsQuotation.P_COMISSION_BROKER_SALUD = (parseFloat(self.commissionSalud) * parseFloat(channel.distribution)) / 100;
                                        }
                                    });
                                    item.channelDistributions.forEach(channel => {
                                        this.brokerList.forEach(broker => {
                                            if (channel.roleId == broker.COD_CANAL) {
                                                broker.P_COM_SALUD = (parseFloat(self.commissionSalud) * parseFloat(channel.distribution)) / 100;
                                            }
                                        });
                                    });
                                }

                                // Comision en veremos //
                                if (this.InputsQuotation.P_COMISSION_BROKER_SALUD == "") {
                                    this.InputsQuotation.P_COMISSION_BROKER_SALUD = "0";
                                }
                            }
                        }
                        break;
                }
            });
        }
    }

    grabarCotizacion() {
        let msg = "";
        this.isLoading = true;
        if (this.InputsQuotation.P_NIDDOC_TYPE == "-1") {
            this.VAL_QUOTATION[0] = "0";
            msg += "Debe ingresar el tipo de documento <br>";
        }

        if (this.InputsQuotation.P_SIDDOC == "") {
            this.VAL_QUOTATION[1] = "1";
            msg += "Debe ingresar el número de documento <br>"
        }

        if (this.InputsQuotation.P_NPRODUCT == "-1") {
            this.VAL_QUOTATION[11] = "10";
            msg += "Debe seleccionar un producto válido <br>"
        }

        if (this.sedesList.length > 0) {
            if (this.InputsQuotation.P_NIDSEDE == null || this.InputsQuotation.P_NIDSEDE == 0) {
                this.VAL_QUOTATION[2] = "2";
                msg += "Debe seleccionar una sede válida <br>"
            }
        } else {
            if (this.InputsQuotation.P_NTECHNICAL == null || this.InputsQuotation.P_NTECHNICAL == 0) {
                this.VAL_QUOTATION[12] = "12";
                msg += "Debe seleccionar una actividad a realizar válida <br>"
            }
            if (this.InputsQuotation.P_NECONOMIC == null || this.InputsQuotation.P_NECONOMIC == 0) {
                this.VAL_QUOTATION[3] = "3";
                msg += "Debe seleccionar una actividad económica válida <br>"
            }
            if (this.InputsQuotation.P_NPROVINCE == null || this.InputsQuotation.P_NPROVINCE == 0) {
                this.VAL_QUOTATION[4] = "4";
                msg += "Debe seleccionar un departamento válida <br>"
            }
            if (this.InputsQuotation.P_NLOCAL == null || this.InputsQuotation.P_NLOCAL == 0) {
                this.VAL_QUOTATION[5] = "5";
                msg += "Debe seleccionar una provincia válida <br>"
            }
            if (this.InputsQuotation.P_NMUNICIPALITY == null || this.InputsQuotation.P_NMUNICIPALITY == 0) {
                this.VAL_QUOTATION[6] = "6";
                msg += "Debe seleccionar un distrito válida <br>"
            }
        }


        if (this.tasasList.length == 0) {
            this.VAL_QUOTATION[7] = "7";
            msg += "Para generar una cotización debe tener un producto <br>"
        } else {
            let countWorker = 0;
            let countPlanilla = 0;

            if (this.listaTasasSalud.length > 0) {

                this.listaTasasSalud.forEach(item => {
                    if (item.totalWorkes == 0) {
                        this.VAL_QUOTATION[8] = "8";
                        countWorker++
                    } else {
                        if (item.planilla == 0) {
                            msg += "Debe ingresar un monto en el campo planilla de la categoría " + item.description + " [Salud] <br>"
                        }
                    }
                    if (item.planilla == 0) {
                        this.VAL_QUOTATION[9] = "9";
                        countPlanilla++;
                    } else {
                        if (item.totalWorkes == 0) {
                            msg += "Debe ingresar trabajadores de la categoría " + item.description + " [Salud] <br>"
                        }
                    }

                    if (item.totalWorkes == 0 && item.planilla == 0) {
                        if (item.planProp != 0) {
                            msg += "No puedes proponer tasa en la categoría " + item.description + " [Salud]<br>"
                        }
                    }

                });
            }

            if (this.listaTasasPension.length > 0) {

                this.listaTasasPension.forEach(item => {
                    if (item.totalWorkes == 0) {
                        this.VAL_QUOTATION[8] = "8";
                        countWorker++
                    } else {
                        if (item.planilla == 0) {
                            msg += "Debe ingresar un monto en el campo planilla de la categoría " + item.description + " [Pensión]<br>"
                        }
                    }
                    if (item.planilla == 0) {
                        this.VAL_QUOTATION[9] = "9";
                        countPlanilla++;
                    } else {
                        if (item.totalWorkes == 0) {
                            msg += "Debe ingresar trabajadores de la categoría " + item.description + " [Pensión]<br>"
                        }
                    }

                    if (item.totalWorkes == 0 && item.planilla == 0) {
                        if (item.planProp != 0) {
                            msg += "No puedes proponer tasa en la categoría " + item.description + " [Pensión]<br>"
                        }
                    }

                });
            }

            if (countPlanilla == this.tasasList.length) {
                if (countWorker == this.tasasList.length) {
                    msg += "Debe ingresar trabajadores al menos en un tipo de riesgo <br>";
                }
            }


            if (countWorker == this.tasasList.length) {
                if (countPlanilla == this.tasasList.length) {
                    msg += "Debe ingresar planilla al menos en un tipo de riesgo <br>";
                }
            }
        }

        if (this.stateWorker == true) {
            msg += "Para continuar debe haber calculado la prima <br />";
        }

        let sumSize = 0;
        this.files.forEach(file => {
            sumSize = sumSize + file.size;
        });

        if (sumSize > this.maxSize) {
            this.VAL_QUOTATION[10] = "10";
            msg += "La suma del tamaño de los archivos no puede superar los 10MB  <br>";
        }
        let self = this;
        if (msg != "") {
            swal.fire("Información", msg, "error");
            self.isLoading = false;
            return;
        } else {
            let self = this;
            let sedeId = "0";
            self.isLoading = false;

            swal.fire({
                title: "Información",
                text: "¿Desea generar la cotización?",
                type: "question",
                showCancelButton: true,
                confirmButtonText: 'Generar',
                allowOutsideClick: false,
                cancelButtonText: 'Cancelar'
            })
                .then((result) => {
                    if (result.value) {
                        self.isLoading = true;

                        if (self.sedesList.length == 0) {
                            let _contractorLocation: any = {};
                            _contractorLocation.Action = "1"
                            _contractorLocation.Address = "DIRECCION PRINCIPAL"
                            _contractorLocation.ContactList = []
                            _contractorLocation.ContractorId = this.sedeContractor
                            _contractorLocation.DepartmentId = this.InputsQuotation.P_NPROVINCE
                            _contractorLocation.Description = "PRINCIPAL"
                            _contractorLocation.DistrictId = this.InputsQuotation.P_NMUNICIPALITY
                            _contractorLocation.EconomicActivityId = this.InputsQuotation.P_NECONOMIC
                            _contractorLocation.ProvinceId = this.InputsQuotation.P_NLOCAL
                            _contractorLocation.StateId = "1"
                            _contractorLocation.TechnicalActivityId = this.InputsQuotation.P_NTECHNICAL
                            _contractorLocation.TypeId = "1"
                            _contractorLocation.UserCode = JSON.parse(localStorage.getItem("currentUser"))["id"]

                            this.contractorLocationIndexService.updateContractorLocation(_contractorLocation).subscribe(
                                res => {
                                    if (res.P_NCODE == 0) {
                                        sedeId = res.P_RESULT;
                                        self.proceso(sedeId, self)
                                    } else if (res.P_NCODE == 1) {
                                        swal.fire('Información', "Ocurrió un problema en la creación de la sede", 'error');
                                        return;
                                    }
                                },
                                err => {
                                    swal.fire('Información', err, 'error');
                                }
                            );
                        }
                        else {
                            self.proceso(sedeId, self)
                        }

                    }
                });
        }
    }

    proceso(sedeId, self) {
        // Inicio
        let now = new Date();
        let dayIni = now.getDate() < 10 ? "0" + now.getDate() : now.getDate();
        let monthPreviewIni = now.getMonth() + 1;
        let monthIni = monthPreviewIni < 10 ? "0" + monthPreviewIni : monthPreviewIni;
        let yearIni = now.getFullYear();

        let dataQuotation: any = {};
        dataQuotation.P_SCLIENT = this.ContractorId;
        dataQuotation.P_NCURRENCY = this.InputsQuotation.P_NCURRENCY;
        dataQuotation.P_NBRANCH = 1;
        dataQuotation.P_DSTARTDATE = dayIni + "/" + monthIni + "/" + yearIni; //Fecha Inicio
        dataQuotation.P_NIDCLIENTLOCATION = self.sedesList.length > 0 ? this.InputsQuotation.P_NIDSEDE : sedeId;
        dataQuotation.P_SCOMMENT = this.InputsQuotation.P_SCOMMENT.toUpperCase();
        dataQuotation.P_SRUTA = "";
        dataQuotation.P_NUSERCODE = this.userId;
        dataQuotation.P_NACT_MINA = this.InputsQuotation.P_MINA == true ? 1 : 0;
        dataQuotation.QuotationDet = [];
        dataQuotation.QuotationCom = [];

        //Detalle de Cotizacion Pension
        if (this.listaTasasPension.length > 0) {
            this.listaTasasPension.forEach(dataPension => {
                let itemQuotationDet: any = {};
                itemQuotationDet.P_NBRANCH = 1;
                itemQuotationDet.P_NPRODUCT = this.pensionID; // Pensión
                itemQuotationDet.P_NMODULEC = dataPension.id;
                itemQuotationDet.P_NTOTAL_TRABAJADORES = dataPension.totalWorkes;
                itemQuotationDet.P_NMONTO_PLANILLA = dataPension.planilla;
                itemQuotationDet.P_NTASA_CALCULADA = dataPension.rate;
                itemQuotationDet.P_NTASA_PROP = dataPension.planProp == "" ? "0" : dataPension.planProp;
                itemQuotationDet.P_NPREMIUM_MENSUAL = dataPension.premiumMonth;
                itemQuotationDet.P_NPREMIUM_MIN = this.InputsQuotation.P_PRIMA_MIN_PENSION;
                itemQuotationDet.P_NPREMIUM_MIN_PR = this.InputsQuotation.P_PRIMA_MIN_PENSION_PRO == "" ? "0" : this.InputsQuotation.P_PRIMA_MIN_PENSION_PRO;
                itemQuotationDet.P_NPREMIUM_END = this.InputsQuotation.P_PRIMA_END_PENSION == "" ? "0" : this.InputsQuotation.P_PRIMA_END_PENSION;
                itemQuotationDet.P_NSUM_PREMIUMN = this.totalNetoPensionSave;
                itemQuotationDet.P_NSUM_IGV = this.igvPensionSave;
                itemQuotationDet.P_NSUM_PREMIUM = this.brutaTotalPensionSave;
                itemQuotationDet.P_NRATE = dataPension.rateDet == "" ? "0" : dataPension.rateDet;
                itemQuotationDet.P_NDISCOUNT = this.discountPension == "" ? "0" : this.discountPension;
                itemQuotationDet.P_NACTIVITYVARIATION = this.activityVariationPension == "" ? "0" : this.activityVariationPension;
                itemQuotationDet.P_FLAG = "0";
                dataQuotation.QuotationDet.push(itemQuotationDet);
            });
        }

        //Detalle de Cotizacion Salud
        if (this.listaTasasSalud.length > 0) {
            this.listaTasasSalud.forEach(dataSalud => {
                let itemQuotationDet: any = {};
                itemQuotationDet.P_NBRANCH = 1;
                itemQuotationDet.P_NPRODUCT = this.saludID; //Salud
                itemQuotationDet.P_NMODULEC = dataSalud.id;
                itemQuotationDet.P_NTOTAL_TRABAJADORES = dataSalud.totalWorkes;
                itemQuotationDet.P_NMONTO_PLANILLA = dataSalud.planilla;
                itemQuotationDet.P_NTASA_CALCULADA = dataSalud.rate;
                itemQuotationDet.P_NTASA_PROP = dataSalud.planProp == "" ? "0" : dataSalud.planProp;
                itemQuotationDet.P_NPREMIUM_MENSUAL = dataSalud.premiumMonth;
                itemQuotationDet.P_NPREMIUM_MIN = this.InputsQuotation.P_PRIMA_MIN_SALUD;
                itemQuotationDet.P_NPREMIUM_MIN_PR = this.InputsQuotation.P_PRIMA_MIN_SALUD_PRO == "" ? "0" : this.InputsQuotation.P_PRIMA_MIN_SALUD_PRO;
                itemQuotationDet.P_NPREMIUM_END = this.InputsQuotation.P_PRIMA_END_SALUD == "" ? "0" : this.InputsQuotation.P_PRIMA_END_SALUD;
                itemQuotationDet.P_NSUM_PREMIUMN = this.totalNetoSaludSave;
                itemQuotationDet.P_NSUM_IGV = this.igvSaludSave;
                itemQuotationDet.P_NSUM_PREMIUM = this.brutaTotalSaludSave;
                itemQuotationDet.P_NRATE = dataSalud.rateDet == "" ? "0" : dataSalud.rateDet;
                itemQuotationDet.P_NDISCOUNT = this.discountSalud == "" ? "0" : this.discountSalud;
                itemQuotationDet.P_NACTIVITYVARIATION = this.activityVariationSalud == "" ? "0" : this.activityVariationSalud;
                itemQuotationDet.P_FLAG = "0";
                dataQuotation.QuotationDet.push(itemQuotationDet);
            });
        }

        //Comercializador Principal
        // let itemQuotationComMain: any = {};
        // itemQuotationComMain.P_NIDTYPECHANNEL = JSON.parse(localStorage.getItem("currentUser"))["tipoCanal"];
        // itemQuotationComMain.P_NINTERMED = JSON.parse(localStorage.getItem("currentUser"))["canal"];
        // itemQuotationComMain.P_SCLIENT_COMER = JSON.parse(localStorage.getItem("currentUser"))["sclient"];
        // itemQuotationComMain.P_NCOMISION_SAL = self.listaTasasSalud.length > 0 ? this.InputsQuotation.P_COMISSION_BROKER_SALUD == "" ? "0" : this.InputsQuotation.P_COMISSION_BROKER_SALUD : "0";
        // itemQuotationComMain.P_NCOMISION_SAL_PR = self.listaTasasSalud.length > 0 ? this.InputsQuotation.P_COMISSION_BROKER_SALUD_PRO == "" ? "0" : this.InputsQuotation.P_COMISSION_BROKER_SALUD_PRO : "0";
        // itemQuotationComMain.P_NCOMISION_PEN = self.listaTasasPension.length > 0 ? this.InputsQuotation.P_COMISSION_BROKER_PENSION == "" ? "0" : this.InputsQuotation.P_COMISSION_BROKER_PENSION : "0";
        // itemQuotationComMain.P_NCOMISION_PEN_PR = self.listaTasasPension.length > 0 ? this.InputsQuotation.P_COMISSION_BROKER_PENSION_PRO == "" ? "0" : this.InputsQuotation.P_COMISSION_BROKER_PENSION_PRO : "0";
        // itemQuotationComMain.P_NPRINCIPAL = 1;
        // dataQuotation.QuotationCom.push(itemQuotationComMain);

        //Comercializadores
        if (this.brokerList.length > 0) {
            this.brokerList.forEach(dataBroker => {
                let itemQuotationCom: any = {};
                itemQuotationCom.P_NIDTYPECHANNEL = dataBroker.NTYPECHANNEL;
                itemQuotationCom.P_NINTERMED = dataBroker.COD_CANAL; //Desarrollo
                itemQuotationCom.P_SCLIENT_COMER = dataBroker.SCLIENT;
                itemQuotationCom.P_NCOMISION_SAL = self.listaTasasSalud.length > 0 ? dataBroker.P_COM_SALUD == "" ? "0" : dataBroker.P_COM_SALUD : "0";
                itemQuotationCom.P_NCOMISION_SAL_PR = self.listaTasasSalud.length > 0 ? dataBroker.P_COM_SALUD_PRO == "" ? "0" : dataBroker.P_COM_SALUD_PRO : "0";
                itemQuotationCom.P_NCOMISION_PEN = self.listaTasasPension.length > 0 ? dataBroker.P_COM_PENSION == "" ? "0" : dataBroker.P_COM_PENSION : "0";
                itemQuotationCom.P_NCOMISION_PEN_PR = self.listaTasasPension.length > 0 ? dataBroker.P_COM_PENSION_PRO == "" ? "0" : dataBroker.P_COM_PENSION_PRO : "0";
                itemQuotationCom.P_NPRINCIPAL = 0;
                dataQuotation.QuotationCom.push(itemQuotationCom);
            });
        }

        let myFormData: FormData = new FormData()
        this.files.forEach(file => {
            myFormData.append(file.name, file);
        });

        self.isLoading = false;
        myFormData.append("objeto", JSON.stringify(dataQuotation));
        this.quotationService.insertQuotation(myFormData).subscribe(
            res => {
                let quotationNumber = 0;
                if (res.P_COD_ERR == 0) {
                    this.clearInsert()
                    quotationNumber = res.P_NID_COTIZACION;
                    if (res.P_SAPROBADO == 'S') {
                        self.isLoading = false;
                        if (res.P_NCODE == 0) {
                            swal.fire({
                                title: "Información",
                                text: "¿Desea emitir la cotización N° " + quotationNumber + " de forma directa?",
                                type: "question",
                                showCancelButton: true,
                                confirmButtonText: 'Sí',
                                allowOutsideClick: false,
                                cancelButtonText: 'No'
                            })
                                .then((result) => {
                                    if (result.value) {
                                        self.isLoading = false;
                                        this.router.navigate(['/broker/policy/emit'], { queryParams: { quotationNumber: quotationNumber } });
                                    }
                                });
                        } else {
                            self.isLoading = false;
                            swal.fire("Información", "Se ha generado correctamente la cotización N° " + quotationNumber + ",  para emitir debe esperar su aprobación.", "success");
                        }
                    } else {
                        self.isLoading = false;
                        swal.fire("Información", "Se ha generado correctamente la cotización N° " + quotationNumber + ",  para emitir debe esperar su aprobación. " + res.P_SMESSAGE, "success");
                    }
                } else {
                    self.isLoading = false;
                    swal.fire("Información", res.P_MESSAGE, "error");
                }
            },
            err => {
                self.isLoading = false;
                swal.fire("Información", "Hubo un error con el servidor", "error");
            }
        );
    }


    getFileExtension(filename) {
        return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
    }
    limpiar() {
        this.clearInsert()
    }
    clearInsert() {
        //Datos Contratante
        this.blockDoc = true;
        this.InputsQuotation.P_NIDDOC_TYPE = "-1"; // Tipo de documento
        this.InputsQuotation.P_SIDDOC = ""; // Nro de documento
        this.InputsQuotation.P_SFIRSTNAME = ""; // Nombre 
        this.InputsQuotation.P_SLASTNAME = ""; // Apellido Paterno
        this.InputsQuotation.P_SLASTNAME2 = ""; // Apellido Materno
        this.InputsQuotation.P_SLEGALNAME = ""; // Razon social
        this.InputsQuotation.P_SE_MAIL = ""; // Email
        this.InputsQuotation.P_SDESDIREBUSQ = ""; // Direccion

        //Datos Cotización
        this.InputsQuotation.P_NCURRENCY = "1"; // Moneda
        this.InputsQuotation.P_NIDSEDE = null; // Sede
        this.InputsQuotation.P_NTECHNICAL = null; // Actividad Tecnica
        this.InputsQuotation.P_NECONOMIC = null; // Actividad Economica
        this.InputsQuotation.P_DELIMITER = ""; // Delimitación check
        this.InputsQuotation.P_SDELIMITER = "0"; // Delimitacion  1 o 0
        this.InputsQuotation.P_NPROVINCE = null;
        this.InputsQuotation.P_NLOCAL = null;
        this.InputsQuotation.P_NMUNICIPALITY = null;
        this.InputsQuotation.P_NPRODUCT = "-1";

        // Sedes
        this.sedesList = [];
        this.stateQuotation = true;
        this.provinceList = [];
        this.districtList = [];
        this.listaTasasPension = [];
        this.listaTasasSalud = [];
        this.InputsQuotation.P_COMISSION_BROKER_SALUD = "";
        this.InputsQuotation.P_COMISSION_BROKER_SALUD_PRO = "";
        this.InputsQuotation.P_COMISSION_BROKER_PENSION = "";
        this.InputsQuotation.P_COMISSION_BROKER_PENSION_PRO = "";

        //Cotizador
        this.clearTariff();

        this.InputsQuotation.P_TYPE_SEARCH = "1"; // Tipo de busqueda
        this.InputsQuotation.P_PERSON_TYPE = "1"; // Tipo persona
        this.brokerList = [];
        this.maxlength = 8;
    }

    clearTariff() {
        this.stateBrokerSalud = true;
        this.stateBrokerPension = true;
        this.statePrimaSalud = true;
        this.statePrimaPension = true;
        this.stateSalud = true;
        this.statePension = true;
        //this.stateQuotation = true;
        this.stateTasaSalud = false;
        this.stateTasaPension = false;
        this.stateBrokerTasaSalud = true;
        this.stateBrokerTasaPension = true;
        this.blockSearch = true;
        this.stateSearch = false;
        this.reloadTariff = false;
        this.messageWorker = ""
        this.typeDocument = 0;
        this.tasasList = [];
        this.listaTasasPension = []
        this.listaTasasSalud = []
        this.P_TOTAL_TRAB = {}
        this.P_TOTAL_PLAN = {}
        this.P_PLAN_PRO = {}
        this.P_PLAN_PRO_PEN = {}
        this.P_COM_SAL_PRO = {}
        this.P_COM_PEN_PRO = {}
        this.InputsQuotation.P_COMISSION_BROKER_SALUD = ""; // Comision salud web service
        this.InputsQuotation.P_COMISSION_BROKER_SALUD_PRO = ""; // Comision salud propuesta
        this.InputsQuotation.P_COMISSION_BROKER_PENSION = ""; // Comision pension web service
        this.InputsQuotation.P_COMISSION_BROKER_PENSION_PRO = ""; // Comision pension propuesta
        this.InputsQuotation.P_PRIMA_MIN_SALUD = ""; // Prima minima salud
        this.InputsQuotation.P_PRIMA_MIN_SALUD_PRO = ""; // Prima minima salud propuesta
        this.InputsQuotation.P_PRIMA_MIN_PENSION = ""; // Prima minima pension
        this.InputsQuotation.P_PRIMA_MIN_PENSION_PRO = ""; // Prima minima pension propuesta
        this.totalNetoPensionSave = 0.00
        this.totalNetoSaludSave = 0.00
        this.igvPensionSave = 0.00
        this.igvSaludSave = 0.00
        this.brutaTotalPensionSave = 0.00
        this.brutaTotalSaludSave = 0.00
        this.discountPension = "";
        this.discountSalud = "";
        this.activityVariationPension = "";
        this.activityVariationSalud = "";
        this.commissionPension = "";
        this.commissionSalud = "";
        this.InputsQuotation.P_SCOMMENT = ""; // Comentario
        this.files = []; // Archivos
    }

    uploadFiles(files: File[]) {
        const myFormData: FormData = new FormData()
        files.forEach(file => {
            myFormData.append("prueba", file);
        });
    }

    addBroker() {
        let modalRef = this.modalService.open(SearchBrokerComponent, { size: 'lg', backdropClass: 'light-blue-backdrop', backdrop: 'static', keyboard: false });
        modalRef.componentInstance.formModalReference = modalRef;
        modalRef.componentInstance.listaBroker = this.brokerList;
        modalRef.componentInstance.brokerMain = this.InputsQuotation.P_SIDDOC_COM;

        modalRef.result.then((BorkerData) => {
            BorkerData.P_COM_SALUD = 0;
            BorkerData.P_COM_SALUD_PRO = 0;
            BorkerData.P_COM_PENSION = 0;
            BorkerData.P_COM_PENSION_PRO = 0;
            BorkerData.PROFILE = JSON.parse(localStorage.getItem("currentUser"))["idProfile"];
            BorkerData.BLOCK = 0; 
            this.brokerList.push(BorkerData);
            this.equivalentMuni();
        }, (reason) => {
        });
    }

    deleteBroker(row) {
        swal.fire({
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
                    this.brokerList.splice(row, 1);
                    this.equivalentMuni();
                }
            });
    }

    documentNumberKeyPress(event: any) {
        let pattern;
        switch (this.InputsQuotation.P_NIDDOC_TYPE) {
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

    valText(event: any, type) {
        let pattern;
        switch (type) {
            case 1: { // Numericos 
                pattern = /[0-9]/;
                break;
            }
            case 2: { // Alfanumericos sin espacios
                pattern = /[0-9A-Za-zñÑÁÉÍÓÚáéíóúÄËÏÖÜäëïöü]/;
                break;
            }
            case 3: { // Alfanumericos con espacios
                pattern = /[0-9A-Za-zñÑÁÉÍÓÚáéíóúÄËÏÖÜäëïöü ]/;
                break;
            }
            case 4: { // LegalName
                pattern = /[a-zA-ZñÑÁÉÍÓÚáéíóúÄËÏÖÜäëïöü0-9-,:()&$#'. ]/;
                break;
            }
            case 5: { // Solo texto
                pattern = /[A-Za-zñÑÁÉÍÓÚáéíóúÄËÏÖÜäëïöü ]/;
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
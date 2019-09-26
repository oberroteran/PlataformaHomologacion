import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { BsDatepickerConfig } from "ngx-bootstrap";
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { DatePipe } from "@angular/common";

//Importación de servicios
import { ClientInformationService } from '../../../services/shared/client-information.service';
import { PolicyemitService } from '../../../services/policy/policyemit.service';

//componentes para ser usados como MODAL
import { PolicyMovementDetailsComponent } from '../policy-movement-details/policy-movement-details.component'
import { PolicyService } from '../../../services/policy/policy.service';
//Compartido
import { AccessFilter } from './../../access-filter'
import { ModuleConfig } from './../../module.config'
import Swal from 'sweetalert2'

@Component({
    selector: 'app-policy-index',
    templateUrl: './policy-index.component.html',
    styleUrls: ['./policy-index.component.css']
})
export class PolicyIndexComponent implements OnInit {
    //
    @ViewChild('desde', null) desde: any;
    @ViewChild('hasta', null) hasta: any;
    userType: number = 1; //1: admin, 2:emisor, 3:comercial, 4:tecnico, 5:cobranza
    isLoading: boolean = false;

    //Datos para configurar los datepicker
    bsConfig: Partial<BsDatepickerConfig>;
    bsValueIni: Date = new Date();
    bsValueFin: Date = new Date();
    bsValueIniMax: Date = new Date();
    bsValueFinMin: Date = new Date();
    bsValueFinMax: Date = new Date();

    //Objeto de busqueda
    InputsSearch: any = {};
    documentTypeList: any = [];
    transaccionList: any = [];
    productList: any = [];
    policyList: any = [];
    blockDoc = true;
    blockSearch = true;
    stateSearch = false;
    maxlength = 8;
    minlength = 8;
    lista = [];
    selectedPolicy: string;

    listToShow: any[] = [];

    /**Puede renovar? */
    canRenovate: boolean;
    /**Puede endosar? */
    canEndorse: boolean;
    /**Puede incluir? */
    canInclude: boolean;
    /**Puede excluir? */
    canExclude: boolean;
    /**Puede netear? */
    canNetear: boolean;
    /**Puede anular? */
    canNullify: boolean;

    currentPage = 1; //página actual
    rotate = true; //
    maxSize = 10; // cantidad de paginas que se mostrarán en el paginado
    itemsPerPage = 5; // limite de items por página
    totalItems = 0; //total de items encontrados

    constructor(
        private clientInformationService: ClientInformationService,
        private policyService: PolicyService,
        private policyemit: PolicyemitService,
        private router: Router,
        private datePipe: DatePipe,
        private modalService: NgbModal
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
        if (AccessFilter.hasPermission(ModuleConfig.ViewIdList["policy_transaction_query"]) == false) this.router.navigate(['/broker/home']);
        this.canRenovate = AccessFilter.hasPermission("19");
        this.canEndorse = AccessFilter.hasPermission("21");
        this.canInclude = AccessFilter.hasPermission("22");
        this.canExclude = AccessFilter.hasPermission("23");
        this.canNetear = AccessFilter.hasPermission("24");
        this.canNullify = AccessFilter.hasPermission("26");

        this.InputsSearch.P_NPRODUCT = "0";
        this.InputsSearch.P_NIDTRANSACCION = "0";
        this.InputsSearch.P_NPOLICY = "";

        this.InputsSearch.P_NIDDOC_TYPE = "-1";
        this.InputsSearch.P_SIDDOC = "";
        this.InputsSearch.P_PERSON_TYPE = "1";
        this.InputsSearch.P_TYPE_SEARCH = "1";
        this.InputsSearch.P_SFIRSTNAME = ""
        this.InputsSearch.P_SLEGALNAME = ""
        this.InputsSearch.P_SLASTNAME = ""
        this.InputsSearch.P_SLASTNAME2 = ""

        this.getDocumentTypeList();
        this.getTransaccionList();
        this.getProductList();

        this.bsValueIni = new Date();
        this.bsValueIni.setDate(this.bsValueIni.getDate() - 30);
        this.bsValueFin = new Date();
        this.bsValueIniMax = new Date();
        this.bsValueFinMin = this.bsValueIni;
        this.bsValueFinMax = new Date();

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

    getTransaccionList() {
        this.policyService.getTransaccionList().subscribe(
            res => {
                this.transaccionList = res;
            },
            err => {
                console.log(err);
            }
        );
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

    openModal(row: number, cotizacionID: string) {
        let modalRef: NgbModalRef;
        if (cotizacionID != "") {
            modalRef = this.modalService.open(PolicyMovementDetailsComponent, { size: 'lg', windowClass: "modalCustom", backdropClass: 'light-blue-backdrop', backdrop: 'static', keyboard: false });
            modalRef.componentInstance.reference = modalRef;
            modalRef.componentInstance.itemTransaccionList = this.policyList;
            modalRef.componentInstance.cotizacionID = cotizacionID;
        }
    }

    onSelectTypeDocument() {
        switch (this.InputsSearch.P_NIDDOC_TYPE) {
            case "-1":
                this.maxlength = 8;
                this.minlength = 8;
                break;
            case "1":
                this.maxlength = 11;
                this.minlength = 11;
                break;
            case "2":
                this.maxlength = 8;
                this.minlength = 8;
                break;
            case "4":
                this.maxlength = 12;
                this.minlength = 8;
                break;
            case "4":
                this.maxlength = 12;
                this.minlength = 8;
                break;
            default:
                this.maxlength = 15;
                this.minlength = 8;
                break;
        }
    }

    onSelectTypePerson() {
        switch (this.InputsSearch.P_PERSON_TYPE) {
            case "1":
                this.blockDoc = true;
                break;
            case "2":
                this.blockDoc = false;
                break;
        }
    }

    onSelectTypeSearch() {
        switch (this.InputsSearch.P_TYPE_SEARCH) {
            case "1":
                this.blockSearch = true;
                this.blockDoc = true;
                this.InputsSearch.P_SFIRSTNAME = ""
                this.InputsSearch.P_SLEGALNAME = ""
                this.InputsSearch.P_SLASTNAME = ""
                this.InputsSearch.P_SLASTNAME2 = ""
                break;

            case "2":
                this.blockSearch = false;
                this.blockDoc = true;
                this.InputsSearch.P_NIDDOC_TYPE = "-1";
                this.InputsSearch.P_SIDDOC = "";
                break;

        }
    }

    changePolicy(sdoc) {
        if (sdoc.length > 0) {
            this.stateSearch = true;
            this.InputsSearch.P_NIDPRODUCT = "0";
            this.InputsSearch.P_NIDTRANSACCION = "0";
            this.InputsSearch.P_NIDDOC_TYPE = "-1";
            this.InputsSearch.P_SIDDOC = "";
            this.InputsSearch.P_PERSON_TYPE = "1";
            this.InputsSearch.P_TYPE_SEARCH = "1";
            this.InputsSearch.P_SFIRSTNAME = ""
            this.InputsSearch.P_SLEGALNAME = ""
            this.InputsSearch.P_SLASTNAME = ""
            this.InputsSearch.P_SLASTNAME2 = ""
        } else {
            this.stateSearch = false;
        }
    }

    documentNumberKeyPress(event: any) {
        let pattern;
        switch (this.InputsSearch.P_NIDDOC_TYPE) {
            case "-1": { //ruc 
                pattern = /[0-9]/;
                break;
            }
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

    buscarPoliza() {
        this.listToShow = [];
        this.currentPage = 1; //página actual
        this.maxSize = 10; // cantidad de paginas que se mostrarán en el paginado
        this.itemsPerPage = 5; // limite de items por página
        this.totalItems = 0; //total de items encontrados

        let msg: string = "";
        if (this.InputsSearch.P_NIDDOC_TYPE != "-1") {
            if (this.InputsSearch.P_SIDDOC == "") {
                msg = "Debe llenar el número de documento"
            }
        }

        if (this.InputsSearch.P_SIDDOC != "") {
            if (this.InputsSearch.P_NIDDOC_TYPE == "-1") {
                msg = "Debe llenar el tipo de documento"
            }
        }

        if (this.InputsSearch.P_SFIRSTNAME != "") {
            if (this.InputsSearch.P_SFIRSTNAME.length < 2) {
                msg += "El campo nombre debe contener al menos 2 caracteres <br />"
            }
        }

        if (this.InputsSearch.P_SLASTNAME != "") {
            if (this.InputsSearch.P_SLASTNAME.length < 2) {
                msg += "El campo apellido paterno debe contener al menos 2 caracteres"
            }
        }

        if (msg != "") {
            Swal.fire("Información", msg, "error");
        } else {

            this.isLoading = true;
            //Fecha Inicio
            let dayIni = this.bsValueIni.getDate() < 10 ? "0" + this.bsValueIni.getDate() : this.bsValueIni.getDate();
            let monthPreviewIni = this.bsValueIni.getMonth() + 1;
            let monthIni = monthPreviewIni < 10 ? "0" + monthPreviewIni : monthPreviewIni;
            let yearIni = this.bsValueIni.getFullYear();

            //Fecha Fin
            let dayFin = this.bsValueFin.getDate() < 10 ? "0" + this.bsValueFin.getDate() : this.bsValueFin.getDate();
            let monthPreviewFin = this.bsValueFin.getMonth() + 1;
            let monthFin = monthPreviewFin < 10 ? "0" + monthPreviewFin : monthPreviewFin;
            let yearFin = this.bsValueFin.getFullYear();

            let data: any = {};
            data.P_NPOLICY = this.InputsSearch.P_NPOLICY == "0" ? "" : this.InputsSearch.P_NPOLICY
            data.P_NPRODUCT = this.InputsSearch.P_NPRODUCT == "0" ? "" : this.InputsSearch.P_NPRODUCT
            data.P_FECHA_DESDE = dayIni + "/" + monthIni + "/" + yearIni;
            data.P_FECHA_HASTA = dayFin + "/" + monthFin + "/" + yearFin;
            data.P_NTYPE_TRANSAC = this.InputsSearch.P_NIDTRANSACCION == "0" ? "" : this.InputsSearch.P_NIDTRANSACCION;
            data.P_TIPO_DOC_CONT = this.InputsSearch.P_NIDDOC_TYPE == "-1" ? "" : this.InputsSearch.P_NIDDOC_TYPE;
            data.P_NUM_DOC_CONT = this.InputsSearch.P_SIDDOC;
            data.P_RAZON_SOCIAL_CONT = this.InputsSearch.P_SLEGALNAME;
            data.P_APE_PAT_CONT = this.InputsSearch.P_SLASTNAME;
            data.P_APE_MAT_CONT = this.InputsSearch.P_SLASTNAME2;
            data.P_NOMBRES_CONT = this.InputsSearch.P_SFIRSTNAME;
            data.P_NUSERCODE = JSON.parse(localStorage.getItem("currentUser"))["id"];
            this.policyService.getPolicyTransList(data).subscribe(
                res => {
                    this.isLoading = false;
                    this.policyList = res.C_TABLE;
                    this.totalItems = this.policyList.length;
                    this.listToShow = this.policyList.slice(((this.currentPage - 1) * this.itemsPerPage), (this.currentPage * this.itemsPerPage));
                    if (this.policyList.length == 0) {
                        Swal.fire({
                            title: "Información",
                            text: "No se encuentran póliza(s) con los datos ingresados",
                            type: "error",
                            confirmButtonText: 'OK',
                            allowOutsideClick: false,
                        }).then((result) => {
                            if (result.value) {
                                return;
                            }
                        });
                    }
                },
                err => {
                    this.isLoading = false;
                    console.log(err);
                }
            );
        }
    }

    pageChanged(currentPage) {
        this.currentPage = currentPage;
        this.listToShow = this.policyList.slice(((this.currentPage - 1) * this.itemsPerPage), (this.currentPage * this.itemsPerPage));
        this.selectedPolicy = "";
    }

    choosePolicyClk(evt, selection: any, idTipo: number) {
        if (selection != undefined && selection != "") {
            if (this.policyList.length > 0) {
                this.policyList.forEach(item => {
                    if (item.NRO_COTIZACION == selection) {
                        this.policyService.valTransactionPolicy(item.NRO_COTIZACION).subscribe(
                            res => {
                                if (res.P_COD_ERR == "0") {
                                    switch (idTipo) {
                                        case 1: // Anular
                                            this.router.navigate(['/broker/policy/transaction/cancel'], { queryParams: { nroCotizacion: item.NRO_COTIZACION } });
                                            break;
                                        case 2: // Incluir
                                            this.router.navigate(['/broker/policy/transaction/include'], { queryParams: { nroCotizacion: item.NRO_COTIZACION } });
                                            break;
                                        case 3: // Exluir
                                            this.router.navigate(['/broker/policy/transaction/exclude'], { queryParams: { nroCotizacion: item.NRO_COTIZACION } });
                                            break;
                                        case 4: // Renovar
                                            this.router.navigate(['/broker/policy/transaction/renew'], { queryParams: { nroCotizacion: item.NRO_COTIZACION } });
                                            break;
                                        case 5: //Neteo
                                            this.router.navigate(['/broker/policy/transaction/netear'], { queryParams: { nroCotizacion: item.NRO_COTIZACION } });
                                            break;
                                        case 6: //Endoso
                                            this.router.navigate(['/broker/policy/transaction/endosar'], { queryParams: { nroCotizacion: item.NRO_COTIZACION } });
                                            break;
                                        case 9: //Facturacion
                                            this.recibosPoliza(item);
                                            break;
                                    }
                                } else {
                                    Swal.fire({
                                        title: "Información",
                                        text: res.P_MESSAGE,
                                        type: "error",
                                        confirmButtonText: 'OK',
                                        allowOutsideClick: false,
                                    }).then((result) => {
                                        if (result.value) {
                                            return;
                                        }
                                    });
                                }
                            },
                            err => {
                                this.isLoading = false;
                            }
                        );
                    }
                });
            }
        } else {
            Swal.fire({
                title: "Información",
                text: "Para continuar deberá elegir una póliza",
                type: "error",
                confirmButtonText: 'OK',
                allowOutsideClick: false,
            }).then((result) => {
                if (result.value) {
                    return;
                }
            });
        }
        evt.preventDefault();
    }

    recibosPoliza(itemFact: any) {
        let myFormData: FormData = new FormData()
        let renovacion: any = {};
        renovacion.P_NID_COTIZACION = itemFact.NRO_COTIZACION // nro cotizacion
        renovacion.P_DEFFECDATE = null; //Fecha Inicio
        renovacion.P_DEXPIRDAT = null; // Fecha Fin
        renovacion.P_NUSERCODE = JSON.parse(localStorage.getItem("currentUser"))["id"] // Fecha hasta
        renovacion.P_NTYPE_TRANSAC = 9; // tipo de movimiento
        renovacion.P_NID_PROC = "" // codigo de proceso (Validar trama)
        renovacion.P_FACT_MES_VENCIDO = null // Facturacion Vencida
        renovacion.P_SFLAG_FAC_ANT = null // Facturacion Anticipada
        renovacion.P_SCOLTIMRE = null // Tipo de renovacion
        renovacion.P_NPAYFREQ = null // Frecuencia Pago
        renovacion.P_NMOV_ANUL = null // Movimiento de anulacion
        renovacion.P_NNULLCODE = 0 // Motivo anulacion
        renovacion.P_SCOMMENT = "" // Frecuencia Pago

        myFormData.append("objeto", JSON.stringify(renovacion));

        Swal.fire({
            title: "Información",
            text: "¿Deseas generar recibos de la(s) póliza(s) " + itemFact.POLIZA + "?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: 'Generar',
            allowOutsideClick: false,
            cancelButtonText: 'Cancelar'
        })
            .then((result) => {
                if (result.value) {
                    this.policyemit.transactionPolicy(myFormData).subscribe(
                        res => {
                            if (res.P_COD_ERR == 0) {
                                Swal.fire({
                                    title: "Información",
                                    text: "Se ha realizado la generación de recibos correctamente",
                                    type: "success",
                                    confirmButtonText: 'OK',
                                    allowOutsideClick: false,
                                })
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
                            console.log(err);
                        }
                    );
                }
            });
    }

    valInicio(event) {
        this.bsValueFinMin = new Date(this.bsValueIni);

    }
    valFin(event) {
        this.bsValueIniMax = new Date(this.bsValueFin);
    }
}


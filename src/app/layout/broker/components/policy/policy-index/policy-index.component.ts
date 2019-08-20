import { Component, OnInit } from '@angular/core';
import { BsDatepickerConfig } from "ngx-bootstrap";
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { DatePipe } from "@angular/common";

//Importación de servicios
import { ClientInformationService } from '../../../services/shared/client-information.service';

//componentes para ser usados como MODAL
import { PolicyMovementDetailsComponent } from '../policy-movement-details/policy-movement-details.component'
import { PolicyFormComponent } from '../policy-form/policy-form.component'
import { PolicyService } from '../../../services/policy/policy.service';

//Alertas
import swal from 'sweetalert2';
//Compartido
import { AccessFilter } from './../../access-filter'
import { ModuleConfig } from './../../module.config'

@Component({
    selector: 'app-policy-index',
    templateUrl: './policy-index.component.html',
    styleUrls: ['./policy-index.component.css']
})
export class PolicyIndexComponent implements OnInit {
    //
    userType: number = 1; //1: admin, 2:emisor, 3:comercial, 4:tecnico, 5:cobranza
    isLoading: boolean = false;

    //Datos para configurar los datepicker
    bsConfig: Partial<BsDatepickerConfig>;
    bsValueIni: Date = new Date();
    bsValueFin: Date = new Date();

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

    public currentPage = 1; //página actual
    public rotate = true; //
    public maxSize = 10; // cantidad de paginas que se mostrarán en el paginado
    public itemsPerPage = 5; // limite de items por página
    public totalItems = 0; //total de items encontrados

    constructor(
        private clientInformationService: ClientInformationService,
        private policyService: PolicyService,
        private router: Router,
        private datePipe: DatePipe,
        private modalService: NgbModal
    ) { }

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
        this.bsValueIni.setDate(this.bsValueIni.getDate() - 30);
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
            // console.log(row)
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
                break;
            case "1":
                this.maxlength = 11;
                break;
            case "2":
                this.maxlength = 8;
                break;
            case "4":
                this.maxlength = 12;
                break;
            default:
                this.maxlength = 15;
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

    BuscarPoliza() {

        this.listToShow = [];
        this.currentPage = 1; //página actual
        this.maxSize = 10; // cantidad de paginas que se mostrarán en el paginado
        this.itemsPerPage = 6; // limite de items por página
        this.totalItems = 0; //total de items encontrados

        let msg: string = "";
        if (this.InputsSearch.P_NIDDOC_TYPE != "-1") {
            console.log(this.InputsSearch.P_SIDDOC)
            if (this.InputsSearch.P_SIDDOC == "") {
                msg = "Debe llenar el número de documento"
            }
        }

        if (this.InputsSearch.P_SIDDOC != "") {
            console.log(this.InputsSearch.P_SIDDOC)
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
            swal.fire("Información", msg, "error");
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
            // console.log(data)
            this.policyService.getPolicyTransList(data).subscribe(
                res => {
                    // console.log(res.C_TABLE)
                    this.isLoading = false;
                    this.policyList = res.C_TABLE;
                    this.totalItems = this.policyList.length;
                    this.listToShow = this.policyList.slice(((this.currentPage - 1) * this.itemsPerPage), (this.currentPage * this.itemsPerPage));
                    if (this.policyList.length == 0) {
                        swal.fire({
                            title: "Información",
                            text: "No se encuentran póliza(s) con los datos ingresados",
                            type: "error",
                            confirmButtonText: 'OK',
                            allowOutsideClick: false,
                        }).then((result) => {
                            if (result.value) {
                                //this.router.navigate(['/broker/policy-transactions']);
                            }
                        });
                    }
                    // console.log(this.policyList);
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

    }

    choosePolicyClk(selection: any, idTipo: number) {
        if (selection != undefined) {
            //let existe: any = 0;

            if (this.policyList.length > 0) {
                this.policyList.forEach(element => {
                    if (element.NRO_COTIZACION == this.policyList[this.selectedPolicy].NRO_COTIZACION) {
                        this.policyService.valTransactionPolicy(element.NRO_COTIZACION).subscribe(
                            res => {
                                console.log(res)
                                if (res.P_COD_ERR == "0") {
                                    switch (idTipo) {
                                        case 1: // Anular
                                            this.router.navigate(['/broker/policy/transaction/cancel'], { queryParams: { nroCotizacion: element.NRO_COTIZACION } });
                                            break;
                                        case 2: // Incluir
                                            this.router.navigate(['/broker/policy/transaction/include'], { queryParams: { nroCotizacion: element.NRO_COTIZACION } });
                                            break;
                                        case 3: // Exluir
                                            this.router.navigate(['/broker/policy/transaction/exclude'], { queryParams: { nroCotizacion: element.NRO_COTIZACION } });
                                            break;
                                        case 4: // Renovar
                                            this.router.navigate(['/broker/policy/transaction/renew'], { queryParams: { nroCotizacion: element.NRO_COTIZACION } });
                                            break;
                                        case 5: //Neteo
                                            this.router.navigate(['/broker/policy/transaction/netear'], { queryParams: { nroCotizacion: element.NRO_COTIZACION } });
                                            break;
                                        case 6: //Endoso
                                            this.router.navigate(['/broker/policy/transaction/endosar'], { queryParams: { nroCotizacion: element.NRO_COTIZACION } });
                                            break;
                                    }
                                } else {
                                    swal.fire({
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
                                console.log(err);
                            }
                        );
                    }
                });
            }

            // if (idTipo == 1) {
            //     console.log(selection)
            // }

        } else {
            swal.fire({
                title: "Información",
                text: "Para continuar deberá elegir una póliza",
                type: "error",
                confirmButtonText: 'OK',
                allowOutsideClick: false,
            }).then((result) => {
                if (result.value) {
                    return;
                    //this.router.navigate(['/broker/policy-transactions']);
                }
            });
        }
    }
}


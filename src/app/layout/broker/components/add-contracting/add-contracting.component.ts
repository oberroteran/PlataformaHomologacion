import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from "@angular/forms";
import { BsDatepickerConfig } from "ngx-bootstrap";
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from "@angular/router";
import { DatePipe } from "@angular/common";

//Importación de servicios
import { ClientInformationService } from '../../services/shared/client-information.service';
import { ContractorLocationIndexService } from '../../services/maintenance/contractor-location/contractor-location-index/contractor-location-index.service';

//Importacion de modelos
import { DocumentType } from '../../models/shared/client-information/document-type';
import { Nacionality } from '../../models/shared/client-information/nationality-type';
import { Gender } from '../../models/shared/client-information/gender-type';
import { CivilStatus } from '../../models/shared/client-information/civilStatus-type';
import { Profession } from '../../models/shared/client-information/profession-type';
import { EconomicActivity } from '../../models/shared/client-information/economic-activity';
import { ContractorLocationContactREQUEST } from '../../models/maintenance/contractor-location/Request/contractor-location-contact-request';
import { ClientDataToSearch } from '../../models/shared/client-information/client-data-to-search';

//componentes para ser usados como MODAL
import { AddTelephoneComponent } from '../../modal/add-telephone/add-telephone.component';
import { AddAddressComponent } from '../../modal/add-address/add-address.component';
import { AddContactComponent } from '../../modal/add-contact/add-contact.component';
import { AddEmailComponent } from '../../modal/add-email/add-email.component';
import { AddCiiuComponent } from '../../modal/add-ciiu/add-ciiu.component';
import { ContractorLocationFormComponent } from '../maintenance/contractor-location/contractor-location-form/contractor-location-form.component';
import swal from 'sweetalert2';


@Component({
    selector: 'app-add-contracting',
    templateUrl: './add-contracting.component.html',
    styleUrls: ['./add-contracting.component.css']
})
export class AddContractingComponent implements OnInit {
    bsValueFNac: any;
    bsConfig: Partial<BsDatepickerConfig>;
    documentTypeList: DocumentType[];
    nacionalityList: Nacionality[];
    genderList: Gender[];
    civilStatusList: CivilStatus[];
    professionList: Profession[];
    economicActivityList: EconomicActivity[];
    InputsContracting: any = {};
    typeContact: any = {};
    maxlength = 8;
    blockDoc = true;
    blockCuspp = true;
    typeDocument = 0;
    txtNacimiento = "FECHA DE NACIMIENTO (*)";
    receiverApp = "";
    datosClient: any = [];

    //Errores cliente
    VAL_CLIENT: any = {};

    // Listas a Guardar
    listaDirecciones = [];
    listaTelefonos = [];
    listaCorreos = [];
    listaContactos = [];
    listaSedes = [];
    listaCiiu = [];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private modalService: NgbModal,
        private clientInformationService: ClientInformationService,
        private contractorLocationIndexService: ContractorLocationIndexService,
        private datePipe: DatePipe
    ) {

        this.bsConfig = Object.assign(
            {},
            {
                dateInputFormat: "DD/MM/YYYY",
                locale: "es",
                // containerClass: 'theme-dark-blue',
                showWeekNumbers: false
            }
        );
    }

    ngOnInit() {
        this.getDocumentTypeList();
        this.getNationalityList();
        this.getGenderList();
        this.getCivilStatusList();
        //this.getProfessionList();
        //this.getEconomicActivityList();

        this.VAL_CLIENT[0] = ""; // Nombre
        this.VAL_CLIENT[1] = ""; // Razon Social
        this.VAL_CLIENT[2] = ""; // Apellido Pat
        this.VAL_CLIENT[3] = ""; // Apellido Mat
        this.VAL_CLIENT[4] = ""; // Fecha de nacimiento / creacion
        this.VAL_CLIENT[5] = ""; // Sedes
        this.VAL_CLIENT[6] = ""; // Ciiu
        // this.VAL_CLIENT[7] = ""; // Min Producto
        // this.VAL_CLIENT[8] = ""; // Trabajadore
        // this.VAL_CLIENT[9] = ""; // Planilla
        // this.VAL_CLIENT[10] = ""; // Sum Archivos

        this.bsValueFNac = new Date("01/01/1950")
        //Objeto a grabar
        this.route.queryParams
            //.filter(params => params.tipoDocumento)
            .subscribe(params => {
                // console.log(params);
                this.InputsContracting.P_NIDDOC_TYPE = params.typeDocument;
                this.InputsContracting.P_SIDDOC = params.document;
                this.receiverApp = params.receiver;
            });

        if (this.InputsContracting.P_NIDDOC_TYPE != undefined && this.InputsContracting.P_SIDDOC != undefined && this.InputsContracting.P_NIDDOC_TYPE != "" && this.InputsContracting.P_SIDDOC != "" &&
            this.receiverApp != undefined && this.receiverApp != "") {

            if (this.InputsContracting.P_NIDDOC_TYPE == 1 && this.InputsContracting.P_SIDDOC.trim().length > 1) {
                if (this.InputsContracting.P_SIDDOC.substr(0, 2) != "10" && this.InputsContracting.P_SIDDOC.substr(0, 2) != "15" && this.InputsContracting.P_SIDDOC.substr(0, 2) != "17" && this.InputsContracting.P_SIDDOC.substr(0, 2) != "20") {
                    console.log(this.InputsContracting.P_SIDDOC.substr(0, 2))
                    swal.fire("Información", "El número de RUC no es válido, debe empezar con 10, 15, 17, 20", "error");
                    return
                }
            }

            let data = new ClientDataToSearch();
            data.P_CodAplicacion = "SCTR";
            data.P_TipOper = "CON";
            data.P_NUSERCODE = JSON.parse(localStorage.getItem("currentUser"))["id"];
            data.P_NIDDOC_TYPE = this.InputsContracting.P_NIDDOC_TYPE;
            data.P_SIDDOC = this.InputsContracting.P_SIDDOC;
            data.P_SFIRSTNAME = "";
            data.P_SLASTNAME = "";
            data.P_SLASTNAME2 = "";
            data.P_SLEGALNAME = "";

            this.clientInformationService.getClientInformation(data).subscribe(
                res => {
                    console.log(res.EListClient)
                    if (res.EListClient != null) {
                        if (res.EListClient.length > 0) {
                            this.datosClient = res.EListClient[0];
                            this.InputsContracting.P_TipOper = "INS";
                            this.InputsContracting.P_SFIRSTNAME = res.EListClient[0].P_SFIRSTNAME;
                            this.InputsContracting.P_SLASTNAME = res.EListClient[0].P_SLASTNAME;
                            this.InputsContracting.P_SLASTNAME2 = res.EListClient[0].P_SLASTNAME2;
                            this.InputsContracting.P_SLEGALNAME = res.EListClient[0].P_SLEGALNAME;
                            this.InputsContracting.P_SSEXCLIEN = res.EListClient[0].P_SSEXCLIEN != "" ? res.EListClient[0].P_SSEXCLIEN : "3";
                            let dd = res.EListClient[0].P_DBIRTHDAT.substr(0, 2);
                            let mm = res.EListClient[0].P_DBIRTHDAT.substr(3, 2);
                            let yy = res.EListClient[0].P_DBIRTHDAT.substr(6, 4);
                            this.bsValueFNac = new Date(mm + "/" + dd + "/" + yy);
                            this.InputsContracting.P_DBIRTHDAT = res.EListClient[0].P_DBIRTHDAT;
                            this.InputsContracting.P_NSPECIALITY = res.EListClient[0].P_NSPECIALITY != "" ? res.EListClient[0].P_NSPECIALITY : "99";
                            this.InputsContracting.P_NCIVILSTA = res.EListClient[0].P_NCIVILSTA != "" ? res.EListClient[0].P_NCIVILSTA : "6";
                            this.InputsContracting.P_SBLOCKADE = "2";
                            this.InputsContracting.P_NTITLE = res.EListClient[0].P_NTITLE != "" ? res.EListClient[0].P_NSPECIALITY : "99";
                            this.InputsContracting.P_NHEIGHT = null;
                            this.InputsContracting.P_ORIGEN_DATA = "GESTORCLIENTE";
                            this.InputsContracting.P_RESTRICCION = null;
                            //this.InputsContracting.P_NAREA: '', // falta validar
                            this.InputsContracting.P_NNATIONALITY = "604";
                            this.InputsContracting.P_SDIGIT = null;
                            this.InputsContracting.P_SBLOCKLAFT = "2"; //1 o 2 Lavado de activos 
                            this.InputsContracting.P_SISCLIENT_IND = "2"; //1 o 2 Cliente protecta
                            this.InputsContracting.P_SISRENIEC_IND = "2";
                            this.InputsContracting.P_SPOLIZA_ELECT_IND = "2"; //1 o 2 poliza electronica
                            this.InputsContracting.P_TI_DOC_SUSTENT = null;
                            this.InputsContracting.P_NU_DOC_SUSTENT = null;
                            this.InputsContracting.P_COD_UBIG_DEP_NAC = null;
                            this.InputsContracting.P_COD_UBIG_PROV_NAC = null;
                            this.InputsContracting.P_COD_UBIG_DIST_NAC = null;
                            this.InputsContracting.P_DEPARTAMENTO_NACIMIENTO = null;
                            this.InputsContracting.P_PROVINCIA_NACIMIENTO = null;
                            this.InputsContracting.P_DISTRITO_NACIMIENTO = null;
                            this.InputsContracting.P_NOMBRE_PADRE = null;
                            this.InputsContracting.P_NOMBRE_MADRE = null;
                            this.InputsContracting.P_FECHA_INSC = null;
                            this.InputsContracting.P_FECHA_EXPEDICION = null;
                            this.InputsContracting.P_CONSTANCIA_VOTACION = null;
                            this.InputsContracting.P_APELLIDO_CASADA = null;
                            this.InputsContracting.P_SDIG_VERIFICACION = null;
                            this.InputsContracting.P_SPROTEG_DATOS_IND = "2"; //1 o 2 proteccion de datos
                            this.InputsContracting.P_COD_CUSPP = res.EListClient[0].P_COD_CUSPP;
                            this.InputsContracting.P_SGRADO_INSTRUCCION = null;
                            this.InputsContracting.P_FOTO_RENIEC = null;
                            this.InputsContracting.P_FIRMA_RENIEC = null;
                            this.InputsContracting.P_NUSERCODE = JSON.parse(localStorage.getItem("currentUser"))["id"];
                            this.InputsContracting.P_CodAplicacion = "SCTR";
                            this.listaDirecciones = res.EListClient[0].EListAddresClient;
                            this.InputsContracting.EListAddresClient = this.listaDirecciones;
                            let numdir = 1;
                            this.listaDirecciones.forEach(item => {
                                item.P_NROW = numdir++;
                                item.P_CLASS = "";
                            });
                            this.listaTelefonos = res.EListClient[0].EListPhoneClient;
                            this.InputsContracting.EListPhoneClient = this.listaTelefonos;
                            let numtel = 1;
                            this.listaTelefonos.forEach(item => {
                                item.P_NROW = numtel++;
                                item.P_CLASS = "";
                            });
                            this.listaCorreos = res.EListClient[0].EListEmailClient;
                            this.InputsContracting.EListEmailClient = this.listaCorreos;
                            let numcor = 1;
                            this.listaCorreos.forEach(item => {
                                item.P_NROW = numcor++;
                                item.P_CLASS = "";
                            });
                            this.listaContactos = res.EListClient[0].EListContactClient;
                            this.InputsContracting.EListContactClient = this.listaContactos;
                            let numcon = 1;
                            this.listaContactos.forEach(item => {
                                item.P_NROW = numcon++;
                                item.P_CLASS = "";
                            });
                            this.listaCiiu = res.EListClient[0].EListCIIUClient;
                            this.InputsContracting.EListCIIUClient = this.listaCiiu;
                            let numciiu = 1;
                            this.listaCiiu.forEach(item => {
                                item.P_NROW = numciiu++;
                                item.P_CLASS = "";
                            });
                            this.InputsContracting.EListSedesClient = this.listaSedes;
                            this.typeContact.P_NIDDOC_TYPE = this.InputsContracting.P_NIDDOC_TYPE;
                            this.typeContact.P_SIDDOC = this.InputsContracting.P_SIDDOC;
                        }
                        else {
                            this.InputsContracting.P_TipOper = "INS";
                            this.InputsContracting.P_SFIRSTNAME = "";
                            this.InputsContracting.P_SLASTNAME = "";
                            this.InputsContracting.P_SLASTNAME2 = "";
                            this.InputsContracting.P_SLEGALNAME = "";
                            this.InputsContracting.P_SSEXCLIEN = "3";
                            this.InputsContracting.P_DBIRTHDAT = "";
                            this.InputsContracting.P_NSPECIALITY = "99";
                            this.InputsContracting.P_NCIVILSTA = "6";
                            this.InputsContracting.P_SBLOCKADE = "2";
                            this.InputsContracting.P_NTITLE = "99";
                            this.InputsContracting.P_NHEIGHT = null;
                            this.InputsContracting.P_ORIGEN_DATA = "GESTORCLIENTE";
                            this.InputsContracting.P_RESTRICCION = null;
                            //this.InputsContracting.P_NAREA: '', // falta validar
                            this.InputsContracting.P_NNATIONALITY = "604";
                            this.InputsContracting.P_SDIGIT = null;
                            this.InputsContracting.P_SBLOCKLAFT = "2"; //1 o 2 Lavado de activos 
                            this.InputsContracting.P_SISCLIENT_IND = "2"; //1 o 2 Cliente protecta
                            this.InputsContracting.P_SISRENIEC_IND = "2";
                            this.InputsContracting.P_SPOLIZA_ELECT_IND = "2"; //1 o 2 poliza electronica
                            this.InputsContracting.P_TI_DOC_SUSTENT = null;
                            this.InputsContracting.P_NU_DOC_SUSTENT = null;
                            this.InputsContracting.P_COD_UBIG_DEP_NAC = null;
                            this.InputsContracting.P_COD_UBIG_PROV_NAC = null;
                            this.InputsContracting.P_COD_UBIG_DIST_NAC = null;
                            this.InputsContracting.P_DEPARTAMENTO_NACIMIENTO = null;
                            this.InputsContracting.P_PROVINCIA_NACIMIENTO = null;
                            this.InputsContracting.P_DISTRITO_NACIMIENTO = null;
                            this.InputsContracting.P_NOMBRE_PADRE = null;
                            this.InputsContracting.P_NOMBRE_MADRE = null;
                            this.InputsContracting.P_FECHA_INSC = null;
                            this.InputsContracting.P_FECHA_EXPEDICION = null;
                            this.InputsContracting.P_CONSTANCIA_VOTACION = null;
                            this.InputsContracting.P_APELLIDO_CASADA = null;
                            this.InputsContracting.P_SDIG_VERIFICACION = null;
                            this.InputsContracting.P_SPROTEG_DATOS_IND = "2"; //1 o 2 proteccion de datos
                            this.InputsContracting.P_COD_CUSPP = "";
                            this.InputsContracting.P_SGRADO_INSTRUCCION = null;
                            this.InputsContracting.P_FOTO_RENIEC = null;
                            this.InputsContracting.P_FIRMA_RENIEC = null;
                            this.InputsContracting.P_NUSERCODE = JSON.parse(localStorage.getItem("currentUser"))["id"];
                            this.InputsContracting.P_CodAplicacion = "SCTR";
                            this.InputsContracting.EListAddresClient = this.listaDirecciones;
                            this.InputsContracting.EListPhoneClient = this.listaTelefonos;
                            this.InputsContracting.EListEmailClient = this.listaCorreos;
                            this.InputsContracting.EListContactClient = this.listaContactos;
                            this.InputsContracting.EListSedesClient = this.listaSedes;
                            this.InputsContracting.EListCIIUClient = this.listaCiiu;
                            this.typeContact.P_NIDDOC_TYPE = this.InputsContracting.P_NIDDOC_TYPE;
                            this.typeContact.P_SIDDOC = this.InputsContracting.P_SIDDOC;
                        }
                    }
                    else {
                        this.InputsContracting.P_TipOper = "INS";
                        this.InputsContracting.P_SFIRSTNAME = "";
                        this.InputsContracting.P_SLASTNAME = "";
                        this.InputsContracting.P_SLASTNAME2 = "";
                        this.InputsContracting.P_SLEGALNAME = "";
                        this.InputsContracting.P_SSEXCLIEN = "3";
                        this.InputsContracting.P_DBIRTHDAT = "";
                        this.InputsContracting.P_NSPECIALITY = "99";
                        this.InputsContracting.P_NCIVILSTA = "6";
                        this.InputsContracting.P_SBLOCKADE = "2";
                        this.InputsContracting.P_NTITLE = "99";
                        this.InputsContracting.P_NHEIGHT = null;
                        this.InputsContracting.P_ORIGEN_DATA = "GESTORCLIENTE";
                        this.InputsContracting.P_RESTRICCION = null;
                        //this.InputsContracting.P_NAREA: '', // falta validar
                        this.InputsContracting.P_NNATIONALITY = "604";
                        this.InputsContracting.P_SDIGIT = null;
                        this.InputsContracting.P_SBLOCKLAFT = "2"; //1 o 2 Lavado de activos 
                        this.InputsContracting.P_SISCLIENT_IND = "2"; //1 o 2 Cliente protecta
                        this.InputsContracting.P_SISRENIEC_IND = "2";
                        this.InputsContracting.P_SPOLIZA_ELECT_IND = "2"; //1 o 2 poliza electronica
                        this.InputsContracting.P_TI_DOC_SUSTENT = null;
                        this.InputsContracting.P_NU_DOC_SUSTENT = null;
                        this.InputsContracting.P_COD_UBIG_DEP_NAC = null;
                        this.InputsContracting.P_COD_UBIG_PROV_NAC = null;
                        this.InputsContracting.P_COD_UBIG_DIST_NAC = null;
                        this.InputsContracting.P_DEPARTAMENTO_NACIMIENTO = null;
                        this.InputsContracting.P_PROVINCIA_NACIMIENTO = null;
                        this.InputsContracting.P_DISTRITO_NACIMIENTO = null;
                        this.InputsContracting.P_NOMBRE_PADRE = null;
                        this.InputsContracting.P_NOMBRE_MADRE = null;
                        this.InputsContracting.P_FECHA_INSC = null;
                        this.InputsContracting.P_FECHA_EXPEDICION = null;
                        this.InputsContracting.P_CONSTANCIA_VOTACION = null;
                        this.InputsContracting.P_APELLIDO_CASADA = null;
                        this.InputsContracting.P_SDIG_VERIFICACION = null;
                        this.InputsContracting.P_SPROTEG_DATOS_IND = "2"; //1 o 2 proteccion de datos
                        this.InputsContracting.P_COD_CUSPP = "";
                        this.InputsContracting.P_SGRADO_INSTRUCCION = null;
                        this.InputsContracting.P_FOTO_RENIEC = null;
                        this.InputsContracting.P_FIRMA_RENIEC = null;
                        this.InputsContracting.P_NUSERCODE = JSON.parse(localStorage.getItem("currentUser"))["id"];
                        this.InputsContracting.P_CodAplicacion = "SCTR";
                        this.InputsContracting.EListAddresClient = this.listaDirecciones;
                        this.InputsContracting.EListPhoneClient = this.listaTelefonos;
                        this.InputsContracting.EListEmailClient = this.listaCorreos;
                        this.InputsContracting.EListContactClient = this.listaContactos;
                        this.InputsContracting.EListSedesClient = this.listaSedes;
                        this.InputsContracting.EListCIIUClient = this.listaCiiu;
                        this.typeContact.P_NIDDOC_TYPE = this.InputsContracting.P_NIDDOC_TYPE;
                        this.typeContact.P_SIDDOC = this.InputsContracting.P_SIDDOC;
                    }
                }
            );


            this.onSelectTypeDocument(this.InputsContracting.P_NIDDOC_TYPE);
            this.changeSDOC(this.InputsContracting.P_SIDDOC);
        } else {
            this.router.navigate(['/broker/quotation']);
        }

    }

    // BuscarContratante() {
    //   //this.clearInputsQuotation();
    //   let data = new ClientDataToSearch();
    //   data.P_CodAplicacion = "GESTORCLIENTE";
    //   data.P_TipOper = "CON";
    //   data.P_NUSERCODE = "126";
    //   data.P_NIDDOC_TYPE = this.InputsContracting.P_NIDDOC_TYPE;
    //   data.P_SIDDOC = this.InputsContracting.P_SIDDOC;
    //   data.P_SFIRSTNAME = "";
    //   data.P_SLASTNAME = "";
    //   data.P_SLASTNAME2 = "";
    //   data.P_SLEGALNAME = "";

    //   this.clientInformationService.getClientInformation(data).subscribe(
    //     res => {
    //       if (res.EListClient.length != 0) {
    //         datosClient = data.EListClient[0];

    //       }
    //     }
    //   );
    // }
    Clear(idx) {
        this.VAL_CLIENT[idx] = "";
    }
    //Section Teléfono
    EditarTelefono(row) {
        let modalRef: NgbModalRef;
        let itemTelefono: any = {};
        modalRef = this.modalService.open(AddTelephoneComponent, { size: 'lg', backdropClass: 'light-blue-backdrop', backdrop: 'static', keyboard: false });
        modalRef.componentInstance.reference = modalRef;
        this.listaTelefonos.map(function (dato) {
            if (dato.P_NROW === row) {
                itemTelefono = dato;
            }
        });
        modalRef.componentInstance.itemTelefono = itemTelefono;
        modalRef.componentInstance.listaTelefonos = this.listaTelefonos;
    }

    EliminarTelefono(row) {
        swal.fire({
            title: "Eliminar Teléfono",
            text: "¿Estás seguro que deseas eliminar esta teléfono?",
            type: "info",
            showCancelButton: true,
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar'
        })
            .then((result) => {
                if (result.value) {
                    this.listaTelefonos.map(function (dato) {
                        if (dato.P_NROW === row) {
                            dato.P_TipOper = "DEL";
                            dato.P_CLASS = "eliminar";
                        }
                    });
                }
            });
    }

    RevertirTelefono(row) {
        swal.fire({
            title: "Activar Teléfono",
            text: "¿Estás seguro que deseas activar esta teléfono?",
            type: "info",
            showCancelButton: true,
            confirmButtonText: 'Activar',
            cancelButtonText: 'Cancelar'
        })
            .then((result) => {
                if (result.value) {
                    this.listaTelefonos.map(function (dato) {
                        if (dato.P_NROW === row) {
                            dato.P_TipOper = "";
                            dato.P_CLASS = "";
                        }
                    });
                }
            });
    }

    //Section Ciiu
    EditarCiiu(row) {
        let modalRef: NgbModalRef;
        let itemCiiu: any = {};
        modalRef = this.modalService.open(AddCiiuComponent, { size: 'lg', backdropClass: 'light-blue-backdrop', backdrop: 'static', keyboard: false });
        modalRef.componentInstance.reference = modalRef;
        this.listaCiiu.map(function (dato) {
            if (dato.P_NROW === row) {
                itemCiiu = dato;
            }
        });
        modalRef.componentInstance.itemCiiu = itemCiiu;
        modalRef.componentInstance.listaCiiu = this.listaCiiu;
    }

    EliminarCiiu(row) {
        swal.fire({
            title: "Eliminar CIIU",
            text: "¿Estás seguro que deseas eliminar este ciiu?",
            type: "info",
            showCancelButton: true,
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar'
        })
            .then((result) => {
                if (result.value) {
                    this.listaCiiu.map(function (dato) {
                        if (dato.P_NROW === row) {
                            dato.P_TipOper = "DEL";
                            dato.P_CLASS = "eliminar";
                        }
                    });
                }
            });
    }

    RevertirCiiu(row) {
        swal.fire({
            title: "Activar CIIU",
            text: "¿Estás seguro que deseas activar este ciiu?",
            type: "info",
            showCancelButton: true,
            confirmButtonText: 'Activar',
            cancelButtonText: 'Cancelar'
        })
            .then((result) => {
                if (result.value) {
                    this.listaCiiu.map(function (dato) {
                        if (dato.P_NROW === row) {
                            dato.P_TipOper = "";
                            dato.P_CLASS = "";
                        }
                    });
                }
            });
    }

    //Section Correo
    EditarCorreo(row) {
        let modalRef: NgbModalRef;
        let itemCorreo: any = {};
        modalRef = this.modalService.open(AddEmailComponent, { size: 'lg', backdropClass: 'light-blue-backdrop', backdrop: 'static', keyboard: false });
        modalRef.componentInstance.reference = modalRef;
        this.listaCorreos.map(function (dato) {
            if (dato.P_NROW === row) {
                itemCorreo = dato;
            }
        });
        modalRef.componentInstance.itemCorreo = itemCorreo;
        modalRef.componentInstance.listaCorreos = this.listaCorreos;
    }

    EliminarCorreo(row) {
        swal.fire({
            title: "Eliminar Correo",
            text: "¿Estás seguro que deseas eliminar esta correo?",
            type: "info",
            showCancelButton: true,
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar'
        })
            .then((result) => {
                if (result.value) {
                    this.listaCorreos.map(function (dato) {
                        if (dato.P_NROW === row) {
                            dato.P_TipOper = "DEL";
                            dato.P_CLASS = "eliminar";
                        }
                    });
                }
            });
    }

    RevertirCorreo(row) {
        swal.fire({
            title: "Activar Correo",
            text: "¿Estás seguro que deseas activar esta correo?",
            type: "info",
            showCancelButton: true,
            confirmButtonText: 'Activar',
            cancelButtonText: 'Cancelar'
        })
            .then((result) => {
                if (result.value) {
                    this.listaCorreos.map(function (dato) {
                        if (dato.P_NROW === row) {
                            dato.P_TipOper = "";
                            dato.P_CLASS = "";
                        }
                    });
                }
            });
    }

    //Section Dirección
    EditarDireccion(row) {
        let modalRef: NgbModalRef;
        let itemDireccion: any = {};
        modalRef = this.modalService.open(AddAddressComponent, { size: 'lg', backdropClass: 'light-blue-backdrop', backdrop: 'static', keyboard: false });
        modalRef.componentInstance.reference = modalRef;
        this.listaDirecciones.map(function (dato) {
            if (dato.P_NROW === row) {
                itemDireccion = dato;
            }
        });
        modalRef.componentInstance.itemDireccion = itemDireccion;
        modalRef.componentInstance.listaDirecciones = this.listaDirecciones;
    }

    EliminarDireccion(row) {
        swal.fire({
            title: "Eliminar Dirección",
            text: "¿Estás seguro que deseas eliminar esta dirección?",
            type: "info",
            showCancelButton: true,
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar'
        })
            .then((result) => {
                if (result.value) {
                    this.listaDirecciones.map(function (dato) {
                        if (dato.P_NROW === row) {
                            dato.P_TipOper = "DEL";
                            dato.P_CLASS = "eliminar";
                        }
                    });
                }
            });
    }

    RevertirDireccion(row) {
        swal.fire({
            title: "Activar Dirección",
            text: "¿Estás seguro que deseas activar esta dirección?",
            type: "info",
            showCancelButton: true,
            confirmButtonText: 'Activar',
            cancelButtonText: 'Cancelar'
        })
            .then((result) => {
                if (result.value) {
                    this.listaDirecciones.map(function (dato) {
                        if (dato.P_NROW === row) {
                            dato.P_TipOper = "";
                            dato.P_CLASS = "";
                        }
                    });
                }
            });
    }

    //Section Contacto
    EditarContacto(row) {
        let modalRef: NgbModalRef;
        let itemContacto: any = {};
        modalRef = this.modalService.open(AddContactComponent, { size: 'lg', backdropClass: 'light-blue-backdrop', backdrop: 'static', keyboard: false });
        modalRef.componentInstance.reference = modalRef;
        this.typeContact.P_NIDDOC_TYPE = this.InputsContracting.P_NIDDOC_TYPE;
        this.typeContact.P_SIDDOC = this.InputsContracting.P_SIDDOC;
        modalRef.componentInstance.typeContact = this.typeContact;
        this.listaContactos.map(function (dato) {
            if (dato.P_NROW === row) {
                itemContacto = dato;
            }
        });
        modalRef.componentInstance.itemContacto = itemContacto;
        modalRef.componentInstance.listaContactos = this.listaContactos;
    }

    EliminarContacto(row) {
        swal.fire({
            title: "Eliminar Contacto",
            text: "¿Estás seguro que deseas eliminar esta contacto?",
            type: "info",
            showCancelButton: true,
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar'
        })
            .then((result) => {
                if (result.value) {
                    this.listaContactos.map(function (dato) {
                        if (dato.P_NROW === row) {
                            dato.P_TipOper = "DEL";
                            dato.P_CLASS = "eliminar";
                        }
                    });
                }
            });
    }

    RevertirContacto(row) {
        swal.fire({
            title: "Activar Contacto",
            text: "¿Estás seguro que deseas activar esta contacto?",
            type: "info",
            showCancelButton: true,
            confirmButtonText: 'Activar',
            cancelButtonText: 'Cancelar'
        })
            .then((result) => {
                if (result.value) {
                    this.listaContactos.map(function (dato) {
                        if (dato.P_NROW === row) {
                            dato.P_TipOper = "";
                            dato.P_CLASS = "";
                        }
                    });
                }
            });
    }

    //Section Sedes
    EditarSede(row) {
        let modalRef: NgbModalRef;
        let itemSede: any = {};
        modalRef = this.modalService.open(ContractorLocationFormComponent, { size: 'lg', backdropClass: 'light-blue-backdrop', backdrop: 'static', keyboard: false });
        modalRef.componentInstance.formModalReference = modalRef;
        modalRef.componentInstance.openedInEditMode = true;
        modalRef.componentInstance.existentLocationList = this.listaSedes;
        modalRef.componentInstance.rowToBeIgnored = row - 1;
        modalRef.componentInstance.willBeSaved = false;
        modalRef.result.then((sede) => {
            sede.P_NROW = row;
            if (sede != undefined) {
                this.actualizarSede(sede);
            }
        }, (reason) => {
        });
    }

    EliminarSede(row) {
        swal.fire({
            title: "Eliminar Sede",
            text: "¿Estás seguro que deseas eliminar esta sede?",
            type: "info",
            showCancelButton: true,
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar'
        })
            .then((result) => {
                if (result.value) {
                    this.listaSedes.map(function (dato) {
                        if (dato.P_NROW === row) {
                            dato.P_TipOper = "DEL";
                            dato.P_CLASS = "eliminar";
                        }
                    });
                }
            });
    }

    RevertirSede(row) {
        swal.fire({
            title: "Activar Sede",
            text: "¿Estás seguro que deseas activar esta sede?",
            type: "info",
            showCancelButton: true,
            confirmButtonText: 'Activar',
            cancelButtonText: 'Cancelar'
        })
            .then((result) => {
                if (result.value) {
                    this.listaSedes.map(function (dato) {
                        if (dato.P_NROW === row) {
                            dato.P_TipOper = "";
                            dato.P_CLASS = "";
                        }
                    });
                }
            });
    }

    actualizarSede(sede) {
        let item = sede;
        this.listaSedes.map(function (dato) {
            if (dato.P_NROW == item.P_NROW) {
                dato.DepartmentId = item.DepartmentId;
                dato.Description = item.Description;
                dato.DistrictId = item.DistrictId;
                dato.EconomicActivityId = item.EconomicActivityId;
                dato.ProvinceId = item.ProvinceId;
                dato.Address = item.Address;
                dato.StateId = item.StateId;
                dato.TypeId = item.TypeId;
            }
        });

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

    getNationalityList() {

        this.clientInformationService.getNationalityList().subscribe(
            res => {
                this.nacionalityList = res;
            },
            err => {
                console.log(err);
            }
        );
    }

    getGenderList() {

        this.clientInformationService.getGenderList().subscribe(
            res => {
                this.genderList = res;
            },
            err => {
                console.log(err);
            }
        );
    }

    getCivilStatusList() {

        this.clientInformationService.getCivilStatusList().subscribe(
            res => {
                this.civilStatusList = res;
            },
            err => {
                console.log(err);
            }
        );
    }

    getProfessionList() {

        this.clientInformationService.getProfessionList().subscribe(
            res => {
                console.log(res);
                this.professionList = res;
            },
            err => {
                console.log(err);
            }
        );
    }

    /*getEconomicActivityList() {
  
      this.clientInformationService.getEconomicActivityList().subscribe(
        res => {
          this.economicActivityList = res;
        },
        err => {
          console.log(err);
        }
      );
    }*/

    onSelectTypeDocument(typeDocumentID) {
        this.blockDoc = true;
        switch (typeDocumentID) {
            case "0":
                this.blockCuspp = true;
                this.InputsContracting.P_NIDDOC_TYPE = null;
                this.typeDocument = 0;
                this.maxlength = 8;
                //this.clearDocument();
                break;
            case "1":
                this.blockCuspp = false;
                this.InputsContracting.P_NIDDOC_TYPE = typeDocumentID;
                this.typeDocument = typeDocumentID;
                this.maxlength = 11;
                //this.clearDocument();
                break;
            case "2":
                this.blockCuspp = true;
                this.InputsContracting.P_NIDDOC_TYPE = typeDocumentID;
                this.typeDocument = typeDocumentID;
                this.maxlength = 8;
                //this.clearDocument();
                break;
            case "4":
                this.blockCuspp = true;
                this.InputsContracting.P_NIDDOC_TYPE = typeDocumentID;
                this.typeDocument = typeDocumentID;
                this.maxlength = 12;
                //this.clearDocument();
                break;
            default:
                this.blockCuspp = true;
                this.InputsContracting.P_NIDDOC_TYPE = typeDocumentID;
                this.typeDocument = typeDocumentID;
                this.maxlength = 15;
                //this.clearDocument();
                break;
        }
    }

    changeSDOC(sdoc) {
        if (this.typeDocument == 1 && sdoc.length > 1) {
            if (sdoc.substr(0, 2) == "10" || sdoc.substr(0, 2) == "15" || sdoc.substr(0, 2) == "17") {
                this.blockDoc = true;
                this.txtNacimiento = "FECHA DE NACIMIENTO (*)";
                this.InputsContracting.P_SLEGALNAME = "";
            } else {
                this.blockDoc = false;
                this.txtNacimiento = "FECHA DE CREACIÓN";
                this.InputsContracting.P_SSEXCLIEN = null;
                this.InputsContracting.P_NCIVILSTA = null;
                this.InputsContracting.P_SFIRSTNAME = "";
                this.InputsContracting.P_SLASTNAME = "";
                this.InputsContracting.P_SLASTNAME2 = "";
            }
        }
    }

    // clearDocument() {
    //   this.InputsContracting.P_SIDDOC = "";
    //   this.InputsContracting.P_SFIRSTNAME = "";
    //   this.InputsContracting.P_SLEGALNAME = "";
    //   this.InputsContracting.P_SLASTNAME = "";
    //   this.InputsContracting.P_SLASTNAME2 = "";
    //   this.InputsContracting.P_COD_CUSPP = "";
    //   this.InputsContracting.P_SSEXCLIEN = null;
    //   this.InputsContracting.P_NCIVILSTA = null;
    // }

    onSelectNacionality(nacionalityID) {
        this.InputsContracting.P_NNATIONALITY = nacionalityID;
    }

    onSelectGender(genderID) {
        this.InputsContracting.P_SSEXCLIEN = genderID;
        //console.log(this.InputsContracting);
    }

    onSelectCivilStatus(civilStatusID) {
        this.InputsContracting.P_NCIVILSTA = civilStatusID;
    }

    // onSelectProfession(professionID) {
    //   if (professionID === "0") {
    //     this.InputsContracting.P_NSPECIALITY = null;
    //   } else {
    //     this.InputsContracting.P_NSPECIALITY = professionID;
    //   }
    // }

    // onSelectEconomicActivity(economicActivityID) {
    //   if (economicActivityID === "0") {
    //     this.InputsContracting.P_SGRADO_INSTRUCCION = null;
    //   } else {
    //     this.InputsContracting.P_SGRADO_INSTRUCCION = economicActivityID;
    //   }
    // }

    openModal(modalName: String) {
        let modalRef: NgbModalRef;
        switch (modalName) {
            case "add-telephone":
                modalRef = this.modalService.open(AddTelephoneComponent, { size: 'lg', backdropClass: 'light-blue-backdrop', backdrop: 'static', keyboard: false });
                modalRef.componentInstance.reference = modalRef;
                modalRef.componentInstance.listaTelefonos = this.listaTelefonos;
                modalRef.componentInstance.itemTelefono = null;
                break;
            case "add-email":
                modalRef = this.modalService.open(AddEmailComponent, { size: 'lg', backdropClass: 'light-blue-backdrop', backdrop: 'static', keyboard: false });
                modalRef.componentInstance.reference = modalRef;
                modalRef.componentInstance.listaCorreos = this.listaCorreos;
                modalRef.componentInstance.itemCorreo = null;
                break;
            case "add-address":
                modalRef = this.modalService.open(AddAddressComponent, { size: 'lg', backdropClass: 'light-blue-backdrop', backdrop: 'static', keyboard: false });
                modalRef.componentInstance.reference = modalRef;
                modalRef.componentInstance.listaDirecciones = this.listaDirecciones;
                modalRef.componentInstance.itemDireccion = null;
                break;
            case "add-contact":
                modalRef = this.modalService.open(AddContactComponent, { size: 'lg', backdropClass: 'light-blue-backdrop', backdrop: 'static', keyboard: false });
                modalRef.componentInstance.reference = modalRef;
                this.typeContact.P_NIDDOC_TYPE = this.InputsContracting.P_NIDDOC_TYPE;
                this.typeContact.P_SIDDOC = this.InputsContracting.P_SIDDOC;
                modalRef.componentInstance.typeContact = this.typeContact;
                modalRef.componentInstance.listaContactos = this.listaContactos;
                modalRef.componentInstance.itemContacto = null;
                break;
            case "add-ciiu":
                modalRef = this.modalService.open(AddCiiuComponent, { size: 'lg', backdropClass: 'light-blue-backdrop', backdrop: 'static', keyboard: false });
                modalRef.componentInstance.reference = modalRef;
                modalRef.componentInstance.listaCiiu = this.listaCiiu;
                modalRef.componentInstance.itemCiiu = null;
                break;
            case "add-sede":
                modalRef = this.modalService.open(ContractorLocationFormComponent, { size: 'lg', backdropClass: 'light-blue-backdrop', backdrop: 'static', keyboard: false });
                modalRef.componentInstance.formModalReference = modalRef;
                modalRef.componentInstance.openedInEditMode = false;
                modalRef.componentInstance.existentLocationList = this.listaSedes;
                modalRef.componentInstance.rowToBeIgnored = -1;
                modalRef.componentInstance.willBeSaved = false;
                let main = "2";
                if (this.listaSedes.length == 0) {
                    main = "1";
                }
                modalRef.componentInstance.suggestedLocationType = main;
                modalRef.componentInstance.openedInEditMode = false;
                modalRef.result.then((sede) => {
                    if (sede != undefined) {
                        this.AgregarSede(sede);
                    }
                }, (reason) => {
                });
                break;
        }
    }

    AgregarSede(sede) {
        sede.P_NROW = this.listaSedes.length + 1;
        sede.P_CLASS = "";
        this.listaSedes.push(sede);
    }

    EventSave(event) {

        this.InputsContracting.P_SFIRSTNAME = this.InputsContracting.P_SFIRSTNAME == null ? "" : this.InputsContracting.P_SFIRSTNAME.toUpperCase()
        this.InputsContracting.P_SLEGALNAME = this.InputsContracting.P_SLEGALNAME == null ? "" : this.InputsContracting.P_SLEGALNAME.toUpperCase()
        this.InputsContracting.P_SLASTNAME = this.InputsContracting.P_SLASTNAME == null ? "" : this.InputsContracting.P_SLASTNAME.toUpperCase()
        this.InputsContracting.P_SLASTNAME2 = this.InputsContracting.P_SLASTNAME2 == null ? "" : this.InputsContracting.P_SLASTNAME2.toUpperCase()

        //Fecha Inicio
        let dayIni = this.bsValueFNac.getDate() < 10 ? "0" + this.bsValueFNac.getDate() : this.bsValueFNac.getDate();
        let monthPreviewIni = this.bsValueFNac.getMonth() + 1;
        let monthIni = monthPreviewIni < 10 ? "0" + monthPreviewIni : monthPreviewIni;
        let yearIni = this.bsValueFNac.getFullYear();

        this.InputsContracting.P_DBIRTHDAT = dayIni + "/" + monthIni + "/" + yearIni;
        console.log(this.InputsContracting.P_DBIRTHDAT)
        let mensaje = "";
        if (this.InputsContracting.P_NIDDOC_TYPE == 1) { //RUC
            if (this.InputsContracting.P_SIDDOC.substr(0, 2) == "10" || this.InputsContracting.P_SIDDOC.substr(0, 2) == "15" || this.InputsContracting.P_SIDDOC.substr(0, 2) == "17") {
                if (this.InputsContracting.P_SFIRSTNAME == "" || this.InputsContracting.P_SFIRSTNAME == null) {
                    this.VAL_CLIENT[0] = "0";
                    mensaje += "El nombre del contratante es requerido <br />"
                }
                if (this.InputsContracting.P_SLASTNAME == "" || this.InputsContracting.P_SLASTNAME == null) {
                    this.VAL_CLIENT[2] = "2";
                    mensaje += "El apellido paterno del contratante es requerido <br />"
                }
                if (this.InputsContracting.P_SLASTNAME2 == "" || this.InputsContracting.P_SLASTNAME2 == null) {
                    this.VAL_CLIENT[3] = "3";
                    mensaje += "El apellido materno del contratante es requerido <br />"
                }
                //console.log(this.InputsContracting.P_DBIRTHDAT);
                if (this.InputsContracting.P_DBIRTHDAT == null) {
                    this.VAL_CLIENT[4] = "4";
                    mensaje += "La fecha de nacimiento del contratante es requerido <br />"
                }
            } else {
                if (this.InputsContracting.P_SLEGALNAME == "" || this.InputsContracting.P_SLEGALNAME == null) {
                    this.VAL_CLIENT[1] = "1";
                    mensaje += "La razón social del contratante es requerida <br />"
                }
            }

            if (this.listaCiiu.length == 0) {
                this.VAL_CLIENT[6] = "6";
                mensaje += "La actividad económica es requerido <br />"
            }

        } else {
            if (this.InputsContracting.P_SFIRSTNAME == "" || this.InputsContracting.P_SFIRSTNAME == null) {
                this.VAL_CLIENT[0] = "0";
                mensaje += "El nombre del contratante es requerido <br />"
            }
            if (this.InputsContracting.P_SLASTNAME == "" || this.InputsContracting.P_SLASTNAME == null) {
                this.VAL_CLIENT[2] = "2";
                mensaje += "El apellido paterno del contratante es requerido <br />"
            }
            if (this.InputsContracting.P_SLASTNAME2 == "" || this.InputsContracting.P_SLASTNAME2 == null) {
                this.VAL_CLIENT[3] = "3";
                mensaje += "El apellido materno del contratante es requerido <br />"
            }
            //console.log(this.InputsContracting.P_DBIRTHDAT);
            if (this.InputsContracting.P_DBIRTHDAT == null) {
                this.VAL_CLIENT[4] = "4";
                mensaje += "La fecha de nacimiento del contratante es requerido <br />"
            }

        }
        if (this.listaSedes.length == 0 || this.InputsContracting.P_SLEGALNAME == null) {
            this.VAL_CLIENT[5] = "5";
            mensaje += "La sede del contratante es requerido <br />"
        }
        // console.log(this.InputsContracting)
        // return;
        if (mensaje == "") {
            swal.fire({
                title: "Información",
                text: "¿Estas seguro de crear el contratante?",
                type: "question",
                showCancelButton: true,
                confirmButtonText: 'Crear',
                allowOutsideClick: false,
                cancelButtonText: 'Cancelar'
            })
                .then((result) => {
                    if (result.value) {
                        this.clientInformationService.insertContract(this.InputsContracting).subscribe(
                            res => {
                                if (res.P_NCODE === "0") {
                                    console.log(res);
                                    this.InputsContracting.EListSedesClient.forEach(sede => {
                                        sede.Action = '1';
                                        sede.ContractorId = res.P_SCOD_CLIENT;
                                        this.contractorLocationIndexService.updateContractorLocation(sede).subscribe(
                                            res => {
                                                if (res.P_NCODE == 0) {
                                                    let self = this;
                                                    sede.ContactList.forEach(function (item) {
                                                        item.Action = '1';
                                                        item.ContractorLocationId = res.P_RESULT;
                                                        self.updateContact(item);
                                                    });
                                                }
                                            },
                                            err => {
                                                // swal.fire('Información', err, 'error');
                                                console.log(err);
                                            }
                                        );
                                    });

                                    swal.fire("Información", "Se ha realizado el registro correctamente", "success")
                                        .then((value) => {
                                            //this.router.navigate(['/broker/' + this.receiverApp], { queryParams: { typeDocument: this.InputsContracting.P_NIDDOC_TYPE, document: this.InputsContracting.P_SIDDOC } });
                                            switch (this.receiverApp) {
                                                case "quotation":
                                                    this.router.navigate(['/broker/quotation'], { queryParams: { typeDocument: this.InputsContracting.P_NIDDOC_TYPE, document: this.InputsContracting.P_SIDDOC } });
                                                    break;
                                                case "agency":
                                                    this.router.navigate(['/broker/agency-form'], { queryParams: { DocumentType: this.InputsContracting.P_NIDDOC_TYPE, DocumentNumber: this.InputsContracting.P_SIDDOC, ContractorId: res.P_SCOD_CLIENT, Sender: "add-contractor" } });
                                                    break;
                                                case "contractor-location":
                                                    this.router.navigate(['/broker/contractor-location'], { queryParams: { DocumentType: this.InputsContracting.P_NIDDOC_TYPE, DocumentNumber: this.InputsContracting.P_SIDDOC, Sender: "add-contractor" } });
                                                    break;
                                            }
                                        });
                                }
                                else if (res.P_NCODE === "1") {
                                    swal.fire("Información", res.P_SMESSAGE, "error");
                                }
                                else {
                                    swal.fire("Información", res.P_SMESSAGE, "warning");
                                }
                            },
                            err => {
                                console.log(err);
                                //swal({ title: "Información", text: err.statusText, icon: "warning" });
                                swal.fire("Información", err.statusText, "warning");
                            }
                        );
                    }
                });

        } else {
            swal.fire("Información", mensaje, "warning");
        }
    }

    Back() {
        //this.router.navigate(['/broker/' + this.receiverApp]);

        switch (this.receiverApp) {
            case "quotation":
                this.router.navigate(['/broker/quotation']);
                break;
            case "agency":
                this.router.navigate(['/broker/agency-form'], { queryParams: { Sender: "add-contractor" } });
                break;
            case "contractor-location":
                this.router.navigate(['/broker/contractor-location']);
                break;
        }
    }

    updateContact(_contact: ContractorLocationContactREQUEST) {

        this.contractorLocationIndexService.updateContractorLocationContact(_contact).subscribe(
            res => {
                if (res.P_NCODE == 0) {
                    // console.log(res.P_SMESSAGE);
                } else if (res.P_NCODE == 1) {
                    //console.log(res.P_SMESSAGE);
                }
            },
            err => {
                console.log(err);
            }
        );
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

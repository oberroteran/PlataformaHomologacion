import { Component, OnInit, Input } from '@angular/core';
import { BsDatepickerConfig } from "ngx-bootstrap";
import Swal from 'sweetalert2';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
//MODELOS
import { CreditEvaluationSearch } from '../../../../models/report/state-report/request/credit-evaluation-search'
import { CreditEvaluation } from '../../../../models/report/state-report/request/credit-evaluation'
import { CreditEvaluationView } from '../../../../models/report/state-report/response/credit-evaluation-view'
//SERVICIOS
import { StateReportService } from '../../../../services/report/state-report/state-report.service';
import { GlobalValidators } from './../../../global-validators';
//Herramientas globales
import { CommonMethods } from './../../../common-methods';
//Compartido
import { AccessFilter } from './../../../access-filter'
import { ModuleConfig } from './../../../module.config'
import { ContractorForTable } from '../../../../models/maintenance/contractor-location/contractor-for-table';
@Component({
    selector: 'app-credit-qualification-record',
    templateUrl: './credit-qualification-record.component.html',
    styleUrls: ['./credit-qualification-record.component.css']
})
export class CreditQualificationRecordComponent implements OnInit {

    @Input() public reference: any; //Referencia al modal creado desde el padre de este componente 'contractor-location-index' para ser cerrado desde aquí
    @Input() public contractor: ContractorForTable; //Id de cliente

    qualificationTypeList: any[]; //Lista de tipos de calificación

    isLoading: Boolean = false;
    // datepicker
    public bsConfig: Partial<BsDatepickerConfig>;
    bsValueIni: Date = new Date("01/01/2019");  //Fecha inicial del componente
    bsValueFin: Date = new Date("12/30/2019");  //Fecha final del componente
    /**
     * Variables de paginación
     */
    public rotate = true; //Si rotar las páginas cuando maxSize > el número de páginas generado 
    public maxSize = 5; // cantidad de paginas que se mostrarán en el html del paginado
    public totalItems = 0; //total de items encontrados
    public foundResults: CreditEvaluationView[] = [];  //Lista de registros encontrados durante la búsqueda
    filter = new CreditEvaluationSearch(); //Objeto con datos de búsqueda que se llena en la primera búsqueda y que quedará en memoria para los cambios de página, el atributo PageNumber (Nro de página) está enlazado con el elemento de paginado del HTML y se actualiza automaticamente

    mainFormGroup: FormGroup;
    //qualificationTypeList: any[] = []; //Lista de tipos calificación
    isValidatedInClickButton: boolean = false;  //Flag que indica si el formulario ha sido validado por la acción BUSCAR. Este flag nos sirve para hacer la validación al momento de accionar la búsqueda.

    genericErrorMessage = ModuleConfig.GenericErrorMessage; //Mensaje de error genérico
    redirectionMessage = ModuleConfig.RedirectionMessage;
    invalidStartDateMessage = ModuleConfig.InvalidStartDateMessage;
    invalidEndDateMessage = ModuleConfig.InvalidEndDateMessage;
    invalidStartDateOrderMessage = ModuleConfig.InvalidStartDateOrderMessage;
    invalidEndDateOrderMessage = ModuleConfig.InvalidEndDateOrderMessage;
    notFoundMessage = ModuleConfig.NotFoundMessage;

    /**Puede realizar la evaluación crediticia */
    canEvaluateCredit: boolean;

    constructor(private stateReportService: StateReportService,
        private formBuilder: FormBuilder
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
        this.canEvaluateCredit = AccessFilter.hasPermission("33");

        this.getQualificationTypeList();

        this.createForm();
        this.initializeForm();
        this.filter.LimitPerPage = 5;

        this.firstSearch(true);
    }
    getQualificationList() {
        this.stateReportService.getQualificationTypeList().subscribe(
            res => {

            },
            error => {

            }
        )
    }
    /**
      * 
      */
    cleanValidation() {
        this.isValidatedInClickButton = false;
    }
    /**
     * Obtiene la lista de tipos de califiación
     */
    // getQualificationList() {
    //   this.stateReportService.getQualificationTypeList().subscribe(
    //     res => {
    //       this.qualificationTypeList = res.GenericResponse;
    //     },
    //     error => {
    //       Swal.fire("Información", this.genericErrorMessage, "error");
    //     }
    //   )
    // }
    createForm() {
        this.mainFormGroup = this.formBuilder.group({
            startDate: [new Date("01/01/2019"), [Validators.required]],
            endDate: [new Date("12/30/2019"), [Validators.required]],
            qualification: [""]
        });
    }
    initializeForm() {
        this.mainFormGroup.setValidators([GlobalValidators.dateSort]);
    }
    async evaluate() {
        let list = {};
        list["1"] = "Bueno";
        list["2"] = "Regular";
        list["3"] = "Malo";

        const { value: fruit } = await Swal.fire({
            title: 'Seleccione una calificación',
            input: 'select',
            inputOptions: list,
            inputPlaceholder: 'Seleccionar',
            showCancelButton: true,
            inputValidator: (value) => {
                return new Promise((resolve) => {
                    let data = new CreditEvaluation();
                    data.ClientId = this.contractor.Id;
                    data.Qualification = value;
                    data.User = JSON.parse(localStorage.getItem("currentUser"))["id"];
                    this.stateReportService.evaluateClient(data).subscribe(
                        res => {
                            if (res.StatusCode == 0) {
                                this.contractor.LastCreditEvaluationId = value;
                                this.contractor.LastCreditEvaluationName = list[value];
                                Swal.fire({
                                    title: 'Información',
                                    text: "El cliente fue evaluado exitosamente.",
                                    type: "success",
                                    showCancelButton: false,
                                    confirmButtonColor: '#3085d6',
                                    cancelButtonColor: '#d33',
                                    confirmButtonText: 'Ok'
                                }).then((result) => {

                                    this.firstSearch(false);
                                })
                            } else if (res.StatusCode == 1) {
                                Swal.fire("Información", CommonMethods.listToString(res.ErrorMessageList), "error");
                            } else {
                                Swal.fire("Información", this.genericErrorMessage, "error");
                            }
                        },
                        error => {
                            Swal.fire("Información", this.genericErrorMessage, "error");
                        }
                    )
                })
            }
        })
    }

    /**
     * Realiza la primera búsqueda accionada por el botón buscar o la tecla ENTER
     */
    firstSearch(isFirstSearch: boolean) {
        this.isValidatedInClickButton = true;
        this.isLoading = true;
        if (this.mainFormGroup.valid && this.contractor.Id != null && this.contractor.Id.toString().trim() != null) {
            this.filter.PageNumber = 1;
            this.filter.ClientId = this.contractor.Id;
            this.filter.StartDate = this.mainFormGroup.controls.startDate.value;
            this.filter.EndDate = this.mainFormGroup.controls.endDate.value;
            this.filter.Qualification = this.mainFormGroup.controls.qualification.value;
            this.search(isFirstSearch);
        } else {
            let errorList = [];

            if (this.mainFormGroup.controls.startDate.valid && this.mainFormGroup.controls.endDate.valid) {
                if (this.mainFormGroup.hasError("datesNotSortedCorrectly")) errorList.push(ModuleConfig.InvalidStartDateOrderMessage);
            } else {
                if (this.mainFormGroup.controls.startDate.valid == false) {
                    if (this.mainFormGroup.controls.startDate.hasError('required')) errorList.push("La fecha de inicio es requerida.");
                    else errorList.push(ModuleConfig.InvalidStartDateMessage);
                }
                if (this.mainFormGroup.controls.endDate.valid == false) {
                    if (this.mainFormGroup.controls.endDate.hasError('required')) errorList.push("La fecha de fin es requerida.");
                    else errorList.push(ModuleConfig.InvalidEndDateMessage);
                }
            }

            if (this.contractor.Id == null || this.contractor.Id.trim() == "") errorList.push("El Id del cliente no es válido.");

            Swal.fire("Información", CommonMethods.listToString(errorList), "error");
        }
    }

    /**
     * Extrae datos de movimientos del servicio
     */
    search(isFirstSearch: boolean) {
        this.stateReportService.getCreditEvaluationList(this.filter).subscribe(
            res => {
                this.foundResults = res.GenericResponse;
                if (this.foundResults != null && this.foundResults.length > 0) this.totalItems = res.TotalRowNumber;
                else {
                    this.totalItems = 0;
                    if (isFirstSearch == false) Swal.fire("Información", this.notFoundMessage, "warning");
                }
                this.isLoading = false;
            },
            error => {
                this.foundResults = [];
                this.totalItems = 0;
                this.isLoading = false;
                if (isFirstSearch == false) Swal.fire("Información", this.genericErrorMessage, "error");
            }
        );
    }

    /**
     * Obtiene la lista de tipos de calificación
     */
    private getQualificationTypeList() {
        this.stateReportService.getQualificationTypeList().subscribe(
            res => {
                this.qualificationTypeList = res.GenericResponse;
            },
            error => {
                Swal.fire("Información", this.genericErrorMessage, "error");
            }
        );
    }


}

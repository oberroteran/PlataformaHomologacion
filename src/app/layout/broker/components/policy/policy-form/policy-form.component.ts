import { PolizaAsegurados } from '../../../models/polizaEmit/PolizaAsegurados';
import { PolizaEmitCab } from '../../../models/polizaEmit/PolizaEmitCab';
import { PolizaEmitComer } from '../../../models/polizaEmit/PolizaEmitComer';
import { TipoRenovacion } from '../../../models/polizaEmit/TipoRenovacion';
import { FrecuenciaPago } from '../../../models/polizaEmit/FrecuenciaPago';
import { PolizaEmitDet, PolizaEmitDetAltoRiesgo, PolizaEmitDetMedianoRiesgo, PolizaEmitDetBajoRiesgo } from '../../../models/polizaEmit/PolizaEmitDet';
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { BsDatepickerConfig } from "ngx-bootstrap";
import { ActivatedRoute, Route, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2'
import { PolicyemitService } from '../../../services/policy/policyemit.service';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ValErrorComponent } from '../../../modal/val-error/val-error.component';
//Compartido
import { AccessFilter } from './../../access-filter'
import { ModuleConfig } from './../../module.config'
import { OthersService } from '../../../services/shared/others.service';
import { QuotationService } from '../../../services/quotation/quotation.service';
import { ClientInformationService } from '../../../services/shared/client-information.service';

@Component({
	selector: 'app-policy-form',
	templateUrl: './policy-form.component.html',
	styleUrls: ['./policy-form.component.css']
})
export class PolicyFormComponent implements OnInit {
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
	flagEmail = false;
	flagEmailNull = true;
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
	contractingdata: any = [];
	activityVariationPension = "";
	activityVariationSalud = "";
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
	igvPensionWS: number = 0.0;
	igvSaludWS: number = 0.0;
	endosoPension: string;
	endosoSalud: string;

	//Datos para configurar los datepicker
	bsConfig: Partial<BsDatepickerConfig>;
	igvPension = 0;
	igvSalud = 0;

	isValidatedInClickButton: boolean = false;
	ValFecha: boolean = false;
	excelSubir: File;
	errorExcel = false;
	errorNroCot = false;
	excelJson: any[] = [];
	archivosJson: any[] = [];
	mensajeValidacion = "";
	indentificacion = "";
	//flagNroCotizacion = false;
	flagColumnas = false;
	primatotalSCTR = 0;
	primatotalSalud = 0;
	filePathList = [];

	validaciones = [];
	validacionIndentifacion = [];
	validacionIndentifacionRUC20 = [];
	validacionIndentifacionRUC10 = [];
	mensajeValidacionInd = "";
	objcolumnas = [];
	objcolumnasRuc20 = [];
	objcolumnasRuc10 = [];
	polizaEmit: any = {};
	polizaEmitCab: any = {};
	SClient: string;
	polizaEmitComer: any[] = [];
	polizaEmitComerDTOPrincipal: PolizaEmitComer = new PolizaEmitComer();
	polizaEmitComerDTO: PolizaEmitComer = new PolizaEmitComer();
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
	pensionID: string = JSON.parse(localStorage.getItem("pensionID"))["id"];
	saludID: string = JSON.parse(localStorage.getItem("saludID"))["id"];

	/**Puede facturar a mes vencido? */
	canBillMonthly: boolean;
	/**Puede facturar anticipadamente? */
	canBillInAdvance: boolean;
	/** Facturacion a mes vencido */
	facVencido: boolean = false;
	/** Facturacion anticipada */
	facAnticipada: boolean = false;
	/**Tenemos un número de cotización? */
	hasQuotationNumber: boolean = false;

	constructor(private route: ActivatedRoute, private clientInformationService: ClientInformationService, private quotationService: QuotationService, private router: Router, private othersService: OthersService, private policyemit: PolicyemitService, private modalService: NgbModal) {
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
		this.canBillMonthly = AccessFilter.hasPermission("16");
		this.canBillInAdvance = AccessFilter.hasPermission("17");
		this.polizaEmit.facturacionVencido = false;
		this.polizaEmit.facturacionAnticipada = false;
		this.polizaEmit.comentario = "";
		this.polizaEmitCab.MINA = false;
		this.obtenerTipoRenovacion();
		this.polizaEmitCab.bsValueIni = new Date();
		this.polizaEmitCab.bsValueFin = new Date();
		this.polizaEmitCab.bsValueIniMin = new Date();
		this.polizaEmitCab.bsValueFinMax = new Date();
		this.polizaEmitCab.bsValueFinMin = new Date();
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
		this.getIGVPension();
		this.getIGVSalud();

		this.route.queryParams
			.subscribe(params => {
				this.nrocotizacion = params.quotationNumber;
				if (this.nrocotizacion != null && this.nrocotizacion !== undefined && this.nrocotizacion.toString().trim() != "") this.hasQuotationNumber = true;
			});

		if (this.nrocotizacion != undefined) {
			this.buscarCotizacion(event);
		}
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

	onFacturacion() {
		let self = this;
		let sumPen = 0;
		this.pensionList.forEach(item => {
			sumPen = sumPen + parseFloat(item.AUT_PRIMA)
		});

		let sumSal = 0;
		this.saludList.forEach(item => {
			sumSal = sumSal + parseFloat(item.AUT_PRIMA)
		});

		if (this.polizaEmit.facturacionVencido == true) {
			this.facAnticipada = true;

			if (self.formateaValor(sumPen) == parseFloat(this.polizaEmitCab.MIN_PENSION)) {
				this.mensajePrimaPension = ""
				this.totalNetoPensionSave = this.primatotalSCTR
				this.igvPensionSave = this.igvPension;
				this.brutaTotalPensionSave = this.totalSTRC;
			} else {
				if (parseFloat(this.primatotalSCTR.toString()) < parseFloat(this.polizaEmitCab.MIN_PENSION)) {
					this.mensajePrimaPension = "* Se aplica prima mínima en esta ocasión"
					this.totalNetoPensionSave = this.primatotalSCTR
					this.igvPensionSave = this.igvPension;
					this.brutaTotalPensionSave = this.totalSTRC;
				} else {
					this.totalNetoPensionSave = this.primatotalSCTR
					this.igvPensionSave = this.igvPension;
					this.brutaTotalPensionSave = this.totalSTRC;
					this.mensajePrimaPension = "";
				}
			}

			if (self.formateaValor(sumPen) == parseFloat(this.polizaEmitCab.MIN_PENSION)) {
				this.mensajePrimaSalud = ""
				this.totalNetoSaludSave = this.primatotalSalud
				this.igvSaludSave = this.igvSalud;
				this.brutaTotalSaludSave = this.totalSalud;
			} else {
				if (parseFloat(this.primatotalSCTR.toString()) < parseFloat(this.polizaEmitCab.MIN_PENSION)) {
					this.mensajePrimaPension = "* Se aplica prima mínima en esta ocasión"
					this.totalNetoSaludSave = this.primatotalSalud
					this.igvSaludSave = this.igvSalud;
					this.brutaTotalSaludSave = this.totalSalud;
				} else {
					this.totalNetoSaludSave = this.primatotalSalud
					this.igvSaludSave = this.igvSalud;
					this.brutaTotalSaludSave = this.totalSalud;
					this.mensajePrimaPension = "";
				}
			}

		} else {
			if (self.formateaValor(sumPen) == parseFloat(this.polizaEmitCab.MIN_PENSION)) {
				this.mensajePrimaPension = ""
				this.totalNetoPensionSave = this.primatotalSCTR
				this.igvPensionSave = this.igvPension;
				this.brutaTotalPensionSave = this.totalSTRC;
			} else {
				if (parseFloat(this.primatotalSCTR.toString()) < parseFloat(this.polizaEmitCab.MIN_PENSION)) {
					this.totalNetoPensionSave = this.formateaValor(this.polizaEmitCab.MIN_PENSION)
					this.igvPensionSave = this.formateaValor((this.totalNetoPensionSave * this.igvPensionWS) - this.totalNetoPensionSave);
					this.brutaTotalPensionSave = this.formateaValor(parseFloat(this.totalNetoPensionSave.toString()) + parseFloat(this.igvPensionSave.toString()));
					this.mensajePrimaPension = "* Se aplica prima mínima en esta ocasión";
				} else {
					this.mensajePrimaPension = ""
					this.totalNetoPensionSave = this.primatotalSCTR
					this.igvPensionSave = this.igvPension;
					this.brutaTotalPensionSave = this.totalSTRC;
				}
			}

			if (self.formateaValor(sumSal) == parseFloat(this.polizaEmitCab.MIN_SALUD)) {
				this.mensajePrimaSalud = ""
				this.totalNetoSaludSave = this.primatotalSalud
				this.igvSaludSave = this.igvSalud;
				this.brutaTotalSaludSave = this.totalSalud;
			} else {
				if (this.primatotalSalud < parseFloat(this.polizaEmitCab.MIN_SALUD)) {
					this.totalNetoSaludSave = this.formateaValor(this.polizaEmitCab.MIN_SALUD)
					this.igvSaludSave = this.formateaValor((this.totalNetoSaludSave * this.igvSaludWS) - this.totalNetoSaludSave);
					this.brutaTotalSaludSave = this.formateaValor(parseFloat(this.totalNetoSaludSave.toString()) + parseFloat(this.igvSaludSave.toString()));
					this.mensajePrimaSalud = "* Se aplica prima mínima en esta ocasión";
				} else {
					this.mensajePrimaSalud = ""
					this.totalNetoSaludSave = this.primatotalSalud
					this.igvSaludSave = this.igvSalud;
					this.brutaTotalSaludSave = this.totalSalud;
				}
			}
		}

		if (this.polizaEmit.facturacionAnticipada == true) {
			this.facVencido = true;
		}

		if (this.polizaEmit.facturacionVencido == false && this.polizaEmit.facturacionAnticipada == false) {
			this.facVencido = false;
			this.facAnticipada = false;
		}
	}

	getDate() {
		return new Date()
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
		if (this.cotizacionID != "") {
			if (this.excelSubir != undefined) {
				this.validarTrama()
			} else {
				swal.fire("Información", "Adjunte una trama para validar", "error");
			}

		} else {
			swal.fire("Información", "Ingrese una cotización", "error");
		}
	};

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
		myFormData.append("type_mov", "1");
		myFormData.append("retarif", "1");
		myFormData.append("date", dayIni + "/" + monthIni + "/" + yearIni);
		this.policyemit.valGestorList(myFormData).subscribe(
			res => {
				this.erroresList = res.C_TABLE;
				this.loading = false;
				if (this.erroresList != null) {
					if (this.erroresList.length > 0) {
						this.processID = "";
						let modalRef = this.modalService.open(ValErrorComponent, { size: 'lg', backdropClass: 'light-blue-backdrop', backdrop: 'static', keyboard: false });
						modalRef.componentInstance.formModalReference = modalRef;
						modalRef.componentInstance.erroresList = this.erroresList;
					} else {
						this.processID = res.P_NID_PROC;
						this.infoCarga(this.processID)
						swal.fire("Información", "Se validó correctamente la trama", "success");
					}
				} else {
					swal.fire("Información", "El archivo enviado contiene errores", "error");
				}

			},
			err => {
				this.loading = false;
				console.log(err);
			}
		);
	}

	infoCarga(processID: any) {
		let self = this;
		if (processID != "") {
			this.policyemit.getPolicyEmitDetTX(processID, "1", JSON.parse(localStorage.getItem("currentUser"))["id"])
				.subscribe((res: any) => {
					if (res.length > 0) {
						this.pensionList = []
						this.saludList = []
						this.primatotalSCTR = 0;
						this.primatotalSalud = 0;

						res.forEach(item => {
							if (item.ID_PRODUCTO == this.pensionID) {
								this.polizaEmitCab.MIN_PENSION = item.PRIMA_MIN;
								item.PRIMA = self.formateaValor(item.PRIMA)
								this.pensionList.push(item);
								// this.prodPension = true;
								this.activityVariationPension = item.VARIACION_TASA;

								this.primatotalSCTR = self.formateaValor(item.NSUM_PREMIUMN);
								this.igvPension = self.formateaValor(item.NSUM_IGV);
								this.totalSTRC = self.formateaValor(item.NSUM_PREMIUM);

							}
							if (item.ID_PRODUCTO == this.saludID) {
								this.polizaEmitCab.MIN_SALUD = item.PRIMA_MIN;
								item.PRIMA = self.formateaValor(item.PRIMA)
								this.saludList.push(item);
								this.activityVariationSalud = item.VARIACION_TASA;

								this.primatotalSalud = self.formateaValor(item.NSUM_PREMIUMN);
								this.igvSalud = self.formateaValor(item.NSUM_IGV);
								this.totalSalud = self.formateaValor(item.NSUM_PREMIUM);

							}
						});

						let sumPen = 0;
						this.pensionList.forEach(item => {
							sumPen = sumPen + parseFloat(item.AUT_PRIMA)
						});

						if (this.polizaEmit.facturacionVencido == true) {
							if (self.formateaValor(sumPen) == parseFloat(this.polizaEmitCab.MIN_PENSION)) {
								this.mensajePrimaPension = ""
								this.totalNetoPensionSave = this.primatotalSCTR
								this.igvPensionSave = this.igvPension;
								this.brutaTotalPensionSave = this.totalSTRC;
							} else {
								if (parseFloat(this.primatotalSCTR.toString()) < parseFloat(this.polizaEmitCab.MIN_PENSION)) {
									this.mensajePrimaPension = "* Se aplica prima mínima en esta ocasión"
									this.totalNetoPensionSave = this.primatotalSCTR
									this.igvPensionSave = this.igvPension;
									this.brutaTotalPensionSave = this.totalSTRC;
								} else {
									this.totalNetoPensionSave = this.primatotalSCTR
									this.igvPensionSave = this.igvPension;
									this.brutaTotalPensionSave = this.totalSTRC;
									this.mensajePrimaPension = "";
								}
							}
						} else {
							if (self.formateaValor(sumPen) == parseFloat(this.polizaEmitCab.MIN_PENSION)) {
								this.mensajePrimaPension = ""
								this.totalNetoPensionSave = this.primatotalSCTR
								this.igvPensionSave = this.igvPension;
								this.brutaTotalPensionSave = this.totalSTRC;
							} else {
								if (parseFloat(this.primatotalSCTR.toString()) < parseFloat(this.polizaEmitCab.MIN_PENSION)) {
									this.totalNetoPensionSave = this.formateaValor(this.polizaEmitCab.MIN_PENSION)
									this.igvPensionSave = this.formateaValor((this.totalNetoPensionSave * this.igvPensionWS) - this.totalNetoPensionSave);
									this.brutaTotalPensionSave = this.formateaValor(parseFloat(this.totalNetoPensionSave.toString()) + parseFloat(this.igvPensionSave.toString()));
									this.mensajePrimaPension = "* Se aplica prima mínima en esta ocasión";
								} else {
									this.mensajePrimaPension = ""
									this.totalNetoPensionSave = this.primatotalSCTR
									this.igvPensionSave = this.igvPension;
									this.brutaTotalPensionSave = this.totalSTRC;
								}
							}
						}



						let sumSal = 0;
						this.saludList.forEach(item => {
							sumSal = sumSal + parseFloat(item.AUT_PRIMA)
						});


						if (this.polizaEmit.facturacionVencido == true) {
							if (self.formateaValor(sumPen) == parseFloat(this.polizaEmitCab.MIN_PENSION)) {
								this.mensajePrimaSalud = ""
								this.totalNetoSaludSave = this.primatotalSalud
								this.igvSaludSave = this.igvSalud;
								this.brutaTotalSaludSave = this.totalSalud;
							} else {
								if (parseFloat(this.primatotalSCTR.toString()) < parseFloat(this.polizaEmitCab.MIN_PENSION)) {
									this.mensajePrimaPension = "* Se aplica prima mínima en esta ocasión"
									this.totalNetoSaludSave = this.primatotalSalud
									this.igvSaludSave = this.igvSalud;
									this.brutaTotalSaludSave = this.totalSalud;
								} else {
									this.totalNetoSaludSave = this.primatotalSalud
									this.igvSaludSave = this.igvSalud;
									this.brutaTotalSaludSave = this.totalSalud;
									this.mensajePrimaPension = "";
								}
							}
						} else {
							if (self.formateaValor(sumSal) == parseFloat(this.polizaEmitCab.MIN_SALUD)) {
								this.mensajePrimaSalud = ""
								this.totalNetoSaludSave = this.primatotalSalud
								this.igvSaludSave = this.igvSalud;
								this.brutaTotalSaludSave = this.totalSalud;
							} else {
								if (this.primatotalSalud < parseFloat(this.polizaEmitCab.MIN_SALUD)) {
									this.totalNetoSaludSave = this.formateaValor(this.polizaEmitCab.MIN_SALUD)
									this.igvSaludSave = this.formateaValor((this.totalNetoSaludSave * this.igvSaludWS) - this.totalNetoSaludSave);
									this.brutaTotalSaludSave = this.formateaValor(parseFloat(this.totalNetoSaludSave.toString()) + parseFloat(this.igvSaludSave.toString()));
									this.mensajePrimaSalud = "* Se aplica prima mínima en esta ocasión";
								} else {
									this.mensajePrimaSalud = ""
									this.totalNetoSaludSave = this.primatotalSalud
									this.igvSaludSave = this.igvSalud;
									this.brutaTotalSaludSave = this.totalSalud;
								}
							}
						}

						let sumWorkers = 0;
						if (this.pensionList.length > 0) {
							this.tasasList = this.pensionList;
							this.pensionList.map(function (dato) {
								dato.AUT_PRIMA = self.formateaValor(dato.AUT_PRIMA)
								dato.TASA_PRO = "";
								self.endosoPension = dato.PRIMA_END;
								dato.rateDet = dato.TASA_RIESGO;
								sumWorkers = sumWorkers + parseFloat(dato.NUM_TRABAJADORES);
							});
						}

						if (this.saludList.length > 0) {
							this.tasasList = this.saludList;
							this.saludList.map(function (dato) {
								dato.AUT_PRIMA = self.formateaValor(dato.AUT_PRIMA)
								dato.TASA_PRO = "";
								self.endosoSalud = dato.PRIMA_END;
								dato.rateDet = dato.TASA_RIESGO;
								sumWorkers = sumWorkers + parseFloat(dato.NUM_TRABAJADORES);
							});
						}

						if (this.pensionList.length == 0 && this.saludList.length == 0) {
							this.tasasList = [];
						}

						this.polizaEmit.P_WORKER = sumWorkers;

						if (sumWorkers <= 50) {
							this.polizaEmit.workers = "1";
						}

						if (sumWorkers > 50) {
							this.polizaEmit.workers = "2";
						}

					} else {
						this.primatotalSCTR = 0;
						this.primatotalSalud = 0;
						this.igvPension = 0;
						this.igvSalud = 0;
						this.totalSalud = 0;
						this.totalSTRC = 0;
					}
				})
		}

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

	buscarCotizacion(event) {
		this.cotizacionID = "";
		this.NroPension = "";
		this.NroSalud = "";
		this.flagBusqueda = false;
		this.pensionList = [];
		this.saludList = [];
		this.tasasList = [];
		let typeMovement = "1";
		//Cabeza Cotizacion | Datos de la póliza
		if (this.nrocotizacion != undefined && this.nrocotizacion != 0) {
			this.policyemit.getPolicyEmitCab(this.nrocotizacion, typeMovement, JSON.parse(localStorage.getItem("currentUser"))["id"])
				.subscribe((res: any) => {
					let self = this;
					this.cotizacionID = this.nrocotizacion;
					if (res.GenericResponse !== null) {
						if (res.GenericResponse.COD_ERR == 0) {
							this.filePathList = res.GenericResponse.RUTAS;
							this.SClient = res.GenericResponse.SCLIENT;
							res.GenericResponse.bsValueIni = this.polizaEmitCab.bsValueIni
							res.GenericResponse.bsValueFin = this.polizaEmitCab.bsValueFin
							res.GenericResponse.tipoRenovacion = this.polizaEmitCab.tipoRenovacion
							res.GenericResponse.frecuenciaPago = this.polizaEmitCab.frecuenciaPago
							this.polizaEmitCab = res.GenericResponse;
							if (this.polizaEmitCab.CORREO == "") {
								this.flagEmailNull = false
								let data: any = {};
								data.P_CodAplicacion = "SCTR";
								data.P_TipOper = "CON";
								data.P_NUSERCODE = JSON.parse(localStorage.getItem("currentUser"))["id"];
								data.P_NIDDOC_TYPE = this.polizaEmitCab.TIPO_DOCUMENTO;
								data.P_SIDDOC = this.polizaEmitCab.NUM_DOCUMENTO.toUpperCase();

								this.clientInformationService.getClientInformation(data).subscribe(
									res => {
										this.contractingdata = res.EListClient[0]
									}

								);
							}
							this.polizaEmitCab.bsValueIni = new Date();
							this.polizaEmitCab.bsValueIniMin = new Date(this.polizaEmitCab.EFECTO_COTIZACION);
							this.polizaEmitCab.bsValueFinMin = this.polizaEmitCab.bsValueIni;
							this.polizaEmitCab.bsValueFin = new Date(res.GenericResponse.EXPIRACION_COTIZACION);
							this.polizaEmitCab.bsValueFinMax = new Date(this.polizaEmitCab.EXPIRACION_COTIZACION);
							this.polizaEmitCab.MINA = res.GenericResponse.MINA == "1" ? true : false;
							this.polizaEmitCab.DELIMITACION = res.GenericResponse.DELIMITACION == "1" ? "* La actividad cuenta con delimitación" : "";
							this.flagBusqueda = true;

							this.policyemit.getPolicyEmitComer(this.nrocotizacion)
								.subscribe((res: any) => {
									this.tableComer = true
									this.polizaEmitComer = [];
									if (res.length > 0 && res !== null) {
										res.forEach(com => {
											com.COMISION_PENSION_AUT = com.COMISION_PENSION_AUT == "" ? "0" : com.COMISION_PENSION_AUT;
											com.COMISION_PENSION_PRO = com.COMISION_PENSION_PRO == "" ? "0" : com.COMISION_PENSION_PRO;
											com.COMISION_PENSION = com.COMISION_PENSION == "" ? "0" : com.COMISION_PENSION;
											com.COMISION_SALUD = com.COMISION_SALUD == "" ? "0" : com.COMISION_SALUD;
											com.COMISION_SALUD_AUT = com.COMISION_SALUD_AUT == "" ? "0" : com.COMISION_SALUD_AUT;
											com.COMISION_SALUD_PRO = com.COMISION_SALUD_PRO == "" ? "0" : com.COMISION_SALUD_PRO;
										});
										this.polizaEmitComer = res
										this.flagBusqueda = true;
									} else {
										this.polizaEmitComerDTOPrincipal = {};
										this.polizaEmitComer = [];
									}
								})

							// this.policyemit.getPolicyEmitDet(this.nrocotizacion, JSON.parse(localStorage.getItem("currentUser"))["id"])
							// 	.subscribe((res: any) => {
							// 		if (res.length > 0) {
							// 			this.primatotalSCTR = 0;
							// 			this.primatotalSalud = 0;
							// 			this.igvPension = 0;
							// 			this.igvSalud = 0;
							// 			this.totalSTRC = 0;
							// 			this.totalSalud = 0;
							// 			res.forEach(item => {
							// 				if (item.ID_PRODUCTO == this.pensionID) {
							// 					item.PRIMA = self.formateaValor(item.PRIMA)
							// 					this.pensionList.push(item);
							// 					this.primatotalSCTR = self.formateaValor(item.NSUM_PREMIUMN);
							// 					this.igvPension = self.formateaValor(item.NSUM_IGV);
							// 					this.totalSTRC = self.formateaValor(item.NSUM_PREMIUM);
							// 				}
							// 				if (item.ID_PRODUCTO == this.saludID) {
							// 					item.PRIMA = self.formateaValor(item.PRIMA)
							// 					this.saludList.push(item);
							// 					this.primatotalSalud = self.formateaValor(item.NSUM_PREMIUMN);
							// 					this.igvSalud = self.formateaValor(item.NSUM_IGV);
							// 					this.totalSalud = self.formateaValor(item.NSUM_PREMIUM);
							// 				}
							// 			});

							// 			if (this.pensionList.length > 0) {
							// 				this.tasasList = this.pensionList;
							// 			} else if (this.saludList.length > 0) {
							// 				this.tasasList = this.saludList;
							// 			} else {
							// 				this.tasasList = [];
							// 			}
							// 		} else {
							// 			this.primatotalSCTR = 0;
							// 			this.primatotalSalud = 0;
							// 			this.igvPension = 0;
							// 			this.igvSalud = 0;
							// 			this.totalSalud = 0;
							// 			this.totalSTRC = 0;
							// 		}
							// 	})
						} else {
							swal.fire("Información", res.GenericResponse.MENSAJE, "error");
							this.polizaEmitCab = new PolizaEmitCab();
							this.polizaEmitCab.bsValueIni = new Date();
							this.polizaEmitCab.bsValueFin = new Date();
							this.polizaEmitCab.bsValueIniMin = new Date();
							this.polizaEmitCab.bsValueFinMin = new Date();
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
						this.polizaEmitCab = new PolizaEmitCab();
						this.polizaEmitCab.bsValueIni = new Date();
						this.polizaEmitCab.bsValueFin = new Date();
						this.polizaEmitCab.bsValueIniMin = new Date();
						this.polizaEmitCab.bsValueFinMin = new Date();
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
			swal.fire("Información", "Ingresar nro de cotización", "error");
		}
	}

	formateaValor(valor) {
		// si no es un número devuelve el valor, o lo convierte a número con 2 decimales
		return isNaN(valor) ? valor : parseFloat(valor).toFixed(2);
	}

	obtenerTipoRenovacion() {
		let requestTypeRen: any = {}
		requestTypeRen.P_NUSERCODE = JSON.parse(localStorage.getItem("currentUser"))["id"]
		this.policyemit.getTipoRenovacion(requestTypeRen)
			.subscribe((res: any) => {
				this.tipoRenovacion = res;
				if (this.polizaEmitCab.tipoRenovacion !== "") {
					this.policyemit.getFrecuenciaPago(this.polizaEmitCab.tipoRenovacion)
						.subscribe((res: any) => {
							this.polizaEmitCab.frecuenciaPago = "";
							this.frecuenciaPago = res;
						})
				}
			})
	}

	downloadExcel() {
		let client: string = this.SClient;
		if (client != null && this.nrocotizacion != undefined && this.nrocotizacion != 0) {
			this.loading = true;
			this.policyemit.downloadExcel(client, this.nrocotizacion, '1', '0', '0').subscribe((res: any) => {
				if (res.GenericResponse != null) {
					this.loading = false;
					let Url: string = this.policyemit.getUrl();
					Url = Url.substring(0, Url.length - 4);
					console.log(Url);
					let ruta: string = res.GenericResponse;
					ruta = (Url + '//' + ruta.replace("\\", "//"));
					parent.location.href = ruta;
				} else {
					this.loading = false;
				}
			}),
				err => {
					this.loading = false;
					console.log(err);
				}

		} else {
			swal.fire("Información", "Debes buscar una cotizacion", "error");
		}

	}

	cambioFecha() {
		this.errorFrecPago = false;
	}


	generarPoliza(forma: NgForm) {
		let mensaje = "";
		if (this.cotizacionID == "") {
			this.errorNroCot = true;
			mensaje = "Debe ingresar una cotización <br />";
		}
		if (this.polizaEmitCab.frecuenciaPago === "") {
			this.errorFrecPago = true;
			mensaje += "Debe ingresar una frecuencia de pago <br />";
		}
		if (this.polizaEmitCab.tipoRenovacion === "") {
			this.flagTipoR = true;
			mensaje += "Debe ingresar un tipo de renovación <br />";
		}
		// if (this.mode != "endosar" && this.mode != "cancel") {
		if (this.excelSubir === undefined) {
			this.errorExcel = true;
			mensaje += "Debe subir un archivo excel para su validación <br />";
		} else {
			if (this.erroresList.length > 0 || this.processID == "") {
				this.errorExcel = true;
				mensaje += "No se ha procesado la validación de forma correcta <br />";
			}
		}
		// }

		if (this.polizaEmitCab.CORREO == "") {
			this.flagEmail = true;
			mensaje += "Debes ingresar un correo electrónico <br />";
		} else {
			if (/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(this.polizaEmitCab.CORREO) == false) {
				this.flagEmail = true;
				mensaje += "El correo electrónico es inválido <br />";
			} else {
				this.flagEmail = false;
			}
		}

		if (mensaje == "") {

			if (this.flagEmailNull == false) {
				let contracting: any = {}
				contracting.P_APELLIDO_CASADA = this.contractingdata.P_APELLIDO_CASADA
				contracting.P_COD_CUSPP = this.contractingdata.P_COD_CUSPP
				contracting.P_COD_UBIG_DEP_NAC = this.contractingdata.P_COD_UBIG_DEP_NAC
				contracting.P_COD_UBIG_DIST_NAC = this.contractingdata.P_COD_UBIG_DIST_NAC
				contracting.P_COD_UBIG_PROV_NAC = this.contractingdata.P_COD_UBIG_PROV_NAC
				contracting.P_CONSTANCIA_VOTACION = this.contractingdata.P_CONSTANCIA_VOTACION
				contracting.P_CodAplicacion = "SCTR"
				contracting.P_DBIRTHDAT = this.contractingdata.P_DBIRTHDAT
				contracting.P_DEPARTAMENTO_NACIMIENTO = this.contractingdata.P_DEPARTAMENTO_NACIMIENTO
				contracting.P_DISTRITO_NACIMIENTO = this.contractingdata.P_DISTRITO_NACIMIENTO
				contracting.P_FECHA_EXPEDICION = this.contractingdata.P_FECHA_EXPEDICION
				contracting.P_FECHA_INSC = this.contractingdata.P_FECHA_INSC
				contracting.P_FIRMA_RENIEC = this.contractingdata.P_FIRMA_RENIEC
				contracting.P_FOTO_RENIEC = this.contractingdata.P_FOTO_RENIEC
				contracting.P_NCIVILSTA = this.contractingdata.P_NCIVILSTA
				contracting.P_NHEIGHT = this.contractingdata.P_NHEIGHT
				contracting.P_NIDDOC_TYPE = this.contractingdata.P_NIDDOC_TYPE
				contracting.P_NNATIONALITY = this.contractingdata.P_NNATIONALITY
				contracting.P_NOMBRE_MADRE = this.contractingdata.P_NOMBRE_MADRE
				contracting.P_NOMBRE_PADRE = this.contractingdata.P_NOMBRE_PADRE
				contracting.P_NSPECIALITY = this.contractingdata.P_NSPECIALITY
				contracting.P_NTITLE = this.contractingdata.P_NTITLE
				contracting.P_NUSERCODE = JSON.parse(localStorage.getItem("currentUser"))["id"]
				contracting.P_NU_DOC_SUSTENT = this.contractingdata.P_NU_DOC_SUSTENT
				contracting.P_ORIGEN_DATA = this.contractingdata.P_ORIGEN_DATA
				contracting.P_PROVINCIA_NACIMIENTO = this.contractingdata.P_PROVINCIA_NACIMIENTO
				contracting.P_RESTRICCION = this.contractingdata.P_RESTRICCION
				contracting.P_SBLOCKADE = this.contractingdata.P_SBLOCKADE
				contracting.P_SBLOCKLAFT = this.contractingdata.P_SBLOCKLAFT
				contracting.P_SDIGIT = this.contractingdata.P_SDIGIT
				contracting.P_SDIG_VERIFICACION = null
				contracting.P_SFIRSTNAME = this.contractingdata.P_SFIRSTNAME
				contracting.P_SGRADO_INSTRUCCION = this.contractingdata.P_SGRADO_INSTRUCCION
				contracting.P_SIDDOC = this.contractingdata.P_SIDDOC
				contracting.P_SISCLIENT_IND = this.contractingdata.P_SISCLIENT_IND
				contracting.P_SISRENIEC_IND = this.contractingdata.P_SISRENIEC_IND
				contracting.P_SLASTNAME = this.contractingdata.P_SLASTNAME
				contracting.P_SLASTNAME2 = this.contractingdata.P_SLASTNAME2
				contracting.P_SLEGALNAME = this.contractingdata.P_SLEGALNAME
				contracting.P_SPOLIZA_ELECT_IND = this.contractingdata.P_SPOLIZA_ELECT_IND
				contracting.P_SPROTEG_DATOS_IND = this.contractingdata.P_SPROTEG_DATOS_IND
				contracting.P_SSEXCLIEN = this.contractingdata.P_SSEXCLIEN
				contracting.P_TI_DOC_SUSTENT = this.contractingdata.P_TI_DOC_SUSTENT
				contracting.P_TipOper = "INS"
				contracting.EListAddresClient = []
				contracting.EListCIIUClient = []
				contracting.EListContactClient = []
				contracting.EListPhoneClient = []
				contracting.EListEmailClient = []
				let contractingEmail: any = {}
				contractingEmail.P_CLASS = ""
				contractingEmail.P_DESTICORREO = "Personal"
				contractingEmail.P_NROW = 1
				contractingEmail.P_NUSERCODE = JSON.parse(localStorage.getItem("currentUser"))["id"];
				contractingEmail.P_SE_MAIL = this.polizaEmitCab.CORREO
				contractingEmail.P_SORIGEN = "SCTR"
				contractingEmail.P_SRECTYPE = "4"
				contractingEmail.P_TipOper = ""
				contracting.EListEmailClient.push(contractingEmail)
				this.clientInformationService.insertContract(contracting).subscribe(
					res => {
						if (res.P_NCODE == "0") {
							this.emitirContrac()
						}
					}
				);
			} else {
				this.emitirContrac()
			}
		} else {
			swal.fire("Información", mensaje, "error");
		}

	}

	emitirContrac() {
		this.savedPolicyList = [];
		let myFormData: FormData = new FormData()

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

		if (this.saludList.length > 0) {
			this.savedPolicyEmit = {};
			this.savedPolicyEmit.P_NID_COTIZACION = this.cotizacionID; //Cotizacion
			this.savedPolicyEmit.P_NID_PROC = this.processID; // Proceso
			this.savedPolicyEmit.P_NPRODUCT = this.saludID; // Producto
			this.savedPolicyEmit.P_SCOLTIMRE = this.polizaEmitCab.tipoRenovacion; //Tipo Renovacion
			this.savedPolicyEmit.P_DSTARTDATE = dayIni + "/" + monthIni + "/" + yearIni; //Fecha Inicio
			this.savedPolicyEmit.P_DEXPIRDAT = dayFin + "/" + monthFin + "/" + yearFin; // Fecha Fin
			this.savedPolicyEmit.P_NPAYFREQ = this.polizaEmitCab.frecuenciaPago // Frecuencia Pago
			this.savedPolicyEmit.P_SFLAG_FAC_ANT = this.polizaEmit.facturacionAnticipada == true ? 1 : 0; // Facturacion Anticipada
			this.savedPolicyEmit.P_FACT_MES_VENCIDO = this.polizaEmit.facturacionVencido == true ? 1 : 0; // Facturacion Vencida
			this.savedPolicyEmit.P_NPREM_NETA = this.primatotalSalud; // Prima Mensual
			this.savedPolicyEmit.P_IGV = this.igvSalud; // IGV 
			this.savedPolicyEmit.P_NPREM_BRU = this.totalSalud; // Total bruta
			this.savedPolicyEmit.P_SCOMMENT = this.polizaEmit.comentario.toUpperCase(); // Comentario
			this.savedPolicyEmit.P_NUSERCODE = JSON.parse(localStorage.getItem("currentUser"))["id"]; //Usuario
			this.savedPolicyList.push(this.savedPolicyEmit);
		}

		if (this.pensionList.length > 0) {
			this.savedPolicyEmit = {};
			this.savedPolicyEmit.P_NID_COTIZACION = this.cotizacionID; //Cotizacion
			this.savedPolicyEmit.P_NID_PROC = this.processID; // Proceso
			this.savedPolicyEmit.P_NPRODUCT = this.pensionID; // Producto
			this.savedPolicyEmit.P_SCOLTIMRE = this.polizaEmitCab.tipoRenovacion; //Tipo Renovacion
			this.savedPolicyEmit.P_DSTARTDATE = dayIni + "/" + monthIni + "/" + yearIni; //Fecha Inicio
			this.savedPolicyEmit.P_DEXPIRDAT = dayFin + "/" + monthFin + "/" + yearFin; // Fecha Fin
			this.savedPolicyEmit.P_NPAYFREQ = this.polizaEmitCab.frecuenciaPago // Frecuencia Pago
			this.savedPolicyEmit.P_SFLAG_FAC_ANT = this.polizaEmit.facturacionAnticipada == true ? 1 : 0; // Facturacion Anticipada
			this.savedPolicyEmit.P_FACT_MES_VENCIDO = this.polizaEmit.facturacionVencido == true ? 1 : 0; // Facturacion Vencida
			this.savedPolicyEmit.P_NPREM_NETA = this.primatotalSCTR; // Prima Mensual
			this.savedPolicyEmit.P_IGV = this.igvPension; // IGV 
			this.savedPolicyEmit.P_NPREM_BRU = this.totalSTRC; // Total bruta
			this.savedPolicyEmit.P_SCOMMENT = this.polizaEmit.comentario.toUpperCase(); //Comentario
			this.savedPolicyEmit.P_NUSERCODE = JSON.parse(localStorage.getItem("currentUser"))["id"]; //Usuario
			this.savedPolicyList.push(this.savedPolicyEmit);
		}

		myFormData.append("objeto", JSON.stringify(this.savedPolicyList));
		swal.fire({
			title: "Información",
			text: "¿Desea realizar la emisión?",
			type: "question",
			showCancelButton: true,
			confirmButtonText: 'Generar',
			allowOutsideClick: false,
			cancelButtonText: 'Cancelar'
		})
			.then((result) => {
				if (result.value) {
					this.policyemit.savePolicyEmit(myFormData)
						.subscribe((res: any) => {
							if (res.P_COD_ERR == 0) {
								this.flagEmailNull = true;
								let policyPension = 0;
								let policySalud = 0;
								let constancia = 0

								policyPension = res.P_POL_PENSION;
								policySalud = res.P_POL_SALUD;
								constancia = res.P_NCONSTANCIA;

								this.NroPension = policyPension;
								this.NroSalud = policySalud;

								if (policyPension > 0 && policySalud > 0) {

									swal.fire({
										title: "Información",
										text: "Se ha generado correctamente la póliza de Pensión N° " + policyPension + " y la póliza de Salud N° " + policySalud + " con Constancia N° " + constancia,
										type: "success",
										confirmButtonText: 'OK',
										allowOutsideClick: false,
									})
										.then((result) => {
											if (result.value) {
												this.router.navigate(['/broker/policy-transactions']);
											}
										});
								}
								else {
									if (policyPension > 0) {
										swal.fire({
											title: "Información",
											text: "Se ha generado correctamente la póliza de Pensión N° " + policyPension + " con Constancia N° " + constancia,
											type: "success",
											confirmButtonText: 'OK',
											allowOutsideClick: false,
										})
											.then((result) => {
												if (result.value) {
													this.router.navigate(['/broker/policy-transactions']);
												}
											});
									}
									if (policySalud > 0) {
										swal.fire({
											title: "Información",
											text: "Se ha generado correctamente la póliza de Salud N° " + policySalud + " con Constancia N° " + constancia,
											type: "success",
											confirmButtonText: 'OK',
											allowOutsideClick: false,
										})
											.then((result) => {
												if (result.value) {
													this.router.navigate(['/broker/policy-transactions']);
												}
											});
									}
								}
							} else {
								swal.fire({
									title: "Información",
									text: res.P_MESSAGE,
									type: "error",
									confirmButtonText: 'OK',
									allowOutsideClick: false,
								})
							}

						});
				}
			});

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

	validarTipoRenovacion(event: any) {
		var fechadesde = this.desde.nativeElement.value.split("/");
		var fechahasta = this.hasta.nativeElement.value.split("/");
		var fechaDes = (fechadesde[1]) + "/" + fechadesde[0] + "/" + fechadesde[2];
		var fechaHas = (fechahasta[1]) + "/" + fechahasta[0] + "/" + fechahasta[2];
		let fechad = new Date(fechaDes);
		let fechah = new Date(fechaHas);

		if (this.polizaEmitCab.tipoRenovacion == "6") { //Especial
			fechad.setDate(fechad.getDate() + 1);
			this.polizaEmitCab.bsValueFinMin = new Date(fechad);
			if (fechad.getTime() > fechah.getTime()) {
				this.polizaEmitCab.bsValueFin = new Date(fechad);
			}
			this.disabledFecha = false;
		}
		if (this.polizaEmitCab.tipoRenovacion == "7") { //Especial Estado
			fechad.setDate(fechad.getDate() + 1);
			this.polizaEmitCab.bsValueFinMin = new Date(fechad);
			if (fechad.getTime() > fechah.getTime()) {
				this.polizaEmitCab.bsValueFin = new Date(fechad);
			}
			this.disabledFecha = false;
		}
		if (this.polizaEmitCab.tipoRenovacion === "5") { //Mensual
			fechad.setMonth(fechad.getMonth() + 1);
			fechad.setDate(fechad.getDate() - 1);
			this.polizaEmitCab.bsValueFin = new Date(fechad);
			this.flagFechaMenorMayorFin = true;
		}
		if (this.polizaEmitCab.tipoRenovacion === "4") { //Bimestral

			fechad.setMonth(fechad.getMonth() + 2);
			fechad.setDate(fechad.getDate() - 1);
			this.polizaEmitCab.bsValueFin = new Date(fechad);
			this.flagFechaMenorMayorFin = true;
		}
		if (this.polizaEmitCab.tipoRenovacion === "3") { //Trimestral
			fechad.setMonth(fechad.getMonth() + 3);
			fechad.setDate(fechad.getDate() - 1);
			this.polizaEmitCab.bsValueFin = new Date(fechad);
			this.flagFechaMenorMayorFin = true;
		}
		if (this.polizaEmitCab.tipoRenovacion === "2") { //Semestral
			fechad.setMonth(fechad.getMonth() + 6);
			fechad.setDate(fechad.getDate() - 1);
			this.polizaEmitCab.bsValueFin = new Date(fechad);
			this.flagFechaMenorMayorFin = true;
		}

		if (this.polizaEmitCab.tipoRenovacion === "1") { //Anual
			fechad.setFullYear(fechad.getFullYear() + 1)
			fechad.setDate(fechad.getDate() - 1);
			this.polizaEmitCab.bsValueFin = new Date(fechad);
			this.flagFechaMenorMayorFin = true;
		}
	}


	habilitarFechas() {
		this.flagTipoR = false;
		this.activacion = false;
		this.disabledFecha = true;
		this.errorFrecPago = false;
		this.policyemit.getFrecuenciaPago(this.polizaEmitCab.tipoRenovacion)
			.subscribe((res: any) => {
				this.polizaEmitCab.frecuenciaPago = "";
				this.frecuenciaPago = res;

				if (res != null && res.length == 1) this.polizaEmitCab.frecuenciaPago = res[0].COD_TIPO_FRECUENCIA; //Si solo hay una frecuencia de pago, está se seleccionará automáticamente
			})

		var fechadesde = this.desde.nativeElement.value.split("/");
		var fechahasta = this.hasta.nativeElement.value.split("/");
		var fechaDes = (fechadesde[1]) + "/" + fechadesde[0] + "/" + fechadesde[2];
		var fechaHas = (fechahasta[1]) + "/" + fechahasta[0] + "/" + fechahasta[2];
		let fechad = new Date(fechaDes);
		let fechah = new Date(fechaHas);

		if (this.polizaEmitCab.tipoRenovacion == "6") {
			fechad.setDate(fechad.getDate() + 1);
			this.polizaEmitCab.bsValueFinMin = new Date(fechad);
			if (fechad.getTime() > fechah.getTime()) {
				this.polizaEmitCab.bsValueFin = new Date(fechad);
			}
			this.disabledFecha = false;
		}
		if (this.polizaEmitCab.tipoRenovacion == "7") {
			fechad.setDate(fechad.getDate() + 1);
			this.polizaEmitCab.bsValueFinMin = new Date(fechad);
			if (fechad.getTime() > fechah.getTime()) {
				this.polizaEmitCab.bsValueFin = new Date(fechad);
			}
			this.disabledFecha = false;
		}
		if (this.polizaEmitCab.tipoRenovacion == "5") {
			fechad.setMonth(fechad.getMonth() + 1);
			fechad.setDate(fechad.getDate() - 1);
			this.polizaEmitCab.bsValueFin = new Date(fechad);
			this.flagFechaMenorMayorFin = true;
		}
		if (this.polizaEmitCab.tipoRenovacion == "4") {
			fechad.setMonth(fechad.getMonth() + 2);
			fechad.setDate(fechad.getDate() - 1);
			this.polizaEmitCab.bsValueFin = new Date(fechad);
			this.flagFechaMenorMayorFin = true;
		}
		if (this.polizaEmitCab.tipoRenovacion == "3") {
			fechad.setMonth(fechad.getMonth() + 3);
			fechad.setDate(fechad.getDate() - 1);
			this.polizaEmitCab.bsValueFin = new Date(fechad);
			this.flagFechaMenorMayorFin = true;
		}

		if (this.polizaEmitCab.tipoRenovacion == "2") {
			fechad.setMonth(fechad.getMonth() + 6);
			fechad.setDate(fechad.getDate() - 1);
			this.polizaEmitCab.bsValueFin = new Date(fechad);
			this.flagFechaMenorMayorFin = true;
		}

		if (this.polizaEmitCab.tipoRenovacion == "1") {
			fechad.setFullYear(fechad.getFullYear() + 1)
			fechad.setDate(fechad.getDate() - 1);
			this.polizaEmitCab.bsValueFin = new Date(fechad);
			this.flagFechaMenorMayorFin = true;
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
				pattern = /[a-zA-ZñÑÁÉÍÓÚáéíóúÄËÏÖÜäëïöü0-9-,:()&$#. ]/;
				break;
			}
			case 5: { // Solo texto
				pattern = /[A-Za-zñÑÁÉÍÓÚáéíóúÄËÏÖÜäëïöü ]/;
				break;
			}
			case 6: { // Email
				this.flagEmail = false;
				pattern = /[0-9A-Za-z._@-]/;
				break;
			}
		}

		const inputChar = String.fromCharCode(event.charCode);

		if (!pattern.test(inputChar)) {
			event.preventDefault();
		}
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

	listToString(list: String[]): string {
		let output = "";
		if (list != null) {
			list.forEach(function (item) {
				output = output + item + " <br>"
			});
		}
		return output;
	}
}
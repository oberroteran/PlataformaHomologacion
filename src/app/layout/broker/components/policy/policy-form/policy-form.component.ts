import { PolizaAsegurados } from '../../../models/polizaEmit/PolizaAsegurados';
import { PolizaEmit } from '../../../models/polizaEmit/polizaEmit';
import { PolizaEmitCab } from '../../../models/polizaEmit/PolizaEmitCab';
import { PolizaEmitComer } from '../../../models/polizaEmit/PolizaEmitComer';
import { TipoRenovacion } from '../../../models/polizaEmit/TipoRenovacion';
import { FrecuenciaPago } from '../../../models/polizaEmit/FrecuenciaPago';
import { SavedPolicyEmit } from '../../..//models/polizaEmit/SavedPolicyEmit';
import { PolizaEmitDet, PolizaEmitDetAltoRiesgo, PolizaEmitDetMedianoRiesgo, PolizaEmitDetBajoRiesgo } from '../../../models/polizaEmit/PolizaEmitDet';
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { BsDatepickerConfig } from "ngx-bootstrap";
import { ActivatedRoute, Route, Router } from '@angular/router';
import { utils, write, read, readFile, WorkBook, WorkSheet } from 'xlsx';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2'
import { PolicyemitService } from '../../../services/policy/policyemit.service';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
//import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ValErrorComponent } from '../../../modal/val-error/val-error.component';
//Compartido
import { AccessFilter } from './../../access-filter'
import { ModuleConfig } from './../../module.config'

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
	saludID: string = "130";

	/**Puede facturar a mes vencido? */
	canBillMonthly: boolean;
	/**Puede facturar anticipadamente? */
	canBillInAdvance: boolean;

	/** Facturacion a mes vencido */
	facVencido: boolean = false;
	/** Facturacion anticipada */
	facAnticipada: boolean = false;

	constructor(private route: ActivatedRoute, private router: Router, private policyemit: PolicyemitService, private modalService: NgbModal) {

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
		//prueba mina
		this.polizaEmitCab.MINA = false;
		this.ObtenerTipoRenovacion();

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

		this.route.queryParams
			.subscribe(params => {
				this.nrocotizacion = params.quotationNumber;
			});

		if (this.nrocotizacion != undefined) {
			this.buscarCotizacion(event);
		}
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
	}

	getDate() {
		return new Date()
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
		if (this.cotizacionID != "") {
			if (this.excelSubir != undefined) {
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
			} else {
				Swal.fire("Información", "Adjunte una trama para validar", "error");
			}

		} else {
			Swal.fire("Información", "Ingrese una cotización", "error");
		}
	};

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
			this.policyemit.getPolicyEmitCab(this.nrocotizacion, typeMovement)
				.subscribe((res: any) => {
					let self = this;
					this.cotizacionID = this.nrocotizacion;
					if (res.GenericResponse !== null) {
						if (res.GenericResponse.COD_ERR == 0) {

							this.SClient = res.GenericResponse.SCLIENT;
							res.GenericResponse.bsValueIni = this.polizaEmitCab.bsValueIni
							res.GenericResponse.bsValueFin = this.polizaEmitCab.bsValueFin
							res.GenericResponse.tipoRenovacion = this.polizaEmitCab.tipoRenovacion
							res.GenericResponse.frecuenciaPago = this.polizaEmitCab.frecuenciaPago

							this.polizaEmitCab = res.GenericResponse;

							this.polizaEmitCab.bsValueIni = new Date();
							this.polizaEmitCab.bsValueIniMin = new Date(this.polizaEmitCab.EFECTO_COTIZACION);
							this.polizaEmitCab.bsValueFinMin = this.polizaEmitCab.bsValueIni;
							this.polizaEmitCab.bsValueFin = new Date(res.GenericResponse.EXPIRACION_COTIZACION);
							this.polizaEmitCab.bsValueFinMax = new Date(this.polizaEmitCab.EXPIRACION_COTIZACION);

							this.polizaEmitCab.MINA = res.GenericResponse.MINA == "1" ? true : false;
							this.polizaEmitCab.DELIMITACION = res.GenericResponse.DELIMITACION == "1" ? true : false;
							this.flagBusqueda = true;

							this.policyemit.getPolicyEmitComer(this.nrocotizacion)
								.subscribe((res: any) => {
									this.tableComer = true
									this.polizaEmitComer = [];
									if (res.length > 0 && res !== null) {
										res.forEach(com => {
											if (com.PRINCIPAL == 1) {
												this.polizaEmitComerDTOPrincipal = com;
											} else {
												this.polizaEmitComer.push(com);
											}
										});
										this.flagBusqueda = true;
									} else {
										this.polizaEmitComerDTOPrincipal = {};
										this.polizaEmitComer = [];
									}
								})

							this.policyemit.getPolicyEmitDet(this.nrocotizacion)
								.subscribe((res: any) => {
									console.log(res)
									if (res.length > 0) {
										this.primatotalSCTR = 0;
										this.primatotalSalud = 0;
										this.igvPension = 0;
										this.igvSalud = 0;
										this.totalSTRC = 0;
										this.totalSalud = 0;
										res.forEach(item => {
											if (item.ID_PRODUCTO == this.pensionID) {
												item.PRIMA = self.formateaValor(item.PRIMA)
												this.pensionList.push(item);
												this.primatotalSCTR = self.formateaValor(item.NSUM_PREMIUMN);
												this.igvPension = self.formateaValor(item.NSUM_IGV);
												this.totalSTRC = self.formateaValor(item.NSUM_PREMIUM);
											}
											if (item.ID_PRODUCTO == this.saludID) {
												item.PRIMA = self.formateaValor(item.PRIMA)
												this.saludList.push(item);
												this.primatotalSalud = self.formateaValor(item.NSUM_PREMIUMN);
												this.igvSalud = self.formateaValor(item.NSUM_IGV);
												this.totalSalud = self.formateaValor(item.NSUM_PREMIUM);
											}
										});

										if (this.pensionList.length > 0) {
											this.tasasList = this.pensionList;
										} else if (this.saludList.length > 0) {
											this.tasasList = this.saludList;
										} else {
											this.tasasList = [];
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
						} else {
							Swal.fire("Información", res.GenericResponse.MENSAJE, "error");
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
		console.log(this.polizaEmitCab);
		if (client != null && this.nrocotizacion != undefined && this.nrocotizacion != 0) {
			this.loading = true;
			this.policyemit.downloadExcel(client, this.nrocotizacion).subscribe((res: any) => {
				if (res.GenericResponse != null) {
					this.loading = false;
					let Url: string = this.policyemit.getUrl();
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
			Swal.fire("Información", "Debes buscar una cotizacion", "error");
		}

	}

	cambioFecha() {
		this.errorFrecPago = false;
	}


	GenerarPoliza(forma: NgForm) {
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

		if (mensaje == "") {
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

			// console.log(this.savedPolicyList);
			myFormData.append("objeto", JSON.stringify(this.savedPolicyList));
			Swal.fire({
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
						// self.isLoading = true;
						this.policyemit.savePolicyEmit(myFormData)
							.subscribe((res: any) => {
								console.log(res);
								if (res.P_COD_ERR == 0) {
									let policyPension = 0;
									let policySalud = 0;
									let constancia = 0

									policyPension = res.P_POL_PENSION;
									policySalud = res.P_POL_SALUD;
									constancia = res.P_NCONSTANCIA;

									this.NroPension = policyPension;
									this.NroSalud = policySalud;

									if (policyPension > 0 && policySalud > 0) {

										Swal.fire({
											title: "Información",
											text: "Se ha generado correctamente la póliza de Pensión N° " + policyPension + " y la póliza de Salud N° " + policySalud + " con Constancia N° " + constancia,
											type: "success",
											confirmButtonText: 'OK',
											allowOutsideClick: false,
										})
									}
									else {
										if (policyPension > 0) {
											Swal.fire({
												title: "Información",
												text: "Se ha generado correctamente la póliza de Pensión N° " + policyPension + " con Constancia N° " + constancia,
												type: "success",
												confirmButtonText: 'OK',
												allowOutsideClick: false,
											})
										}
										if (policySalud > 0) {
											Swal.fire({
												title: "Información",
												text: "Se ha generado correctamente la póliza de Salud N° " + policySalud + " con Constancia N° " + constancia,
												type: "success",
												confirmButtonText: 'OK',
												allowOutsideClick: false,
											})
										}
									}
								} else {
									Swal.fire({
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


		} else {
			Swal.fire("Información", mensaje, "error");
		}

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
		if (this.polizaEmitCab.tipoRenovacion === "5") {
			fechad.setMonth(fechad.getMonth() + 1);
			fechad.setDate(fechad.getDate() - 1);
			this.polizaEmitCab.bsValueFin = new Date(fechad);
			this.flagFechaMenorMayorFin = true;
		}
		if (this.polizaEmitCab.tipoRenovacion === "4") {

			fechad.setMonth(fechad.getMonth() + 2);
			fechad.setDate(fechad.getDate() - 1);
			this.polizaEmitCab.bsValueFin = new Date(fechad);
			this.flagFechaMenorMayorFin = true;
		}
		if (this.polizaEmitCab.tipoRenovacion === "3") {

			fechad.setMonth(fechad.getMonth() + 2);
			fechad.setDate(fechad.getDate() - 1);
			this.polizaEmitCab.bsValueFin = new Date(fechad);
			this.flagFechaMenorMayorFin = true;
		}
		if (this.polizaEmitCab.tipoRenovacion === "2") {
			fechad.setMonth(fechad.getMonth() + 6);
			fechad.setDate(fechad.getDate() - 1);
			this.polizaEmitCab.bsValueFin = new Date(fechad);
			this.flagFechaMenorMayorFin = true;
		}

		if (this.polizaEmitCab.tipoRenovacion === "1") {
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
		this.policyemit.getFrecuenciaPago(this.polizaEmitCab.tipoRenovacion)
			.subscribe((res: any) => {
				this.polizaEmitCab.frecuenciaPago = "";
				this.frecuenciaPago = res;
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
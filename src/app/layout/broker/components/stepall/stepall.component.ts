// import { Component, OnInit, Pipe, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
// import { EmisionService } from '../../../client/shared/services/emision.service';
// import { VehiculoService } from '../../services/vehiculo/vehiculo.service';
// import { Marca } from '../../../client/shared/models/marca.model';
// import { Clase } from '../../../client/shared/models/clase.model';
// import { Auto } from '../../models/auto/auto.model';
// import { UsoService } from '../../../../shared/services/uso/uso.service';
// import { Uso } from '../../../../shared/models/use/use';
// import { Routes, RouterModule, Router } from '@angular/router';
// import { Modelo } from '../../../client/shared/models/modelo.model';
// import { ZonaCirculacion } from '../../../client/shared/models/zona-circulacion.model';
// import { ReactiveFormsModule, FormsModule, FormControl, NgForm, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
// import { Cliente } from '../../models/cliente/cliente';
// import { ListaTipoCliente } from '../../models/cliente/listatipocliente';
// import { Step03Service } from '../../services/step03/step03.service';
// import { ListaTipoDocumento } from '../../models/Documento/listatipodocumento';
// import { isNullOrUndefined } from 'util';
// import { Province } from '../../../../shared/models/province/province';
// import { District } from '../../../../shared/models/district/district';
// import { Municipality } from '../../../../shared/models/municipality/municipality';
// import { UbigeoService } from '../../../../shared/services/ubigeo/ubigeo.service';
// import { HttpClient } from '@angular/common/http';
// import { Certificado } from '../../models/certificado/certificado';
// import { Poliza } from '../../models/poliza/poliza';
// import { Step04Service } from '../../services/step04/step04.service';
// import { UtilityService } from '../../../../shared/services/general/utility.service';
// import { Prima, PrimaFilter } from '../../../client/shared/models/prima.model';
// import { Plan } from '../../models/plan/plan';
// import { PlanFilter } from '../../models/plan/planfilter';
// import { isDate, isUndefined } from 'util';
// import { Observable } from 'rxjs/Observable';
// import { DatePipe } from '@angular/common';
// import 'rxjs/add/observable/of';
// import 'rxjs/add/operator/map';
// import { Campaign } from '../../../../shared/models/campaign/campaign';

// // Validacion de Fecha Minima
// function ValidateMinDate(control: AbstractControl) {
//   if (control.value !== undefined && control.value !== '' && control.value !== null) {
//     const Modalidad = JSON.parse(sessionStorage.getItem('Modalidad'));
//     const tCertificado = Modalidad && Modalidad['tipoCertificado'];
//     if (tCertificado === 1) {
//       return true;
//     }
//     const arrFecha = control.value.toString().split('-');
//     const inputDay = +arrFecha[2];
//     const inputMonth = +arrFecha[1];
//     const inputYear = +arrFecha[0];
//     const currDate = new Date();
//     const currDay = currDate.getDate();
//     const currMonth = currDate.getMonth() + 1;
//     const currYear = currDate.getFullYear();

//     if (inputYear < currYear) {
//       // Si el año ingresado es menor
//       return { minDate: true };
//     } else if (inputMonth < currMonth && inputYear === currYear) {
//       // Si el mes ingresado es menor al mes actual
//       return { minDate: true };
//     } else if (
//       inputDay < currDay &&
//       (inputMonth === currMonth && inputYear >= currYear)
//     ) {
//       return { minDate: true };
//     }
//     return null;
//   }
//   return { minDate: true };
// }

// @Component({
//   selector: 'app-stepall',
//   templateUrl: './stepall.component.html',
//   styleUrls: ['./stepall.component.css']
// })

// export class StepAllComponent implements OnInit {

//   bLock01 = false;
//   bLock02 = true;
//   bLock03 = true;
//   bLock04 = true;
//   fecha_actual = new Date;

//   //PASO 1
//   bBoton01 = false;
//   bTipoVehiculo = true;
//   sTipoVehiculo = '1';
//   bValido = false;
//   bValidado = false;
//   codigo = '';
//   mensaje = '';
//   placa = '';
//   bValidar = false;
//   bLoading = false;
//   Modalidad: any;
//   tCertificado: number;
//   NroCertificado: number;
//   mainTitle = '';
//   titulos: string[];
//   longitudPlaca = 6;
//   ultimaPaginaNavegada = 0;
//   paginaActual = 4;

//   //PASO 2
//   auto: Auto = new Auto();
//   autoSession = new Auto();
//   usos: Uso[];
//   clasesFull: Clase[] = [];
//   clases: Clase[] = [];
//   marcasFull: Marca[] = [];
//   marcas: Marca[] = [];
//   zonas: ZonaCirculacion[] = [];
//   modelos: Modelo[] = [];
//   claseDescripcion = '';
//   marcaDescripcion = '';
//   modeloDescripcion = '';
//   usoDescripcion = '';
//   zonaDescripcion = '';
//   fechaInicioVigencia = '';
//   mensajeError = '';
//   byear = false;
//   bserie = false;
//   claseSeleccionada = false;
//   marcaSeleccionada = false;
//   marcaDescrp: Marca[];
//   vehiculoForm: FormGroup;

//   //PASO 3
//   ListaTipoCliente: ListaTipoCliente[] = [];
//   ListaTipoDocumento: ListaTipoDocumento[] = [];
//   Cliente = new Cliente();
//   ClienteSession = new Cliente();
//   resultDepReport = 0;
//   resultProReport = 0;
//   resultDisReport = 0;
//   tipoPersona: string;
//   tipoDocumento = 0;
//   codigoFlujo: any;
//   imagePaths: string[];
//   imagePath = '';
//   departamentos: Province[] = [];
//   provincias: District[] = [];
//   distritos: Municipality[] = [];
//   besEmpresa = false;
//   tamanoTipoDocumento: number;
//   public TIPO_DOCUMENTO_IDENTIDAD = {
//     DNI: '2',
//     RUC: '1',
//     CE: '4'
//   };
//   contratanteForm: FormGroup;

//   //PASO 4
//   certificadoSession = new Certificado();
//   Certificado = new Certificado();
//   lstPolizasFull: Poliza[] = [];
//   lstPolizasFilter: Poliza[] = [];
//   filter: any = {};
//   planes: Plan[] = [];
//   tarifa = new Prima();
//   opcionModalidad: number;
//   totalSoats = 0;
//   mensajeVigencia = '';
//   truefalsePlan = true;
//   LockPlan = true;
//   vfr = true;
//   codigoVigencia = '';
//   certificadoForm: FormGroup;
//   bMostrar = false;
//   canal = '';
//   puntoVenta = '';
//   bEditPrecio = true;
//   bFechaMinima = true;

//   bSpinner = false;
//   bSpinner2 = false;
//   fecha_vigencia: Date;

//   @ViewChild("fv") fv;

//   //Campaign
//   validaCampaign = new Campaign();

//   constructor(private vehiculoService: VehiculoService,
//     private emisionService: EmisionService,
//     private router: Router,

//     private usoService: UsoService,
//     private formBuilder: FormBuilder,

//     private step03service: Step03Service,
//     private ubigeoService: UbigeoService,

//     private step04service: Step04Service,
//     public utilityService: UtilityService,

//     private datePipe: DatePipe) { }

//   ngOnInit() {
//     this.initComponent();
//   }

//   initComponent() {
//     const currentUser = JSON.parse(localStorage.getItem('currentUser'));
//     this.canal = currentUser && currentUser['canal'];
//     this.puntoVenta = currentUser && currentUser['puntoVenta'];
//     this.getDataUserSession();
//     this.Modalidad = JSON.parse(sessionStorage.getItem('Modalidad'));
//     this.tCertificado = this.Modalidad && this.Modalidad['tipoCertificado'];
//     this.NroCertificado = Number(this.tCertificado) - 1;
//     this.setTitle(this.NroCertificado);
//     //PASO 1
//     this.autoSession = <Auto>JSON.parse(sessionStorage.getItem('auto'));
//     if (!isNullOrUndefined(this.autoSession)) {
//       this.auto = this.autoSession;
//       this.getZonaCirculacion(this.auto.p_NYEAR);
//     }
//     if (this.auto.p_SREGIST !== undefined) {
//       this.placa = this.auto.p_SREGIST;
//       this.bBoton01 = true;
//       this.bLock01 = true;
//       this.bLock02 = false;
//       this.bLock03 = false;
//       this.bLock04 = false;
//     }
//     this.onSetTipoVehiculo(true);
//     //PASO 2
//     this.crearFormularioPaso02();
//     this.getClases();
//     this.getTiposUso();
//     this.getMarcas();

//     //PASO 3
//     this.crearFormularioPaso03();
//     this.getListTipoPersona();
//     this.listarDepartamentos();
//     this.ClienteSession = <Cliente>JSON.parse(sessionStorage.getItem('contratante'));
//     if (!isNullOrUndefined(this.ClienteSession)) {
//       this.Cliente = this.ClienteSession;
//       this.getListTipoDocumento(this.Cliente.p_NPERSON_TYP);
//       if (this.Cliente.p_NPERSON_TYP !== undefined && this.Cliente.p_NDOCUMENT_TYP !== undefined) {
//         if (this.Cliente.p_NDOCUMENT_TYP.toString() === this.TIPO_DOCUMENTO_IDENTIDAD.RUC) { this.besEmpresa = true; }
//       }
//       this.subscribeRazonSocialChanges();
//     }
//     //PASO 4
//     this.crearFormularioPaso04();
//     this.bMostrar = this.tCertificado !== 3;
//     this.bEditPrecio = this.tCertificado !== 1;
//     if (this.tCertificado === 1) {
//       this.bFechaMinima = false;
//     }
//     this.getPolizas(this.puntoVenta, this.canal, this.tCertificado.toString());
//     this.certificadoSession = JSON.parse(sessionStorage.getItem('certificado'));
//     if (!isNullOrUndefined(this.certificadoSession)) {
//       this.Certificado = this.certificadoSession;
//       this.initFormularioPaso04();
//     }
//     if (this.Certificado.P_DSTARTDATE !== undefined) {
//       this.ValidaFecha(this.Certificado.P_DSTARTDATE);
//       this.fecha_vigencia = this.Certificado.P_DSTARTDATE;
//     } else {
//       this.fecha_vigencia = undefined;
//     }
//     const validacampaignSession = <Campaign>JSON.parse(sessionStorage.getItem('validaCampaign'));
//     if (validacampaignSession !== null) {
//       this.validaCampaign = validacampaignSession;
//     }
//     this.setPlanes();
//     this.truefalsePlan = true;
//     this.LockPlan = true;
//   }

//   setTitle(id: number) {
//     this.titulos = ['Crea un SOAT Manual para un tercero', 'Crea un SOAT Láser para un tercero', 'Crea un SOAT electrónico para un tercero'];
//     this.mainTitle = this.titulos[id];
//   }

//   onSetTipoVehiculo(tipo) {
//     if (!this.bLock01) {
//       this.bTipoVehiculo = tipo;
//       if (this.bTipoVehiculo) {
//         this.sTipoVehiculo = '1';
//         this.longitudPlaca = 6;
//       } else {
//         this.sTipoVehiculo = '2';
//         this.longitudPlaca = 8;
//       }
//       this.placa = '';
//     }
//   }

//   //PASO 1
//   validarPlaca() {
//     this.bValidar = true;
//     this.bLoading = true;
//     this.bValido = false;
//     this.bValidado = false;
//     this.vehiculoService.validarPlaca(this.sTipoVehiculo, this.placa)
//       .subscribe(
//         data => {
//           this.codigo = data['codigo'];
//           this.mensaje = data['mensaje'];
//           this.bLoading = false;
//           this.bValidado = true;
//           this.auto.p_SREGIST = this.placa;
//           if (this.codigo === '1') {
//             this.bValido = true;
//             //ValidaCampaign
//             this.validaCampaignPlaca();
//             // Invocar al servicio de auto por placa
//             this.obtenerDatosAutoPorPlaca(this.placa);
//           } else {
//             this.bValidar = false;
//           }
//         },
//         error => {
//           console.log(error);
//           this.bValidado = true;
//           this.bValidar = false;
//           this.bLoading = false;
//           this.mensaje = 'No se pudo realizar la validación de la placa. Por favor vuelva a intentarlo.';
//         }
//       );
//   }

//   validaCampaignPlaca() {
//     this.vehiculoService.validarPlacaCampaign(this.canal, this.placa)
//       .subscribe(
//         data => {
//           if (data != null) {
//             this.validaCampaign.fechaCampaign = data['dexpirdat'];
//             this.validaCampaign.validaPlacaCampaign = data['nvalida'];
//             if (this.validaCampaign.validaPlacaCampaign != '0') {
//               this.validaCampaign.nidcampaign = data['nidcampaign'];
//               this.Certificado.P_DSTARTDATE = data['dexpirdat'];
//               this.fecha_vigencia = data['dexpirdat'];
//               this.certificadoForm.controls.fechavigencia.setValue(this.Certificado.P_DSTARTDATE);
//             }
//           } else {
//             this.validaCampaign.nidcampaign = 0;
//             this.validaCampaign.validaPlacaCampaign = '0';
//           }
//           sessionStorage.setItem('validaCampaign', JSON.stringify(this.validaCampaign));
//         },
//         error => {
//           console.log(error);
//           this.bValidado = true;
//           this.bValidar = false;
//           this.bLoading = false;
//           this.mensaje = 'No se pudo realizar la validación de la placa. Por favor vuelva a intentarlo.';
//         }
//       );
//   }

//   obtenerDatosAutoPorPlaca(placa) {
//     this.emisionService.autoPorPlaca(placa)
//       .subscribe(
//         res => {
//           const arrAuto = res;
//           if (arrAuto.length > 0) {
//             this.auto = arrAuto[0];
//             this.auto.p_STYPE_REGIST = this.sTipoVehiculo;
//             this.auto.p_SREGIST = this.placa.toString().toUpperCase();
//             sessionStorage.setItem('auto', JSON.stringify(this.auto));
//           } else {
//             this.auto.p_STYPE_REGIST = this.sTipoVehiculo;
//             this.auto.p_SREGIST = this.placa.toString().toUpperCase();
//             sessionStorage.setItem('auto', JSON.stringify(this.auto));
//           }

//           this.bBoton01 = true;
//           this.bLock01 = true;
//           this.bLock02 = false;
//           this.bLock03 = false;
//           this.bLock04 = false;
//           this.initFormularioPaso02();
//         },
//         err => {
//           console.log(err);
//           this.bLoading = false;
//           this.bValidar = false;
//           this.bLoading = false;
//         }
//       );
//   }

//   //PASO 2
//   crearFormularioPaso02() {
//     this.vehiculoForm = this.formBuilder.group({
//       clasecodigo: ['', Validators.required],
//       // clasedescripcion: ['', Validators.required],
//       uso: ['', Validators.required],
//       marcacodigo: ['', Validators.required],
//       // marcadescripcion: ['', Validators.required],
//       modelo: ['', Validators.required],
//       serie: ['', [Validators.required, Validators.maxLength(17)]],
//       asientos: ['', [Validators.required, Validators.maxLength(2)]],
//       anho: ['', [Validators.required, Validators.maxLength(4)]],
//       zona: ['', Validators.required]

//     });
//   }

//   initFormularioPaso02() {
//     if (this.auto.p_NIDCLASE !== undefined) {
//       this.vehiculoForm.controls.clasecodigo.setValue(this.auto.p_NIDCLASE.toString());
//     }
//     if (this.auto.p_NIDUSO !== undefined) {
//       this.vehiculoForm.controls.uso.setValue(this.auto.p_NIDUSO.toString());
//     }
//     if (this.auto.p_NVEHBRAND !== undefined) {
//       this.vehiculoForm.controls.marcacodigo.setValue(this.auto.p_NVEHBRAND.toString());
//       this.getModelosPorMarca(this.auto.p_NVEHBRAND);
//     }
//     if (this.auto.p_NVEHMODEL !== undefined) {
//       this.vehiculoForm.controls.modelo.setValue(this.auto.p_NVEHMODEL.toString());
//     }
//     if (this.auto.p_SNUMSERIE !== undefined) {
//       this.vehiculoForm.controls.serie.setValue(this.auto.p_SNUMSERIE.trim());
//     }
//     if (this.auto.p_SEATNUMBER !== undefined) {
//       this.vehiculoForm.controls.asientos.setValue(this.auto.p_SEATNUMBER.toString());
//     }
//     if (this.auto.p_NYEAR !== undefined) {
//       this.vehiculoForm.controls.anho.setValue(this.auto.p_NYEAR.toString());
//       this.getZonaCirculacion(this.auto.p_NYEAR);
//     }
//     if (this.auto.p_NAUTOZONE !== undefined) {
//       this.vehiculoForm.controls.zona.setValue(this.auto.p_NAUTOZONE.toString());
//     }
//   }

//   getClases() {
//     const filter = new Clase();
//     this.vehiculoService.getClases(filter)
//       .subscribe(
//         res => {
//           this.clasesFull = this.clases = <Clase[]>res;
//           if (this.auto.p_NIDCLASE !== undefined) {
//             const claseDescrp = this.clases.filter(c => c.nidclase.toString() === this.auto.p_NIDCLASE.toString());
//             this.auto.p_SNAMECLASE = claseDescrp.length == 0 ? '' : claseDescrp[0].sdescript;
//           }
//         },
//         err => {
//           console.log(err);
//         }
//       );
//   }

//   getTiposUso() {
//     const filter = new Uso('0', '');
//     this.usoService.getPostUsos(filter)
//       .subscribe(
//         res => {
//           this.usos = <Uso[]>res;
//         },
//         err => {
//           console.log(err);
//         }
//       );
//   }

//   getMarcas() {
//     const filter = new Marca();
//     this.vehiculoService.getMarcas(filter)
//       .subscribe(
//         res => {
//           this.marcasFull = this.marcas = <Marca[]>res;
//           if (this.auto.p_NVEHBRAND !== undefined) {
//             this.marcaDescrp = this.marcas.filter(c => c.nvehbrand.toString() === this.auto.p_NVEHBRAND.toString());
//             this.getModelosPorMarca(this.auto.p_NVEHBRAND);
//           }
//         },
//         err => {
//           console.log(err);
//         }
//       );
//   }

//   getModelosPorMarca(id) {
//     const filter = new Modelo();
//     filter.nvehbrand = id;
//     this.vehiculoService.getModelos(filter)
//       .subscribe(
//         res => {
//           this.modelos = res;
//           if (this.auto.p_NVEHMODEL !== undefined) {
//             if (this.auto.p_NVEHBRAND !== id) {
//               this.vehiculoForm.controls.modelo.setValue(undefined);
//             }
//           } else {
//             this.vehiculoForm.controls.modelo.setValue(undefined);
//           }
//         },
//         err => {
//           console.log(err);
//         }
//       );
//   }

//   getZonaCirculacion(id: string) {
//     const filter = new ZonaCirculacion();
//     filter.sregist = this.auto.p_SREGIST;
//     filter.stype_vehicle = this.auto.p_STYPE_REGIST; /*true: automotor | false: liviano */
//     filter.nyear = id;

//     this.vehiculoService.getZonasCirculacion(filter)
//       .subscribe(
//         res => {
//           this.zonas = <ZonaCirculacion[]>res;
//           if (this.auto.p_NAUTOZONE !== undefined) {
//             this.vehiculoForm.controls.zona.setValue(this.auto.p_NAUTOZONE.toString());
//           }
//         },
//         err => {
//           console.log(err);
//         }
//       );
//   }

//   onBlurAnho() {
//     const d = new Date();
//     if (this.vehiculoForm.get('anho').value !== undefined) {
//       this.getZonaCirculacion(this.vehiculoForm.get('anho').value);
//       if (this.vehiculoForm.get('anho').value > d.getFullYear()) {
//         this.byear = true;
//       } else {
//         this.byear = false;
//       }
//       this.auto.p_NYEAR = this.vehiculoForm.get('anho').value;
//     }
//   }

//   onBlurSerie() {
//     if (this.vehiculoForm.get('serie').value !== undefined) {
//       if (this.vehiculoForm.get('serie').value.toString().length !== 17) {
//         this.bserie = true;
//       } else {
//         this.bserie = false;
//       }
//       this.auto.p_SNUMSERIE = this.vehiculoForm.get('serie').value;
//     }
//   }

//   onBlurAsiento() {
//     this.auto.p_SEATNUMBER = this.vehiculoForm.get('asientos').value;
//   }

//   setClase(id) {
//     if (id !== '') {
//       this.auto.p_NIDCLASE = id;
//       this.vehiculoForm.controls.clasecodigo.setValue(id);
//       const claseDescrp = this.clases.filter(c => c.nidclase.toString() === id.toString());
//       this.auto.p_SNAMECLASE = claseDescrp[0].sdescript;
//       this.claseSeleccionada = true;
//     }
//   }

//   setMarca(id) {
//     if (id !== '') {
//       this.auto.p_NVEHBRAND = id;
//       this.auto.p_NVEHMODEL = undefined;
//       this.vehiculoForm.controls.marcacodigo.setValue(id);
//       this.marcaDescrp = this.marcas.filter(c => c.nvehbrand.toString() === id.toString());
//       this.auto.p_SNAME_VEHBRAND = this.marcaDescrp[0].sdescript;
//       this.marcaSeleccionada = true;
//       this.getModelosPorMarca(id);
//     }
//   }

//   setZona(idZona) {
//     this.auto.p_NAUTOZONE = idZona;
//     this.vehiculoForm.controls.zona.setValue(idZona);
//   }

//   setModelo(id) {
//     if (id !== '') {
//       this.auto.p_NVEHMODEL = id;
//       this.vehiculoForm.controls.modelo.setValue(id);
//       const modeloDescrp = this.modelos.filter(c => c.nvehmodel.toString() === id.toString());
//       this.auto.p_SNAME_VEHMODEL = modeloDescrp[0].sdescript;
//     }
//   }

//   setUso(id) {
//     if (id !== '') {
//       this.auto.p_NIDUSO = id;
//       this.vehiculoForm.controls.uso.setValue(id);
//       if (this.auto.p_NIDUSO !== undefined) {
//         const usoDescrp = this.usos.filter(c => c.niduso.toString() === id.toString());
//         this.auto.p_SNAME_USO = usoDescrp[0].sdescript;
//       }
//     }
//   }

//   soloNumeros(event: any) {
//     const pattern = /[0-9\+\-\ ]/;
//     const inputChar = String.fromCharCode(event.charCode);

//     if (!pattern.test(inputChar)) { // invalid character, prevent input
//       event.preventDefault();
//     }
//   }

//   searchMarcas(search: string) {
//     if (search) {
//       this.marcas = this.marcasFull.filter(s => s.sdescript.toLowerCase().indexOf(search.toLowerCase()) >= 0);
//     } else {
//       this.marcas = this.marcasFull;
//     }
//   }

//   searchClases(search: string) {
//     if (search) {
//       this.clases = this.clasesFull.filter(s => s.sdescript.toLowerCase().indexOf(search.toLowerCase()) >= 0);
//     } else {
//       this.clases = this.clasesFull;
//     }
//   }

//   ValidateFormPaso02() {
//     this.vehiculoForm.get('clasecodigo').markAsTouched();
//     this.vehiculoForm.get('uso').markAsTouched();
//     this.vehiculoForm.get('marcacodigo').markAsTouched();
//     this.vehiculoForm.get('modelo').markAsTouched();
//     this.vehiculoForm.get('serie').markAsTouched();
//     this.vehiculoForm.get('asientos').markAsTouched();
//     this.vehiculoForm.get('anho').markAsTouched();
//     this.vehiculoForm.get('zona').markAsTouched();
//     this.vehiculoForm.updateValueAndValidity();
//   }

//   SaveFormPaso02() {
//     this.auto.p_NIDFLOW = '2'; // Para clientes siempre enviar '1' PARA CANAL DE VENTAS '2'
//     this.auto.p_NREMINDER = '0'; // 1: ACTIVADO (Para Cliente siempre es 1) | 0 : DESACTIVADO (Para canal de Venta 0)

//     for (var i = 0; i < this.zonas.length; i++) {
//       const z = this.zonas[i] as ZonaCirculacion;
//       if (z.nprovince === this.auto.p_NAUTOZONE) {
//         this.auto.p_SNAME_AUTOZONE = z.sdescript;
//         break;
//       }
//     }

//     const currentUser = JSON.parse(localStorage.getItem('currentUser'));
//     this.auto.p_NUSERCODE = currentUser["id"];
//     this.vehiculoService.registrar(this.auto)
//       .subscribe(
//         res => {
//           this.auto.V_NIDPROCESS = this.auto.p_NIDPROCESS = res.toString();
//           if (this.auto.V_NIDPROCESS !== '0') {
//             sessionStorage.setItem('auto', JSON.stringify(this.auto));
//             if (!this.contratanteForm.valid) {
//               return;
//             } else {
//               this.SaveFormPaso03();
//             }
//           } else {
//             this.mensajeError =
//               'Ocurrio un error al intentar registrar los datos del vehiculo. Por favor, vuelva a intentarlo.';
//           }
//         },
//         err => {
//           console.log(err);
//           this.mensajeError =
//             'Ocurrio un error al intentar registrar los datos del vehiculo. Por favor, vuelva a intentarlo.';
//         }
//       );
//   }

//   asignarDatosVehiculo() {
//     this.auto.p_NIDFLOW = '1'; // Para clientes siempre enviar '1'
//     this.auto.p_NREMINDER = '1'; // Para clientes siempre enviar '1'
//     this.auto.p_NIDCLASE = this.vehiculoForm.get('clasecodigo').value;
//     this.auto.p_NIDUSO = this.vehiculoForm.get('uso').value;
//     this.auto.p_NVEHBRAND = this.vehiculoForm.get('marcacodigo').value;
//     this.auto.p_NVEHMODEL = this.vehiculoForm.get('modelo').value;
//     this.auto.p_SNUMSERIE = this.vehiculoForm.get('serie').value;
//     this.auto.p_SEATNUMBER = this.vehiculoForm.get('asientos').value;
//     this.auto.p_NYEAR = this.vehiculoForm.get('anho').value;
//     this.auto.p_NAUTOZONE = this.vehiculoForm.get('zona').value;
//     this.fechaInicioVigencia = this.vehiculoForm.get('vigencia').value;
//   }

//   //PASO 3
//   private crearFormularioPaso03() {
//     this.contratanteForm = this.formBuilder.group({
//       tipopersona: ['', Validators.required],
//       tipodocumento: ['', Validators.required],
//       numdocumento: ['', [Validators.required, Validators.maxLength(12)]],
//       apepaterno: ['', [Validators.required, Validators.maxLength(50)]],
//       apematerno: ['', [Validators.required, Validators.maxLength(50)]],
//       nombres: ['', [Validators.required, Validators.maxLength(50)]],
//       razonsocial: ['', [Validators.required, Validators.maxLength(50)]],
//       departamento: ['', Validators.required],
//       provincia: ['', Validators.required],
//       distrito: ['', Validators.required],
//       direccion: ['', [Validators.required, Validators.maxLength(100)]],
//       correo: ['', [Validators.required, Validators.maxLength(100), Validators.email]],
//       celular: ['', [Validators.required, Validators.maxLength(9)]],
//     });
//   }

//   private initFormularioPaso03() {
//     if (this.Cliente.p_NPERSON_TYP !== undefined) {
//       this.contratanteForm.controls.tipopersona.setValue(this.Cliente.p_NPERSON_TYP);
//     }
//     if (this.Cliente.p_NDOCUMENT_TYP !== undefined) {
//       this.contratanteForm.controls.tipodocumento.setValue(this.Cliente.p_NDOCUMENT_TYP);
//       this.callTypeDocument(this.Cliente.p_NDOCUMENT_TYP);
//     }
//     if (this.Cliente.p_SDOCUMENT !== undefined) {
//       this.contratanteForm.controls.numdocumento.setValue(this.Cliente.p_SDOCUMENT.trim());
//     }
//     if (this.Cliente.p_SCLIENT_APPPAT !== undefined) { this.contratanteForm.controls.apepaterno.setValue(this.Cliente.p_SCLIENT_APPPAT); }
//     if (this.Cliente.p_SCLIENT_APPMAT !== undefined) { this.contratanteForm.controls.apematerno.setValue(this.Cliente.p_SCLIENT_APPMAT); }
//     if (this.Cliente.p_SCLIENT_NAME !== undefined) { this.contratanteForm.controls.nombres.setValue(this.Cliente.p_SCLIENT_NAME); }
//     if (this.Cliente.p_NPROVINCE !== undefined) {
//       this.contratanteForm.controls.departamento.setValue(this.Cliente.p_NPROVINCE);
//       this.listarProvinciasPorDepartamento(this.Cliente.p_NPROVINCE);
//     }

//     if (this.Cliente.p_SLEGALNAME !== undefined) { this.contratanteForm.controls.razonsocial.setValue(this.Cliente.p_SLEGALNAME); }
//     if (this.Cliente.p_NLOCAT !== undefined) { this.contratanteForm.controls.provincia.setValue(this.Cliente.p_NLOCAT); }
//     if (this.Cliente.p_NMUNICIPALITY !== undefined) { this.contratanteForm.controls.distrito.setValue(this.Cliente.p_NMUNICIPALITY); }
//     if (this.Cliente.p_SADDRESS !== undefined) { this.contratanteForm.controls.direccion.setValue(this.Cliente.p_SADDRESS); }
//     if (this.Cliente.p_SMAIL !== undefined) { this.contratanteForm.controls.correo.setValue(this.Cliente.p_SMAIL); }
//     if (this.Cliente.p_SPHONE !== undefined) { this.contratanteForm.controls.celular.setValue(this.Cliente.p_SPHONE); }
//   }

//   private cleanFormulario() {
//     this.contratanteForm.controls.apepaterno.setValue(undefined);
//     this.contratanteForm.controls.apematerno.setValue(undefined);
//     this.contratanteForm.controls.nombres.setValue(undefined);
//     this.contratanteForm.controls.departamento.setValue(undefined);
//     this.contratanteForm.controls.razonsocial.setValue(undefined);
//     this.contratanteForm.controls.provincia.setValue(undefined);
//     this.contratanteForm.controls.distrito.setValue(undefined);
//     this.contratanteForm.controls.direccion.setValue(undefined);
//     this.contratanteForm.controls.correo.setValue(undefined);
//     this.contratanteForm.controls.celular.setValue(undefined);
//   }

//   listarDepartamentos() {
//     const filter = new Province('0', '');
//     this.ubigeoService.getPostProvince(filter)
//       .subscribe(
//         res => {
//           this.departamentos = <Province[]>res;
//           if (this.Cliente.p_NPROVINCE !== undefined) {
//             this.listarProvinciasPorDepartamento(this.Cliente.p_NPROVINCE);
//           }
//         },
//         err => {
//           console.log(err);
//         }
//       );
//   }

//   listarProvinciasPorDepartamento(idDepartamento) {
//     const filter = new District('0', idDepartamento, '');

//     this.ubigeoService.getPostDistrict(filter)
//       .subscribe(
//         res => {
//           this.provincias = <District[]>res;

//           if (this.Cliente.p_NLOCAT !== undefined) {
//             this.listarDistritosPorProvincia(this.Cliente.p_NLOCAT);
//             if (this.Cliente.p_NPROVINCE !== idDepartamento) {
//               this.contratanteForm.controls.provincia.setValue(undefined);
//               this.contratanteForm.controls.distrito.setValue(undefined);
//             }
//           } else {
//             this.contratanteForm.controls.provincia.setValue(undefined);
//             this.contratanteForm.controls.distrito.setValue(undefined);
//           }
//         },
//         err => {
//           console.log(err);
//         }
//       );
//   }

//   listarDistritosPorProvincia(idProvincia) {
//     const filter = new Municipality('0', idProvincia, '');
//     this.ubigeoService.getPostMunicipality(filter)
//       .subscribe(
//         res => {
//           this.distritos = <Municipality[]>res;
//           if (this.Cliente.p_NMUNICIPALITY !== undefined) {
//             if (this.Cliente.p_NLOCAT !== idProvincia) {
//               this.contratanteForm.controls.distrito.setValue(undefined);
//             }
//           } else {
//             this.contratanteForm.controls.distrito.setValue(undefined);
//           }
//         },
//         err => {
//           console.log(err);
//         }
//       );
//   }

//   getListTipoPersona() {
//     return this.step03service.getListTipoPersona()
//       .subscribe(
//         result => {
//           this.ListaTipoCliente = result;
//         },
//         error => {
//           console.log(<any>error);
//         }
//       );
//   }

//   getListTipoDocumento(id: string) {
//     return this.step03service.getListTipoDocumento(id, '0').subscribe(result => { this.ListaTipoDocumento = result; },
//       error => {
//         console.log(<any>error);
//       });
//   }

//   getCliente(id: string) {
//     return this.step03service.getCliente(id).subscribe(cli => { this.Cliente = cli; /*console.log(cli);*/ },
//       error => {
//         console.log(<any>error);
//       });
//   }

//   callTypePerson(value) {
//     if (value !== '') {
//       this.tipoPersona = value;
//       this.Cliente.p_NPERSON_TYP = value;
//       this.getListTipoDocumento(this.tipoPersona);
//       this.contratanteForm.controls.tipodocumento.setValue(undefined);
//     }
//   }

//   callTypeDocument(value) {
//     if (value !== '') {
//       this.tipoDocumento = this.Cliente.p_NDOCUMENT_TYP = value;
//       this.besEmpresa = this.tipoDocumento.toString() === this.TIPO_DOCUMENTO_IDENTIDAD.RUC;
//       if (value == this.TIPO_DOCUMENTO_IDENTIDAD.RUC) { this.tamanoTipoDocumento = 11 }
//       if (value == this.TIPO_DOCUMENTO_IDENTIDAD.DNI) { this.tamanoTipoDocumento = 8 }
//       if (value == this.TIPO_DOCUMENTO_IDENTIDAD.CE) { this.tamanoTipoDocumento = 12 }
//       this.subscribeRazonSocialChanges();
//     }
//   }

//   subscribeRazonSocialChanges() {
//     const pmCtrl = (<any>this.contratanteForm);
//     Object.keys(pmCtrl.controls).forEach(key => {
//       if (this.besEmpresa === true) {
//         if (key.toString() === 'nombres' || key.toString() === 'apepaterno' || key.toString() === 'apematerno') {
//           pmCtrl.controls[key].setValidators(null);
//           pmCtrl.controls[key].updateValueAndValidity();
//         } else if (key.toString() === 'razonsocial') {
//           pmCtrl.controls[key].setValidators([Validators.required]);
//           pmCtrl.controls[key].updateValueAndValidity();
//         }
//       } else {
//         if (key.toString() === 'razonsocial') {
//           pmCtrl.controls[key].setValidators(null);
//           pmCtrl.controls[key].updateValueAndValidity();
//         } else if (key.toString() === 'nombres' || key.toString() === 'apepaterno' || key.toString() === 'apematerno') {
//           pmCtrl.controls[key].setValidators([Validators.required]);
//           pmCtrl.controls[key].updateValueAndValidity();
//         }
//       }
//     });
//   }

//   onBlurNumeroDocument() {
//     const tipodocumento = this.contratanteForm.get('tipodocumento').value;
//     const numdocumento = this.contratanteForm.get('numdocumento').value;

//     this.step03service.clientePorDocumento(tipodocumento, numdocumento)
//       .subscribe(
//         res => {
//           const data = res;

//           if (data.length > 0) {
//             const persona = <Cliente>data[0];
//             this.Cliente = persona;
//             this.Cliente.p_SMAIL = undefined;
//             this.Cliente.p_SPHONE = undefined;
//             this.Cliente.p_SADDRESS = undefined;
//             this.initFormularioPaso03();
//           } else {
//             this.cleanFormulario();
//           }
//           this.validaCampaignDocumento();
//         },
//         err => {
//           console.log(err);
//         }
//       );
//   }

//   validaCampaignDocumento() {
//     const tipodocumento = this.contratanteForm.get('tipodocumento').value.toString();
//     const numdocumento = this.contratanteForm.get('numdocumento').value.toString();
//     //Validación de Campaña
//     this.emisionService.validarDocumentoCampaign(this.canal, tipodocumento, numdocumento)
//       .subscribe(
//         res => {
//           const result = res;
//           if (result != null) {
//             this.validaCampaign.validaDocumentoCampaign = result['nvalida'];
//             if (this.validaCampaign.validaDocumentoCampaign == '1') {
//               this.validaCampaign.planCampaign = result['nplan'];
//               this.validaCampaign.planDescriptCampaign = result['splandescript'];
//             } else {
//               this.validaCampaign.validaDocumentoCampaign = '0';
//             }
//           } else {
//             this.validaCampaign.validaDocumentoCampaign = '0';
//           }
//           this.setPlanes();
//           sessionStorage.setItem('validaCampaign', JSON.stringify(this.validaCampaign));
//         },
//         err => {
//           console.log(err);
//           this.bLoading = false;
//         }
//       );
//   }

//   ValidateFormPaso03() {
//     this.contratanteForm.get('tipopersona').markAsTouched();
//     this.contratanteForm.get('tipodocumento').markAsTouched();
//     this.contratanteForm.get('numdocumento').markAsTouched();
//     this.contratanteForm.get('apepaterno').markAsTouched();
//     this.contratanteForm.get('apematerno').markAsTouched();
//     this.contratanteForm.get('nombres').markAsTouched();
//     this.contratanteForm.get('razonsocial').markAsTouched();
//     this.contratanteForm.get('departamento').markAsTouched();
//     this.contratanteForm.get('provincia').markAsTouched();
//     this.contratanteForm.get('distrito').markAsTouched();
//     this.contratanteForm.get('direccion').markAsTouched();
//     this.contratanteForm.get('correo').markAsTouched();
//     this.contratanteForm.get('celular').markAsTouched();

//     this.contratanteForm.updateValueAndValidity();
//   }

//   SaveFormPaso03() {
//     this.asignarDatosCliente();
//     this.Cliente.p_NIDPROCESS = this.auto.V_NIDPROCESS;
//     this.step03service.saveCliente(this.Cliente)
//       .subscribe(
//         result => {
//           this.Cliente.V_NIDPROCESS = result.toString();
//           this.Cliente.p_NIDPROCESS = result.toString();
//           sessionStorage.setItem('contratante', JSON.stringify(this.Cliente));
//           if (!this.certificadoForm.valid) {
//             return;
//           } else {
//             this.SaveFormPaso04();
//           }
//         },
//         error => {
//           console.log(<any>error);
//         }
//       );
//   }

//   asignarDatosCliente() {
//     this.Cliente.p_NIDPROCESS = this.auto.V_NIDPROCESS;
//     this.Cliente.p_NPERSON_TYP = this.contratanteForm.get('tipopersona').value;
//     this.Cliente.p_NDOCUMENT_TYP = this.contratanteForm.get('tipodocumento').value;
//     this.Cliente.p_SDOCUMENT = this.contratanteForm.get('numdocumento').value;
//     this.Cliente.p_SCLIENT_APPPAT = this.contratanteForm.get('apepaterno').value == undefined ? "" : this.contratanteForm.get('apepaterno').value;
//     this.Cliente.p_SCLIENT_APPMAT = this.contratanteForm.get('apematerno').value == undefined ? "" : this.contratanteForm.get('apematerno').value;
//     this.Cliente.p_SCLIENT_NAME = this.contratanteForm.get('nombres').value == undefined ? "" : this.contratanteForm.get('nombres').value;
//     this.Cliente.p_SLEGALNAME = this.contratanteForm.get('razonsocial').value == undefined ? "" : this.contratanteForm.get('razonsocial').value;
//     this.Cliente.p_NPROVINCE = this.contratanteForm.get('departamento').value;
//     this.Cliente.p_NLOCAT = this.contratanteForm.get('provincia').value;
//     this.Cliente.p_NMUNICIPALITY = this.contratanteForm.get('distrito').value;
//     this.Cliente.p_SADDRESS = this.contratanteForm.get('direccion').value;
//     this.Cliente.p_SMAIL = this.contratanteForm.get('correo').value;
//     this.Cliente.p_SPHONE = this.contratanteForm.get('celular').value;
//   }

//   //PASO 04
//   private crearFormularioPaso04() {
//     this.certificadoForm = this.formBuilder.group({
//       fechavigencia: ['', [Validators.required, ValidateMinDate]],
//       poliza: ['', Validators.required],
//       plan: ['', Validators.required],
//       precio: ['', [Validators.required, Validators.min(1)]]
//     });
//   }

//   private initFormularioPaso04() {
//     if (this.Certificado.P_NIDPROCESS !== undefined) {
//       this.certificadoForm.controls.fechavigencia.setValue(this.Certificado.P_DSTARTDATE);
//       this.certificadoForm.controls.poliza.setValue(this.Certificado.P_NPOLICY);
//       this.certificadoForm.controls.plan.setValue(this.Certificado.P_NPLAN);
//     }
//   }

//   onFechaVigenciaChange(fecha: any) {
//     if (fecha !== null || fecha != undefined) {
//       this.certificadoForm.controls.fechavigencia.setValue(fecha);
//       this.Certificado.P_DSTARTDATE = fecha;
//       this.ValidaFecha(fecha);
//     }
//   }

//   ValidaFecha(fec: Date) {
//     this.vfr = true; // this.ValidarFechaRetroactiva(fec); // valida retroactiva
//     if (this.vfr) {
//       this.validarFechaVigencia(this.convertDateToStringOracle(fec)); // valida vigencia activa
//     } else {
//       this.truefalsePlan = true;
//       this.certificadoForm.controls.plan.setValue(undefined);
//       this.certificadoForm.controls.precio.setValue('0');
//     }
//   }

//   validarFechaVigencia(fechaVigencia: string) {
//     // Validar que a la fecha no existe una poliza ya ingresada
//     if (this.auto.p_SREGIST != null) {
//       this.step04service.validarFechaVigencia(this.auto.p_SREGIST.trim().toUpperCase(), fechaVigencia)
//         .subscribe(
//           res => {
//             this.mensajeVigencia = res['mensaje'];
//             this.codigoVigencia = res['codigo'];
//             if (this.codigoVigencia.trim() === '1') {
//               this.truefalsePlan = false;
//               this.mensajeVigencia = '';
//             } else {
//               this.truefalsePlan = true;
//             }
//           },
//           err => {
//             console.log(err);
//           }
//         );
//     }
//   }

//   convertDateToStringOracle(fec: Date): string {
//     const tsTofec = new Date(fec);
//     let hdia = tsTofec.getUTCDate().toString();
//     let hmes = (tsTofec.getUTCMonth() + 1).toString();
//     const hanio = tsTofec.getUTCFullYear().toString();
//     if (hmes.length <= 1) {
//       hmes = '0' + hmes;
//     }
//     if (hdia.length <= 1) {
//       hdia = '0' + hdia;
//     }
//     return hdia + '-' + hmes + '-' + hanio;
//   }

//   asignarDatosCertificado() {
//     this.Certificado.P_NIDPROCESS = this.auto.V_NIDPROCESS;
//     this.Certificado.P_DSTARTDATE = this.certificadoForm.get('fechavigencia').value;
//     this.Certificado.P_NPOLICY = this.certificadoForm.get('poliza').value;
//     this.Certificado.P_NPLAN = this.certificadoForm.get('plan').value;

//     if (this.validaCampaign.validaPlacaCampaign == '1' && this.validaCampaign.validaDocumentoCampaign == '1') {
//       this.Certificado.P_NIDCAMPAIGN = this.validaCampaign.nidcampaign;
//     } else {
//       this.Certificado.P_NIDCAMPAIGN = 0;
//     }
//   }

//   ValidarFechaRetroactiva(fec: string): boolean {
//     if (!this.bFechaMinima) {
//       return true;
//     }
//     if (isDate(new Date(fec))) {
//       const tsTofec = new Date(fec);
//       const hdia = tsTofec.getDate() + 1;
//       const hmes = tsTofec.getMonth() + 1;
//       const hanio = tsTofec.getUTCFullYear();
//       const ts = new Date();
//       return (
//         hdia >= ts.getDate() &&
//         hmes >= ts.getUTCMonth() + 1 &&
//         hanio >= tsTofec.getUTCFullYear()
//       );
//     } else {
//       return false;
//     }
//   }

//   getPolizas(pv: string, canal: string, modalidad: string) {
//     return this.step04service.getPolizas(pv, canal, modalidad).subscribe(
//       res => {
//         this.lstPolizasFull = this.lstPolizasFilter = res;
//         this.totalSoats = this.lstPolizasFull.length;
//         // TODO: no esta trayendo polizas
//         if (this.lstPolizasFull.length > 0) {
//           if (this.tCertificado === 3) {
//             this.Certificado.P_NPOLICY = this.lstPolizasFull[0].npolesP_COMP;
//           } else {
//             this.Certificado.P_NPOLICY = this.lstPolizasFull[0].npolesP_COMP;
//           }
//         }
//       },
//       error => {
//         console.log(<any>error);
//       }
//     );
//   }

//   getCertificado(id: string) {
//     return this.step04service.getCertificado(id).subscribe(
//       res => {
//         this.Certificado = res;
//       },
//       error => {
//         console.log(<any>error);
//       }
//     );
//   }

//   getDataUserSession() {
//     const currentUser = JSON.parse(localStorage.getItem('currentUser'));
//     this.Certificado.P_NCODCHANNEL_BO = currentUser && currentUser.canal;
//     this.Certificado.P_SDESCHANNEL_BO = currentUser && currentUser.desCanal;
//     this.Certificado.P_NCODNUMPOINT_BO = currentUser && currentUser.puntoVenta;
//     this.Certificado.P_SDESNUMPOINT_BO = currentUser && currentUser.desPuntoVenta;
//     this.Certificado.P_NTYPECHANNEL_BO = currentUser && currentUser.tipoCanal;
//   }

//   setPoliza(clase: Poliza) {
//     this.Certificado.P_NPOLICY = clase.npolesP_COMP;
//   }

//   setTarifa() {
//     this.obtenerTarifa();
//   }

//   recalculateTarifa() {
//     sessionStorage.setItem('auto', JSON.stringify(this.auto));
//     sessionStorage.setItem('contratante', JSON.stringify(this.Cliente));
//     sessionStorage.setItem('certificado', JSON.stringify(this.Certificado));
//     this.setPlan(undefined);
//   }

//   validateDataTarifa(data: PrimaFilter) {
//     if (data.Carroceria == undefined) { return false };
//     if (data.ClaseId == undefined) { return false };
//     if (data.UsoId == undefined) { return false };
//     if (data.MarcaId == undefined) { return false };
//     if (data.ModeloId == undefined) { return false };
//     if (data.CantidadAsientos == undefined) { return false };
//     if (data.Departamento == undefined) { return false };
//     if (data.Fecha == undefined) { return false };
//     if (data.Plan == undefined) { return false };
//     if (data.TipoPersona == undefined) { return false };
//     return true;
//   }

//   obtenerTarifa() {
//     debugger;
//     const filter = new PrimaFilter();
//     filter.Carroceria = this.auto.p_NIDCLASE;
//     filter.ClaseId = this.auto.p_NIDCLASE;
//     filter.UsoId = this.auto.p_NIDUSO;
//     filter.MarcaId = this.auto.p_NVEHBRAND;
//     filter.ModeloId = this.auto.p_NVEHMODEL;
//     filter.CantidadAsientos = this.auto.p_SEATNUMBER;
//     filter.Departamento = this.auto.p_NAUTOZONE;
//     filter.Fecha = (this.Certificado.P_DSTARTDATE == undefined ? undefined : this.Certificado.P_DSTARTDATE.toString());
//     filter.Plan = this.Certificado.P_NPLAN;
//     filter.TipoPersona = this.Cliente.p_NPERSON_TYP;
//     filter.CategoriaId = '1';
//     if (this.validateDataTarifa(filter)) {
//       this.Certificado.P_NCOMISSION = 0;
//       this.Certificado.P_NPREMIUM = 0;
//       this.bSpinner = true;

//       this.emisionService.obtenerTarifa(filter).subscribe(
//         res => {
//           if (res != null) {
//             this.tarifa = res;
//             // this.Certificado.P_NCOMISSION = this.tarifa.comision;
//             this.Certificado.P_NPREMIUM = this.tarifa.precio;
//           } else {
//             this.tarifa.precio = 0;
//             // this.tarifa.comision = 0;
//           }
//           sessionStorage.setItem('certificado', JSON.stringify(this.Certificado));
//           this.bSpinner = false;
//         },
//         err => {
//           this.tarifa.precio = 0;
//           // this.tarifa.comision = 0;
//           this.bSpinner = false;
//           console.log(err);
//         }
//       );
//     }
//   }

//   setPlan(id) {
//     this.Certificado.P_NPLAN = id;
//     this.obtenerTarifa();
//   }

//   setPlanes() {
//     const filter = new PlanFilter();
//     filter.poliza = this.canal;
//     filter.tipomodulo = this.tCertificado.toString();

//     if (this.validaCampaign.validaPlacaCampaign == '1' && this.validaCampaign.validaDocumentoCampaign == '1') {
//       const plan = new Plan();
//       plan.nmodulec = this.validaCampaign.planCampaign;
//       plan.sdescript = this.validaCampaign.planDescriptCampaign;
//       this.planes = [plan];
//       return;
//     }

//     this.emisionService.obtenerPlanes(filter).subscribe(
//       res => {
//         this.planes = res;
//       },
//       err => {
//         console.log(err);
//       }
//     );
//   }

//   searchCertificado(search: string) {
//     if (search) {
//       this.lstPolizasFilter = this.lstPolizasFull.filter(
//         s => s.npolesP_COMP.toString().indexOf(search.toLowerCase()) >= 0
//       );
//     } else {
//       this.lstPolizasFilter = this.lstPolizasFull;
//     }
//   }

//   SaveFormPaso04() {
//     this.asignarDatosCertificado();
//     this.Certificado.P_NIDPROCESS = this.auto.V_NIDPROCESS;
//     this.step04service.saveCertificado(this.Certificado).subscribe(
//       result => {
//         this.codigoFlujo = result.toString();
//         sessionStorage.setItem('certificado', JSON.stringify(this.Certificado));
//         this.almacenarNavegacion();
//         this.bSpinner2 = false;
//         this.router.navigate(['broker/step05']);
//       },
//       error => {
//         console.log(<any>error);
//       }
//     );
//   }

//   ValidateFormPaso04() {
//     this.certificadoForm.get('fechavigencia').markAsTouched();
//     this.certificadoForm.get('poliza').markAsTouched();
//     this.certificadoForm.get('plan').markAsTouched();
//     this.certificadoForm.get('precio').markAsTouched();
//     this.certificadoForm.updateValueAndValidity();
//   }

//   irAlResumen() {
//     this.ValidateFormPaso02();
//     this.ValidateFormPaso03();
//     this.ValidateFormPaso04();

//     if (!this.vehiculoForm.valid || !this.contratanteForm.valid || !this.certificadoForm.valid || this.mensajeVigencia) {
//       return;
//     } else {
//       this.bSpinner2 = true;
//       this.SaveFormPaso02();

//     }
//   }

//   private almacenarNavegacion() {
//     if (this.paginaActual > this.ultimaPaginaNavegada) {
//       sessionStorage.setItem('pagina', this.paginaActual.toString());
//     }
//   }

//   nuevoSOAT() {
//     this.placa = '';
//     this.bLock01 = false;
//     this.bLock02 = true;
//     this.bLock03 = true;
//     this.bLock04 = true;
//     this.bBoton01 = false;
//     this.bValidar = false;
//     this.mensajeVigencia = '';

//     sessionStorage.removeItem('auto');
//     sessionStorage.removeItem('contratante');
//     sessionStorage.removeItem('certificado');

//     this.clearFormularioPaso02();
//     this.clearFormularioPaso03();
//     this.clearFormularioPaso04();
//   }

//   clearFormularioPaso02() {
//     this.vehiculoForm.controls.clasecodigo.setValue(undefined);
//     this.vehiculoForm.controls.uso.setValue(undefined);
//     this.vehiculoForm.controls.marcacodigo.setValue(undefined);
//     this.vehiculoForm.controls.modelo.setValue(undefined);
//     this.vehiculoForm.controls.serie.setValue(undefined);
//     this.vehiculoForm.controls.asientos.setValue(undefined);
//     this.vehiculoForm.controls.anho.setValue(undefined);
//     this.vehiculoForm.controls.zona.setValue(undefined);
//   }

//   clearFormularioPaso03() {
//     this.contratanteForm.controls.tipopersona.setValue(undefined);
//     this.contratanteForm.controls.tipodocumento.setValue(undefined);
//     this.contratanteForm.controls.numdocumento.setValue(undefined);
//     this.contratanteForm.controls.apepaterno.setValue(undefined);
//     this.contratanteForm.controls.apematerno.setValue(undefined);
//     this.contratanteForm.controls.nombres.setValue(undefined);
//     this.contratanteForm.controls.departamento.setValue(undefined);
//     this.contratanteForm.controls.razonsocial.setValue(undefined);
//     this.contratanteForm.controls.provincia.setValue(undefined);
//     this.contratanteForm.controls.distrito.setValue(undefined);
//     this.contratanteForm.controls.direccion.setValue(undefined);
//     this.contratanteForm.controls.correo.setValue(undefined);
//     this.contratanteForm.controls.celular.setValue(undefined);
//   }

//   clearFormularioPaso04() {
//     this.certificadoForm.controls.fechavigencia.setValue(undefined);
//     this.certificadoForm.controls.plan.setValue(undefined);
//     this.certificadoForm.controls.precio.setValue(undefined);
//     this.Certificado.P_DSTARTDATE = undefined;
//     this.fecha_vigencia = null;
//   }

// }

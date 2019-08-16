import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl
} from '@angular/forms';
import { Router } from '@angular/router';
// Services/Providers
import { EmisionService } from '../../shared/services/emision.service';
import { UsoService } from '../../../../shared/services/uso/uso.service';
import { VehiculoService } from '../../shared/services/vehiculo.service';
// Modelos
import { Auto } from '../../shared/models/auto.model';
import { Certificado } from '../../shared/models/certificado.model';
import { Clase, ClaseModel } from '../../shared/models/clase.model';
import { Marca } from '../../shared/models/marca.model';
import { Modelo } from '../../shared/models/modelo.model';
import { Uso } from '../../../../shared/models/use/use';
import { ZonaCirculacion } from '../../shared/models/zona-circulacion.model';

import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { AppConfig } from '../../../../app.config';
import { parse } from 'querystring';
import { Campaign } from '../../../../shared/models/campaign/campaign';
import { sortArray, validateMinDate } from '../../../../shared/helpers/utils';
import { isNullOrUndefined } from 'util';

defineLocale('es', esLocale);

// Validacion de Fecha Minima
/* function ValidateMinDate(control: AbstractControl) {
  if (control.value !== '') {
    // console.log(control.value);
    const arrFecha = control.value.toString().split('-');
    const inputDay = +arrFecha[2];
    const inputMonth = +arrFecha[1];
    const inputYear = +arrFecha[0];
    const currDate = new Date();
    const currDay = currDate.getDate();
    const currMonth = currDate.getMonth() + 1;
    const currYear = currDate.getFullYear();

    if (inputYear < currYear) {
      // Si el año ingresado es menor
      return { minDate: true };
    } else if (inputYear - currYear > 1) {
      // Si el año ingresado supera en mas de un año al año actual
      return { minDate: true };
    } else if (inputMonth < currMonth && inputYear === currYear) {
      // Si el mes ingresado es menor al mes actual
      return { minDate: true };
    } else if (
      inputDay < currDay && (inputMonth === currMonth && inputYear >= currYear)
    ) {
      // console.log('El dia ingresado es menor');
      return { minDate: true };
    }

    return null;
  }

  return { minDate: true };
} */

@Component({
  selector: 'app-step02',
  templateUrl: './step02.component.html',
  styleUrls: ['./step02.component.css', './step02.component-mobile.css']
})
export class Step02Component implements OnInit {
  auto: Auto = new Auto();
  certificado: Certificado = new Certificado();
  usos: Uso[];
  clasesFull: ClaseModel[] = [];
  clases: ClaseModel[] = [];
  clasesModel: ClaseModel[] = [];
  marcasFull: Marca[] = [];
  marcas: Marca[] = [];
  zonas: ZonaCirculacion[] = [];

  modelos: Modelo[] = [];
  fechaInicioVigencia = '';
  vFecha: Date;
  minDate: Date = new Date();
  validaCampaign: Campaign = new Campaign();

  @ViewChild('modalVehiculosEspeciales', { static: true }) modalInfo;
  @ViewChild('modalClases', { static: true }) modalClases;
  @ViewChild('modalMarcas', { static: true }) modalMarcas;
  modalClasesAbierto = false;
  modalMarcasAbierto = false;
  claseSeleccionada = false;
  marcaSeleccionada = false;
  bFechaInvalida = false;
  bserie = false;
  bDateSelected = false;

  vehiculoForm: FormGroup;
  bLoading = false;
  bSpinner = false;
  bFlagBoton = false;
  bFechaValida = false;
  mensajeValidacion = '';
  tipoImagen = 0;
  byear = false;
  ultimaPaginaNavegada = 0;
  paginaActual = 2;

  @ViewChild('fv', { static: true }) fv;

  // MENSAJES DE ERROR
  errClaseVehiculo = 'Necesitamos conocer la clase de tu vehículo';
  errTipoUso = 'Necesitamos conocer el uso de tu vehículo';
  errMarca = 'Necesitamos conocer la marca que le das a tu vehículo';
  errModelo = 'Necesitamos conocer el modelo de tu vehículo';
  errVersion = 'Necesitamos conocer la versión de tu vehículo';
  errSerie = 'Necesitamos conocer la serie de tu vehículo';
  errSerie2 = 'El chassis o serie de tu vehículo, debe tener 17 dígitos';
  errAsientos = 'Necesitamos conocer la cantidad de asientos que tiene tu vehículo';
  errAnio = 'Necesitamos conocer el año de tu vehículo';
  errAnio2 = 'El año de tu vehículo no puede ser mayor al actual';
  errZona = 'Necesitamos conocer tu zona de circulación';
  errVigencia = 'Por favor, ingresa una fecha valida para el inicio de vigencia de tu SOAT';

  constructor(
    private usoService: UsoService,
    private vehiculoService: VehiculoService,
    private emisionService: EmisionService,
    private router: Router,
    private formBuilder: FormBuilder,
    private appConfig: AppConfig,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.initComponent();
  }

  initComponent() {
    sessionStorage.setItem('pagefrom', 'Step02Component');
    window.scroll(0, 0);
    this.validarNavegacion();
    this.crearFormulario();

    const autoSession = <Auto>JSON.parse(sessionStorage.getItem('auto'));
    if (autoSession !== null) {
      this.auto = autoSession;
    }

    const certificadoSession = <Certificado>JSON.parse(sessionStorage.getItem('certificado'));
    if (certificadoSession !== undefined && certificadoSession !== null) {
      this.certificado = certificadoSession;
      if (this.certificado.P_DSTARTDATE !== undefined && this.certificado.P_DSTARTDATE !== null) {
        const arr = this.certificado.P_DSTARTDATE.split('-');
        this.vFecha = new Date(Number(arr[0]), Number(arr[1]) - 1, Number(arr[2]));
      }
    }

    const validacampaignSession = <Campaign>JSON.parse(sessionStorage.getItem('validaCampaign'));
    if (validacampaignSession !== null) {
      this.validaCampaign = validacampaignSession;
    }

    this.getTiposUso();
    this.getMarcas();
    this.initFormulario();

    if (this.validaCampaign.validaPlacaCampaign !== null && this.validaCampaign.validaPlacaCampaign !== undefined) {
      if (Number(this.validaCampaign.validaPlacaCampaign) === 1) {
        this.vFecha = new Date(this.validaCampaign.fechaCampaign);
      }
    }
  }

  private validarNavegacion() {
    const sessionUltimaPagina = sessionStorage.getItem('pagina');
    if (sessionUltimaPagina != null) {
      this.ultimaPaginaNavegada = +sessionUltimaPagina;
    } else {
      this.volverValidarPlaca();
    }
  }

  crearFormulario() {
    this.vehiculoForm = this.formBuilder.group({
      clasecodigo: ['', Validators.required],
      clasedescripcion: ['', Validators.required],
      uso: ['', Validators.required],
      marcacodigo: ['', Validators.required],
      marcadescripcion: ['', Validators.required],
      modeloprincipal: ['', Validators.required],
      modelo: ['', Validators.required],
      modeloId: [''],
      serie: [
        '',
        [
          Validators.required,
          Validators.minLength(17),
          Validators.maxLength(17)
        ]
      ],
      asientos: ['', [Validators.required, Validators.maxLength(2)]],
      anho: ['', [Validators.required, Validators.maxLength(4)]],
      vigencia: ['', [Validators.required, validateMinDate]]
    });
  }

  initFormulario() {
    if (!isNullOrUndefined(this.auto.p_NIDUSO) && this.auto.p_NIDUSO.toString() !== '0') {
      this.vehiculoForm.controls.uso.setValue(this.auto.p_NIDUSO.toString());
    }

    if (!isNullOrUndefined(this.auto.p_NVEHBRAND)) {
      this.vehiculoForm.controls.marcacodigo.setValue(this.auto.p_NVEHBRAND.toString());
      this.getModelos();

      if (!isNullOrUndefined(this.auto.p_SNAME_VEHBRAND)) {
        this.vehiculoForm.controls.marcadescripcion.setValue(this.auto.p_SNAME_VEHBRAND);
      }

      if (!isNullOrUndefined(this.auto.p_NVEHMODEL)) {
        this.vehiculoForm.controls.modelo.setValue(this.auto.p_SNAME_VEHMODEL);
        this.getClases();

        if (!isNullOrUndefined(this.auto.p_NIDCLASE) && this.auto.p_NIDCLASE.toString() !== '0') {
          this.vehiculoForm.controls.clasecodigo.setValue(this.auto.p_NIDCLASE.toString());

          if (!isNullOrUndefined(this.auto.p_NVEHMAINMODEL)) {
            this.vehiculoForm.controls.modeloprincipal.setValue(this.auto.p_NVEHMAINMODEL.toString());
          }

          if (!isNullOrUndefined(this.auto.p_SNAMECLASE)) {
            this.vehiculoForm.controls.clasedescripcion.setValue(this.auto.p_SNAMECLASE);
          }
        }

      }
    }

    if (!isNullOrUndefined(this.auto.p_SNUMSERIE)) {
      this.vehiculoForm.controls.serie.setValue(this.auto.p_SNUMSERIE.trim());
      this.bserie = true;
    }

    if (!isNullOrUndefined(this.auto.p_SEATNUMBER)) {
      this.vehiculoForm.controls.asientos.setValue(this.auto.p_SEATNUMBER.toString());
    }

    if (!isNullOrUndefined(this.auto.p_NYEAR)) {
      this.vehiculoForm.controls.anho.setValue(this.auto.p_NYEAR.toString());
      this.byear = true;
    }

    if (!isNullOrUndefined(this.fechaInicioVigencia) && this.fechaInicioVigencia !== '') {
      this.vehiculoForm.controls.vigencia.setValue(this.fechaInicioVigencia);
      this.validarFechaVigencia(this.fechaInicioVigencia);
    }
  }

  getClases() {
    const filter = new Modelo();
    filter.nvehbrand = this.auto.p_NVEHBRAND;
    filter.sdescript = this.auto.p_SNAME_VEHMODEL;

    this.vehiculoService.getClases(filter).subscribe(
      res => {
        this.clasesFull = this.clasesModel = sortArray(<ClaseModel[]>res, 'sdescript', 1);

        if (this.clasesModel.length === 1) {
          const unq = this.clasesModel[0];
          this.vehiculoForm.controls.clasecodigo.setValue(unq.nvehclass);
          this.setClase(unq.nvehclass);
        } else {
          this.vehiculoForm.controls.clasecodigo.setValue('');
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  setClase(idClase) {
    this.vehiculoForm.controls.clasecodigo.setValue(idClase);
    const vehicle = this.clasesModel.find(x => Number(x.nvehclass) === Number(idClase));
    this.auto.p_NVEHBRAND = vehicle.nvehbrand;
    this.auto.p_NVEHMAINMODEL = vehicle.nmainvehmodel;
    this.auto.p_NVEHMODEL = vehicle.nvehmodel;
    this.auto.p_NIDCLASE = vehicle.nvehclass;

    this.vehiculoForm.controls.modeloId.setValue(vehicle.nvehmodel);
    this.vehiculoForm.controls.clasedescripcion.setValue(vehicle.sdescript);
    this.vehiculoForm.controls.modeloprincipal.setValue(vehicle.nmainvehmodel);

    this.claseSeleccionada = true;
    this.cerrarModalClases();

  }

  getTiposUso() {
    const filter = new Uso('0', '');
    this.usoService.getPostUsos(filter).subscribe(
      res => {
        this.usos = sortArray(<Uso[]>res, 'sdescript', 1);
      },
      err => {
        console.log(err);
      }
    );
  }

  cleanVehicle() {
    this.auto.p_NVEHBRAND = undefined;
    this.auto.p_NVEHMAINMODEL = undefined;
    this.auto.p_NVEHMODEL = undefined;
    this.auto.p_SNAME_VEHMODEL = undefined;
  }

  getMarcas() {
    const filter = new Marca();
    this.vehiculoService.getMarcas(filter).subscribe(
      res => {
        this.marcasFull = this.marcas = <Marca[]>res; // sortArray(<Marca[]>res, 'sdescript', 1);
        if (!isNullOrUndefined(this.auto.p_NVEHBRAND)) {
          const marcaAuto = this.marcas.filter(c => c.nvehbrand.toString() === this.auto.p_NVEHBRAND.toString());
          if (marcaAuto.length > 0) {
            this.vehiculoForm.controls.marcadescripcion.setValue(marcaAuto[0].sdescript);
          }
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  setMarca(idMarca) {
    this.auto.p_NVEHBRAND = idMarca;
    this.clasesModel = [];
    this.modelos = [];

    this.vehiculoForm.controls.marcacodigo.setValue(idMarca);
    this.vehiculoForm.controls.modelo.setValue('');
    this.vehiculoForm.controls.clasecodigo.setValue('');

    const descript = this.marcas.find(x => Number(x.nvehbrand) === Number(idMarca)).sdescript;
    this.vehiculoForm.controls.marcadescripcion.setValue(descript);
    this.marcaSeleccionada = true;
    this.getModelos();
  }

  getModelos() {
    const filter = new Modelo();
    filter.nvehbrand = this.auto.p_NVEHBRAND;
    this.vehiculoService.getModelos(filter).subscribe(
      res => {
        this.modelos = sortArray(<Modelo[]>res, 'sdescript', 1);
        if (this.modelos.length === 1) {
          this.setModelo(this.modelos[0].sdescript);
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  setModelo(id) {
    if (id !== '') {
      this.auto.p_SNAME_VEHMODEL = id;
      this.vehiculoForm.controls.modelo.setValue(id);
      this.getClases();
    }
  }

  onBlurAnho() {
    const d = new Date();
    if (this.vehiculoForm.get('anho').value !== undefined) {
      if (this.vehiculoForm.get('anho').value > d.getFullYear()) {
        this.byear = false;
      } else {
        this.byear = true;
      }
    }
  }

  abrirModalClases() {
    this.modalClases.show();
    this.modalClasesAbierto = true;
  }

  cerrarModalClases() {
    this.modalClases.hide();
  }

  abrirModalMarcas() {
    this.modalMarcas.show();
    this.modalMarcasAbierto = true;
  }

  cerrarModalMarca() {
    this.modalMarcas.hide();
  }

  soloNumeros(event: any) {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  soloNumerosLetras(event: any) {
    const pattern = /[0-9a-zA-Z]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  onGuardar() {
    if (!this.vehiculoForm.valid) {
      return;
    }
    this.appConfig.pixelEvent('virtualEvent', 'SOAT Digital - Cliente - Paso 2', 'Avance satisfactorio', '(not available)');
    this.bLoading = true;
    this.bSpinner = true;
    this.asignarDatosVehiculo();
    this.asignarDatosCertificado();

    this.vehiculoService.registrar(this.auto).subscribe(
      res => {
        this.auto.V_NIDPROCESS = this.auto.p_NIDPROCESS = res.toString();

        if (this.auto.V_NIDPROCESS !== '0') {
          sessionStorage.setItem('auto', JSON.stringify(this.auto));
          sessionStorage.setItem('certificado', JSON.stringify(this.certificado));
          this.almacenarNavegacion();

          setTimeout(() => {
            this.irPaso03();
          }, 1500);
        } else {
          // this.mensajeError =
          // 'Ocurrio un error al intentar registrar los datos del vehiculo. Por favor, vuelva a intentarlo.';
        }
      },
      err => {
        console.log(err);
        this.bLoading = false;
        // this.mensajeError =
        // 'Ocurrio un error al intentar registrar los datos del vehiculo. Por favor, vuelva a intentarlo.';
      }
    );
    // setTimeout(() => {this.bLoading = false; }, 5000);
  }

  asignarDatosVehiculo() {
    this.auto.p_NIDFLOW = '1'; // Para clientes siempre enviar '1'
    this.auto.p_NREMINDER = '1'; // Para clientes siempre enviar '1'

    // CLASE
    this.auto.p_NIDCLASE = this.vehiculoForm.get('clasecodigo').value;
    this.auto.p_SNAMECLASE = this.vehiculoForm.get('clasedescripcion').value;

    // USO
    this.auto.p_NIDUSO = this.vehiculoForm.get('uso').value;
    const arrUso = this.usos.filter(u => u.niduso.toString() === this.auto.p_NIDUSO.toString());
    this.auto.p_SNAME_USO = arrUso[0].sdescript;

    // MARCA
    this.auto.p_NVEHBRAND = this.vehiculoForm.get('marcacodigo').value;
    this.auto.p_SNAME_VEHBRAND = this.vehiculoForm.get('marcadescripcion').value;

    // MODELO
    this.auto.p_NVEHMODEL = this.vehiculoForm.get('modeloId').value;
    this.auto.p_SNAME_VEHMODEL = this.vehiculoForm.get('modelo').value;

    // MODELO PRINCIPAL
    this.auto.p_NVEHMAINMODEL = this.vehiculoForm.get('modeloprincipal').value;

    // OTROS
    this.auto.p_SNUMSERIE = this.vehiculoForm.get('serie').value;
    this.auto.p_SEATNUMBER = this.vehiculoForm.get('asientos').value;
    this.auto.p_NYEAR = this.vehiculoForm.get('anho').value;
  }

  asignarDatosCertificado() {
    this.certificado.P_DSTARTDATE = this.vehiculoForm.get('vigencia').value;
  }

  searchMarcas(search: string) {
    if (search) {
      this.marcas = this.marcasFull.filter(
        s => s.sdescript.toLowerCase().indexOf(search.toLowerCase()) >= 0
      );
    } else {
      this.marcas = this.marcasFull;
    }
  }

  searchClases(search: string) {
    if (search) {
      this.clases = this.clasesFull.filter(s => s.sdescript.toLowerCase().indexOf(search.toLowerCase()) >= 0);
    } else {
      this.clases = this.clasesFull;
    }
  }

  onBlurSerie() {
    if (this.vehiculoForm.get('serie').value !== undefined) {
      if (this.vehiculoForm.get('serie').value.toString().length !== 17) {
        this.bserie = false;
      } else {
        this.bserie = true;
      }
    }
  }

  validarFechaVigencia(fecha) {
    if (fecha.length > 0) {
      this.bDateSelected = true;
    }

    this.vehiculoForm.controls.vigencia.setValue(fecha);
    this.bSpinner = true;

    if (this.validarFormatoFecha(fecha)) {
      this.emisionService.validarInicioVigencia(this.auto.p_SREGIST, fecha).subscribe(
        res => {
          const data = res;

          if (data.codigo !== '1') {
            this.mensajeValidacion = data.mensaje;
            this.bFechaInvalida = false;
          } else {
            this.mensajeValidacion = '';
            this.bFechaInvalida = true;
          }
          this.bSpinner = false;
          this.bFlagBoton = false;
        },
        err => {
          console.log(err);
          this.bLoading = false;
          this.bSpinner = false;
          this.bFlagBoton = false;
          this.bSpinner = false;
        }
      );
    } else {
      this.bLoading = false;
      this.bSpinner = false;
      this.bFlagBoton = false;
      this.bSpinner = false;
    }
    this.ref.detectChanges();
  }

  validarFormatoFecha(value) {
    if (value === '' || value === null || value === undefined) {
      return false;
    }
    // console.log('Valor valido');
    // tslint:disable-next-line:max-line-length
    /*const pattern = /^(?:(?:31(\/|-)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
    if (!pattern.test(value)) {
      console.log('No cumple con el formato de fechas');
      return false;
    }*/
    return true;
  }

  setImagen(tipo: number) {
    this.tipoImagen = tipo;
  }

  private almacenarNavegacion() {
    if (this.paginaActual > this.ultimaPaginaNavegada) {
      sessionStorage.setItem('pagina', this.paginaActual.toString());
    }
  }

  private volverValidarPlaca() {
    this.router.navigate(['client/placa']);
  }

  irPaso03() {
    this.router.navigate(['client/contratante']);
  }

  onOutsideClick() {
    // console.log('onOutsideClick');
    this.bDateSelected = true;
  }

  onTouchEnd() {
    // console.log("onTouchEnd");
  }
}

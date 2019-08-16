import { ConfirmService } from './../../../../shared/components/confirm/confirm.service';
import { AppConfig } from './../../../../app.config';
import { FormaDePago, Turno } from '../../models/delivery/delivery';
import { ClaseModel } from './../../../client/shared/models/clase.model';
import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { EmisionService } from '../../../client/shared/services/emision.service';
import { VehiculoService } from '../../services/vehiculo/vehiculo.service';
import { Marca } from '../../../client/shared/models/marca.model';
import { Auto } from '../../models/auto/auto.model';
import { UsoService } from '../../../../shared/services/uso/uso.service';
import { Uso } from '../../../../shared/models/use/use';
import { Router } from '@angular/router';
import { Modelo } from '../../../client/shared/models/modelo.model';
import { ZonaCirculacion } from '../../../client/shared/models/zona-circulacion.model';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Cliente } from '../../models/cliente/cliente';
import { ListaTipoCliente } from '../../models/cliente/listatipocliente';
import { Step03Service } from '../../services/step03/step03.service';
import { ListaTipoDocumento } from '../../models/Documento/listatipodocumento';
import { isNullOrUndefined } from 'util';
import { Province } from '../../../../shared/models/province/province';
import { District } from '../../../../shared/models/district/district';
import { Municipality } from '../../../../shared/models/municipality/municipality';
import { UbigeoService } from '../../../../shared/services/ubigeo/ubigeo.service';
import { Certificado } from '../../models/certificado/certificado';
import { Poliza } from '../../models/poliza/poliza';
import { Step04Service } from '../../services/step04/step04.service';
import { UtilityService } from '../../../../shared/services/general/utility.service';
import { Prima, PrimaFilter } from '../../../client/shared/models/prima.model';
import { Plan, PlanTariff } from '../../models/plan/plan';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { Campaign } from '../../../../shared/models/campaign/campaign';
import { sortArray, validateMinDate, convertDateToStringOracle } from '../../../../shared/helpers/utils';
import { SessionToken } from '../../../client/shared/models/session-token.model';
import { VisaService } from '../../../../shared/services/pago/visa.service';
import { DeliveryService } from '../../services/delivery/delivery.service';
import { Step05Service } from '../../services/step05/step05.service';

@Component({
  selector: 'app-broker-emission',
  templateUrl: './broker-emission.component.html',
  styleUrls: ['./broker-emission.component.css']
})

export class BrokerEmissionComponent implements OnInit {
  @ViewChild('modalPolizas', { static: true }) modalPolizas;
  bLock01 = false;
  bLock02 = true;
  bLock03 = true;
  bLock04 = true;
  fecha_actual = new Date;

  // PASO 1
  deshabilitarNuevoSoat = false;
  bTipoVehiculo = true;
  sTipoVehiculo = '1';
  bValido = false;
  bValidado = false;
  codigo = '';
  mensaje = '';
  placa = '';
  bValidar = false;
  bLoading = false;
  Modalidad: any;
  tCertificado: number;
  NroCertificado: number;
  mainTitle = '';
  titulos: string[];
  longitudPlaca = 6;
  ultimaPaginaNavegada = 0;
  paginaActual = 4;

  // PASO 2
  auto: Auto = new Auto();
  autoSession = new Auto();
  usos: Uso[];
  clasesFull: ClaseModel[] = [];
  clases: ClaseModel[] = [];
  marcasFull: Marca[] = [];
  marcas: Marca[] = [];
  zonas: ZonaCirculacion[] = [];
  modelos: Modelo[] = [];
  claseDescripcion = '';
  marcaDescripcion = '';
  modeloDescripcion = '';
  usoDescripcion = '';
  zonaDescripcion = '';
  fechaInicioVigencia = '';
  mensajeError = '';
  byear = false;
  bserie = false;
  claseSeleccionada = false;
  marcaSeleccionada = false;
  marcaDescrp: Marca[];
  vehiculoForm: FormGroup;

  // PASO 3
  ListaTipoCliente: ListaTipoCliente[] = [];
  ListaTipoDocumento: ListaTipoDocumento[] = [];
  Cliente = new Cliente();
  ClienteSession = new Cliente();
  resultDepReport = 0;
  resultProReport = 0;
  resultDisReport = 0;
  tipoPersona: string;
  tipoDocumento = 0;
  codigoFlujo: any;
  imagePaths: string[];
  imagePath = '';
  departamentos: Province[] = [];
  provincias: District[] = [];
  distritos: Municipality[] = [];
  provinciasDelivery: District[] = [];
  distritosDelivery: Municipality[] = [];
  besEmpresa = false;
  tamanoTipoDocumento: number;
  public TIPO_DOCUMENTO_IDENTIDAD = {
    DNI: '2',
    RUC: '1',
    CE: '4'
  };
  contratanteForm: FormGroup;

  // PASO 4
  certificadoSession = new Certificado();
  Certificado = new Certificado();
  lstPolizasFull: Poliza[] = [];
  lstPolizasFilter: Poliza[] = [];
  lstPolizasParticular: Poliza[] = [];
  lstPolizasPublico: Poliza[] = [];

  lstTarifarios: PlanTariff[] = [];
  filter: any = {};
  planes: Plan[] = [];
  tarifa = new Prima();
  opcionModalidad: number;
  totalSoats = 0;
  mensajeVigencia = '';
  truefalsePlan = true;
  LockPlan = true;
  vfr = true;
  codigoVigencia = '';
  certificadoForm: FormGroup;
  datosEntregaForm: FormGroup;
  bMostrar = false;
  canal = '';
  puntoVenta = '';
  brokerId = null;
  intermediaId = null;
  bEditPrecio = true;

  bSpinner = false;
  bSpinner2 = false;
  fecha_vigencia: Date;
  fecha_entrega: Date;
  @ViewChild('fv', { static: true }) fv;
  @ViewChild('fe', { static: true }) fe;


  validaCampaign = new Campaign();

  // Datos de Entrega
  minDateEntrega: Date = new Date();
  minDateEmission: Date = new Date();
  showSeccionEntrega = true;
  formasDePago: FormaDePago[];
  turnos: Turno[];

  constructor(private vehiculoService: VehiculoService,
    private emisionService: EmisionService,
    private router: Router,
    private usoService: UsoService,
    private formBuilder: FormBuilder,
    private step03service: Step03Service,
    private ubigeoService: UbigeoService,
    private step04service: Step04Service,
    private step05service: Step05Service,
    public utilityService: UtilityService,
    public cd: ChangeDetectorRef,
    private visaService: VisaService,
    private confirmService: ConfirmService,
    private deliveryService: DeliveryService) {
  }

  ngOnInit() {
    this.initComponent();
    this.cd.detectChanges();
  }

  initComponent() {
    window.scroll(0, 0);
    sessionStorage.setItem('pagefrom', 'BrokerEmissionComponent');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.canal = currentUser && currentUser['canal'];
    this.puntoVenta = currentUser && currentUser['puntoVenta'];
    this.brokerId = currentUser && currentUser['brokerId'];
    this.intermediaId = currentUser && currentUser['intermediaId'];


    this.getDataUserSession();

    this.Modalidad = JSON.parse(sessionStorage.getItem('Modalidad'));
    this.tCertificado = this.Modalidad && this.Modalidad['tipoCertificado'];
    this.NroCertificado = Number(this.tCertificado) - 1;
    this.setTitle(this.NroCertificado);

    // SECCION CONTRATANTE
    this.crearFormularioContratante();
    this.getListTipoDocumento();
    this.listarDepartamentos();
    this.ClienteSession = <Cliente>JSON.parse(sessionStorage.getItem('contratante'));
    if (!isNullOrUndefined(this.ClienteSession)) {
      this.Cliente = this.ClienteSession;
      if (this.Cliente.p_NPERSON_TYP !== undefined && this.Cliente.p_NDOCUMENT_TYP !== undefined) {
        if (this.Cliente.p_NDOCUMENT_TYP.toString() === this.TIPO_DOCUMENTO_IDENTIDAD.RUC) { this.besEmpresa = true; }
      }
      this.subscribeRazonSocialChanges();
      if (this.Cliente.p_NPROVINCE !== undefined) {
        this.contratanteForm.controls.departamento.setValue(this.Cliente.p_NPROVINCE.toString());
        this.listarProvinciasPorDepartamento(
          this.Cliente.p_NPROVINCE,
          this.Cliente.p_NLOCAT,
          this.Cliente.p_NMUNICIPALITY);
      }
    }

    // SECCION VEHICULO
    this.autoSession = <Auto>JSON.parse(sessionStorage.getItem('auto'));
    if (!isNullOrUndefined(this.autoSession)) {
      this.auto = this.autoSession;
    } else {
      this.auto = new Auto();
    }
    if (this.auto.p_SREGIST !== undefined) {
      this.placa = this.auto.p_SREGIST;
      this.deshabilitarNuevoSoat = true;
      this.bLock01 = true;
      this.bLock02 = false;
      this.bLock03 = false;
      this.bLock04 = false;
    }
    this.onSetTipoVehiculo(true);
    this.crearFormularioVehiculo();
    this.getMarcas();
    this.cargarSeccionVehiculo();
    this.getTiposUso();

    // SECCION CERTIFICADO
    this.crearFormularioCertificado();
    this.bMostrar = this.tCertificado !== 3;
    this.bEditPrecio = this.tCertificado !== 1;

    // SECCION DELIVERY
    this.formasDePago = [];
    this.turnos = [];
    this.crearFormularioDatosEntrega();
    this.asignarSeccionCertificadoEntrega();
  }

  asignarSeccionCertificadoEntrega() {
    this.getPolizas(this.puntoVenta, this.canal, this.tCertificado.toString());
    this.certificadoSession = JSON.parse(sessionStorage.getItem('certificado'));
    if (!isNullOrUndefined(this.certificadoSession)) {
      this.Certificado = this.certificadoSession;
      this.initFormularioPaso04();
      // this.initFormularioPaso05();
    }
    if (this.Certificado.P_DSTARTDATE !== undefined && this.Certificado.P_DSTARTDATE !== null) {
      this.ValidaFecha(this.Certificado.P_DSTARTDATE);
      this.fecha_vigencia = this.Certificado.P_DSTARTDATE;
    } else {
      this.fecha_vigencia = new Date;
    }
    const validacampaignSession = <Campaign>JSON.parse(sessionStorage.getItem('validaCampaign'));
    if (validacampaignSession !== null) {
      this.validaCampaign = validacampaignSession;
    }
    this.truefalsePlan = true;
    this.LockPlan = true;
  }

  setTitle(id: number) {
    this.titulos = [
      'Crea un SOAT Manual para un tercero',
      'Crea un SOAT Láser para un tercero',
      'Crea un SOAT electrónico para un tercero'
    ];
    this.mainTitle = this.titulos[id];
  }

  onSetTipoVehiculo(tipo) {
    if (!this.bLock01) {
      this.bTipoVehiculo = tipo;
      if (this.bTipoVehiculo) {
        this.sTipoVehiculo = '1';
        this.longitudPlaca = 6;
      } else {
        this.sTipoVehiculo = '2';
        this.longitudPlaca = 8;
      }
      this.placa = '';
    }
  }

  // PASO 1
  validarPlaca() {
    if (this.placa.length < 6) {
      return;
    }

    this.bValidar = true;
    this.bLoading = true;
    this.bValido = false;
    this.bValidado = false;
    this.vehiculoService.informacionPlaca(this.canal, this.sTipoVehiculo, this.placa).subscribe(
      data => {
        this.codigo = data.p_VALIDO;
        this.mensaje = data.p_MENSAJE;
        this.bLoading = false;
        this.bValidado = true;

        if (this.codigo === '1') {
          this.bValido = true;
          const validaCampaign = new Campaign();
          validaCampaign.fechaCampaign = data.dexpirdat;
          validaCampaign.validaPlacaCampaign = data.nvalida;
          validaCampaign.nidcampaign = data.nidcampaign;
          this.validaCampaign = validaCampaign;
          sessionStorage.setItem('validaCampaign', JSON.stringify(validaCampaign));
          if (!isNullOrUndefined(data)) {
            this.auto = data;
          }
          this.auto.p_STYPE_REGIST = this.sTipoVehiculo;
          this.auto.p_SREGIST = this.placa.toString().toUpperCase();
          if (!isNullOrUndefined(this.auto.p_SNUMSERIE)) {
            this.auto.p_SNUMSERIE = this.auto.p_SNUMSERIE.trim();
          }
          sessionStorage.setItem('auto', JSON.stringify(this.auto));
          this.deshabilitarNuevoSoat = true;
          this.bLock01 = true;
          this.bLock02 = false;
          this.bLock03 = false;
          this.bLock04 = false;
          this.cargarSeccionVehiculo();
        } else {
          this.bValidar = false;
        }

        /* this.codigo = data['codigo'];
        this.mensaje = data['mensaje'];
        this.bLoading = false;
        this.bValidado = true;
        this.auto.p_SREGIST = this.placa;
        if (this.codigo === '1') {
          this.bValido = true;
          this.validaCampaignPlaca();
          this.obtenerDatosAutoPorPlaca(this.placa);
        } else {
          this.bValidar = false;
        }
        this.getListTipoDocumento();
        this.cd.detectChanges(); */
      },
      error => {
        console.log(error);
        this.bValidado = true;
        this.bValidar = false;
        this.bLoading = false;
        this.mensaje = 'No se pudo realizar la validación de la placa. Por favor vuelva a intentarlo.';
      }
    );
  }

  validaCampaignPlaca() {
    this.vehiculoService.validarPlacaCampaign(this.canal, this.placa)
      .subscribe(
        data => {
          if (data != null) {
            this.validaCampaign.fechaCampaign = data['dexpirdat'];
            this.validaCampaign.validaPlacaCampaign = data['nvalida'];
            if (Number(this.validaCampaign.validaPlacaCampaign) === 1) {
              this.validaCampaign.nidcampaign = data['nidcampaign'];
              this.Certificado.P_DSTARTDATE = data['dexpirdat'];
              this.fecha_vigencia = data['dexpirdat'];
              this.certificadoForm.controls.fechavigencia.setValue(this.Certificado.P_DSTARTDATE);
            }
          } else {
            this.validaCampaign.nidcampaign = 0;
            this.validaCampaign.validaPlacaCampaign = '0';
          }
          sessionStorage.setItem('validaCampaign', JSON.stringify(this.validaCampaign));
        },
        error => {
          console.log(error);
          this.bValidado = true;
          this.bValidar = false;
          this.bLoading = false;
          this.mensaje = 'No se pudo realizar la validación de la placa. Por favor vuelva a intentarlo.';
        }
      );
  }

  obtenerDatosAutoPorPlaca(placa) {
    this.emisionService.autoPorPlaca(placa)
      .subscribe(
        res => {
          const arrAuto = res;
          if (!isNullOrUndefined(arrAuto)) {
            this.auto = arrAuto;
          }
          this.auto.p_STYPE_REGIST = this.sTipoVehiculo;
          this.auto.p_SREGIST = this.placa.toString().toUpperCase();
          if (!isNullOrUndefined(this.auto.p_SNUMSERIE)) {
            this.auto.p_SNUMSERIE = this.auto.p_SNUMSERIE.trim();
          }
          sessionStorage.setItem('auto', JSON.stringify(this.auto));
          this.deshabilitarNuevoSoat = true;
          this.bLock01 = true;
          this.bLock02 = false;
          this.bLock03 = false;
          this.bLock04 = false;
          this.cargarSeccionVehiculo();
        },
        err => {
          console.log(err);
          this.bLoading = false;
          this.bValidar = false;
          this.bLoading = false;
        }
      );
  }

  // PASO 2
  crearFormularioVehiculo() {
    this.vehiculoForm = this.formBuilder.group({
      clasecodigo: ['0', Validators.required],
      clasedescripcion: [''],
      uso: ['', Validators.required],
      marcacodigo: ['', Validators.required],
      marcadescripcion: [''],
      modelo: ['', Validators.required],
      modeloId: [''],
      modeloprincipal: ['', Validators.required],
      serie: ['', [Validators.required, Validators.maxLength(17)]],
      asientos: ['', [Validators.required, Validators.maxLength(2)]],
      anho: ['', [Validators.required, Validators.maxLength(4)]]
    });
  }

  cargarSeccionVehiculo() {
    this.auto.p_NIDUSO = isNullOrUndefined(this.auto.p_NIDUSO) ? '' : this.auto.p_NIDUSO;
    this.auto.p_NVEHBRAND = isNullOrUndefined(this.auto.p_NVEHBRAND) ? '' : this.auto.p_NVEHBRAND;
    this.auto.p_SNAME_VEHBRAND = isNullOrUndefined(this.auto.p_SNAME_VEHBRAND) ? '' : this.auto.p_SNAME_VEHBRAND;
    this.auto.p_NVEHMODEL = isNullOrUndefined(this.auto.p_NVEHMODEL) ? '' : this.auto.p_NVEHMODEL;
    this.auto.p_NIDCLASE = isNullOrUndefined(this.auto.p_NIDCLASE) ? '' : this.auto.p_NIDCLASE;
    this.auto.p_NVEHMAINMODEL = isNullOrUndefined(this.auto.p_NVEHMAINMODEL) ? '' : this.auto.p_NVEHMAINMODEL;
    this.auto.p_SNAMECLASE = isNullOrUndefined(this.auto.p_SNAMECLASE) ? '' : this.auto.p_SNAMECLASE;
    this.auto.p_SNUMSERIE = isNullOrUndefined(this.auto.p_SNUMSERIE) ? '' : this.auto.p_SNUMSERIE;
    this.auto.p_SEATNUMBER = isNullOrUndefined(this.auto.p_SEATNUMBER) ? '' : this.auto.p_SEATNUMBER;
    this.auto.p_NYEAR = isNullOrUndefined(this.auto.p_NYEAR) ? '' : this.auto.p_NYEAR;
    this.auto.p_SNAME_VEHMODEL = isNullOrUndefined(this.auto.p_SNAME_VEHMODEL) ? '' : this.auto.p_SNAME_VEHMODEL;

    if (this.auto.p_NIDUSO !== '') {
      this.vehiculoForm.controls.uso.setValue(this.auto.p_NIDUSO.toString());
    }

    if (this.auto.p_NVEHBRAND !== '') {

      this.vehiculoForm.controls.marcacodigo.setValue(this.auto.p_NVEHBRAND.toString());
      this.getModelos(true);

      if (this.auto.p_SNAME_VEHBRAND !== '') {
        this.vehiculoForm.controls.marcadescripcion.setValue(this.auto.p_SNAME_VEHBRAND);
      }

      if (this.auto.p_NVEHMODEL !== '') {
        this.vehiculoForm.controls.modelo.setValue(this.auto.p_SNAME_VEHMODEL);
        this.getClases();

        /*  if (this.auto.p_NIDCLASE !== '' && Number(this.auto.p_NIDCLASE) !== 0) {
           this.vehiculoForm.controls.clasecodigo.setValue(this.auto.p_NIDCLASE);

           if (this.auto.p_NVEHMAINMODEL !== '') {
             this.vehiculoForm.controls.modeloprincipal.setValue(this.auto.p_NVEHMAINMODEL.toString());
           }

           if (this.auto.p_SNAMECLASE !== '') {
             this.vehiculoForm.controls.clasedescripcion.setValue(this.auto.p_SNAMECLASE);
           }
         } */

      }
    }

    if (this.auto.p_SNUMSERIE !== '') {
      this.vehiculoForm.controls.serie.setValue(this.auto.p_SNUMSERIE.trim());
    }

    if (this.auto.p_SEATNUMBER !== '') {
      this.vehiculoForm.controls.asientos.setValue(this.auto.p_SEATNUMBER.toString());
    }

    if (this.auto.p_NYEAR !== '') {
      this.vehiculoForm.controls.anho.setValue(this.auto.p_NYEAR.toString());
    }
    sessionStorage.setItem('auto', JSON.stringify(this.auto));
  }

  getClases() {
    const filter = new Modelo();
    filter.nvehbrand = this.auto.p_NVEHBRAND;
    filter.sdescript = this.auto.p_SNAME_VEHMODEL;
    const mclaseSession = this.auto.p_NIDCLASE === '' || isNullOrUndefined(this.auto.p_NIDCLASE) ? 0 : this.auto.p_NIDCLASE;
    this.vehiculoService.getClases(filter)
      .subscribe(
        res => {
          this.clasesFull = this.clases = <ClaseModel[]>res;
          const unq = this.clasesFull[0];
          if (this.clasesFull.length === 1) {
            if (mclaseSession !== '' && Number(mclaseSession) !== 0) {
              this.setClase(Number(mclaseSession));
            } else {
              this.setClase(unq.nvehclass);
            }
          } else {
            this.vehiculoForm.controls.clasecodigo.setValue('0');
            if (mclaseSession !== '' && mclaseSession !== 0) {
              this.setClase(Number(mclaseSession));
            }
          }
        },
        err => {
          console.log(err);
        }
      );
  }

  getTiposUso() {
    const filter = new Uso('0', '');
    this.usoService.getPostUsos(filter)
      .subscribe(
        res => {
          this.usos = <Uso[]>res;
          this.auto.p_NIDUSO = '1';
        },
        err => {
          console.log(err);
        }
      );
  }

  setClase(idClase) {
    if (idClase !== '') {
      const vehicle = this.clases.find(x => Number(x.nvehclass) === Number(idClase));
      if (vehicle !== undefined) {
        this.auto.p_NVEHBRAND = vehicle.nvehbrand;
        this.auto.p_NVEHMAINMODEL = vehicle.nmainvehmodel;
        this.auto.p_NVEHMODEL = vehicle.nvehmodel;
        this.auto.p_NIDCLASE = vehicle.nvehclass;
        this.auto.p_SNAMECLASE = vehicle.sdescript;
        this.vehiculoForm.controls.modeloId.setValue(vehicle.nvehmodel);
        this.vehiculoForm.controls.clasedescripcion.setValue(vehicle.sdescript);
        this.vehiculoForm.controls.modeloprincipal.setValue(vehicle.nmainvehmodel);
        this.vehiculoForm.controls.clasecodigo.setValue(vehicle.nvehclass);
        this.claseSeleccionada = true;
        sessionStorage.setItem('auto', JSON.stringify(this.auto));
        this.recalculateTarifa();
      }
    }
    this.recalculateTarifa();
  }

  getMarcas() {
    const filter = new Marca();
    // this.auto.p_NIDCLASE = '0';
    this.vehiculoForm.controls.clasecodigo.setValue('');
    this.vehiculoService.getMarcas(filter)
      .subscribe(
        res => {
          this.marcasFull = this.marcas = <Marca[]>res;
          if (this.auto.p_NVEHBRAND !== undefined) {
            const marcaAuto = this.marcas.filter(c => c.nvehbrand.toString() === this.auto.p_NVEHBRAND.toString());
            if (marcaAuto.length > 0) {
            }
          }
        },
        err => {
          console.log(err);
        }
      );
  }

  setMarca(id) {
    if (id !== '') {
      this.auto.p_NVEHBRAND = id;
      this.auto.p_NVEHMAINMODEL = '';
      this.auto.p_NVEHMODEL = '';
      this.auto.p_SNAME_VEHMODEL = '';
      this.modelos = [];
      this.vehiculoForm.controls.marcacodigo.setValue(id);
      this.marcaDescrp = this.marcas.filter(c => c.nvehbrand.toString() === id.toString());
      this.auto.p_SNAME_VEHBRAND = this.marcaDescrp[0].sdescript;
      this.marcaSeleccionada = true;
      this.getModelos(false);
    }
    this.recalculateTarifa();
  }

  getModelos(setclasectrl) {
    const filter = new Modelo();
    filter.nvehbrand = this.auto.p_NVEHBRAND;
    if (!setclasectrl) {
      this.auto.p_NIDCLASE = '0';
    }
    this.vehiculoService.getModelos(filter)
      .subscribe(
        res => {
          this.modelos = sortArray(<Modelo[]>res, 'sdescript', 1);
          if (this.modelos.length === 1) {
            this.setModelo(this.modelos[0].sdescript);
          }
          this.cd.detectChanges();
        },
        err => {
          console.log(err);
        }
      );
  }

  setModelo(id) {
    if (id !== '') {
      this.auto.p_NIDCLASE = '0';
      this.auto.p_SNAME_VEHMODEL = id;
      this.vehiculoForm.controls.modelo.setValue(id);
      this.getClases();
    }
    this.recalculateTarifa();
  }

  onBlurAnho() {
    const d = new Date();
    if (this.vehiculoForm.get('anho').value !== undefined || this.vehiculoForm.get('anho').value !== '') {
      if (this.vehiculoForm.get('anho').value > d.getFullYear()) {
        this.byear = true;
      } else {
        this.byear = false;
      }
      this.auto.p_NYEAR = this.vehiculoForm.get('anho').value;
    }
  }

  onBlurSerie() {
    if (this.vehiculoForm.get('serie').value !== undefined || this.vehiculoForm.get('serie').value !== '') {
      if (this.vehiculoForm.get('serie').value.toString().length !== 17) {
        this.bserie = true;
      } else {
        this.bserie = false;
      }
      this.auto.p_SNUMSERIE = this.vehiculoForm.get('serie').value;
    }
  }

  onBlurAsiento() {
    this.auto.p_SEATNUMBER = this.vehiculoForm.get('asientos').value;
  }

  setUso(id) {
    if (id !== '') {
      this.auto.p_NIDUSO = id;
      this.vehiculoForm.controls.uso.setValue(id);
      if (this.auto.p_NIDUSO !== undefined) {
        const usoDescrp = this.usos.filter(c => c.niduso.toString() === id.toString());
        this.auto.p_SNAME_USO = usoDescrp[0].sdescript;
        this.setUsoNumerador();
      }
    }
    this.recalculateTarifa();
  }

  soloNumeros(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    const inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  searchMarcas(search: string) {
    if (search) {
      this.marcas = this.marcasFull.filter(s => s.sdescript.toLowerCase().indexOf(search.toLowerCase()) >= 0);
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

  ValidateFormVehiculo() {
    this.vehiculoForm.get('clasecodigo').markAsTouched();
    this.vehiculoForm.get('uso').markAsTouched();
    this.vehiculoForm.get('marcacodigo').markAsTouched();
    this.vehiculoForm.get('modeloprincipal').markAsTouched();
    this.vehiculoForm.get('modelo').markAsTouched();
    this.vehiculoForm.get('serie').markAsTouched();
    this.vehiculoForm.get('asientos').markAsTouched();
    this.vehiculoForm.get('anho').markAsTouched();
    this.vehiculoForm.updateValueAndValidity();
  }

  grabarDatosVehiculo() {
    this.auto.p_NIDFLOW = '2';
    this.auto.p_NREMINDER = '0';
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.auto.p_NUSERCODE = currentUser['id'];
    this.vehiculoService.registrar(this.auto)
      .subscribe(
        res => {
          this.auto.V_NIDPROCESS = this.auto.p_NIDPROCESS = res.toString();
          if (this.auto.V_NIDPROCESS !== '0') {
            sessionStorage.setItem('auto', JSON.stringify(this.auto));
            if (!this.contratanteForm.valid) {
              return;
            } else {
              this.grabarDatosContratante();
            }
          } else {
            this.mensajeError =
              'Ocurrio un error al intentar registrar los datos del vehiculo. Por favor, vuelva a intentarlo.';
          }
        },
        err => {
          console.log(err);
          this.mensajeError =
            'Ocurrio un error al intentar registrar los datos del vehiculo. Por favor, vuelva a intentarlo.';
        }
      );
  }

  // PASO 3
  crearFormularioContratante() {
    this.contratanteForm = this.formBuilder.group({
      tipodocumento: ['', Validators.required],
      numdocumento: ['', [Validators.required, Validators.maxLength(12)]],
      apepaterno: ['', [Validators.required, Validators.maxLength(50)]],
      apematerno: ['', [Validators.required, Validators.maxLength(50)]],
      nombres: ['', [Validators.required, Validators.maxLength(50)]],
      razonsocial: ['', [Validators.required, Validators.maxLength(50)]],
      departamento: ['', Validators.required],
      provincia: ['', Validators.required],
      distrito: ['', Validators.required],
      direccion: ['', [Validators.required, Validators.maxLength(100)]],
      correo: ['', [Validators.required, Validators.maxLength(100), Validators.email]],
      celular: ['', [Validators.required, Validators.maxLength(9)]],
    });
  }

  initFormularioPaso03() {
    if (!isNullOrUndefined(this.Cliente.p_NDOCUMENT_TYP)) {
      this.contratanteForm.controls.tipodocumento.setValue(this.Cliente.p_NDOCUMENT_TYP);
      this.callTypeDocument(this.Cliente.p_NDOCUMENT_TYP);
    }
    if (!isNullOrUndefined(this.Cliente.p_SDOCUMENT)) {
      this.contratanteForm.controls.numdocumento.setValue(this.Cliente.p_SDOCUMENT.trim());
    }
    if (!isNullOrUndefined(this.Cliente.p_SCLIENT_APPPAT)) {
      this.contratanteForm.controls.apepaterno.setValue(this.Cliente.p_SCLIENT_APPPAT);
    }
    if (!isNullOrUndefined(this.Cliente.p_SCLIENT_APPMAT)) {
      this.contratanteForm.controls.apematerno.setValue(this.Cliente.p_SCLIENT_APPMAT);
    }
    if (!isNullOrUndefined(this.Cliente.p_SCLIENT_NAME)) {
      this.contratanteForm.controls.nombres.setValue(this.Cliente.p_SCLIENT_NAME);
    }
    if (!isNullOrUndefined(this.Cliente.p_NPROVINCE)) {
      if (Number(this.Cliente.p_NPROVINCE) === 0) {
        this.contratanteForm.controls.departamento.setValue(undefined);
        this.contratanteForm.controls.provincia.setValue(undefined);
        this.contratanteForm.controls.distrito.setValue(undefined);
      } else {
        this.contratanteForm.controls.departamento.setValue(this.Cliente.p_NPROVINCE);
        this.listarProvinciasPorDepartamento(this.Cliente.p_NPROVINCE, this.Cliente.p_NLOCAT, this.Cliente.p_NMUNICIPALITY);
      }
    }
    if (!isNullOrUndefined(this.Cliente.p_SLEGALNAME)) {
      this.contratanteForm.controls.razonsocial.setValue(this.Cliente.p_SLEGALNAME);
    }
    if (!isNullOrUndefined(this.Cliente.p_SADDRESS)) {
      this.contratanteForm.controls.direccion.setValue(this.Cliente.p_SADDRESS);
    }
    if (!isNullOrUndefined(this.Cliente.p_SMAIL)) {
      this.contratanteForm.controls.correo.setValue(this.Cliente.p_SMAIL);
    }
    if (!isNullOrUndefined(this.Cliente.p_SPHONE)) {
      this.contratanteForm.controls.celular.setValue(this.Cliente.p_SPHONE);
    }
  }

  cleanFormulario() {
    this.contratanteForm.controls.apepaterno.setValue(undefined);
    this.contratanteForm.controls.apematerno.setValue(undefined);
    this.contratanteForm.controls.nombres.setValue(undefined);
    this.contratanteForm.controls.departamento.setValue(undefined);
    this.contratanteForm.controls.razonsocial.setValue(undefined);
    this.contratanteForm.controls.provincia.setValue(undefined);
    this.contratanteForm.controls.distrito.setValue(undefined);
    this.contratanteForm.controls.direccion.setValue(undefined);
    this.contratanteForm.controls.correo.setValue(undefined);
    this.contratanteForm.controls.celular.setValue(undefined);
  }

  listarDepartamentos() {
    const filter = new Province('0', '');
    this.ubigeoService.getPostProvince(filter)
      .subscribe(
        res => {
          this.departamentos = <Province[]>res;
          /* if (this.Cliente.p_NPROVINCE !== undefined) {
            this.listarProvinciasPorDepartamento(this.Cliente.p_NPROVINCE, null, null);
          } */
          /*  if (this.Certificado.P_NPROVINCEDELIVERY !== undefined) {
             this.listarProvinciasDelivery(this.Certificado.P_NPROVINCEDELIVERY, null, null);
           } */
        },
        err => {
          console.log(err);
        }
      );
  }

  listarProvinciasPorDepartamento(idDepartamento, idprovincia, iddistrito) {
    const filter = new District('0', idDepartamento, '');
    this.contratanteForm.controls.provincia.setValue(undefined);
    this.contratanteForm.controls.distrito.setValue(undefined);
    this.ubigeoService.getPostDistrict(filter)
      .subscribe(
        res => {
          this.provincias = <District[]>res;
          if (!isNullOrUndefined(idprovincia)) {
            this.contratanteForm.controls.provincia.setValue(idprovincia);
            this.listarDistritosPorProvincia(idprovincia, iddistrito);
          } else {
            this.contratanteForm.controls.provincia.setValue(undefined);
            this.contratanteForm.controls.distrito.setValue(undefined);
          }
          this.recalculateTarifa();
        },
        err => {
          console.log(err);
        }
      );
  }

  listarProvinciasDelivery(idDepartamento, idprovincia, iddistrito) {
    this.datosEntregaForm.controls.provinciaentrega.setValue(undefined);
    this.datosEntregaForm.controls.distritoentrega.setValue(undefined);
    const filter = new District('0', idDepartamento, '');
    this.ubigeoService.getPostDistrict(filter)
      .subscribe(
        res => {
          this.provinciasDelivery = <District[]>res;
          if (!isNullOrUndefined(idprovincia)) {
            this.datosEntregaForm.controls.provinciaentrega.setValue(idprovincia);
            this.listarDistritosDelivery(idprovincia, iddistrito);
          } else {
            this.datosEntregaForm.controls.provinciaentrega.setValue(undefined);
            this.datosEntregaForm.controls.distritoentrega.setValue(undefined);
          }
        },
        err => {
          console.log(err);
        }
      );
  }

  listarDistritosDelivery(idProvincia, idDistrito) {
    this.datosEntregaForm.controls.distritoentrega.setValue(undefined);
    const filter = new Municipality('0', idProvincia, '');
    this.ubigeoService.getPostMunicipality(filter)
      .subscribe(
        res => {
          this.distritosDelivery = <Municipality[]>res;
          if (!isNullOrUndefined(idDistrito)) {
            this.datosEntregaForm.controls.distritoentrega.setValue(idDistrito);
          } else {
            this.datosEntregaForm.controls.distritoentrega.setValue(undefined);
          }
        },
        err => {
          console.log(err);
        }
      );
  }

  listarDistritosPorProvincia(idProvincia, idDistrito) {
    const filter = new Municipality('0', idProvincia, '');
    this.contratanteForm.controls.distrito.setValue(undefined);
    this.ubigeoService.getPostMunicipality(filter)
      .subscribe(
        res => {
          this.distritos = <Municipality[]>res;
          if (!isNullOrUndefined(idDistrito)) {
            this.contratanteForm.controls.distrito.setValue(idDistrito);
          } else {
            this.contratanteForm.controls.distrito.setValue(undefined);
          }
          this.recalculateTarifa();
        },
        err => {
          console.log(err);
        }
      );
  }

  getListTipoDocumento() {
    this.ListaTipoDocumento = [];
    this.ListaTipoDocumento.push({
      niddoC_TYPE: 4,
      sdescript: 'CE'
    });
    this.ListaTipoDocumento.push({
      niddoC_TYPE: 2,
      sdescript: 'DNI'
    });
    this.ListaTipoDocumento.push({
      niddoC_TYPE: 1,
      sdescript: 'RUC'
    });
    this.contratanteForm.get('tipodocumento').setValue(2);
    this.callTypeDocument(2);
  }

  getCliente(id: string) {
    return this.step03service.getCliente(id).subscribe(cli => { this.Cliente = cli; },
      error => {
        console.log(<any>error);
      });
  }

  callTypeDocument(value) {
    if (value !== '') {
      this.tipoDocumento = this.Cliente.p_NDOCUMENT_TYP = value;
      this.besEmpresa = Number(this.tipoDocumento) === Number(this.TIPO_DOCUMENTO_IDENTIDAD.RUC);
      if (Number(value) === Number(this.TIPO_DOCUMENTO_IDENTIDAD.RUC)) { this.tamanoTipoDocumento = 11; }
      if (Number(value) === Number(this.TIPO_DOCUMENTO_IDENTIDAD.DNI)) { this.tamanoTipoDocumento = 8; }
      if (Number(value) === Number(this.TIPO_DOCUMENTO_IDENTIDAD.CE)) { this.tamanoTipoDocumento = 12; }
      this.subscribeRazonSocialChanges();
    }
    this.recalculateTarifa();
  }

  subscribeRazonSocialChanges() {
    const pmCtrl = (<any>this.contratanteForm);
    Object.keys(pmCtrl.controls).forEach(key => {
      if (this.besEmpresa === true) {
        if (key.toString() === 'nombres' || key.toString() === 'apepaterno' || key.toString() === 'apematerno') {
          pmCtrl.controls[key].setValidators(null);
          pmCtrl.controls[key].updateValueAndValidity();
        } else if (key.toString() === 'razonsocial') {
          pmCtrl.controls[key].setValidators([Validators.required]);
          pmCtrl.controls[key].updateValueAndValidity();
        }
      } else {
        if (key.toString() === 'razonsocial') {
          pmCtrl.controls[key].setValidators(null);
          pmCtrl.controls[key].updateValueAndValidity();
        } else if (key.toString() === 'nombres' || key.toString() === 'apepaterno' || key.toString() === 'apematerno') {
          pmCtrl.controls[key].setValidators([Validators.required]);
          pmCtrl.controls[key].updateValueAndValidity();
        }
      }
    });
  }

  onBlurNumeroDocument() {
    const tipodocumento =
      this.contratanteForm.get('tipodocumento').value === undefined ? '' : this.contratanteForm.get('tipodocumento').value;
    const numdocumento =
      this.contratanteForm.get('numdocumento').value === undefined ? '' : this.contratanteForm.get('numdocumento').value;
    if (tipodocumento !== '' && numdocumento !== '') {

      this.step03service.clientePorDocumento(tipodocumento, numdocumento)
        .subscribe(
          res => {
            const data = res;

            if (data.length > 0) {
              const persona = <Cliente>data[0];
              this.Cliente = persona;
              this.initFormularioPaso03();
            } else {
              this.cleanFormulario();
            }
            this.validaCampaignDocumento();
          },
          err => {
            console.log(err);
          }
        );
    }
  }

  validaCampaignDocumento() {
    const tipodocumento =
      this.contratanteForm.get('tipodocumento').value === undefined ? '' : this.contratanteForm.get('tipodocumento').value;
    const numdocumento =
      this.contratanteForm.get('numdocumento').value === undefined ? '' : this.contratanteForm.get('numdocumento').value;

    if (tipodocumento !== '' && numdocumento !== '') {

      this.emisionService.validarDocumentoCampaign(this.canal, tipodocumento, numdocumento)
        .subscribe(
          res => {
            const result = res;
            if (result != null) {
              this.validaCampaign.validaDocumentoCampaign = result['nvalida'];
              if (Number(this.validaCampaign.validaDocumentoCampaign) === 1) {
                this.validaCampaign.planCampaign = result['nplan'];
                this.validaCampaign.planDescriptCampaign = result['splandescript'];
                this.validaCampaign.canalClient = result['sclientchannel'];
              } else {
                this.validaCampaign.validaDocumentoCampaign = '0';
              }
            } else {
              this.validaCampaign.validaDocumentoCampaign = '0';
            }
            sessionStorage.setItem('validaCampaign', JSON.stringify(this.validaCampaign));
            this.recalculateTarifa();
          },
          err => {
            console.log(err);
            this.bLoading = false;
          }
        );
    }
  }

  ValidateFormContratante() {
    this.contratanteForm.get('tipodocumento').markAsTouched();
    this.contratanteForm.get('numdocumento').markAsTouched();
    this.contratanteForm.get('apepaterno').markAsTouched();
    this.contratanteForm.get('apematerno').markAsTouched();
    this.contratanteForm.get('nombres').markAsTouched();
    this.contratanteForm.get('razonsocial').markAsTouched();
    this.contratanteForm.get('departamento').markAsTouched();
    this.contratanteForm.get('provincia').markAsTouched();
    this.contratanteForm.get('distrito').markAsTouched();
    this.contratanteForm.get('direccion').markAsTouched();
    this.contratanteForm.get('correo').markAsTouched();
    this.contratanteForm.get('celular').markAsTouched();
    this.contratanteForm.updateValueAndValidity();
  }

  grabarDatosContratante() {
    this.asignarDatosCliente();
    this.Cliente.p_NIDPROCESS = this.auto.V_NIDPROCESS;
    this.step03service.saveCliente(this.Cliente)
      .subscribe(
        result => {
          this.Cliente.V_NIDPROCESS = result.toString();
          this.Cliente.p_NIDPROCESS = result.toString();
          sessionStorage.setItem('contratante', JSON.stringify(this.Cliente));
          if (!this.certificadoForm.valid) {
            return;
          } else {
            this.grabarDatosCertificado();
          }
        },
        error => {
          console.log(<any>error);
        }
      );
  }

  asignarDatosCliente() {
    this.Cliente.p_NIDPROCESS = this.auto.V_NIDPROCESS;
    this.Cliente.p_NDOCUMENT_TYP = this.contratanteForm.get('tipodocumento').value;
    this.Cliente.p_SDOCUMENT = this.contratanteForm.get('numdocumento').value;
    this.Cliente.p_SCLIENT_APPPAT =
      this.contratanteForm.get('apepaterno').value === undefined ? '' : this.contratanteForm.get('apepaterno').value;
    this.Cliente.p_SCLIENT_APPMAT =
      this.contratanteForm.get('apematerno').value === undefined ? '' : this.contratanteForm.get('apematerno').value;
    this.Cliente.p_SCLIENT_NAME =
      this.contratanteForm.get('nombres').value === undefined ? '' : this.contratanteForm.get('nombres').value;
    this.Cliente.p_SLEGALNAME =
      this.contratanteForm.get('razonsocial').value === undefined ? '' : this.contratanteForm.get('razonsocial').value;
    this.Cliente.p_NPROVINCE = this.contratanteForm.get('departamento').value;
    this.Cliente.p_NLOCAT = this.contratanteForm.get('provincia').value;
    this.Cliente.p_NMUNICIPALITY = this.contratanteForm.get('distrito').value;
    this.Cliente.p_SADDRESS = this.contratanteForm.get('direccion').value;
    this.Cliente.p_SMAIL = this.contratanteForm.get('correo').value;
    this.Cliente.p_SPHONE = this.contratanteForm.get('celular').value;
    this.asignarTipoPersona();
  }

  asignarTipoPersona() {
    switch (Number(this.Cliente.p_NDOCUMENT_TYP)) {
      case 4:
        this.Cliente.p_NPERSON_TYP = '1';
        break;
      case 2:
        this.Cliente.p_NPERSON_TYP = '1';
        break;
      case 1:
        this.Cliente.p_NPERSON_TYP = this.Cliente.p_SDOCUMENT.substr(0, 2) === '10' ? '1' : '2';
        break;
      default:
        this.Cliente.p_NPERSON_TYP = '1';
        break;
    }
  }

  crearFormularioCertificado() {
    this.certificadoForm = this.formBuilder.group({
      fechavigencia: ['', [Validators.required, validateMinDate]],
      poliza: ['', Validators.required],
      plan: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(1)]]
    });
  }

  initFormularioPaso04() {
    if (this.Certificado.P_NIDPROCESS !== undefined) {
      this.certificadoForm.controls.fechavigencia.setValue(this.Certificado.P_DSTARTDATE);
      this.certificadoForm.controls.poliza.setValue(this.Certificado.P_NPOLICY);
      this.certificadoForm.controls.plan.setValue(this.Certificado.P_NPLAN);
    }
  }

  initFormularioPaso05() {
    if (this.showSeccionEntrega) {
      const certificadoSession = JSON.parse(sessionStorage.getItem('certificado'));
      if (!isNullOrUndefined(certificadoSession)) {
        if (!isNullOrUndefined(certificadoSession.P_DFECHAENTREGADELIVERY)) {
          this.fecha_entrega = certificadoSession.P_DFECHAENTREGADELIVERY;
          this.datosEntregaForm.controls.fechaentrega.setValue(certificadoSession.P_DFECHAENTREGADELIVERY);
          this.datosEntregaForm.controls.turnoentrega.setValue(certificadoSession.P_STURNOENTREGADELIVERY);
          this.datosEntregaForm.controls.direccionentrega.setValue(certificadoSession.P_SDIRECCIONENTREGADELIVERY);
          this.datosEntregaForm.controls.comentario.setValue(certificadoSession.P_SCOMENTARIODELIVERY);
          this.datosEntregaForm.controls.formapago.setValue(certificadoSession.P_SFORMAPAGODELIVERY);
          if (certificadoSession.P_NPROVINCEDELIVERY !== undefined) {
            this.datosEntregaForm.controls.departamentoentrega.setValue(certificadoSession.P_NPROVINCEDELIVERY.toString());
            this.listarProvinciasDelivery(
              certificadoSession.P_NPROVINCEDELIVERY,
              certificadoSession.P_NLOCATDELIVERY,
              certificadoSession.P_NMUNICIPALITYDELIVERY);
          }
        }
      }
    }
  }

  onFechaVigenciaChange(fecha: any) {
    if (fecha !== null || fecha !== undefined) {
      this.certificadoForm.controls.fechavigencia.setValue(fecha);
      this.Certificado.P_DSTARTDATE = fecha;
      this.ValidaFecha(fecha);
    }
    this.recalculateTarifa();
  }

  ValidaFecha(fec: Date) {
    this.validarFechaVigencia(convertDateToStringOracle(fec));
  }

  validarFechaVigencia(fechaVigencia: string) {
    if (!isNullOrUndefined(this.auto.p_SREGIST) && this.auto.p_SREGIST !== '') {
      this.step04service.validarFechaVigencia(this.auto.p_SREGIST.trim().toUpperCase(), fechaVigencia)
        .subscribe(
          res => {
            this.mensajeVigencia = res['mensaje'];
            this.codigoVigencia = res['codigo'];
            if (this.codigoVigencia.trim() === '1') {
              this.truefalsePlan = false;
              this.mensajeVigencia = '';
            } else {
              this.truefalsePlan = true;
            }
          },
          err => {
            console.log(err);
          }
        );
    }
  }

  asignarDatosCertificado() {
    this.Certificado.P_NIDPROCESS = this.auto.V_NIDPROCESS;
    this.Certificado.P_DSTARTDATE = this.certificadoForm.get('fechavigencia').value;
    this.Certificado.P_NPOLICY = this.certificadoForm.get('poliza').value;
    this.Certificado.P_NPLAN = '0';

    if (this.validaCampaign.validaPlacaCampaign === '1' && this.validaCampaign.validaDocumentoCampaign === '1') {
      this.Certificado.P_NIDCAMPAIGN = this.validaCampaign.nidcampaign;
    } else {
      this.Certificado.P_NIDCAMPAIGN = 0;
    }
  }

  getPolizas(pv: string, canal: string, modalidad: string) {
    return this.step04service.getPolizas(pv, canal, modalidad).subscribe(
      res => {
        this.lstPolizasFull = res;
        if (this.lstPolizasFull.length > 0) {

          this.lstPolizasParticular = this.lstPolizasFull.filter(
            x => x.ntippoldes.toLocaleLowerCase().indexOf('particular') > -1);

          this.lstPolizasPublico = this.lstPolizasFull.filter(
            x => x.ntippoldes.toLocaleLowerCase().indexOf('blico') > -1);

          if (this.tCertificado === 3) {
            this.Certificado.P_NPOLICY = this.lstPolizasFull[0].npolesP_COMP;
          } else {
            this.setUsoNumerador();
          }
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  getCertificado(id: string) {
    return this.step04service.getCertificado(id).subscribe(
      res => {
        this.Certificado = res;
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  getDataUserSession() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.Certificado.P_NCODCHANNEL_BO = currentUser && currentUser.canal;
    this.Certificado.P_SDESCHANNEL_BO = currentUser && currentUser.desCanal;
    this.Certificado.P_NCODNUMPOINT_BO = currentUser && currentUser.puntoVenta;
    this.Certificado.P_SDESNUMPOINT_BO = currentUser && currentUser.desPuntoVenta;
    this.Certificado.P_NTYPECHANNEL_BO = currentUser && currentUser.tipoCanal;
    this.Certificado.P_NINTERMED_BROK = currentUser && currentUser.brokerId;
    this.Certificado.P_NINTERMED_INTERM = currentUser && currentUser.intermediaId;
    this.Certificado.P_NINTERMED_SPOINT = null;
  }

  setPoliza(clase: Poliza) {
    this.Certificado.P_NPOLICY = clase.npolesP_COMP;
  }

  setTarifario(idTarifario) {
    const actualtariff = this.lstTarifarios.find(x => x.id === idTarifario);
    if (actualtariff !== undefined) {
      this.Certificado.P_IDTARIFARIO = idTarifario;
      this.Certificado.P_DESCRIPTARIFARIO = actualtariff.descripcion;
      this.Certificado.P_NCOMISSION_BROK = actualtariff.comisionBroker;
      this.Certificado.P_NCOMISSION_INTERM = actualtariff.comisionIntermediario;
      this.Certificado.P_NCOMISSION_SPOINT = actualtariff.comisionPuntoVenta;
      this.Certificado.P_NPREMIUM = actualtariff.precio;
    }
    sessionStorage.setItem('certificado', JSON.stringify(this.Certificado));
    this.cd.detectChanges();
  }

  recalculateTarifa() {
    this.Certificado.P_IDTARIFARIO = undefined;
    this.Certificado.P_DESCRIPTARIFARIO = undefined;
    this.Certificado.P_NCOMISSION_BROK = 0;
    this.Certificado.P_NCOMISSION_INTERM = 0;
    this.Certificado.P_NCOMISSION_SPOINT = 0;
    this.Certificado.P_NPREMIUM = 0;
    this.obtenerTarifa(null);
  }

  validateDataTarifa(data: PrimaFilter) {
    if (isNullOrUndefined(data.ClaseId) || data.ClaseId === '' || data.ClaseId === '0') { return false; }
    if (isNullOrUndefined(data.UsoId) || data.UsoId === '') { return false; }
    if (isNullOrUndefined(data.MarcaId) || data.MarcaId === '') { return false; }
    if (isNullOrUndefined(data.ModeloId) || data.ModeloId === '') { return false; }
    if (isNullOrUndefined(data.CantidadAsientos) || data.CantidadAsientos === '') { return false; }
    if (isNullOrUndefined(data.Departamento) || data.Departamento === '' || data.Departamento === '0') { return false; }
    if (isNullOrUndefined(data.Fecha) || data.Fecha === '') { return false; }
    if (isNullOrUndefined(data.TipoPersona) || data.TipoPersona === '') { return false; }
    return true;
  }

  padLeft(text: string, padChar: string, size: number): string {
    return (String(padChar).repeat(size) + text).substr(size * -1, size);
  }

  obtenerTarifa(idTarifario) {
    this.asignarTipoPersona();
    let mTarifaId = null;
    let cliente = null;
    if (Number(this.validaCampaign.validaPlacaCampaign) === 1 && Number(this.validaCampaign.validaDocumentoCampaign) === 1) {
      mTarifaId = this.validaCampaign.planCampaign;
      cliente = this.validaCampaign.canalClient;
    } else {
      if (this.Cliente.p_NDOCUMENT_TYP && this.Cliente.p_SDOCUMENT) {
        cliente = this.padLeft(this.Cliente.p_NDOCUMENT_TYP.toString(), '0', 2) + this.padLeft(this.Cliente.p_SDOCUMENT, '0', 12);
      }
    }
    this.lstTarifarios = [];
    this.Certificado.P_IDTARIFARIO = '';
    const filter = new PrimaFilter();
    filter.TarifaId = mTarifaId;
    filter.Canal = this.canal;
    filter.Placa = this.placa;
    if (!isNullOrUndefined(this.Certificado.P_DSTARTDATE)) {
      filter.Fecha = this.Certificado.P_DSTARTDATE.toString();
    }
    filter.BrokerId = this.brokerId;
    filter.IntermediaId = this.intermediaId;
    filter.SalesPointId = null;
    filter.PuntoVenta = this.puntoVenta;
    if (this.Cliente.p_NDOCUMENT_TYP) {
      filter.Cliente = cliente;
    }
    if (!isNullOrUndefined(this.Cliente.p_NMUNICIPALITY)) {
      if (this.Cliente.p_NMUNICIPALITY.toString() !== '0') {
        filter.Departamento = this.Cliente.p_NMUNICIPALITY ? this.padLeft(this.Cliente.p_NMUNICIPALITY.toString(), '0', 6) : '';
      }
    }
    filter.Carroceria = '0';
    filter.ClaseId = this.auto.p_NIDCLASE;
    filter.UsoId = this.auto.p_NIDUSO;
    filter.MarcaId = this.auto.p_NVEHBRAND;
    filter.ModeloId = this.auto.p_NVEHMAINMODEL;
    filter.CantidadAsientos = this.auto.p_SEATNUMBER;
    filter.Moneda = 'PEN';
    filter.TipoPersona = this.Cliente.p_NPERSON_TYP;
    filter.CategoriaId = '1';
    filter.TipoPapel = this.tCertificado;
    filter.Plan = '0';
    if (this.validateDataTarifa(filter)) {
      if (idTarifario === null) {
        this.Certificado.P_IDTARIFARIO = '';
        this.Certificado.P_DESCRIPTARIFARIO = '';
        this.Certificado.P_NCOMISSION_BROK = 0;
        this.Certificado.P_NCOMISSION_INTERM = 0;
        this.Certificado.P_NCOMISSION_SPOINT = 0;
        this.Certificado.P_NPREMIUM = 0;
      }
      this.bSpinner = true;
      this.emisionService.obtenerTarifarios(filter).subscribe(
        res => {
          if (res !== null && res !== undefined) {
            this.lstTarifarios = res.filter(x => x.id !== '');
            if (idTarifario !== null && this.lstTarifarios.length > 0) {
              this.setTarifario(idTarifario);
            } else if (this.lstTarifarios.length === 1) {
              this.setTarifario(this.lstTarifarios[0].id);
            }
          } else {
            this.lstTarifarios = [];
          }
          sessionStorage.setItem('certificado', JSON.stringify(this.Certificado));
          this.bSpinner = false;
          this.cd.detectChanges();
        },
        err => {
          this.lstTarifarios = [];
          this.bSpinner = false;
          this.cd.detectChanges();
          console.log(err);
        }
      );
    }
  }

  grabarDatosCertificado() {
    this.asignarDatosCertificado();
    this.Certificado.P_NIDPROCESS = this.auto.V_NIDPROCESS;
    this.Certificado.P_NTIPOPAPEL = this.tCertificado;
    this.Certificado.P_NHAVEDELIVERY = this.showSeccionEntrega ? 1 : 0;
    this.step04service.saveCertificado(this.Certificado).subscribe(
      result => {
        this.codigoFlujo = result.toString();
        sessionStorage.setItem('certificado', JSON.stringify(this.Certificado));
        this.almacenarNavegacion();
        this.bSpinner2 = false;
        this.setNavigationData();
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  setNavigationData() {
    this.visaService.generarSessionToken(this.Certificado.P_NPREMIUM, '').subscribe(
      resvisa => {
        const data = <SessionToken>resvisa;
        sessionStorage.setItem('visasession', JSON.stringify(data));
        this.cd.detectChanges();
        this.router.navigate(['broker/step05']);
      },
      error => {
        console.log(error);
      }
    );
  }

  ValidateFormCertificado() {
    this.certificadoForm.get('fechavigencia').markAsTouched();
    this.certificadoForm.get('poliza').markAsTouched();
    this.certificadoForm.get('plan').markAsTouched();
    this.certificadoForm.get('precio').markAsTouched();
    this.certificadoForm.updateValueAndValidity();
  }

  setUsoNumerador() {
    if (this.tCertificado !== 3) {
      if (Number(this.auto.p_NIDUSO) === 1) {
        this.lstPolizasFilter = this.lstPolizasParticular;
        this.totalSoats = this.lstPolizasParticular.length;
        this.Certificado.P_NPOLICY = this.totalSoats > 0 ? this.lstPolizasParticular[0].npolesP_COMP : '0';
      } else {
        this.lstPolizasFilter = this.lstPolizasPublico;
        this.totalSoats = this.lstPolizasPublico.length;
        this.Certificado.P_NPOLICY = this.totalSoats > 0 ? this.lstPolizasPublico[0].npolesP_COMP : '0';
      }
    }
  }

  openNumerador() {
    if (this.auto.p_NIDUSO !== '') {
      this.setUsoNumerador();
      this.modalPolizas.show();
    }
  }

  searchCertificado(search: string) {
    if (search) {
      if (Number(this.auto.p_NIDUSO) === 1) {
        this.lstPolizasFilter = this.lstPolizasParticular.filter(s => s.npolesP_COMP.toString().indexOf(search.toLowerCase()) >= 0);
      } else {
        this.lstPolizasFilter = this.lstPolizasPublico.filter(s => s.npolesP_COMP.toString().indexOf(search.toLowerCase()) >= 0);
      }

    } else {
      if (Number(this.auto.p_NIDUSO) === 1) {
        this.lstPolizasFilter = this.lstPolizasParticular;
      } else {
        this.lstPolizasFilter = this.lstPolizasPublico;
      }
    }
  }

  guardarIrResumen() {
    this.ValidateFormVehiculo();
    this.ValidateFormContratante();
    this.ValidateFormCertificado();

    this.ValidateFormDelivery();

    if (!this.vehiculoForm.valid || !this.contratanteForm.valid ||
      !this.certificadoForm.valid || !this.datosEntregaForm.valid ||
      this.mensajeVigencia) {
      return;
    } else {
      this.bSpinner2 = true;
      this.cd.detectChanges();
      this.grabarDatosVehiculo();
    }
  }

  almacenarNavegacion() {
    if (this.paginaActual > this.ultimaPaginaNavegada) {
      sessionStorage.setItem('pagina', this.paginaActual.toString());
    }
  }

  nuevoSOAT() {
    this.placa = '';
    this.bLock01 = false;
    this.bLock02 = true;
    this.bLock03 = true;
    this.bLock04 = true;
    this.deshabilitarNuevoSoat = false;
    this.bValidar = false;
    this.mensajeVigencia = '';
    this.bValido = false;
    this.bValidado = false;

    sessionStorage.removeItem('auto');
    sessionStorage.removeItem('contratante');
    sessionStorage.removeItem('certificado');
    this.Certificado = new Certificado();
    this.auto = new Auto();
    this.Cliente = new Cliente();

    this.limpiarSeccionVehiculo();
    this.limpiarSeccionContratante();
    this.limpiarSeccionCertificado();

    this.limpiarSeccionEntrega();
    this.onFechaEntregaChange(this.fecha_entrega);
    this.asignarSeccionCertificadoEntrega();
    this.getDataUserSession();
    this.recalculateTarifa();
  }

  limpiarSeccionVehiculo() {
    this.vehiculoForm.reset();
    this.vehiculoForm.controls.clasecodigo.setValue('0');
    this.vehiculoForm.controls.uso.setValue('1');
    this.vehiculoForm.controls.marcacodigo.setValue('');
    this.vehiculoForm.controls.modelo.setValue('');
    this.vehiculoForm.controls.modeloprincipal.setValue('');
    this.vehiculoForm.controls.serie.setValue('');
    this.vehiculoForm.controls.asientos.setValue('');
    this.vehiculoForm.controls.anho.setValue('');
  }

  limpiarSeccionContratante() {
    this.contratanteForm.reset();
    this.contratanteForm.controls.tipodocumento.setValue(undefined);
    this.contratanteForm.controls.numdocumento.setValue(undefined);
    this.contratanteForm.controls.apepaterno.setValue(undefined);
    this.contratanteForm.controls.apematerno.setValue(undefined);
    this.contratanteForm.controls.nombres.setValue(undefined);
    this.contratanteForm.controls.departamento.setValue(undefined);
    this.contratanteForm.controls.razonsocial.setValue(undefined);
    this.contratanteForm.controls.provincia.setValue(undefined);
    this.contratanteForm.controls.distrito.setValue(undefined);
    this.contratanteForm.controls.direccion.setValue(undefined);
    this.contratanteForm.controls.correo.setValue(undefined);
    this.contratanteForm.controls.celular.setValue(undefined);
    this.getListTipoDocumento();
  }

  limpiarSeccionCertificado() {
    this.certificadoForm.reset();
    this.certificadoForm.controls.fechavigencia.setValue(undefined);
    this.certificadoForm.controls.plan.setValue(undefined);
    this.certificadoForm.controls.precio.setValue(undefined);
    this.Certificado.P_DSTARTDATE = undefined;
    this.fecha_vigencia = new Date;
  }


  limpiarSeccionEntrega() {
    this.datosEntregaForm.reset();
    this.datosEntregaForm.controls.fechaentrega.setValue(undefined);
    this.datosEntregaForm.controls.turnoentrega.setValue(undefined);
    this.datosEntregaForm.controls.direccionentrega.setValue(undefined);
    this.datosEntregaForm.controls.comentario.setValue(undefined);
    this.datosEntregaForm.controls.formapago.setValue(undefined);
    this.datosEntregaForm.controls.departamentoentrega.setValue(undefined);
    this.datosEntregaForm.controls.provinciaentrega.setValue(undefined);
    this.datosEntregaForm.controls.distritoentrega.setValue(undefined);
    this.Certificado.P_DFECHAENTREGADELIVERY = undefined;
    this.fecha_entrega = new Date();
  }

  limpiarSessionStorage() {
    sessionStorage.removeItem('placa');
    sessionStorage.removeItem('auto');
    sessionStorage.removeItem('contratante');
    sessionStorage.removeItem('certificado');
  }

  crearFormularioDatosEntrega() {
    this.datosEntregaForm = this.formBuilder.group({
      fechaentrega: [''],
      turnoentrega: [''],
      direccionentrega: [''],
      comentario: [''],
      formapago: [''],
      departamentoentrega: [''],
      provinciaentrega: [''],
      distritoentrega: [''],
    });

    this.step05service.getCanalTipoPago(this.canal, AppConfig.SETTINGS_SALE).subscribe(
      res => {
        this.showSeccionEntrega = false;
        if (res !== null) {
          this.showSeccionEntrega = res.bdelivery === 1 ? true : false;
        }
        if (this.showSeccionEntrega) {
          this.datosEntregaForm = this.formBuilder.group({
            fechaentrega: ['', [Validators.required, validateMinDate]],
            turnoentrega: ['', Validators.required],
            direccionentrega: ['', Validators.required],
            comentario: [''],
            formapago: ['', Validators.required],
            departamentoentrega: ['', Validators.required],
            provinciaentrega: ['', Validators.required],
            distritoentrega: ['', Validators.required],
          });
          if (this.Certificado.P_NPROVINCEDELIVERY !== undefined) {
            this.datosEntregaForm.controls.departamentoentrega.setValue(this.Certificado.P_NPROVINCEDELIVERY.toString());
            this.listarProvinciasDelivery(
              this.Certificado.P_NPROVINCEDELIVERY,
              this.Certificado.P_NLOCATDELIVERY,
              this.Certificado.P_NMUNICIPALITYDELIVERY);
          }
        }
        this.deliveryService.getDatosDelivery('1').subscribe(
          fp => {
            if (fp !== null) {
              const formasDePago = <FormaDePago[]>fp;
              this.formasDePago = formasDePago.filter(x => x.tipo === '1');
              const turnos = <Turno[]>fp;
              this.turnos = turnos.filter(x => x.tipo === '2');
              this.initFormularioPaso05();
            }
          },
          err => {
            console.log(err);
          }
        );

      },
      err => {
        console.log(err);
      }
    );


  }

  ValidateFormDelivery() {
    this.datosEntregaForm.get('fechaentrega').markAsTouched();
    this.datosEntregaForm.get('turnoentrega').markAsTouched();
    this.datosEntregaForm.get('direccionentrega').markAsTouched();
    this.datosEntregaForm.get('comentario').markAsTouched();
    this.datosEntregaForm.get('formapago').markAsTouched();
    this.datosEntregaForm.get('departamentoentrega').markAsTouched();
    this.datosEntregaForm.get('provinciaentrega').markAsTouched();
    this.datosEntregaForm.get('distritoentrega').markAsTouched();
    this.datosEntregaForm.updateValueAndValidity();

    if (this.showSeccionEntrega) {

      if (this.Certificado.P_NMUNICIPALITYDELIVERY) {
        this.Certificado.P_SMUNICIPALITYDESCRIPTDELIVERY =
          this.distritosDelivery.find(x => Number(x.nmunicipality) === Number(this.Certificado.P_NMUNICIPALITYDELIVERY)).sdescript;
        this.Certificado.P_NLOCATDELIVERYDESCRIPTDELIVERY =
          this.provinciasDelivery.find(x => Number(x.nlocal) === Number(this.Certificado.P_NLOCATDELIVERY)).sdescript;
        this.Certificado.P_NPROVINCEDESCRIPTDELIVERY =
          this.departamentos.find(x => Number(x.nprovince) === Number(this.Certificado.P_NPROVINCEDELIVERY)).sdescript;
      }

      this.Certificado.P_SFORMAPAGODESCRIPTDELIVERY =
        this.formasDePago.find(x => Number(x.id) === Number(this.Certificado.P_SFORMAPAGODELIVERY)).description;
      this.Certificado.P_STURNOENTREGADESCRIPTDELIVERY =
        this.turnos.find(x => Number(x.id) === Number(this.Certificado.P_STURNOENTREGADELIVERY)).description;
    }
    sessionStorage.setItem('certificado', JSON.stringify(this.Certificado));
  }

  onFechaEntregaChange(fecha: any) {
    if (fecha !== null || fecha !== undefined) {
      this.Certificado.P_DFECHAENTREGADELIVERY = fecha;
      this.datosEntregaForm.controls.fechaentrega.setValue(fecha);
    }
  }

  setTurnoEntrega(turno) {
    this.Certificado.P_STURNOENTREGADELIVERY = turno;
  }

  setFormaPago(formapgo) {
    this.Certificado.P_SFORMAPAGODELIVERY = formapgo;
  }

}


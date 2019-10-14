import { ConfirmService } from './../../../../shared/components/confirm/confirm.service';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl, EmailValidator } from '@angular/forms';
import { CertificadoService } from '../../shared/services/certificado.service';
import { ClienteService } from '../../shared/services/cliente.service';
import { EmisionService } from '../../shared/services/emision.service';
import { UbigeoService } from '../../../../shared/services/ubigeo/ubigeo.service';
import { UtilityService } from '../../../../shared/services/general/utility.service';
import { Contratante } from '../../shared/models/contratante.model';
import { TipoDocumento } from '../../shared/models/tipo-documento.model';
import { TipoPersona } from '../../shared/models/tipo-persona.model';
import { Auto } from '../../shared/models/auto.model';
import { Prima, PrimaFilter } from '../../shared/models/prima.model';
import { Certificado } from '../../shared/models/certificado.model';
import { Province } from '../../../../shared/models/province/province';
import { District } from '../../../../shared/models/district/district';
import { Municipality } from '../../../../shared/models/municipality/municipality';
import { Parameter } from '../../../../shared/models/parameter/parameter';
import { AppConfig } from '../../../../app.config';
import { Plan } from '../../../broker/models/plan/plan';
import { PlanFilter } from '../../../broker/models/plan/planfilter';
import { Campaign } from '../../../../shared/models/campaign/campaign';
import { ReferenceChannel } from '../../../../shared/models/referencechannel/referencechannel';
import { debugOutputAstAsTypeScript } from '@angular/compiler';
import { VisaService } from '../../../../shared/services/pago/visa.service';
import { SessionToken } from '../../shared/models/session-token.model';
import { isNullOrUndefined } from 'util';
import { environment } from '../../../../../environments/environment';
import { SessionStorageService } from '../../../../shared/services/storage/storage-service';

@Component({
  selector: 'app-step03',
  templateUrl: './step03.component.html',
  styleUrls: ['./step03.component.css', './step03.component-mobile.css']
})
export class Step03Component implements OnInit {
  @ViewChild('modalDatosPersonales', { static: true }) modalDatosPersonales;
  @ViewChild('modalTarifa', { static: true }) modalTarifa;
  cliente = new Contratante();
  auto = new Auto();
  certificado = new Certificado();
  tarifa = new Prima();
  validaCampaign: Campaign = new Campaign();
  referencechannel: ReferenceChannel = new ReferenceChannel();
  tiposPersona: TipoPersona[] = [];
  tiposDocumento: TipoDocumento[] = [];
  departamentos: Province[] = [];
  provincias: District[] = [];
  distritos: Municipality[] = [];
  vigencia: string;
  plan: string;
  canalVenta: string;
  puntoVenta: string;
  poliza: string;
  modalidad = '3';
  carroceria = '1';
  categoria = '1';

  contratanteForm: FormGroup;

  longitudDocumento = 8;
  bLoading = false;
  bSpinner = false;
  tipoImagen = 0;

  ultimaPaginaNavegada = 0;
  paginaActual = 3;

  bAutocomplete = false;
  planes: Plan[] = [];
  bFlagBoton = false;
  besEmpresa = false;
  tipoDocumento = 0;

  public TIPO_DOCUMENTO_IDENTIDAD = {
    DNI: '2',
    RUC: '1',
    CE: '4'
  };

  constructor(
    private certificadoService: CertificadoService,
    private clienteService: ClienteService,
    private ubigeoService: UbigeoService,
    private emisionService: EmisionService,
    private router: Router,
    private fb: FormBuilder,
    private appConfig: AppConfig,
    private visaService: VisaService,
    private sessionStorageService: SessionStorageService
  ) { }

  ngOnInit() {
    this.initComponent();
  }

  initComponent() {
    sessionStorage.setItem('pagefrom', 'Step03Component');
    window.scroll(0, 0);
    this.validarNavegacion();
    this.crearFormulario();

    const clienteSession = JSON.parse(sessionStorage.getItem('contratante'));

    if (clienteSession !== null) {
      this.cliente = clienteSession;
      if (this.cliente.p_NDOCUMENT_TYP !== undefined) {
        if (Number(this.cliente.p_NDOCUMENT_TYP) === Number(this.TIPO_DOCUMENTO_IDENTIDAD.RUC)) { this.besEmpresa = true; }
        this.longitudDocumento = this.besEmpresa ? 11 : 8;
        if (Number(this.cliente.p_NDOCUMENT_TYP) === Number(this.TIPO_DOCUMENTO_IDENTIDAD.RUC)) { this.longitudDocumento = 11; }
        if (Number(this.cliente.p_NDOCUMENT_TYP) === Number(this.TIPO_DOCUMENTO_IDENTIDAD.DNI)) { this.longitudDocumento = 8; }
        if (Number(this.cliente.p_NDOCUMENT_TYP) === Number(this.TIPO_DOCUMENTO_IDENTIDAD.CE)) { this.longitudDocumento = 12; }
      }
      this.subscribeRazonSocialChanges();
    }

    const autoSession = JSON.parse(sessionStorage.getItem('auto'));
    if (autoSession !== null) {
      this.auto = autoSession;
    }

    const certificadoSession = JSON.parse(sessionStorage.getItem('certificado'));
    if (certificadoSession !== null) {
      this.certificado = certificadoSession;
      this.vigencia = this.certificado.P_DSTARTDATE;
    }

    const validacampaignSession = <Campaign>JSON.parse(sessionStorage.getItem('validaCampaign'));
    if (validacampaignSession !== null) {
      this.validaCampaign = validacampaignSession;
    }

    const referencechannelSession = <ReferenceChannel>JSON.parse(sessionStorage.getItem('referenceChannel'));
    if (referencechannelSession !== null) {
      this.referencechannel = referencechannelSession;
    }
    this.listarTiposDocumento(1);
    this.listarDepartamentos();
    this.obtenerCanalVenta();
    this.initFormulario();
  }

  private validarNavegacion() {
    const sessionUltimaPagina = sessionStorage.getItem('pagina');
    if (sessionUltimaPagina != null) {
      this.ultimaPaginaNavegada = +sessionUltimaPagina;

      if (this.paginaActual - this.ultimaPaginaNavegada > 1) {
        this.volverDatosVehiculo();
      }
    } else {
      this.volverValidarPlaca();
    }
  }

  private crearFormulario() {

    this.contratanteForm = this.fb.group({
      tipodocumento: ['', Validators.required],
      numdocumento: ['', [Validators.required, Validators.maxLength(12)]],
      apepaterno: ['', [Validators.required, Validators.maxLength(50)]],
      apematerno: ['', [Validators.required, Validators.maxLength(50)]],
      nombres: ['', [Validators.required, Validators.maxLength(50)]],
      razonsocial: ['', [Validators.maxLength(50)]],
      departamento: ['', Validators.required],
      provincia: ['', Validators.required],
      distrito: ['', Validators.required],
      direccion: ['', [Validators.required, Validators.maxLength(80)]],
      correo: ['', [Validators.required, Validators.maxLength(100), EmailValidator]],
      celular: ['', [Validators.required, Validators.maxLength(9)]]
    });

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

  private initFormulario() {

    if (!isNullOrUndefined(this.cliente.p_NDOCUMENT_TYP)) {
      this.contratanteForm.controls.tipodocumento.setValue(this.cliente.p_NDOCUMENT_TYP);
    }
    if (!isNullOrUndefined(this.cliente.p_SDOCUMENT)) {
      this.contratanteForm.controls.numdocumento.setValue(this.cliente.p_SDOCUMENT.trim());
    }
    if (!isNullOrUndefined(this.cliente.p_SCLIENT_APPPAT)) {
      this.contratanteForm.controls.apepaterno.setValue(this.cliente.p_SCLIENT_APPPAT);
    }
    if (!isNullOrUndefined(this.cliente.p_SCLIENT_APPMAT)) {
      this.contratanteForm.controls.apematerno.setValue(this.cliente.p_SCLIENT_APPMAT);
    }
    if (!isNullOrUndefined(this.cliente.p_SCLIENT_NAME)) {
      this.contratanteForm.controls.nombres.setValue(this.cliente.p_SCLIENT_NAME);
    }
    if (!isNullOrUndefined(this.cliente.p_SLEGALNAME)) {
      this.contratanteForm.controls.razonsocial.setValue(this.cliente.p_SLEGALNAME);
    }
    if (!isNullOrUndefined(this.cliente.p_NPROVINCE) && this.cliente.p_NPROVINCE !== '0') {
      this.contratanteForm.controls.departamento.setValue(this.cliente.p_NPROVINCE);
      this.listarProvinciasPorDepartamento(this.cliente.p_NPROVINCE);
    }
    if (!isNullOrUndefined(this.cliente.p_NLOCAT) && this.cliente.p_NLOCAT !== '0') {
      this.contratanteForm.controls.provincia.setValue(this.cliente.p_NLOCAT);
    }
    if (!isNullOrUndefined(this.cliente.p_NMUNICIPALITY) && this.cliente.p_NMUNICIPALITY !== '0') {
      this.contratanteForm.controls.distrito.setValue(this.cliente.p_NMUNICIPALITY);
    }
    if (!isNullOrUndefined(this.cliente.p_SADDRESS) && !this.bAutocomplete) {
      this.contratanteForm.controls.direccion.setValue(this.cliente.p_SADDRESS);
    } else {
      this.contratanteForm.controls.direccion.setValue('');
    }
    if (!isNullOrUndefined(this.cliente.p_SMAIL)) {
      this.contratanteForm.controls.correo.setValue(this.cliente.p_SMAIL);
    }
    if (!isNullOrUndefined(this.cliente.p_SPHONE)) {
      this.contratanteForm.controls.celular.setValue(this.cliente.p_SPHONE);
    }
    this.bAutocomplete = false;
  }

  listarTiposDocumento(id) {
    this.tiposDocumento = [];
    this.tiposDocumento.push({
      niddoC_TYPE: '4',
      sdescript: 'CE'
    });
    this.tiposDocumento.push({
      niddoC_TYPE: '2',
      sdescript: 'DNI'
    });
    this.tiposDocumento.push({
      niddoC_TYPE: '1',
      sdescript: 'RUC'
    });
    this.cliente.p_NDOCUMENT_TYP = '2';
    this.contratanteForm.get('tipodocumento').setValue('2');
    this.onChangeTipoDocumento('2');
  }

  listarDepartamentos() {
    const filter = new Province('0', '');
    this.ubigeoService.getPostProvince(filter).subscribe(
      res => {
        this.departamentos = <Province[]>res;
        if (this.cliente.p_NPROVINCE !== undefined) {
          this.listarProvinciasPorDepartamento(this.cliente.p_NPROVINCE);
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  listarProvinciasPorDepartamento(idDepartamento) {
    const filter = new District('0', idDepartamento, '');
    this.ubigeoService.getPostDistrict(filter).subscribe(
      res => {
        this.provincias = <District[]>res;
        if (this.cliente.p_NLOCAT !== undefined) {
          this.listarDistritosPorProvincia(this.cliente.p_NLOCAT);
          if (idDepartamento !== this.cliente.p_NPROVINCE) {
            this.contratanteForm.get('provincia').setValue('');
            this.contratanteForm.get('distrito').setValue('');
          }
        } else {
          this.contratanteForm.get('provincia').setValue('');
          this.contratanteForm.get('distrito').setValue('');
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  listarDistritosPorProvincia(idProvincia) {
    const filter = new Municipality('0', idProvincia, '');
    this.ubigeoService.getPostMunicipality(filter).subscribe(
      res => {
        this.distritos = <Municipality[]>res;

        if (this.cliente.p_NMUNICIPALITY !== undefined) {
          if (idProvincia !== this.cliente.p_NLOCAT) {
            this.contratanteForm.get('distrito').setValue('');
          }
        } else {
          this.contratanteForm.controls.distrito.setValue('');
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  soloNumeros(event: any) {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  soloLetrasYEspacios(event: any) {
    const pattern = /[a-zA-Z\ ]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  onChangeTipoDocumento(id) {
    if (id !== '') {
      this.tipoDocumento = this.cliente.p_NDOCUMENT_TYP = id;
      this.besEmpresa = this.tipoDocumento.toString() === this.TIPO_DOCUMENTO_IDENTIDAD.RUC;
      if (Number(id) === Number(this.TIPO_DOCUMENTO_IDENTIDAD.RUC)) { this.longitudDocumento = 11; }
      if (Number(id) === Number(this.TIPO_DOCUMENTO_IDENTIDAD.DNI)) { this.longitudDocumento = 8; }
      if (Number(id) === Number(this.TIPO_DOCUMENTO_IDENTIDAD.CE)) { this.longitudDocumento = 12; }
      this.subscribeRazonSocialChanges();
    }
    this.contratanteForm.get('numdocumento').setValue('');
  }

  onBlurNumeroDocument() {
    let tipodocumento = this.contratanteForm.get('tipodocumento').value;
    let numdocumento = this.contratanteForm.get('numdocumento').value;
    if (tipodocumento !== undefined && numdocumento.trim() !== undefined) {
      tipodocumento = tipodocumento.toString();
      numdocumento = numdocumento.toString();
      if (tipodocumento.trim() !== '' && numdocumento.trim() !== '') {
        this.validaCampaignDocumento();
        this.aceptarAutocompletado();
      }
    }
  }

  private obtenerCanalVenta() {
    if (!isNullOrUndefined(this.referencechannel.referenteCanal) && this.referencechannel.referenteCanal !== '') {
      this.canalVenta = this.referencechannel.referenteCanal;
      this.puntoVenta = this.referencechannel.referentePuntoVenta;
    } else {
      this.canalVenta = environment.canaldeventadefault;
      this.puntoVenta = environment.puntodeventadefault;
    }
    this.sessionStorageService.setItem('canalVentaCliente', this.canalVenta);
    this.sessionStorageService.setItem('puntoVentaCliente', this.puntoVenta);
    this.obtenerPoliza();
  }

  private obtenerPoliza() {
    const filter = {
      canal: this.canalVenta,
      puntoventa: this.puntoVenta,
      modalidad: this.modalidad
    };
    this.certificadoService.obtenerPoliza(filter).subscribe(
      res => {
        const data = res;
        if (data.length === 1) {
          this.poliza = data[0].npolesP_COMP;
          if (this.referencechannel.referenteOrigenPublicidad === '1') {
            this.referencechannel.referenteStock = this.poliza;
          }
        } else {
          if (this.referencechannel.referenteOrigenPublicidad === '1') {
            this.referencechannel.referenteStock = '';
          }
        }
        sessionStorage.setItem('referenceChannel', JSON.stringify(this.referencechannel));
      },
      err => {
        console.log(err);
      }
    );
  }

  generateSessionToken() {
    console.log(this.tarifa.precio);
    
    this.visaService.generarSessionToken(this.tarifa.precio, '').subscribe(
      resvisa => {
        const data = <SessionToken>resvisa;
        sessionStorage.setItem('visasession', JSON.stringify(data));
        this.registrarCliente();
      },
      error => {
        console.log(error);
      }
    );
  }

  private calcularTarifa() {
    let mTarifaId = null;
    let cliente = null;
    if (Number(this.validaCampaign.validaPlacaCampaign) === 1 && Number(this.validaCampaign.validaDocumentoCampaign) === 1) {
      mTarifaId = this.validaCampaign.planCampaign;
      cliente = this.validaCampaign.canalClient;
    } else {
      if (this.cliente.p_NDOCUMENT_TYP) {
        cliente = this.padLeft(this.cliente.p_NDOCUMENT_TYP.toString(), '0', 2) + this.padLeft(this.cliente.p_SDOCUMENT, '0', 12);
      }
    }

    const filter = new PrimaFilter();
    filter.TarifaId = mTarifaId;
    filter.Canal = this.canalVenta;
    filter.Placa = this.auto.p_SREGIST;
    filter.Fecha = this.vigencia;
    filter.BrokerId = null;
    filter.IntermediaId = null;
    filter.SalesPointId = null;
    filter.PuntoVenta = this.puntoVenta;
    if (this.cliente.p_NDOCUMENT_TYP) {
      filter.Cliente = cliente;
      filter.Departamento = this.cliente.p_NMUNICIPALITY ? this.padLeft(this.cliente.p_NMUNICIPALITY.toString(), '0', 6) : '';
    }
    filter.UsoId = this.auto.p_NIDUSO;
    filter.ClaseId = this.auto.p_NIDCLASE;
    filter.MarcaId = this.auto.p_NVEHBRAND;
    filter.ModeloId = this.auto.p_NVEHMAINMODEL;
    filter.CantidadAsientos = this.auto.p_SEATNUMBER;
    filter.TipoPersona = this.cliente.p_NPERSON_TYP;
    filter.Moneda = 'PEN';
    filter.Carroceria = this.carroceria;
    filter.CategoriaId = this.categoria;
    filter.TipoPapel = 3;
    filter.Plan = '0';
    sessionStorage.setItem('contratante', JSON.stringify(this.cliente));
    this.emisionService.obtenerTarifa(filter).subscribe(
      res => {
        if (res != null) {
          this.tarifa = res;
        } else {
          this.resetTarifario();
          this.tarifa.precio = 0;
        }
        if (this.tarifa.precio === 0) {
          this.modalTarifa.show();
        } else {
          this.generateSessionToken();
        }
        this.bSpinner = false;

      },
      err => {
        this.resetTarifario();
        this.bSpinner = false;
        this.bLoading = false;
        this.tarifa.precio = 0;
        console.log(err);
      }
    );
  }
  resetTarifario() {
    this.tarifa.id = '';
    this.tarifa.descripcion = '';
    this.tarifa.comisionBroker = 0;
    this.tarifa.comisionIntermediario = 0;
    this.tarifa.comisionPuntoVenta = 0;
  }

  padLeft(text: string, padChar: string, size: number): string {
    return (String(padChar).repeat(size) + text).substr(size * -1, size);
  }

  onGuardar() {
    if (this.contratanteForm.invalid) {
      return;
    }
    this.bLoading = true;
    this.bSpinner = true;
    this.asignarDatosCliente();
    this.calcularTarifa();
  }

  asignarDatosCliente() {
    this.cliente.p_NIDPROCESS = this.auto.V_NIDPROCESS;
    this.cliente.p_NDOCUMENT_TYP = this.contratanteForm.get('tipodocumento').value;
    this.cliente.p_SDOCUMENT = this.contratanteForm.get('numdocumento').value;
    this.cliente.p_SCLIENT_APPPAT =
      this.contratanteForm.get('apepaterno').value === undefined ? '' : this.contratanteForm.get('apepaterno').value;
    this.cliente.p_SCLIENT_APPMAT =
      this.contratanteForm.get('apematerno').value === undefined ? '' : this.contratanteForm.get('apematerno').value;
    this.cliente.p_SCLIENT_NAME = this.contratanteForm.get('nombres').value === undefined ? '' : this.contratanteForm.get('nombres').value;
    this.cliente.p_SLEGALNAME =
      this.contratanteForm.get('razonsocial').value === undefined ? '' : this.contratanteForm.get('razonsocial').value;
    this.cliente.p_NPROVINCE = this.contratanteForm.get('departamento').value;
    this.cliente.p_NLOCAT = this.contratanteForm.get('provincia').value;
    this.cliente.p_NMUNICIPALITY = this.contratanteForm.get('distrito').value;
    this.cliente.p_SADDRESS = this.contratanteForm.get('direccion').value;
    this.cliente.p_SMAIL = this.contratanteForm.get('correo').value;
    this.cliente.p_SPHONE = this.contratanteForm.get('celular').value;
    this.asignarTipoPersona();
  }

  asignarTipoPersona() {
    switch (Number(this.cliente.p_NDOCUMENT_TYP)) {
      case 4:
        this.cliente.p_NPERSON_TYP = '1';
        break;
      case 2:
        this.cliente.p_NPERSON_TYP = '1';
        break;
      case 1:
        this.cliente.p_NPERSON_TYP = this.cliente.p_SDOCUMENT.substr(0, 2) === '10' ? '1' : '2';
        break;
      default:
        this.cliente.p_NPERSON_TYP = '1';
        break;
    }
  }

  registrarCertificado() {

    const certificado = new Certificado();
    certificado.P_NIDPROCESS = this.cliente.p_NIDPROCESS;
    certificado.P_NPOLICY = this.poliza;
    certificado.P_DSTARTDATE = this.vigencia;
    certificado.P_NPREMIUM = this.tarifa.precio;
    certificado.P_NCOMMISSION = 0;

    certificado.P_IDTARIFARIO = this.tarifa.id;
    certificado.P_DESCRIPTARIFARIO = this.tarifa.descripcion;
    certificado.P_NCOMISSION_BROK = this.tarifa.comisionBroker;
    certificado.P_NCOMISSION_INTERM = this.tarifa.comisionIntermediario;
    certificado.P_NCOMISSION_SPOINT = this.tarifa.comisionPuntoVenta;
    certificado.P_NTIPOPAPEL = 3;

    certificado.P_NPLAN = 0;
    if (this.validaCampaign.validaPlacaCampaign === '1' && this.validaCampaign.validaDocumentoCampaign === '1') {
      certificado.P_NIDCAMPAIGN = this.validaCampaign.nidcampaign;
    } else {
      certificado.P_NIDCAMPAIGN = 0;
    }

    if (this.referencechannel.referenteOrigenPublicidad === '1') {
      certificado.P_CHANNELEXTERNAL = 1;
      certificado.P_NCODCHANNEL_BO = this.referencechannel.referenteCanal;
      certificado.P_NCODNUMPOINT_BO = this.referencechannel.referentePuntoVenta;
      certificado.P_SDESCHANNEL_BO = this.referencechannel.referenteDesCanal;
      certificado.P_SDESNUMPOINT_BO = this.referencechannel.referenteDesPuntoVenta;
      certificado.P_NTYPECHANNEL_BO = this.referencechannel.referenteTipoCanal;
    } else {
      certificado.P_NCODCHANNEL_BO = this.canalVenta;
      certificado.P_NCODNUMPOINT_BO = this.puntoVenta;
    }

    this.certificadoService.registrarCertificado(certificado).subscribe(
      res => {
        certificado.V_NIDPROCESS = res;
        sessionStorage.setItem('certificado', JSON.stringify(certificado));
        this.appConfig.pixelEvent('virtualEvent', 'SOAT Digital - Cliente - Paso 3', 'Avance satisfactorio', '(not available)');
        this.almacenarNavegacion();
        setTimeout(() => {
          this.irAlResumen();
        }, 500);
      },
      err => {
        console.log(err);
      }
    );
  }

  registrarCliente() {
    this.clienteService.registrar(this.cliente).subscribe(
      res => {
        this.cliente.V_NIDPROCESS = res.toString();
        this.cliente.p_NIDPROCESS = res.toString();
        sessionStorage.setItem('contratante', JSON.stringify(this.cliente));
        this.registrarCertificado();
      },
      err => {
        console.log(err);
      }
    );
  }

  private almacenarNavegacion() {
    if (this.paginaActual > this.ultimaPaginaNavegada) {
      sessionStorage.setItem('pagina', this.paginaActual.toString());
    }
  }

  private volverValidarPlaca() {
    this.router.navigate(['client/placa']);
  }

  private volverDatosVehiculo() {
    this.router.navigate(['client/vehiculo']);
  }

  irAlResumen() {
    this.router.navigate(['client/resumen']);
  }

  setImagen(tipo: number) {
    this.tipoImagen = tipo;
  }

  cerrarModal() {
    this.modalDatosPersonales.hide();
  }

  cerrarModalTarifa() {
    this.modalTarifa.hide();
  }

  validaCampaignDocumento() {
    const tipodocumento = this.contratanteForm.get('tipodocumento').value.toString();
    const numdocumento = this.contratanteForm.get('numdocumento').value.toString();
    if (Number(this.validaCampaign.validaPlacaCampaign) === 1) {
      this.emisionService.validarDocumentoCampaign(this.canalVenta, tipodocumento, numdocumento)
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
          },
          err => {
            console.log(err);
            this.bLoading = false;
            this.bFlagBoton = false;
          }
        );
    }
  }

  aceptarAutocompletado() {

    const tipodocumento = this.contratanteForm.get('tipodocumento').value.toString();
    const numdocumento = this.contratanteForm.get('numdocumento').value.toString();

    if (tipodocumento.trim() !== '' && numdocumento.trim() !== '') {
      this.bLoading = true;
      this.bFlagBoton = true;
      this.emisionService.clientePorDocumento(tipodocumento, numdocumento).subscribe(
        res => {
          this.bLoading = false;
          this.bFlagBoton = false;
          const data = res;
          if (data.length > 0) {
            const persona = <Contratante>data[0];
            this.cliente = persona;
            this.cliente.p_SMAIL = undefined;
            this.cliente.p_SPHONE = undefined;
            this.bAutocomplete = true;
            this.cliente.p_SADDRESS = undefined;
            this.initFormulario();
            this.modalDatosPersonales.show();
          } else {
            this.contratanteForm.controls.apepaterno.setValue(undefined);
            this.contratanteForm.controls.apematerno.setValue(undefined);
            this.contratanteForm.controls.nombres.setValue(undefined);
            this.contratanteForm.controls.razonsocial.setValue(undefined);
            this.contratanteForm.controls.departamento.setValue('');
            this.contratanteForm.controls.provincia.setValue('');
            this.contratanteForm.controls.distrito.setValue('');
            this.contratanteForm.controls.direccion.setValue(undefined);
            this.contratanteForm.controls.correo.setValue(undefined);
            this.contratanteForm.controls.celular.setValue(undefined);
          }
          this.asignarTipoPersona();
        },
        err => {
          console.log(err);
          this.bLoading = false;
          this.bFlagBoton = false;
        }
      );
    }
  }

  setPlanes(canal, tipoModulo) {
    const filter = new PlanFilter();
    filter.poliza = canal;
    filter.tipomodulo = tipoModulo;
    this.emisionService.obtenerPlanes(filter).subscribe(
      res => {
        if (res != null) {
          this.planes = res;
          if (res.length > 0) {
            this.plan = this.planes[0].nmodulec;
          }
        }
      },
      err => {
        console.log(err);
      }
    );
  }

}

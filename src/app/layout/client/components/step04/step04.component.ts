import {
  Component,
  OnInit,
  ViewContainerRef,
  ComponentFactoryResolver,
  OnDestroy,
  ViewChild,
  ChangeDetectorRef
} from '@angular/core';
import { Router } from '@angular/router';
import { Contratante } from '../../shared/models/contratante.model';
import { Auto } from '../../shared/models/auto.model';
import { ButtonVisaComponent } from '../../../../shared/components/button-visa/button-visa.component';
import { AppConfig } from '../../../../app.config';
import { Certificado } from '../../shared/models/certificado.model';
import { VehiculoService } from '../../shared/services/vehiculo.service';
import { ReferenceChannel } from '../../../../shared/models/referencechannel/referencechannel';
import { Campaign } from '../../../../shared/models/campaign/campaign';

@Component({
  selector: 'app-step04',
  templateUrl: './step04.component.html',
  styleUrls: ['./step04.component.css', './step04.component-mobile.css']
})
export class Step04Component implements OnInit, OnDestroy {
  cliente = new Contratante();
  certificado = new Certificado();
  auto = new Auto();
  referencechannel: ReferenceChannel = new ReferenceChannel();
  validaCampaign: Campaign = new Campaign();
  tarifaPlus = 0;
  total = 0;
  bMostrarButtons: boolean;
  mostrarVisa = false;
  mostrarPE = false;
  btnVisa;
  @ViewChild('modalResultadoPE', { static: false }) modalResultado;
  @ViewChild('modalTerminosCondiciones', { static: true }) modalTerminosCondiciones;
  @ViewChild('modalEjemploSoat', { static: true }) modalEjemploSoat;
  frameResult;
  bMostrarLoading = false;
  bPlus = 'false';
  etiquetaPlus = 'Adquirir';
  bInit = true;
  btarifa = true;
  btarifaExterno = true;
  bstockExterno = true;
  bAceptarTerminos = false;
  bDisabled = false;
  ultimaPaginaNavegada = 0;
  paginaActual = 4;
  tpDocumento = '';
  texto1 = '';
  texto2 = '';
  texto3 = '';
  texto4 = '';
  texto5 = '';

  bLoadingCupon = false;
  bMostrarCupon = false;
  bErrorCupon = false;
  cuponCode = '';
  cuponPlaceholder = 'Ingrese cupÃ³n';
  mensajeErrorCupon = '';
  carroceria = '1';
  categoria = '1';
  besEmpresa: boolean;

  public TIPO_DOCUMENTO_IDENTIDAD = {
    DNI: '2',
    RUC: '1',
    CE: '4'
  };
  bVisaCreated = false;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private factoryResolver: ComponentFactoryResolver,
    private vehiculoService: VehiculoService,
    private router: Router,
    private appConfig: AppConfig,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.initComponent();
    const sFrom = sessionStorage.getItem('pagefrom');
    if (sFrom === null || sFrom === 'Step03Component') {
      sessionStorage.setItem('pagefrom', 'Step04Component');
      window.location.reload();
    } else if (sFrom === 'LastStepComponent') {
      this.limpiarSessionStorage();
      history.go(+1);
      this.router.navigate(['client/placa'], { replaceUrl: true });
      return;
    }
    this.appConfig.pixelEventDetail('66', this.certificado.P_NPREMIUM.toString(), this.auto.p_SNAMECLASE);
  }

  ngOnDestroy() {
    sessionStorage.removeItem('pagoVisaCliente');
    if (this.btnVisa) {
      this.btnVisa.destroy();
    }

    if (this.frameResult) {
      this.frameResult.destroy();
    }
  }

  initComponent() {
    window.scroll(0, 0);
    this.validarNavegacion();
    this.obtenerDatosCliente();
    this.obtenerDatosAuto();
    this.obtenerDatosCertificado();
    this.obtenerDatosReferenceChannel();
    this.obtenerDatosCampaign();

    this.bMostrarButtons = false;
    this.aceptarTerminos();

    if (this.certificado != null) {

      if (this.certificado.P_NPREMIUM === 0) {
        this.bDisabled = true;
        this.btarifa = true;
        this.bAceptarTerminos = false;
        this.bMostrarButtons = false;

        if (this.referencechannel.referenteOrigenPublicidad === '1') {
          this.btarifaExterno = false;
          this.bDisabled = true;
        }
      } else {
        this.bDisabled = false;
        this.btarifa = false;
      }
    }

    this.obtenerTarifaPlus();
    this.crearBotonVisa();
    this.crearBotonPagoEfectivo();

    if (Number(this.referencechannel.referenteOrigenPublicidad) === 1 &&
      Number(this.referencechannel.referenteAplicaCupon) === 1 &&
      (Number(this.validaCampaign.validaPlacaCampaign) === 0 || Number(this.validaCampaign.validaDocumentoCampaign) === 0)) {
      this.cuponPlaceholder = this.referencechannel.referentePlaceholder;
      this.bMostrarCupon = true;

      if (this.referencechannel.referenteStock == null || this.referencechannel.referenteStock === '') {
        this.bstockExterno = false;
        this.bDisabled = true;
        this.bAceptarTerminos = false;
      }
    }
  }

  private validarNavegacion() {
    const sessionUltimaPagina = sessionStorage.getItem('pagina');
    if (sessionUltimaPagina != null) {
      this.ultimaPaginaNavegada = +sessionUltimaPagina;

      if (this.paginaActual - this.ultimaPaginaNavegada > 1) {
        this.volverDatosContratante();
      }
    } else {
      this.volverValidarPlaca();
    }
  }

  obtenerDatosAuto() {
    const autoSession = JSON.parse(sessionStorage.getItem('auto'));
    if (autoSession != null) {
      this.auto = autoSession;
    }
  }

  obtenerDatosCliente() {
    const clienteSession = JSON.parse(sessionStorage.getItem('contratante'));
    if (clienteSession != null) {
      this.cliente = clienteSession;
      if (this.cliente.p_NPERSON_TYP !== undefined) {
        if (Number(this.cliente.p_NDOCUMENT_TYP) === Number(this.TIPO_DOCUMENTO_IDENTIDAD.RUC)) { this.besEmpresa = true; }
      }
      if (Number(this.cliente.p_NDOCUMENT_TYP) === Number(this.TIPO_DOCUMENTO_IDENTIDAD.RUC)) { this.tpDocumento = 'RUC'; }
      if (Number(this.cliente.p_NDOCUMENT_TYP) === Number(this.TIPO_DOCUMENTO_IDENTIDAD.DNI)) { this.tpDocumento = 'DNI'; }
      if (Number(this.cliente.p_NDOCUMENT_TYP) === Number(this.TIPO_DOCUMENTO_IDENTIDAD.CE)) { this.tpDocumento = 'CE'; }
    }
  }

  obtenerDatosCertificado() {
    const certificadoSession = JSON.parse(sessionStorage.getItem('certificado'));
    if (certificadoSession != null) {
      this.certificado = certificadoSession;
    }
  }

  obtenerDatosReferenceChannel() {
    const referencechannelSession = <ReferenceChannel>JSON.parse(sessionStorage.getItem('referenceChannel'));
    if (referencechannelSession !== null) {
      this.referencechannel = referencechannelSession;
    }
  }

  obtenerDatosCampaign() {
    const validacampaignSession = <Campaign>JSON.parse(sessionStorage.getItem('validaCampaign'));
    if (validacampaignSession !== null) {
      this.validaCampaign = validacampaignSession;
    }
  }

  obtenerTarifaPlus() {
    this.tarifaPlus = 0;
    this.calcularTotal();
  }

  crearBotonVisa() {
    const visasession = JSON.parse(sessionStorage.getItem('visasession'));
    sessionStorage.setItem('sessionToken', visasession.sessionToken);
    const factory = this.factoryResolver.resolveComponentFactory(
      ButtonVisaComponent
    );
    this.btnVisa = factory.create(this.viewContainerRef.parentInjector);
    this.btnVisa.instance.action = AppConfig.ACTION_FORM_VISA_CLIENT;
    this.btnVisa.instance.amount = this.total;
    this.btnVisa.instance.sessionToken = visasession.sessionToken;
    this.btnVisa.instance.purchaseNumber = visasession.purchaseNumber;
    this.btnVisa.instance.merchantLogo = AppConfig.MERCHANT_LOGO_VISA;
    this.btnVisa.instance.userId = '';
    // Agregar el componente al componente contenedor
    this.viewContainerRef.insert(this.btnVisa.hostView);
    this.bVisaCreated = true;
    this.ref.detectChanges();
    this.bVisaCreated = true;
    this.appConfig.AddEventAnalityc();
  }

  crearBotonPagoEfectivo() {
    this.mostrarPE = true;
  }

  onPagar(tipoPago) {
    window.scroll(0, 0);
    if (tipoPago === 2) {
      this.router.navigate(['client/resultadope']);
    }
  }

  calcularTotal() {
    if (this.bInit) {
      const bPlusSession = sessionStorage.getItem('plus');

      if (bPlusSession !== null) {
        this.bPlus = bPlusSession;
      }

      if (this.bPlus === 'true') {
        this.total = this.sumar(+this.certificado.P_NPREMIUM, this.tarifaPlus);
        this.etiquetaPlus = 'Quitar';
      } else {
        this.total = this.certificado.P_NPREMIUM;
        this.etiquetaPlus = 'Adquirir';
      }
      this.bInit = false;
    } else {
      if (this.bPlus === 'true') {
        this.bPlus = 'false';
        this.total = this.certificado.P_NPREMIUM;
        this.etiquetaPlus = 'Adquirir';
      } else {
        this.bPlus = 'true';
        this.total = this.sumar(+this.certificado.P_NPREMIUM, this.tarifaPlus);
        this.etiquetaPlus = 'Quitar';
      }
      sessionStorage.setItem('plus', this.bPlus.toString());
    }
    if (this.total === 0) {
      this.bDisabled = true;
      this.btarifa = true;
    } else {
      this.bDisabled = false;
      this.btarifa = false;
    }
  }

  sumar(a: number, b: number) {
    return a + b;
  }

  verEjemploSOAT() {
    this.modalEjemploSoat.show();
  }

  openModalTerminos(event: any) {
    if (!this.bDisabled) {
      if (this.bAceptarTerminos === false) {
        event.preventDefault();
        this.modalTerminosCondiciones.show();
      } else {
        this.bAceptarTerminos = false;
        this.bDisabled = false;
        this.bMostrarButtons = false;
      }
    }
  }

  closeModalTerminos() {
    this.modalTerminosCondiciones.hide();
  }

  aceptarTerminos() {
    this.bAceptarTerminos = true;
    this.modalTerminosCondiciones.hide();
    this.bMostrarButtons = true;
  }

  volverValidarPlaca() {
    this.router.navigate(['client/placa']);
  }

  volverDatosContratante() {
    this.router.navigate(['client/contratante']);
  }

  aplicarCupon() {
    if (this.cuponCode == null || this.cuponCode.length === 0) {
      this.mensajeErrorCupon = this.cuponCode.length > 0 ? 'Ingrese código de descuento' : 'Ingrese código de descuento';
      this.bErrorCupon = true;
      return;
    }

    this.bErrorCupon = false;
    this.bLoadingCupon = true;

    const filter = JSON.parse('{}');
    filter.CantidadAsientos = this.auto.p_SEATNUMBER;
    filter.Carroceria = this.carroceria;
    filter.CategoriaId = this.categoria;
    filter.ClaseId = this.auto.p_NIDCLASE;
    filter.Departamento = this.cliente.p_NPROVINCE;
    filter.Fecha = this.certificado.P_DSTARTDATE;
    filter.MarcaId = this.auto.p_NVEHBRAND;
    filter.ModeloId = this.auto.p_NVEHMAINMODEL;
    filter.Plan = this.certificado.P_NPLAN;
    filter.TipoPersona = this.cliente.p_NPERSON_TYP;
    filter.UsoId = this.auto.p_NIDUSO;
    filter.Code = this.referencechannel.referenteCode;
    filter.puntoVenta = this.referencechannel.referentePuntoVenta;
    filter.Coupon = this.cuponCode;
    filter.IdProcess = this.auto.p_NIDPROCESS;
    filter.Documento = this.cliente.p_SDOCUMENT;
    filter.TipoDocumento = this.cliente.p_NDOCUMENT_TYP;

    this.vehiculoService.aplicarCupon(filter).subscribe(res => {
      this.bErrorCupon = !res.reload;
      if (res.stock === false) {
        this.mensajeErrorCupon = 'El cupón ya fue utilizado la cantidad de veces permitida.';
        this.bErrorCupon = true;
        this.bAceptarTerminos = false;
        this.bMostrarButtons = false;
        return;
      }
      if (res.exito === false) {
        this.mensajeErrorCupon = 'No se encontraron datos del cupon.';
        this.bErrorCupon = true;
        this.bAceptarTerminos = false;
        this.bMostrarButtons = false;
        return;
      }
      if (res.amount === 0) {
        this.mensajeErrorCupon = 'No cuenta con una tarifa configurada.';
        this.bErrorCupon = true;
        this.bAceptarTerminos = false;
        this.bMostrarButtons = false;
        return;
      }
      if (res.reload) {
        const sCertificado = JSON.parse(sessionStorage.getItem('certificado'));
        sCertificado.P_NCOMMISSION = res.commission;
        sCertificado.P_NPREMIUM = res.amount;
        sCertificado.P_NPLAN = res.plan;

        sessionStorage.setItem('certificado', JSON.stringify(sCertificado));
        window.location.reload();

        /* this.certificadoService.registrarCertificado(sCertificado).subscribe(
          resc => {
            sCertificado.V_NIDPROCESS = resc;
            sessionStorage.setItem('certificado', JSON.stringify(sCertificado));
            window.location.reload();
          },
          err => {
            console.log(err);
          }
        ); */
      }
    }, error => {
      console.log(error);
      this.bErrorCupon = true;
    }, () => {
      this.bLoadingCupon = false;
    });
  }

  leerArchivo() {
    this.vehiculoService.LeerArchivo().subscribe(data => {
      this.texto1 = data.texto1;
      this.texto2 = data.texto2;
      this.texto3 = data.texto3;
      this.texto4 = data.texto4;
      this.texto5 = data.texto5;
    });
  }


  limpiarSessionStorage() {
    sessionStorage.removeItem('placa');
    sessionStorage.removeItem('auto');
    sessionStorage.removeItem('contratante');
    sessionStorage.removeItem('certificado');
  }
}

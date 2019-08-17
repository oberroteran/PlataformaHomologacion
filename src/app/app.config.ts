import { environment } from './../environments/environment.prod';
export class AppConfig {
    public readonly apiUrl = environment.backendapi;

    public static get ACTION_FORM_VISA_CLIENT(): string {
        return environment.backendapi + '/pago/formresponse/1';
    }

    public static get ACTION_FORM_VISA_BROKER(): string {
        return environment.backendapi + '/pago/formresponse/2';
    }

    public static get ACTION_FORM_VISA_PAYROLL(): string {
        return environment.backendapi + '/pago/formresponse/3';
    }

    public static get ACTION_FORM_VISA_PREPAYROLL(): string {
        return environment.backendapi + '/pago/formresponse/4';
    }

    public static get MERCHANT_LOGO_VISA(): string {
        return (
            environment.domainurl + '/assets/logos/logo_protecta_security_cajon.png'
        );
    }

    public static get MERCHANT_NAME_VISA(): string {
        return 'Protecta Security';
    }

    public static get CAPTCHA_KEY(): string {
        return '6Lc4sn8UAAAAAD1V604HezdXnlLTz2n4-dhKLjpm';
    }

    public static get ITEMS_POR_PAGINA(): number {
        return 5;
    }

    //#region Estados de la Planilla
    public static get PAYROLL_STATUS_PENDING(): number {
        return 1;
    }
    public static get PAYROLL_STATUS_PAID(): number {
        return 2;
    }
    //#endregion

    //#region Estados de la Pre planilla
    public static get PREPAYROLL_STATUS_PENDING(): number {
        return 1;
    }
    public static get PREPAYROLL_STATUS_PAID(): number {
        return 2;
    }
    //#endregion

    //#region Estados de detalled de Pago
    public static get PAYMENT_DETAIL_STATUS_PENDING(): string {
        return '1';
    }
    public static get PAYMENT_DETAIL_STATUS_PAID(): string {
        return '2';
    }
    //#endregion

    public static get URL_API(): string {
        return environment.backendapi;
    }
    public static get URL_API_SCTR(): string {
        return environment.kunturapi;
    }
    public static get URL_API_GESTOR(): string {
        return environment.gestorapi;
    }
    public static get FLUJO_CLIENTE(): string {
        return '1';
    }
    public static get FLUJO_BROKER(): string {
        return '2';
    }
    public static get FLUJO_PLANILLA(): string {
        return '3';
    }
    public static get FLUJO_PREPLANILLA(): string {
        return '4';
    }

    //#region Configuración Tipo de Pago
    public static get SETTINGS_SALE(): string {
        return '2';
    }
    public static get SETTINGS_PAYROLL(): string {
        return '3';
    }
    //#endregion

    public registerPageSecond(Page: string) {
        localStorage.setItem('PageSecond', Page);
    }

    public registerPageInitial(Page: string) {
        localStorage.setItem('PageInitial', Page);
    }

    public static get PATH_PDF_FILES(): string {
        return environment.domainurl + '/assets/files';
    }

    public static get TIPO_PERSONA_FLUJO_CLIENTE(): number {
        return 1;
    }

    public pixelEvent(
        event: string,
        category: string,
        action: string,
        label: string
    ) {
        const oBody = document.getElementsByTagName('body')[0];
        const oScript = document.createElement('script');
        oScript.setAttribute('type', 'text/javascript');
        oScript.innerHTML = `
    (function () {
      dataLayer.push({'event':'${event}','category' : '${category}' , 'action':'${action}', 'label': '${label}'});
      // window.console.log('pixelEvent :  ${label}: ', new Date().toLocaleString());
    })();    `;
        oBody.appendChild(oScript);
    }

    public pixelEventDetail(
        productID: string,
        productoPrecio: string,
        clase_vehiculo: string
    ) {
        const oBody = document.getElementsByTagName('body')[0];
        const oScript = document.createElement('script');
        oScript.setAttribute('type', 'text/javascript');
        oScript.innerHTML = `
    (function () {
      dataLayer.push({'event':'productDetails'
                  ,'dimension2' : 'Flujo Cliente'
                  , 'ecommerce': {
                    'currencyCode': 'PEN',
                    'detail':{
                      'actionField': {'list': 'SOAT Digital'},
                      'products': [{
                        'name': 'SOAT Digital',
                        'id': '${productID}',
                        'price': '${productoPrecio}',
                        'brand': 'Protecta',
                        'category': 'Seguros Vehiculares',
                        'variant': '${clase_vehiculo}'
                        }]
                    }
                  }
                    });
      // window.console.log('pixelEvent : ${productID}: ', new Date().toLocaleString());
    })();    `;

        oBody.appendChild(oScript);
    }

    public pixelPagoExitoso(
        transactionID: string,
        precioVenta: string,
        productID: string,
        productoPrecio: string,
        clase_vehiculo: string
    ) {
        const oBody = document.getElementsByTagName('body')[0];
        const oScript = document.createElement('script');
        oScript.setAttribute('type', 'text/javascript');
        oScript.innerHTML = `
    (function () {
      dataLayer.push({
        'event':'orderPurchase',
        'dimension1':'Visanet',
         'dimension2':'Flujo Cliente',
        'ecommerce': {
         'currencyCode': 'PEN',
        'purchase': {
        'actionField': {
                'id': '${transactionID}',
                'affiliation': 'Standard',
                'revenue': '${precioVenta}',
                'tax':'0.00',
                'shipping': '0.00',
                'coupon': ''
                },
        'products': [{
        'name': 'SOAT Digital',
        'id': '${productID}',
        'price': '${productoPrecio}',
        'brand': 'Protecta',
        'category': 'Seguros Vehiculares',
        'variant': '${clase_vehiculo}',
        'quantity': 1,
        'coupon': ''
        }
        ]
      }
    }});

      // window.console.log('pixelEvent :${transactionID}', new Date().toLocaleString());
    })();    `;

        oBody.appendChild(oScript);
    }

    public pixelSaveClientID() {
        const oBody = document.getElementsByTagName('body')[0];
        const oScript = document.createElement('script');
        oScript.setAttribute('type', 'text/javascript');
        oScript.innerHTML = `
    (function () {
       var dato = getClientID();
       sessionStorage.setItem("idClientTrack", dato);
      window.console.log('ClienteId :'+ dato , new Date().toLocaleString());
    })();    `;

        oBody.appendChild(oScript);
    }

    public AddEventAnalityc() {
        const oBody = document.getElementsByTagName('body')[0];
        const oScript = document.createElement('script');
        oScript.setAttribute('type', 'text/javascript');

        oScript.innerHTML = `
    (function () {
      var myFunction2 = function() {
        dataLayer.push({'event':'virtualEvent','category' : 'SOAT Digital - Cliente - Pago' , 'action':'Pago Visa', 'label': 'Ver Pop up'});
    };

    var myVar = setInterval(myTimer, 1000);

    function myTimer() {
      window.console.log('MyTimer:' , new Date().toLocaleString());
      var btnPay = document.getElementsByClassName("start-js-btn modal-opener medium");
        if(btnPay != undefined)
          {  for (var i = 0; i < btnPay.length; i++) {
              btnPay[i].addEventListener('click', myFunction2, false);
            }
            myStopFunction();
          }
    }

    function myStopFunction() {
      clearInterval(myVar);
    }

    })();    `;

        oBody.appendChild(oScript);
    }
}

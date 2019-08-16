import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-pixel-google-tag-manager',
  templateUrl: './pixel-google-tag-manager.component.html',
  styleUrls: ['./pixel-google-tag-manager.component.css']
})
export class PixelGoogleTagManagerComponent implements OnInit, OnDestroy, AfterViewInit {

  constructor() { }

  ngOnInit() { }

  ngOnDestroy() { }

  ngAfterViewInit() {

    const oHead = document.getElementsByTagName('head')[0];
    const oBody = document.getElementsByTagName('body')[0];
    const oScriptH = document.createElement('script');
    const oScriptB = document.createElement('script');

    oScriptH.setAttribute('type', 'text/javascript');
    oScriptH.innerHTML =
      `(function(w,d,s,l,i){
        // console.log('PIXEL GOOGLE TAG MANAGER', new Date().toLocaleString());
        w[l]=w[l] || [];
        w[l].push({'gtm.start':new Date().getTime(), event:'gtm.js'});
        var
          f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),
          dl=l!='dataLayer'?'&l='+l:'';
          j.async=true;
          j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
          f.parentNode.insertBefore(j,f);
      })(window, document, 'script', 'dataLayer', 'GTM-WS93T5W');`;
    oHead.appendChild(oScriptH);
    const oNoscript = document.createElement('noscript');
    const oIframe = document.createElement('iframe');
    oIframe.setAttribute('src', 'https://www.googletagmanager.com/ns.html?id=GTM-WS93T5W');
    oIframe.setAttribute('height', '0');
    oIframe.setAttribute('width', '0');
    oIframe.setAttribute('style', 'display:none;visibility:hidden;');
    oScriptB.setAttribute('type', 'text/javascript');
    oNoscript.appendChild(oIframe);
    const oFirst = oBody.firstElementChild;
    if (oFirst == null) {
      oBody.appendChild(oNoscript);
    } else {
      oBody.insertBefore(oNoscript, oFirst);
    }
  }
}

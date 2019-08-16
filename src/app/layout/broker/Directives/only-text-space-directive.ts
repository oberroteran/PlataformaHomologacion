import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: 'input[OnlyTextSpaceDirective]'
})
export class OnlyTextSpaceDirective {

  constructor(private _el: ElementRef) { }
  /**
   * Valida sólo letras, espacios, tíldes, dieresis y apóstrofes
   */
  @HostListener('input', ['$event']) onInputChange(event) {
    const initalValue = this._el.nativeElement.value;
    // this._el.nativeElement.value = initalValue.replace(/[^A-Za-z\u00C0-\u024F\' ]/g, '');
    this._el.nativeElement.value = initalValue.replace(/[^A-Za-zÁÉÍÓÚáéíóúÄËÏÖÜäëïöü\' ]/g, '');
    if (initalValue !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
  }

}
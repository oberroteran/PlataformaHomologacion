import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: 'input[OnlyNumberDirective]'
})
export class OnlyNumberDirective {

  constructor(private _el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event) {
    const initalValue = this._el.nativeElement.value;
    // this._el.nativeElement.value = initalValue.replace(/[^0-9]*/g, '');
    this._el.nativeElement.value = initalValue.replace(/[^0-9]/, '');
    if (initalValue !== this._el.nativeElement.value) {
      event.stopPropagation();
      //event.preventDefault();
    }
  }
  // @HostListener('input', ['$event']) onkeypress(event) {
  //   const inputChar = String.fromCharCode(event.charCode);
  //   if (!/[0-9]/.test(inputChar)) {
  //     console.log('asdsad')
  //     event.preventDefault();
  //   }
  // }

}
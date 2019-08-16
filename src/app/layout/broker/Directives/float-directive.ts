import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: 'input[FloatDirective]'
})
export class FloatDirective {

  constructor(private _el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event) {
    const initalValue = this._el.nativeElement.value;

    if (initalValue.toString().trim().length == 1 && initalValue.toString().trim() == ".") this._el.nativeElement.value = 0;
    else if (initalValue.toString().indexOf(".") !== -1) {
      let count=0;
      for (var i = 0; i < initalValue.toString().trim().length; i++) {
        if(initalValue.toString().trim().charAt(i)==".") count++
      }
      if(count>1) this._el.nativeElement.value = initalValue.toString().trim().substring(0, initalValue.toString().lastIndexOf("."));
      
    } 
    this._el.nativeElement.value = this._el.nativeElement.value.replace(/[^0-9.]*/g, '');
    if (initalValue !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
  }

}
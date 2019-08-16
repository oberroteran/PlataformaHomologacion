import { Directive, EventEmitter, HostListener, Output } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    selector: 'input[uppercase]'
})
export class UppercaseDirective {

    @Output() ngModelChange: EventEmitter<any> = new EventEmitter();
    value: any;
    /**
     * Valida sólo letras, espacios, tíldes, dieresis y apóstrofes
     */
    @HostListener('input', ['$event']) onInputChange(event) {
        this.value = event.target.value.toUpperCase();
        this.ngModelChange.emit(this.value);
    }

}
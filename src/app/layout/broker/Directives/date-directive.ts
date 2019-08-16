import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: 'input[DateDirective]'
})
export class DateDirective {

  regexStr = '^[0-9-./]*$';
  //regexStr = '^[a-zA-Z ]*$';
    //@Input() isAlphaNumeric: boolean;

    @HostListener('keypress', ['$event']) onKeyPress(event) {
        //console.log('reached');
        return new RegExp(this.regexStr).test(event.key);
    }

}
import {Directive, ElementRef} from '@angular/core';
import { User } from '../providers/user';

@Directive({
  selector: '[has-role]'
})

export class HasRole {

  constructor(private el: ElementRef, public user: User) {
    //alert(el)
  }

}

import { Directive, ElementRef, Input } from '@angular/core';
import { User } from '../providers/user';
import { User as FirebaseUser } from 'firebase/app';

@Directive({
  selector: '[logged-in]'
})

export class LoggedIn {

  @Input('logged-in') loggedIn: string;

  constructor(private el: ElementRef, public user: User) {
    user.userChanged().subscribe(() => {
      var toggleDisplay = (based: boolean) => {
        if (based) {
          el.nativeElement.style.display = "inline";
        } else {
          el.nativeElement.style.display = "none";
        }
      };

      if( this.loggedIn == "true" ) {
        toggleDisplay(!!user.getUser());
      } else if( this.loggedIn == "false" ) {
        toggleDisplay(!user.getUser());
      }
    })
  }

}

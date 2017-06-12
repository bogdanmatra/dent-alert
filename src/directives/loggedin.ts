import {Directive, ElementRef, Input} from '@angular/core';
import {User} from '../providers/user';

@Directive({
  selector: '[logged-in]'
})

export class LoggedIn {

  @Input('logged-in') loggedIn: string;

  constructor(private el: ElementRef, public user: User) {
    this.el = el;


    user.getUser().subscribe((firebaseUser) => {
      if (firebaseUser) {
        user.getUserDetails(firebaseUser.uid).subscribe((response) => {
          this.resetDisplay(this.loggedIn.indexOf(response.role) > -1);
        });
      } else {
        this.resetDisplay(this.loggedIn == "false");
      }
    })

  }

  resetDisplay(condition: boolean) {
    if (this.loggedIn) {
      this.el.nativeElement.style.display = "none";
      if (condition) {
        this.el.nativeElement.style.display = "inline";
      }
    }
  }

}

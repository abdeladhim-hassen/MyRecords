import { Component } from '@angular/core';
import { ModalService } from '../services/modal.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
constructor(
             public Model: ModalService,
             public auth: AuthService,
            ) {}
OppenModel($event: Event){
  $event.preventDefault()
  this.Model.ToggleModal("auth")
}
}

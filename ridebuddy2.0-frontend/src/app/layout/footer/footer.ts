import { Component } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {faFacebook, faInstagram, faTwitter} from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-footer',
  imports: [FaIconComponent],
  templateUrl: './footer.html',
})
export class Footer {
  currentYear = new Date().getFullYear();
  protected readonly faInstagram = faInstagram;
  protected readonly faTwitter = faTwitter;
  protected readonly faFacebook = faFacebook;
}

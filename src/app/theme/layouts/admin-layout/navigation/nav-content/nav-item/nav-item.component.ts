// Angular import
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// Project import
import { NavigationItem } from '../../navigation';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { faHandshake,
   faCoffee,faKey, faCube, faWallet, faMoneyBill
 } from '@fortawesome/free-solid-svg-icons'; // Import FontAwesome icons

@Component({
  selector: 'app-nav-item',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule, FontAwesomeModule],
  templateUrl: './nav-item.component.html',
  styleUrls: ['./nav-item.component.scss']
})
export class NavItemComponent {
  public faHandshake = faHandshake;
  public faCoffee = faCoffee;
  public faKey = faKey;
  public faCube = faCube;
  public faWallet = faWallet;
  public faMoneyBill = faMoneyBill;
  // public props
  @Input() item!: any;

  // public method
  closeOtherMenu(event: MouseEvent) {
    const ele = event.target as HTMLElement;
    if (ele !== null && ele !== undefined) {
      const parent = ele.parentElement as HTMLElement;
      const up_parent = ((parent.parentElement as HTMLElement).parentElement as HTMLElement).parentElement as HTMLElement;
      const last_parent = up_parent.parentElement;
      const sections = document.querySelectorAll('.coded-hasmenu');
      for (let i = 0; i < sections.length; i++) {
        sections[i].classList.remove('active');
        sections[i].classList.remove('coded-trigger');
      }

      if (parent.classList.contains('coded-hasmenu')) {
        parent.classList.add('coded-trigger');
        parent.classList.add('active');
      } else if (up_parent.classList.contains('coded-hasmenu')) {
        up_parent.classList.add('coded-trigger');
        up_parent.classList.add('active');
      } else if (last_parent?.classList.contains('coded-hasmenu')) {
        last_parent.classList.add('coded-trigger');
        last_parent.classList.add('active');
      }
    }
    if ((document.querySelector('app-navigation.pc-sidebar') as HTMLDivElement).classList.contains('mob-open')) {
      (document.querySelector('app-navigation.pc-sidebar') as HTMLDivElement).classList.remove('mob-open');
    }
  }
}

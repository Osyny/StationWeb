import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '../../shared/app-component-base';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent extends AppComponentBase implements OnInit {
  menuBtnActive = false;
  isImpersonatedLogin = false;
  shownLoginNameTitle?: string;

  constructor(injector: Injector) {
    super(injector);
  }
  ngOnInit() {
    // this.shownLoginNameTitle = this.isImpersonatedLogin ? this.l('YouCanBackToYourAccount') : '';
  }

  openMenu() {
    this.menuBtnActive = !this.menuBtnActive;
    const sidebar = document.querySelector('.sidebar');
    sidebar?.classList.toggle('sidebarclose');
  }
}

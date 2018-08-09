import { Component } from '@angular/core';

import { MENU_ITEMS } from './pages-menu';
import 'style-loader!angular2-toaster/toaster.css';
@Component({
  selector: 'ngx-pages',
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent {

  menu = MENU_ITEMS;
}

import {
  ChangeDetectorRef,
  Component,
  Injector,
  Input,
  OnInit,
  SimpleChanges,
} from '@angular/core';

import { Router, RouterLink } from '@angular/router';

import { AppComponentBase } from '../../shared/app-component-base';
import { MenuItem } from 'primeng/api/public_api';

@Component({
  selector: 'sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss'],
})
export class SidebarMenuComponent extends AppComponentBase implements OnInit {
  @Input() showed: boolean = false;
  isOpen: boolean = false;
  itemsClose: MenuItem[] = [];
  itemsOpen: MenuItem[] = [];
  items: MenuItem[] = [];
  activeItem?: MenuItem;

  homeRoute = '/admin';

  constructor(
    injector: Injector,
    private router: Router,
    private changeDetection: ChangeDetectorRef
  ) {
    super(injector);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['showed']) {
      this.items = this.getItems(this.showed, true);
      this.changeDetection.detectChanges();
    }
  }

  ngOnInit(): void {
    this.items = this.getItems(this.showed, false);
    // this.itemsClose = this.getItems(true);
    // this.itemsOpen = this.getItems(false);

    this.changeDetection.detectChanges();
  }

  private fixupItems(items?: MenuItem[]): void {
    items?.forEach((item) => {
      item.command = (e) => (this.activeItem = e.item);
      this.fixupItems(item?.items);
    });
  }

  // private fixActiveItems(items: MenuItem[]): MenuItem[] {
  //   items.forEach((item) => {
  //     if (this.activeItem?.['key'] === item?.['key']) {

  //       item.command = (e) => e.item;
  //       item.expanded = true;
  //     }
  //     if (item.items) {
  //       this.fixActiveItems(item.items);
  //     }
  //   });

  //   return items;
  // }

  private fixActiveItems(items: MenuItem[], subitems?: MenuItem[]): MenuItem[] {
    items.forEach((item) => {
      let foundItem = !subitems
        ? this.items.find((m) => m['key'] === item['key'])
        : subitems.find((m) => m['key'] === item['key']);
      if (foundItem) {
        item.command = foundItem.command;
        item.expanded = foundItem.expanded;
      }
      if (item.items) {
        this.fixActiveItems(item.items, subitems);
      }
    });

    return items;
  }

  get menuItems(): MenuItem[] {
    const items = [
      {
        key: '0',
        label: 'Dashboard',
        icon: 'pi pi-home',

        routerLink: ['/admin'],
      },
      {
        key: '1',
        label: 'Tasks',
        icon: 'pi pi-server',
        items: [
          {
            key: '1_0',
            label: 'Test',
            icon: 'pi pi-chart-bar',

            routerLink: ['/admin/test'],
          },
          {
            key: '1_1',
            label: 'Pending',

            routerLink: ['/'],
          },
          {
            key: '1_2',
            label: 'Overdue',

            routerLink: ['/test2'],
          },
        ],
      },
    ];
    return items;
  }

  setEmptyMenuItem(items: MenuItem[]): MenuItem[] {
    let r: MenuItem[] = [];
    if (items) {
      r = items.map((i) => {
        i.label = '';
        let subMenu: MenuItem[] = [];
        if (i.items) {
          subMenu = this.setEmptyMenuItem(i.items);
          i.items = subMenu;
        }
        return i;
      });
      items = r;
    }

    return r;
  }

  getItems(withoutLabel: boolean, isChanged: boolean): MenuItem[] {
    let items = this.menuItems;

    if (withoutLabel) {
      items = this.setEmptyMenuItem(
        this.items?.length ? this.items : this.menuItems
      );
    } else {
      items = this.fixActiveItems(this.menuItems);
    }

    this.fixupItems(items);

    return items;
  }
}

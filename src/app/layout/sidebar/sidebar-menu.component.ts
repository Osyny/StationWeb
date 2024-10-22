import {
  ChangeDetectorRef,
  Component,
  Injector,
  Input,
  OnInit,
  SimpleChanges,
} from '@angular/core';

import { ActivatedRoute, Router, Event, NavigationEnd } from '@angular/router';

import { AppComponentBase } from '../../shared/app-component-base';
import { MenuItem } from 'primeng/api/public_api';
import { DashboardPageService } from '../../shared/helpers/dashboard-page-service';
import { BehaviorSubject, filter } from 'rxjs';
import { ActiveMenuItemDto } from './dtos/active-item-menu.dto';

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
  keyActivePage?: string;

  homeRoute = '/admin';
  currentUrl?: string;

  constructor(
    injector: Injector,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private changeDetection: ChangeDetectorRef
  ) {
    super(injector);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['showed']) {
      if (!this.items.length) {
        this.items = this.getItems(this.showed, false);
      }
      this.changeDetection.detectChanges();
    }
  }

  ngOnInit(): void {
    DashboardPageService.getInstance().subsribe((page) => {
      this.getActiveLocationPage(page);
    });

    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
        if (!this.items.length || !this.activeItem) {
          this.items = this.getItems(this.showed, false);
        }
      }
    });

    this.changeDetection.detectChanges();
  }

  getActiveLocationPage(page: string) {
    if (page) {
      this.keyActivePage = page;
      this.fixActiveItemAfterClick(this.menuItems);
      this.changeDetection.detectChanges();
    }
  }

  private fixupItems(items?: MenuItem[]): void {
    items?.forEach((item) => {
      item.command = (e) => (this.activeItem = e.item);
      this.fixupItems(item?.items);
    });
  }

  get menuItems(): MenuItem[] {
    const items = [
      {
        key: '1',
        label: 'Dashboard',
        icon: 'pi pi-home',

        routerLink: ['/admin'],
      },

      {
        key: '2',
        label: 'Tasks',
        icon: 'pi pi-server',
        items: [
          {
            key: '2_1',
            label: 'Test',
            icon: 'pi pi-chart-bar',

            routerLink: ['/admin/test'],
          },
          {
            key: '2_2',
            label: 'Pending',

            routerLink: ['/'],
          },
          {
            key: '2_3',
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

  private fixActiveItems(items: MenuItem[], subitems?: MenuItem[]): MenuItem[] {
    if (!this.activeItem && this.currentUrl) {
      let foundActiveItem = this.foundActiveByCurrentUrl(items);

      if (foundActiveItem.foundActiveItem) {
        this.activeItem = foundActiveItem;
        foundActiveItem.foundActiveItem.command = (e) => e.item;
        foundActiveItem.foundActiveItem.expanded = true;
      }
    } else {
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
    }
    return items;
  }

  private foundActiveByCurrentUrl(items: MenuItem[]) {
    let activeItem: ActiveMenuItemDto = new ActiveMenuItemDto();
    let foundActiveItem: MenuItem | null | undefined;
    let foundSubActiveItem: MenuItem | null | undefined;
    for (let index = 0; index < items.length; index++) {
      if (items[index]?.routerLink) {
        let r = items[index]?.routerLink[0] === this.currentUrl;
        if (r) {
          foundActiveItem = items[index];
          break;
        }
      }
    }
    if (!foundActiveItem) {
      items.forEach((item) => {
        if (item.items) {
          let subMenu = this.foundActiveByCurrentUrl(item.items);
          if (subMenu) {
            foundActiveItem = item;
            foundSubActiveItem = subMenu;
            return;
          }
        }
      });
    }
    activeItem.foundActiveItem = foundActiveItem;
    activeItem.foundSubActiveItem = foundSubActiveItem;
    return activeItem;
  }

  private fixActiveItemAfterClick(items?: MenuItem[]) {
    if (!this.activeItem && this.keyActivePage) {
      let foundDashboardItem = items?.find(
        (m) => m['key'] === this.keyActivePage
      );

      if (foundDashboardItem) {
        this.activeItem = foundDashboardItem;
        foundDashboardItem.command = (e) => e.item;
        foundDashboardItem.expanded = true;
      }
    }
  }

  activeMenu(event: any) {
    let node;
    if (event.target.classList.contains('p-submenu-header') == true) {
      node = 'submenu';
    } else if (event.target.tagName === 'SPAN') {
      node = event.target.parentNode.parentNode;
    } else {
      node = event.target.parentNode;
    }

    if (node != 'submenu') {
      let menuitem = document.getElementsByClassName(
        'p-panelmenu-header-content'
      );
      for (let i = 0; i < menuitem.length; i++) {
        menuitem[i].classList.remove('active');
      }
      node.classList.add('active');
    }
  }
}

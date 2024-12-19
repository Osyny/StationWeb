import {
  ChangeDetectorRef,
  Component,
  Injector,
  Input,
  OnInit,
} from '@angular/core';
import {
  Router,
  RouterEvent,
  NavigationEnd,
  PRIMARY_OUTLET,
  Event,
  ResolveStart,
} from '@angular/router';

import { AppComponentBase } from '../../shared/app-component-base';
import { MenuItem } from '../../shared/layout/menu-item';
import { DashboardPageService } from '../../shared/helpers/dashboard-page-service';
import { SidebarMenuOnChangesService } from '../services/sidebar-menu.services';

@Component({
  selector: 'sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss'],
})
export class SidebarMenuComponent extends AppComponentBase implements OnInit {
  menuItems: MenuItem[] = [];
  menuItemsMap: { [key: number]: MenuItem } = {};
  activatedMenuItems: MenuItem[] = [];

  homeRoute = '/admin';
  primaryUrlSegmentGroup?: string;
  isLoadGetInstancePage: boolean = false;
  page?: number;

  constructor(
    injector: Injector,
    private router: Router,
    private changeDetection: ChangeDetectorRef,
    private _sidebarMenuOnChangesService: SidebarMenuOnChangesService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    DashboardPageService.getInstance().subsribe((page) => {
      this.getActiveLocationPage(page);
      this._sidebarMenuOnChangesService.updatePageChanged(page);
    });
    this._sidebarMenuOnChangesService.pageChanged$.subscribe(
      (res) => (this.page = res)
    );
    this.setMenuItems();

    this.changeDetection.detectChanges();
  }

  foundItem(page: number, menuItems: MenuItem[]): MenuItem {
    let foundItem: MenuItem = new MenuItem('', '', '', '');

    for (let m of menuItems) {
      if (m.id === page) {
        foundItem = m;
        break;
      }
      if (m.children) {
        foundItem = this.foundItem(page, m.children);
        if (foundItem) {
          break;
        }
      }
    }
    return foundItem;
  }

  getMenuItems(): MenuItem[] {
    return [
      new MenuItem('Dashboard', '/admin', 'welcome', ''),
      new MenuItem('Information', '', '', '', [
        new MenuItem('About us', '/admin/test', 'dots-vertical', '', [], true),
        new MenuItem(
          'Settings',
          '/admin/settings',
          'dots-vertical',
          '',
          [],
          true
        ),
      ]),
    ];
  }

  setMenuItems() {
    this.menuItems = this.getMenuItems();
    this.patchMenuItems(this.menuItems);
    if (this.page && this.page === 1) {
      let url = this.foundItem(this.page, this.menuItems);

      this.activateMenuItems(url?.route);
    } else {
      this.router.events.subscribe((event: Event) => {
        if (event instanceof NavigationEnd) {
          let currentUrl = this.homeRoute;
          if (event.url !== '/') {
            currentUrl = event.url;
          } else if (
            event instanceof NavigationEnd &&
            !!event.urlAfterRedirects &&
            event.urlAfterRedirects !== '/'
          ) {
            currentUrl = event.urlAfterRedirects;
          }
          const primaryUrlSegmentGroup =
            this.router.parseUrl(currentUrl).root.children[PRIMARY_OUTLET];

          if (primaryUrlSegmentGroup) {
            this.primaryUrlSegmentGroup =
              '/' + primaryUrlSegmentGroup.toString();
            this.activateMenuItems(this.primaryUrlSegmentGroup);
          }
        }
      });
    }
  }

  patchMenuItems(items: MenuItem[], parentId?: number): void {
    items.forEach((item: MenuItem, index: number) => {
      item.id = parentId ? Number(parentId + '' + (index + 1)) : index + 1;
      if (parentId) {
        item.parentId = parentId;
      }
      if (parentId || item.children) {
        this.menuItemsMap[item.id] = item;
      }
      if (item.children) {
        this.patchMenuItems(item.children, item.id);
      }
    });
  }

  activateMenuItems(url: string): void {
    this.deactivateMenuItems(this.menuItems);
    this.activatedMenuItems = [];
    const foundedItems = this.findMenuItemsByUrl(url, this.menuItems);
    foundedItems.forEach((item) => {
      this.activateMenuItem(item);
    });
  }

  deactivateMenuItems(items: MenuItem[]): void {
    items.forEach((item: MenuItem) => {
      item.isActive = false;
      item.isCollapsed = true;
      if (item.children) {
        this.deactivateMenuItems(item.children);
      }
    });
  }

  findMenuItemsByUrl(
    url: string,
    items: MenuItem[],
    foundedItems: MenuItem[] = []
  ): MenuItem[] {
    items.forEach((item: MenuItem) => {
      if (item.route === url) {
        foundedItems.push(item);
      } else if (item.children) {
        this.findMenuItemsByUrl(url, item.children, foundedItems);
      }
    });
    return foundedItems;
  }

  activateMenuItem(item: MenuItem): void {
    item.isActive = true;
    if (item.children) {
      item.isCollapsed = false;
    }
    this.activatedMenuItems.push(item);
    if (item.parentId) {
      this.activateMenuItem(this.menuItemsMap[item.parentId]);
    }
  }

  isMenuItemVisible(item: MenuItem): boolean {
    if (!item.permissionName) {
      return true;
    }
    return false;
  }
  sidebarClose() {
    const sidebar = document.body.querySelector('.sidebar');
    const menu = document.body.querySelector('.menu-btn');
    sidebar?.classList.toggle('sidebarclose');
    menu?.classList.remove('open');
  }

  getActiveLocationPage(page: number) {
    if (page) {
      this.sidebarClose();
      this.deactivateMenuItems(this.menuItems);

      let url = !this.primaryUrlSegmentGroup
        ? this.homeRoute
        : this.primaryUrlSegmentGroup;
      this.activateMenuItems(url);
      this.changeDetection.detectChanges();
    }
  }
}

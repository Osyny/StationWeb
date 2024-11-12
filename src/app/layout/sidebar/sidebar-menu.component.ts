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
} from '@angular/router';

import { AppComponentBase } from '../../shared/app-component-base';
import { MenuItem } from '../../shared/layout/menu-item';
import { DashboardPageService } from '../../shared/helpers/dashboard-page-service';

@Component({
  selector: 'sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss'],
})
export class SidebarMenuComponent extends AppComponentBase implements OnInit {
  menuItems: MenuItem[] = [];
  menuItemsMap: { [key: number]: MenuItem } = {};
  activatedMenuItems: MenuItem[] = [];
  // routerEvents: BehaviorSubject<RouterEvent> = new BehaviorSubject(undefined);
  homeRoute = '/app/about';
  primaryUrlSegmentGroup?: string;

  // user: UserLoginInfoDto;

  constructor(
    injector: Injector,
    private router: Router,
    private changeDetection: ChangeDetectorRef
  ) {
    super(injector);
    // this.router.events.subscribe(this.routerEvents);
  }

  ngOnInit(): void {
    DashboardPageService.getInstance().subsribe((page) => {
      this.getActiveLocationPage(page);
    });
    this.setMenuItems();
    this.changeDetection.detectChanges();
  }

  getMenuItems(): MenuItem[] {
    return [
      new MenuItem('Dashboard', '/admin', 'welcome', ''),
      new MenuItem('Tasks', '', '', '', [
        new MenuItem('Test', '/admin/test', 'dots-vertical1', '', [], true),
        new MenuItem('Users2_1', '/', 'dots-vertical1', '', [], true),
      ]),
    ];
  }

  setMenuItems() {
    this.menuItems = this.getMenuItems();
    this.patchMenuItems(this.menuItems);
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
          this.primaryUrlSegmentGroup = '/' + primaryUrlSegmentGroup.toString();
          this.activateMenuItems(this.primaryUrlSegmentGroup);
        }
      }
    });
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
    // return this.permission.isGranted(item.permissionName);
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

      if (this.primaryUrlSegmentGroup) {
        this.activateMenuItems(this.primaryUrlSegmentGroup);
      }
      this.changeDetection.detectChanges();
    }
  }
}

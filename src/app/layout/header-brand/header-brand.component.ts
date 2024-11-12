import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { LayoutStoreService } from '../../shared/layout/layout-store.service';

@Component({
  selector: 'header-brand',
  templateUrl: './header-brand.component.html',
  styleUrls: ['./header-brand.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderBrandComponent implements OnInit {
  sidebarExpanded: boolean = false;

  constructor(private _layoutStore: LayoutStoreService) {}

  ngOnInit(): void {
    this._layoutStore.sidebarExpanded.subscribe((value) => {
      this.sidebarExpanded = value;
    });
  }

  toggleSidebar(): void {
    this._layoutStore.setSidebarExpanded(!this.sidebarExpanded);
  }
}

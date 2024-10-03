import {
  Component,
  ChangeDetectionStrategy,
  Renderer2,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent implements OnInit {
  sideBarLeft = false;
  sidebarClose = false;

  constructor(private renderer: Renderer2) {}

  toggleSidebar() {
    this.sideBarLeft = !this.sideBarLeft;

    document.body.classList.toggle('sidebarclose');
  }

  get isOpenSidebar(): boolean {
    return this.sideBarLeft;
  }

  ngOnInit(): void {
    // this._layoutStore.sidebarExpanded.subscribe((value) => {
    //   this.sidebarExpanded = value;

    // });
    this.toggleSidebar();
  }
}

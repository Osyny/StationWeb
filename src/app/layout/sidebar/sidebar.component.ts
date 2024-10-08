import {
  Component,
  ChangeDetectionStrategy,
  Renderer2,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent implements OnInit {
  sideBarLeft = true;
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
    this.toggleSidebar();
  }
}

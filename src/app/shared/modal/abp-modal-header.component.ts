import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  Injector,
} from '@angular/core';
import { AppComponentBase } from '../app-component-base';

@Component({
  selector: 'abp-modal-header',
  templateUrl: './abp-modal-header.component.html',
  styleUrls: ['./abp-modal-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AbpModalHeaderComponent extends AppComponentBase {
  @Input() title?: string;
  @Input() name?: string;

  @Output() onCloseClick = new EventEmitter<number>();

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.title =
      this.name && !this.title?.includes(':') ? this.title + ':' : this.title;
  }
}

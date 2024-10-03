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
  selector: 'abp-modal-footer',
  templateUrl: './abp-modal-footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AbpModalFooterComponent extends AppComponentBase {
  @Input() cancelDisabled: boolean = false;

  @Input() saveDisabled: boolean = false;
  @Input() isModalParentGroup: boolean = false;

  @Output() onCancelClick = new EventEmitter<number>();

  constructor(injector: Injector) {
    super(injector);
  }
}

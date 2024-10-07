import {
  Component,
  ElementRef,
  EventEmitter,
  Injector,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppComponentBase } from '../../shared/app-component-base';
import { Subject } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-forgot-password-modal',
  templateUrl: './forgot-password-modal.component.html',
  styleUrl: './forgot-password-modal.component.scss',
})
export class ForgotPasswordModalComponent
  extends AppComponentBase
  implements OnInit, OnDestroy
{
  @ViewChild('editUserForm', { read: ElementRef })
  editAssetFormRef!: ElementRef;
  loading = true;
  email: string | undefined = '';
  title!: string;

  @Output() onSave = new EventEmitter<void>();

  constructor(public bsModalRef: BsModalRef, injector: Injector) {
    super(injector);
  }

  private $unsubscribe = new Subject<void>();

  ngOnInit(): void {}
  ngOnDestroy(): void {
    this.$unsubscribe.next();
    this.$unsubscribe.complete();
  }
  save(ngForm: NgForm): void {
    if (ngForm.invalid) {
      ngForm.form.markAllAsTouched();
      return;
    }

    this.onSave.emit();
    this.cancel();
  }

  cancel() {
    this.bsModalRef.hide();
  }
}

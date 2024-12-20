import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidationSummaryComponent } from './validation/validation-summary.component';
import { AbpModalHeaderComponent } from './modal/abp-modal-header.component';
import { SpinerComponent } from '../layout/spiner/spiner.component';

@NgModule({
  declarations: [
    ValidationSummaryComponent,
    AbpModalHeaderComponent,
    SpinerComponent,
  ],
  exports: [
    ValidationSummaryComponent,
    AbpModalHeaderComponent,
    SpinerComponent,
  ],
  imports: [CommonModule],
})
export class SharedModule {}

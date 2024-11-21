import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbpValidationSummaryComponent } from './validation/abp-validation-summary.component';
import { AbpModalHeaderComponent } from './modal/abp-modal-header.component';
import { SpinerComponent } from '../layout/spiner/spiner.component';

@NgModule({
  declarations: [
    AbpValidationSummaryComponent,
    AbpModalHeaderComponent,
    SpinerComponent,
  ],
  exports: [
    AbpValidationSummaryComponent,
    AbpModalHeaderComponent,
    SpinerComponent,
  ],
  imports: [CommonModule],
})
export class SharedModule {}

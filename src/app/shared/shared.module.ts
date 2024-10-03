import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbpValidationSummaryComponent } from './validation/abp-validation-summary.component';
import { AbpModalHeaderComponent } from './modal/abp-modal-header.component';

@NgModule({
  declarations: [AbpValidationSummaryComponent, AbpModalHeaderComponent],
  exports: [AbpValidationSummaryComponent, AbpModalHeaderComponent],
  imports: [CommonModule],
})
export class SharedModule {}

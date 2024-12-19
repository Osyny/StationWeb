import { AfterViewInit, Component } from '@angular/core';
import { DashboardPageService } from '../../shared/helpers/dashboard-page-service';
import {
  PageRedirectEnumForAdmin,
  SubPageRedirectEnumForAdmin,
} from '../../enums/page-redirect.enum';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styles: ``,
})
export class SettingsComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    let page = Number.parseInt(
      `${PageRedirectEnumForAdmin.task}` +
        `${SubPageRedirectEnumForAdmin.settings}`
    );
    DashboardPageService.getInstance().setData(page);
  }
}

import { AfterViewInit, Component } from '@angular/core';
import { DashboardPageService } from '../../shared/helpers/dashboard-page-service';
import {
  PageRedirectEnumForAdmin,
  SubPageRedirectEnumForAdmin,
} from '../../enums/page-redirect.enum';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styles: ``,
})
export class TestComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    DashboardPageService.getInstance().setData(
      `${PageRedirectEnumForAdmin.task}_${SubPageRedirectEnumForAdmin.test}`
    );
  }
}

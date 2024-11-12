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
    let page = Number.parseInt(
      `${PageRedirectEnumForAdmin.task}` + `${SubPageRedirectEnumForAdmin.test}`
    );
    DashboardPageService.getInstance().setData(page);
  }
}

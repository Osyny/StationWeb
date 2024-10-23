import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';

import { AppComponentBase } from '../../shared/app-component-base';
import { TableLazyLoadEvent } from 'primeng/table';
import { PrimengTableHelper } from '../../helpers/primeng-table-helper';
import { DataInput } from './dtos/data-input.dto';
import { finalize, Subject, takeUntil } from 'rxjs';
import { ChargeStationService } from '../../services/charge-station.service';
import {
  ChargeStationDto,
  ChargeStationResponse,
} from '../../models/charge-station.model';
import { ChargeStationDisplayedDto } from './dtos/charge-station-displayed.dto';
import { InputHelper } from '../../helpers/input-helper';
import { DropdownItem, SelectItem } from './dtos/owner-select-list.dto';
import { FormControl, FormGroup } from '@angular/forms';
import { SignalrService } from '../../services/signalr.service';
import { AuthService } from '../../services/auth.service';
import { DashboardPageService } from '../../shared/helpers/dashboard-page-service';
import { PageRedirectEnumForAdmin } from '../../enums/page-redirect.enum';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent
  extends AppComponentBase
  implements OnInit, AfterViewInit
{
  chargeStations: ChargeStationDisplayedDto[] = [];
  loading = false;
  formDropdownGroup!: FormGroup;

  rows = 10;
  first = 0;
  filterText!: string;
  totalRecords: number = 0;
  selectedOwnerId!: number;
  ownerSelectItems: SelectItem[] = [];
  inputData = new DataInput();
  isActiveDashboard: boolean = false;

  $unsubscribe = new Subject<void>();
  private readonly _primengTableHelper = new PrimengTableHelper();

  constructor(
    injector: Injector,
    private chargeStationService: ChargeStationService,
    public signalRService: SignalrService,
    private authService: AuthService
  ) {
    super(injector);
  }
  ngOnInit(): void {
    DashboardPageService.getInstance().subsribe((page) => {
      this.isActiveDashboard = page === '1';
    });

    setInterval(() => this.lazyLoadStation(false, true), 10000);
    //this.startHttpRequestSignalR1();

    this.formDropdownGroup = new FormGroup({
      value: new FormControl(),
    });
  }

  ngAfterViewInit(): void {
    DashboardPageService.getInstance().setData(
      `${PageRedirectEnumForAdmin.dashboard}`
    );
  }

  lazyLoadStation(
    isFilter: boolean,
    isUpdate?: boolean,
    event?: TableLazyLoadEvent
  ) {
    if (
      !isFilter &&
      this._primengTableHelper.isSkipLoading(this.totalRecords)
    ) {
      return;
    }

    this.inputData.rows = event ? event.rows : this.rows;
    this.inputData.skip = event ? event.first : this.first;
    this.inputData.filterText = !this.filterText ? '' : this.filterText;
    this.inputData.sorting =
      this._primengTableHelper.getSortingFromLazyLoad(event);
    this.inputData.filterOwnerId = !this.selectedOwnerId
      ? 0
      : this.selectedOwnerId;
    if (isUpdate) {
      setTimeout(() => this.startHttpRequest());
    } else {
      setTimeout(() => this.loadStations(this.inputData));
    }
  }

  private startHttpRequest = () => {
    let token = this.authService.getToken();
    if (this.authService.getToken() && this.isActiveDashboard) {
      this.chargeStationService
        .getUpdateStatusesAsync()
        .pipe(
          takeUntil(this.$unsubscribe),
          finalize(() => (this.loading = false))
        )
        .subscribe((res) => {
          console.log('UPDATE: ');
          this.chargeStations.forEach((st) => {
            let foundDisplayed = res.chargeStations?.find(
              (station) => station.id === st.id
            );

            st.status = foundDisplayed?.status ? foundDisplayed?.status : false;
            st.statusDisplayed = st.status ? 'online' : 'offline';
            console.log(`${st.id} -> ${st.status}`);
          });
        });
    }
  };

  loadStations(input: DataInput) {
    this.loading = true;

    this.chargeStationService
      .getAll(input)
      .pipe(
        takeUntil(this.$unsubscribe),
        finalize(() => (this.loading = false))
      )
      .subscribe((res) => {
        this.setDataStation(res);
      });
  }

  setDataStation(res: ChargeStationResponse) {
    this.loading = false;
    this.chargeStations = res.chargeStations?.map((station, i) =>
      this.mapToDisplayStation(station, i)
    );

    this.ownerSelectItems = this.ownerSelectItems.sort((a, b) =>
      a.name < b.name ? -1 : 1
    );
    this.totalRecords = res.total;
  }

  loadUpdateStations(input: DataInput) {
    this.loading = true;
  }

  mapToDisplayStation(
    data: ChargeStationDto,
    index: number
  ): ChargeStationDisplayedDto {
    const displayData = data as ChargeStationDisplayedDto;
    displayData.ownerName = data.owner?.name;
    displayData.statusDisplayed = data.status ? 'online' : 'offline';

    let existOwner = this.ownerSelectItems.find(
      (o) => o.name === data.owner?.name
    );
    if (!existOwner && data.owner?.id) {
      const ownerSelectItem = new SelectItem();
      ownerSelectItem.id = data.owner.id;
      ownerSelectItem.name = displayData.ownerName ? displayData.ownerName : '';

      this.ownerSelectItems.push(ownerSelectItem);
    }

    return displayData;
  }

  searchTextChanged(event: KeyboardEvent) {
    if (InputHelper.isMinimumTextChanged(event) || !this.filterText) {
      this.reloadPage(true);
    }
  }

  reloadPage(isFirstPage = false) {
    if (isFirstPage && this.first !== 0) {
      this.first = 0;
      return;
    }
    this.lazyLoadStation(false);
  }

  setComparedClass(value: string) {
    return value;
  }

  editOrAdd(station?: ChargeStationDisplayedDto) {
    if (!station) {
      station = new ChargeStationDisplayedDto();
    }
  }

  getConfigure(station: ChargeStationDto) {}

  reboot(station: ChargeStationDto) {}

  changedOwnerFilter($event: any) {
    this.lazyLoadStation(true);
  }

  private startHttpRequestSignalR1 = () => {
    let token = this.authService.getToken();
    if (this.authService.getToken()) {
      this.signalRService.hubConnection?.invoke('Hello').catch((error) => {
        console.log(`Signal R error -> ${error}`);
      });

      this.signalRService.hubConnection
        ?.invoke('GetUpdateStatuses')
        .catch((error) => {
          console.log(`Signal R error -> ${error}`);
        });

      this.signalRService?.hubHelloMessage?.subscribe((r) => {
        let res = r;
        console.log(`Signal R  --> ${res}`);
      });
    }
  };
}

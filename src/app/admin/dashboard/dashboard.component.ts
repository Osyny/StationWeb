import { Component, Injector, OnInit } from '@angular/core';

import { AppComponentBase } from '../../shared/app-component-base';
import { TableLazyLoadEvent } from 'primeng/table';
import { PrimengTableHelper } from '../../helpers/primeng-table-helper';
import { DataInput } from './dtos/data-input.dto';
import { finalize, Subject, takeUntil } from 'rxjs';
import { ChargeStationService } from '../../services/charge-station.service';
import { ChargeStationDto } from '../../models/charge-station.model';
import { ChargeStationDisplayedDto } from './dtos/charge-station-displayed.dto';
import { InputHelper } from '../../helpers/input-helper';
import { DropdownItem, SelectItem } from './dtos/owner-select-list.dto';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent extends AppComponentBase implements OnInit {
  chargeStations: ChargeStationDisplayedDto[] = [];
  loading = false;
  formDropdownGroup!: FormGroup;

  rows = 10;
  first = 0;
  filterText!: string;
  totalRecords: number = 0;
  selectedOwnerId!: number;
  ownerSelectItems: SelectItem[] = [];

  $unsubscribe = new Subject<void>();
  private readonly _primengTableHelper = new PrimengTableHelper();

  constructor(
    injector: Injector,
    private chargeStationService: ChargeStationService
  ) {
    super(injector);
  }
  ngOnInit(): void {
    this.formDropdownGroup = new FormGroup({
      value: new FormControl(),
    });
  }

  lazyLoadStation(isFilter: boolean, event?: TableLazyLoadEvent) {
    if (
      !isFilter &&
      this._primengTableHelper.isSkipLoading(this.totalRecords)
    ) {
      return;
    }

    const input = new DataInput();
    input.rows = event ? event.rows : this.rows;
    input.skip = event ? event.first : this.first;
    input.filterText = !this.filterText ? '' : this.filterText;
    input.sorting = this._primengTableHelper.getSortingFromLazyLoad(event);
    input.filterOwnerId = !this.selectedOwnerId ? 0 : this.selectedOwnerId;
    setTimeout(() => this.loadStations(input));
  }

  loadStations(input: DataInput) {
    this.loading = true;

    this.chargeStationService
      .getAll(input)
      .pipe(
        takeUntil(this.$unsubscribe),
        finalize(() => (this.loading = false))
      )
      .subscribe((res) => {
        this.loading = false;
        this.chargeStations = res.chargeStations?.map((station, i) =>
          this.mapToDisplayStation(station, i)
        );

        this.ownerSelectItems = this.ownerSelectItems.sort((a, b) =>
          a.name < b.name ? -1 : 1
        );
        this.totalRecords = res.total;
      });
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
}

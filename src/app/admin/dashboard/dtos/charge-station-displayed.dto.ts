import {
  ChargeStationDto,
  OwnerDto,
} from '../../../models/charge-station.model';

export class ChargeStationDisplayedDto implements ChargeStationDto {
  serialNumber?: string | undefined;
  owner?: OwnerDto | undefined;
  ownerName?: string | undefined = '';
  status: boolean = false;
  statusDisplayed: string = '';
  id: number = 0;
}

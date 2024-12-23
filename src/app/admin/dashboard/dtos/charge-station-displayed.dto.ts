import {
  ChargeStationDto,
  ConnectorDto,
  OwnerDto,
} from '../../../models/charge-station.model';
import { SelectItem } from './owner-select-list.dto';

export class ChargeStationDisplayedDto implements ChargeStationDto {
  serialNumber?: string | undefined;
  owner?: OwnerDto | undefined;
  ownerName?: string | undefined = '';
  status: boolean = false;
  statusDisplayed: string = '';

  id: number = 0;
  name?: string;
  connectors: ConnectorDto[] = [];
}

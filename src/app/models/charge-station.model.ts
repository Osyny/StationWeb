import { UserDto } from './user-model';

export interface ChargeStationResponse {
  chargeStations: ChargeStationDto[];
  total: number;
  skip: number;
  limit: number;
}

export interface ChargeStationDto {
  id?: number;
  serialNumber?: string;
  owner?: OwnerDto;

  status: boolean;

  //  token?: string;
}

export interface OwnerDto {
  id?: number;
  name: string;
}

export interface StationResponse {
  chargeStations: ChargeStationDto[];
}

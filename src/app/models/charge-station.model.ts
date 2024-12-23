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
  connectors: ConnectorDto[];

  //  token?: string;
}

export interface OwnerDto {
  id?: number;
  name: string;
}

export interface ConnectorDto {
  id: number;
  connectorType: ConnectorTypeDto;
  connectorStatus: ConnectorStatusDto;
  maxCurrent: number;
  details: string;
  chargeStationId: number;
  connectorUiStatus: ConnectorUiStatusDto;
}

export interface ConnectorUiStatusDto {
  id: number;
  enumValue: number;
  name: string;
  color: string;
}

export interface ConnectorStatusDto {
  id: number;
  name: string;
  enumValue: number;
}

export interface ConnectorTypeDto {
  id: number;
  name: string;
  Details: string;
}

export interface StationResponse {
  chargeStations: ChargeStationDto[];
  connectors: ConnectorDto[];
}

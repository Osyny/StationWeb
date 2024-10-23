import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DataInput } from '../admin/dashboard/dtos/data-input.dto';
import { Observable } from 'rxjs';
import {
  ChargeStationDto,
  ChargeStationResponse,
  StationResponse,
} from '../models/charge-station.model';

@Injectable({
  providedIn: 'root',
})
export class ChargeStationService {
  private apiUrl = `${environment.apiUrl}`;
  constructor(private http: HttpClient) {}
  getAll(input: DataInput): Observable<ChargeStationResponse> {
    let params = new HttpParams();
    for (const [key, value] of Object.entries(input)) {
      console.log(`${key}: ${value}`);
      if (value) {
        params = params.append(key, value);
      }
    }

    let res = this.http.get<ChargeStationResponse>(
      `${this.apiUrl}/ChargeStation/getAll`,
      {
        params,
      }
    );

    return res;
  }

  getUpdateStatuses(): Observable<StationResponse> {
    let res = this.http.get<StationResponse>(
      `${this.apiUrl}/ChargeStation/getUpdateStatuses`
    );

    return res;
  }
  getUpdateStatusesAsync(): Observable<StationResponse> {
    let res = this.http.get<StationResponse>(
      `${this.apiUrl}/ChargeStation/getUpdateStatusesAsync`
    );

    return res;
  }
}

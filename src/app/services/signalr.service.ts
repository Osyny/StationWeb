import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../environments/environment.development';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';
import { StationResponse } from '../models/charge-station.model';
@Injectable({
  providedIn: 'root',
})
export class SignalrService {
  public data!: any;
  hubConnection!: signalR.HubConnection;
  private apiUrl = `${environment.apiUrl}`;
  hubUrl: string = `${this.apiUrl}/stationhub`;

  hubHelloMessage?: BehaviorSubject<string>;
  hubGetUpdateStatuses?: BehaviorSubject<StationResponse>;
  token?: string | undefined | null;

  constructor(private authService: AuthService) {
    this.hubHelloMessage = new BehaviorSubject<string>('');
    this.token = this.authService.getToken();
  }

  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${this.apiUrl}/ChargeStation/getUpdateStatuses`)
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch((err) => console.log('Error while starting connection: ' + err));
  };
  public async initiateSignalrConnection(): Promise<void> {
    try {
      this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(this.hubUrl, {
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets,
        })
        .withAutomaticReconnect()
        .build();
      await this.hubConnection.start();
      // this.setSignalrClientMethods();
      this.setSignalrGetUpdateStatuses();

      console.log(
        `SignalR connection success! connectionId: ${this.hubConnection.connectionId}`
      );
    } catch (error) {
      console.log(`SignalR connection error: ${error}`);
    }
  }

  private setSignalrClientMethods(): void {
    this.hubConnection.on('DisplayMessage', (message: string) => {
      this.hubHelloMessage?.next(message);
    });
  }

  private setSignalrGetUpdateStatuses(): void {
    this.hubConnection.on(
      'GetUpdateStatuses',
      (stationResponse: StationResponse) => {
        this.hubGetUpdateStatuses?.next(stationResponse);
      }
    );
  }
}

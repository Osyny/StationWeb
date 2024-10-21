import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../environments/environment.development';
@Injectable({
  providedIn: 'root',
})
export class SignalrService {
  public data!: any;
  private hubConnection!: signalR.HubConnection;
  private apiUrl = `${environment.apiUrl}`;

  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${this.apiUrl}/ChargeStation/getAllUpdate`)
      .build();
    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch((err) => console.log('Error while starting connection: ' + err));
  };

  public addStationDataListener = () => {
    this.hubConnection.on('sendstationdata', (data) => {
      this.data = data;
      console.log(
        'Station Name:  ' + data.name + ' - Is Available:  ' + data.isAvailable
      );
    });
  };
}

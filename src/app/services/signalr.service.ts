import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../environments/environment.development';
import { BehaviorSubject, Observable } from 'rxjs';
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
  hubGetUpdateStatuses?: BehaviorSubject<StationResponse> | null;
  token?: string | undefined | null;
  stationResponse!: StationResponse;

  constructor(private authService: AuthService) {
    this.hubHelloMessage = new BehaviorSubject<string>('');
    this.hubGetUpdateStatuses = new BehaviorSubject<StationResponse>(
      this.stationResponse
    );
    this.token = this.authService.getToken();
  }

  public async startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.hubUrl)
      .withAutomaticReconnect()
      .build();

    await this.hubConnection.start();
  }

  public async initiateSignalrConnection(): Promise<void> {
    try {
      this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(this.hubUrl)
        .withAutomaticReconnect()
        .build();

      await this.hubConnection.start();

      this.setSignalrGetUpdateStatuses();
    } catch (error) {
      console.log(`SignalR connection error: ${error}`);
    }
  }

  private setSignalrGetUpdateStatuses(): void {
    this.hubConnection.on(
      'GetUpdateStatuses',
      (stationResponse: StationResponse) => {
        this.hubGetUpdateStatuses?.next(stationResponse);
      }
    );

    this.hubConnection.invoke('UpdateStatuses').catch((error: any) => {
      console.log(`SignalrDemoHub.UpdateStatuses() error: ${error}`);
      alert('SignalrDemoHub.UpdateStatuses() error!, see console for details.');
    });
  }

  private setSignalrClientMethods(): void {
    this.hubConnection.on('DisplayMessage', (message: string) => {
      this.hubHelloMessage?.next(message);
    });
    console.log(
      `SignalR connection success! connectionId: ${this.hubConnection.connectionId}`
    );

    this.hubConnection.invoke('Hello').catch((error: any) => {
      console.log(`SignalrDemoHub.Hello() error: ${error}`);
      alert('SignalrDemoHub.Hello() error!, see console for details.');
    });
  }
}

import { Injectable } from '@angular/core';

type CallbackType = (page: string) => void;
@Injectable()
export class DashboardPageService {
  public static getInstance(): DashboardPageService {
    if (!DashboardPageService.instance) {
      DashboardPageService.instance = new DashboardPageService();
    }
    return DashboardPageService.instance;
  }

  private static instance: DashboardPageService;
  private currentPage?: string;
  private subPage?: number;
  private callback: CallbackType = (page: string) => {};

  constructor() {}

  subsribe(callback: CallbackType) {
    this.callback = callback;
  }

  getData() {
    return this.currentPage;
  }

  setData(page: string, subMenu?: number) {
    this.currentPage = page;
    if (subMenu) {
      this.subPage = this.subPage;
    }
    this.callback(page);
  }
}

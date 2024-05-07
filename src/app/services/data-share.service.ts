import { BehaviorSubject } from 'rxjs';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataSharedDataService {
  private readonly data$ = new BehaviorSubject<any>({});

  public setData(data: any): void {
    this.data$.next(data);
  }

  public getData() {
    return this.data$.asObservable();
  }
}

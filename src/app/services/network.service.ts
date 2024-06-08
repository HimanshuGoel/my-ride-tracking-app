import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

// export interface Token {
//   albumId: number;
//   id: number;
//   title: string;
//   url: string;
//   thumbnailUrl: string;
// }

@Injectable({ providedIn: 'root' })
export class NetworkService {
  readonly #httpClient = inject(HttpClient);
  readonly baseApiUrl = 'http://localhost:8080';

  getTokens(): Observable<string[]> {
    return this.#httpClient.get<string[]>(`${this.baseApiUrl}/tokens`);
  }

  addToken(token: string): Observable<any> {
    return this.#httpClient.post(`${this.baseApiUrl}/tokens`, token);
  }

  removeToken(token: string): Observable<any> {
    return this.#httpClient.delete(`${this.baseApiUrl}/tokens/${token}`);
  }
}

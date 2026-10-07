import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardData } from '../models/dashboard';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private api = `${environment.apiUrl}/api/dashboard`;

  constructor(private http: HttpClient) {}

  getDashboard(): Observable<DashboardData> {
    return this.http.get<DashboardData>(this.api);
  }
}

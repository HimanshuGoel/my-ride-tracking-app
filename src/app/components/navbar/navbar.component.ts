import { Component, OnInit } from '@angular/core';
import { ROUTES } from '../sidebar/sidebar.component';
import { Location } from '@angular/common';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public listTitles: any[];
  public location: Location;

  public athleteData: any;
  public athleteStats: any;
  public athleteActivities: any;

  private apiUrl = 'https://www.strava.com/api/v3';
  private clientId = '125421';
  private redirectUri = window.location.origin;
  private clientSecret = '349613ffbf4a36801a739a6bd1beea68cea4f09c';

  constructor(private http: HttpClient, location: Location) {
    this.location = location;
  }

  ngOnInit() {
    this.listTitles = ROUTES.filter((listTitle) => listTitle);

    const code = new URL(window.location.href).searchParams.get('code');
    if (code) {
      this.getAccessToken(code).subscribe((data: any) => {
        localStorage.setItem('stravaToken', data.access_token);
        this.getAthleteData();
      });
    }
  }

  getTitle() {
    var title = this.location.prepareExternalUrl(this.location.path());
    if (title.charAt(0) === '#') {
      title = title.slice(1);
    }

    for (var item = 0; item < this.listTitles.length; item++) {
      if (this.listTitles[item].path === title) {
        return this.listTitles[item].title;
      }
    }
    return 'Dashboard';
  }

  loginWithStrava() {
    window.location.href = `http://www.strava.com/oauth/authorize?client_id=${this.clientId}&response_type=code&redirect_uri=${this.redirectUri}&approval_prompt=force&scope=read,activity:read`;
  }

  logoutFromStrava(): void {
    const token = localStorage.getItem('stravaToken');
    const headers = { Authorization: 'Bearer ' + token };
    this.http.post('https://www.strava.com/oauth/deauthorize', {}, { headers }).subscribe(
      () => {
        localStorage.removeItem('stravaToken');
        this.athleteData = null;
        this.athleteStats = null;
        this.athleteActivities = null;
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  private getAccessToken(code: string): Observable<any> {
    const body = {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      code: code,
      grant_type: 'authorization_code'
    };
    return this.http.post('https://www.strava.com/oauth/token', body);
  }

  private getAthleteData(): void {
    const token = localStorage.getItem('stravaToken');
    const headers = { Authorization: 'Bearer ' + token };
    this.http.get(this.apiUrl + '/athlete', { headers }).subscribe(
      (data) => {
        this.athleteData = data;
        this.getAthleteStats();
        this.getAthleteActivities();
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  private getAthleteStats(): void {
    const token = localStorage.getItem('stravaToken');
    const headers = { Authorization: 'Bearer ' + token };
    this.http
      .get(`https://www.strava.com/api/v3/athletes/${this.athleteData.id}/stats`, { headers })
      .subscribe(
        (data) => {
          this.athleteStats = data;
        },
        (error) => {
          console.error('Error:', error);
        }
      );
  }

  private getAthleteActivities(): void {
    const token = localStorage.getItem('stravaToken');
    const headers = { Authorization: 'Bearer ' + token };
    this.http.get(`https://www.strava.com/api/v3/activities`, { headers }).subscribe(
      (data) => {
        this.athleteActivities = data;
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }
}

import { Component, OnInit, ElementRef } from '@angular/core';
import { ROUTES } from '../sidebar/sidebar.component';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Router } from '@angular/router';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public focus;
  public listTitles: any[];
  public location: Location;

  public userData: any;

  private apiUrl = 'https://www.strava.com/api/v3';
  private clientId = '125421';
  private redirectUri = window.location.origin;
  private clientSecret = '349613ffbf4a36801a739a6bd1beea68cea4f09c';

  constructor(private http: HttpClient, private router: Router, location: Location) {
    this.location = location;
    const code = new URL(window.location.href).searchParams.get('code');
    if (code) {
      this.getAccessToken(code).subscribe((data: any) => {
        localStorage.setItem('stravaToken', data.access_token);
        // this.router.navigate(['/']);
        this.getStravaData();
      });
    }
  }

  ngOnInit() {
    this.listTitles = ROUTES.filter((listTitle) => listTitle);
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

  getAccessToken(code: string): Observable<any> {
    const body = {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      code: code,
      grant_type: 'authorization_code'
    };
    return this.http.post('https://www.strava.com/oauth/token', body);
  }

  getStravaData(): void {
    const token = localStorage.getItem('stravaToken');
    const headers = { Authorization: 'Bearer ' + token };
    this.http.get(this.apiUrl + '/athlete', { headers }).subscribe((data) => {
      console.log(data);
      this.userData = data;
      this.getAthleteData();
    });
  }

  logoutFromStrava(): void {
    const token = localStorage.getItem('stravaToken');
    const headers = { Authorization: 'Bearer ' + token };
    this.http.post('https://www.strava.com/oauth/deauthorize', {}, { headers }).subscribe(
      (data) => {
        console.log(data);
        // Remove the token from local storage
        localStorage.removeItem('stravaToken');
        // Update the user's login status and other necessary actions
        this.userData = null;
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  getAthleteData(): void {
    const token = localStorage.getItem('stravaToken');
    const headers = { Authorization: 'Bearer ' + token };
    // this.http.get('https://www.strava.com/api/v3/athlete', { headers }).subscribe(
    //   (data) => {
    //     console.log(data);
    //     // Handle the data here
    //   },
    //   (error) => {
    //     console.error('Error:', error);
    //   }
    // );

    // this.http.get('https://www.strava.com/api/v3/athletes/38174313/stats', { headers }).subscribe(
    //   (data) => {
    //     console.log(data);
    //     // Handle the data here
    //   },
    //   (error) => {
    //     console.error('Error:', error);
    //   }
    // );

    this.http
      .get(`https://www.strava.com/api/v3/athletes/${this.userData.id}/stats`, { headers })
      .subscribe(
        (data) => {
          console.log(data);
          // Handle the data here
        },
        (error) => {
          console.error('Error:', error);
        }
      );

    this.http.get(`https://www.strava.com/api/v3/athlete/zones&scope=read_all,activity:read_all`, { headers }).subscribe(
      (data) => {
        console.log(data);
        // Handle the data here
      },
      (error) => {
        console.error('Error:', error);
      }
    );

    this.http.get(`https://www.strava.com/api/v3/segments/starred`, { headers }).subscribe(
      (data) => {
        console.log(data);
        // Handle the data here
      },
      (error) => {
        console.error('Error:', error);
      }
    );

    this.http.get(`https://www.strava.com/api/v3/segments/explore`, { headers }).subscribe(
      (data) => {
        console.log(data);
        // Handle the data here
      },
      (error) => {
        console.error('Error:', error);
      }
    );

    this.http.get(`https://www.strava.com/api/v3/segment_efforts`, { headers }).subscribe(
      (data) => {
        console.log(data);
        // Handle the data here
      },
      (error) => {
        console.error('Error:', error);
      }
    );

    this.http.get(`https://www.strava.com/api/v3/activities`, { headers }).subscribe(
      (data) => {
        console.log(data);
        // Handle the data here
      },
      (error) => {
        console.error('Error:', error);
      }
    );

    this.http.get(`https://www.strava.com/api/v3/athlete/activities`, { headers }).subscribe(
      (data) => {
        console.log(data);
        // Handle the data here
      },
      (error) => {
        console.error('Error:', error);
      }
    );

    this.http.get(`https://www.strava.com/api/v3/athlete/clubs`, { headers }).subscribe(
      (data) => {
        console.log(data);
        // Handle the data here
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }
}

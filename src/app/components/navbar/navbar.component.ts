import { Component, OnInit } from '@angular/core';
import { ROUTES } from '../sidebar/sidebar.component';
import { Location } from '@angular/common';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { DataSharedDataService } from '../../services/data-share.service';
import { NetworkService } from '../../services/network.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public listTitles: any[];
  public location: Location;

  public athlete = {} as any;
  public athletes = [] as any[];

  // private token = '';
  private tokens = [];

  private apiUrl = 'https://www.strava.com/api/v3';
  private clientId = '125421';
  private redirectUri = window.location.origin;
  private clientSecret = '349613ffbf4a36801a739a6bd1beea68cea4f09c';

  constructor(
    location: Location,
    private http: HttpClient,
    private router: Router,
    private dataSharedDataService: DataSharedDataService,
    private networkService: NetworkService
  ) {
    this.location = location;
  }

  ngOnInit() {
    this.listTitles = ROUTES.filter((listTitle) => listTitle);

    const code = new URL(window.location.href).searchParams.get('code');
    if (code) {
      this.getAccessToken(code).subscribe((data: any) => {
        this.networkService.addToken(data.access_token).subscribe(
          (data) => {
            // this.router.navigate([], { replaceUrl: true });
            this.router.navigate(['']).then(() => {
              window.location.reload();
            });
            // this.networkService.getTokens().subscribe((data) => {
            //   this.tokens = data;
            //   // this.token = data[0];

            //   if (this.tokens.length > 0) {
            //     for (let i = 0; i < this.tokens.length; i++) {
            //       // this.token = this.tokens[i];
            //       this.getAthleteData(this.tokens[i]);
            //     }
            //     // this.getAthleteData();
            //   }
            //   //   else {
            //   //     const code = new URL(window.location.href).searchParams.get('code');
            //   //     if (code) {
            //   //       this.getAccessToken(code).subscribe((data: any) => {
            //   //         this.networkService.addToken(data.access_token).subscribe();
            //   //         this.tokens.push(data.access_token);
            //   //         this.getAthleteData(data.access_token);
            //   //       });
            //   //     }
            //   //   }
            // });
          },
          (error) => {
            console.error('Error:', error);
          }
        );
        // this.tokens.push(data.access_token);
        // for (let i = 0; i < this.tokens.length; i++) {
        //   this.getAthleteData(this.tokens[i]);
        // }
        // this.getAthleteData(data.access_token);
        // this.router.navigateByUrl('/dashboard');
      });
    } else {
      this.networkService.getTokens().subscribe((data) => {
        this.tokens = data;
        // this.token = data[0];

        if (this.tokens.length > 0) {
          for (let i = 0; i < this.tokens.length; i++) {
            // this.token = this.tokens[i];
            this.getAthleteData(this.tokens[i]);
          }
          // this.getAthleteData();
        }
        //   else {
        //     const code = new URL(window.location.href).searchParams.get('code');
        //     if (code) {
        //       this.getAccessToken(code).subscribe((data: any) => {
        //         this.networkService.addToken(data.access_token).subscribe();
        //         this.tokens.push(data.access_token);
        //         this.getAthleteData(data.access_token);
        //       });
        //     }
        //   }
      });
    }
  }

  getTitle() {
    var title = this.location.prepareExternalUrl(this.location.path());
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
    // const headers = { Authorization: 'Bearer ' + token };
    // this.http.post('https://www.strava.com/oauth/deauthorize', {}, { headers }).subscribe(
    //   () => {
    //     this.networkService.removeToken(token).subscribe();
    //     this.athlete = {};
    //     this.dataSharedDataService.setData([]);
    //     this.router.navigateByUrl('/dashboard');
    //   },
    //   (error) => {
    //     console.error('Error:', error);
    //   }
    // );
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

  private getAthleteData(token: string): void {
    const headers = { Authorization: 'Bearer ' + token };
    this.http.get(this.apiUrl + '/athlete', { headers }).subscribe(
      (data) => {
        this.athlete.details = data;
        this.getAthleteStats(token);
        this.getAthleteActivities(token);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  private getAthleteStats(token: string): void {
    const headers = { Authorization: 'Bearer ' + token };
    this.http
      .get(`https://www.strava.com/api/v3/athletes/${this.athlete.details.id}/stats`, { headers })
      .subscribe(
        (data) => {
          this.athlete.stats = data;
        },
        (error) => {
          console.error('Error:', error);
        }
      );
  }

  private getAthleteActivities(token: string): void {
    const headers = { Authorization: 'Bearer ' + token };
    this.http.get(`https://www.strava.com/api/v3/activities`, { headers }).subscribe(
      (data) => {
        this.athlete.activities = data;
        this.athletes.push(this.athlete);
        this.dataSharedDataService.setData(this.athletes);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }
}

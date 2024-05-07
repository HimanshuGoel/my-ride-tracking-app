import { Component } from '@angular/core';
import { DataSharedDataService } from '../../services/data-share.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  constructor(private dataSharedDataService: DataSharedDataService) {}

  public athletes = [] as any[];

  ngOnInit() {
    this.dataSharedDataService.getData().subscribe((data) => {
      this.athletes = data;
    });
  }
}

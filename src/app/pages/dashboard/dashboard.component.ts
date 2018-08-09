import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core'

@Component({
  selector: 'ngx-dashboard',
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {

  constructor (
  ) {
    console.log('hello dashboard')
  }

  ngOnInit () {
    console.log('ngOnInit hello dashboard')
  }

}

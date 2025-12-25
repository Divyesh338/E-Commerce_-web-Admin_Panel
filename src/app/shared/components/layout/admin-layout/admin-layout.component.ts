import { Component } from '@angular/core';
import { CollaspeService } from 'src/app/shared/services/collaspe.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent {
  constructor(public _collaspeService: CollaspeService) { }
}

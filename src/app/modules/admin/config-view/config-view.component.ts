import {Component, Input} from '@angular/core';
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {MatCard} from "@angular/material/card";

@Component({
  selector: 'app-config-view',
  standalone: true,
  imports: [
    MatGridTile,
    MatGridList,
    MatCard
  ],
  templateUrl: './config-view.component.html',
  styleUrl: './config-view.component.scss'
})
export class ConfigViewComponent {
  @Input() dataProvider: any;
}

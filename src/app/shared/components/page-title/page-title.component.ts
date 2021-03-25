import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-page-title',
  templateUrl: './page-title.component.html',
  styleUrls: ['./page-title.component.scss']
})
export class PageTitleComponent {

  @Input() navigateText: string;
  @Input() pageTitle: string;
  @Output() navigate: EventEmitter<void> = new EventEmitter<void>();
}

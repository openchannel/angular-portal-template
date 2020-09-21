import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GraphqlService } from '../../../../../graphql-client/graphql-service/graphql.service';

@Component({
  selector: 'app-app-types',
  templateUrl: './app-types.component.html',
  styleUrls: ['./app-types.component.scss']
})
export class AppTypesComponent implements OnInit {

  public appTypes: FormArray = new FormArray([]);
  constructor(private fb: FormBuilder,
              private graphQLService: GraphqlService) { }

  ngOnInit(): void {
    this.getAppTypes();
  }

  // todo this function will get all previously created apps
  getAppTypes(): void {
    this.addAppType();
  }

  addAppType(): void {
    const appForm = this.fb.group({
      label: ['', Validators.required],
      id: ['', Validators.required],
      description: [''],
    });

    this.appTypes.push(appForm);
  }
}

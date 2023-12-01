import { Component, Inject, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorService } from 'src/app/usit/services/vendor.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  ISnackBarData,
  SnackBarService,
} from 'src/app/services/snack-bar.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SearchPipe } from 'src/app/pipes/search.pipe';
import { Vms } from 'src/app/usit/models/vms';
import { MatCardModule } from '@angular/material/card';
import { NgxMatIntlTelInputComponent } from 'ngx-mat-intl-tel-input';
import { NgxGpAutocompleteModule } from '@angular-magic/ngx-gp-autocomplete';
import { Loader } from '@googlemaps/js-api-loader';
import {
  Observable,
  debounceTime,
  distinctUntilChanged,
  tap,
  switchMap,
  of,
  Subject,
  takeUntil,
} from 'rxjs';
import { Company } from 'src/app/usit/models/company';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';

@Component({
  selector: 'app-add-submission',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    SearchPipe,
    MatCardModule,
    NgxMatIntlTelInputComponent,
    NgxGpAutocompleteModule,
    MatRadioModule,
    MatCheckboxModule
  ],
  templateUrl: './add-submission.component.html',
  styleUrls: ['./add-submission.component.scss']
})
export class AddSubmissionComponent {

  submissionForm: any = FormGroup;
  requirementdata: any = [];
  private formBuilder = inject(FormBuilder);


  private initilizeAddEmployeeForm(submissionData: any) {
    
    this.submissionForm = this.formBuilder.group({

      consultant: this.formBuilder.group({
        consultantid: new FormControl(submissionData ? submissionData.role.roleid : '', [
          Validators.required
        ]),
      }),

      user: this.formBuilder.group({
        userid: localStorage.getItem('userid'),
      }),

      flg: [],

      requirement: this.formBuilder.group({
        requirementid: localStorage.getItem('userid'),
      }),



      position: [submissionData ? submissionData.position : '', [Validators.required]],
      source: [submissionData ? submissionData.source : '', [Validators.required]],
      projectlocation: [submissionData ? submissionData.projectlocation : '', [Validators.required]],
      ratetype: [submissionData ? submissionData.ratetype : '', [Validators.required]],
      submissionrate: [submissionData ? submissionData.submissionrate : '', [Validators.required]],
      endclient: [submissionData ? submissionData.endclient : '', [Validators.required]],
      implpartner: [submissionData ? submissionData.implpartner : '', [Validators.required]],

      vendor: this.formBuilder.group({
        vmsid: new FormControl(submissionData ? submissionData.role.vmsid : '', [Validators.required]),
      }),

      recruiter: this.formBuilder.group({
        recid: new FormControl(submissionData ? submissionData.role.recid : '', [Validators.required]),
      }),

      empcontact: [submissionData ? submissionData.empcontact.internationalNumber : '', [Validators.required]],
      companycontactnumber: [submissionData && submissionData.companycontactnumber ? submissionData.companycontactnumber.internationalNumber : ''],
      designation: [submissionData ? submissionData.designation : ''],
      department: [submissionData ? submissionData.department : '', Validators.required],
      joiningdate: [submissionData ? submissionData.joiningdate : '', Validators.required],
      // relievingdate: [submissionData ? submissionData.relievingdate : '', [this.relievingDateValidator]],
      empmail: [
        submissionData ? submissionData.empmail : '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        ],
      ],
    });

  } 
  onSubmit(){

  }

  onCancel() {
    // this.dialogRef.close();
  }
}

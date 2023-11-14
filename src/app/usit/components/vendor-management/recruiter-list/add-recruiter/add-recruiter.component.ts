import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ISnackBarData, SnackBarService } from 'src/app/services/snack-bar.service';
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
import { RecruiterService } from 'src/app/usit/services/recruiter.service';
import { Observable, debounceTime, distinctUntilChanged, tap, switchMap, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { AddVendorComponent } from '../../vendor-list/add-vendor/add-vendor.component';
import { DialogService } from 'src/app/services/dialog.service';
import { MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'app-add-recruiter',
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
    NgxMatIntlTelInputComponent
  ],
  templateUrl: './add-recruiter.component.html',
  styleUrls: ['./add-recruiter.component.scss']
})
export class AddRecruiterComponent implements OnInit {
  entity = new Vms();
  recruiterForm: any = FormGroup;
  submitted = false;
  rolearr: { company: string }[] = [
    // { company: 'abc tech' },
    // { company: 'narvee solutions' },
    // { company: 'hcl' },
  ];
  cityarr: any = [];
  pinarr: any = [];
  statearr: any = [];
  filteredOptions: any;
  vmsid!: any;
  private recruiterServ = inject(RecruiterService);
  private snackBarServ = inject(SnackBarService);
  private dialogServ = inject(DialogService);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  searchObs$!: Observable<any>;
  companySearchData: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) protected data: any,
    public dialogRef: MatDialogRef<AddRecruiterComponent>
  ) { }
  ngOnInit(): void {
    this.getvendorcompanydetails()
    if (this.data.actionName === 'edit-recruiter') {
      this.iniRecruiterForm(this.data.RecruiterData);
      console.log(this.data.RecruiterData);
    } else {
      this.iniRecruiterForm(null);
    }
    // this.filteredOptions = this.autoInput.valueChanges.pipe(
    //   startWith(''),
    //   map(value => this._filter(value || '')),
    // );
  }

  // private _filter(value: any) {
  //   const filterValue = value.toLowerCase();

  //   return this.rolearr.filter(option => option.toLowerCase().includes(filterValue));
  // }

  /**
   * initializes Recruiter Form
   */
  private iniRecruiterForm(recruiterData: any) {
    this.recruiterForm = this.formBuilder.group(
      {
        autoInput: [recruiterData ? recruiterData.company : '', Validators.required],
        recruiter: [recruiterData ? recruiterData.recruiter : ''],
        email: [recruiterData ? recruiterData.email : '', [Validators.required, Validators.email, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$')]],
        usnumber: [recruiterData ? recruiterData.usnumber : ''],
        contactnumber: [recruiterData ? recruiterData.usnumber : ''],
        extension: [recruiterData ? recruiterData.extension : ''],
        recruitertype: [recruiterData ? recruiterData.recruitertype : '', Validators.required],
        details: [recruiterData ? recruiterData.details : ''],
        addedby: [this.entity.addedby],
        updatedby: [this.entity.updatedby],
        vendor: this.formBuilder.group({
          vmsid: [this.recruiterForm.vmsid],
        }),
        user: this.formBuilder.group({
          userid: localStorage.getItem('userid'),
        })
      }
    );
    if (this.data.actionName === 'edit-recruiter') {
      this.recruiterForm.addControl('recid', new FormControl(recruiterData ? recruiterData.recid : ''));
      this.recruiterForm.addControl('status', new FormControl(recruiterData ? recruiterData.status : ''));
      this.recruiterForm.addControl('remarks', new FormControl(recruiterData ? recruiterData.remarks : ''));
      this.recruiterForm.addControl('rec_stat', new FormControl(recruiterData ? recruiterData.rec_stat : ''));
      console.log(this.recruiterForm.value)
    }
    this.validateControls()
  }

  validateControls() {

    this.companyAutoCompleteSearch()
  }

  companyAutoCompleteSearch() {
    this.searchObs$ = this.recruiterForm.get('autoInput').valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((term: any) => {
        if (term) {
          console.log(term)
          return this.getFilteredValue(term);
        }
        else {
          this.companySearchData = [];
          return of<any>([]);
        }
      }
      ),
      // Uncomment below to verify the searched result
      // tap((res) => {
      //   console.log({res})

      // }),

    );



  }
  onSubmit() {
    const dataToBeSentToSnackBar: ISnackBarData = {
      message: '',
      duration: 2500,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      direction: 'above',
      panelClass: ['custom-snack-success'],
    };
    if (this.recruiterForm.invalid) {
      //this.blur = "enable"
      this.displayFormErrors();
      return;
    }
    console.log(this.data.actionName + " recruiterForm.value", this.recruiterForm.value);
    this.recruiterServ.addOrUpdateRecruiter(this.recruiterForm.value, this.data.actionName)
      .subscribe({
         next: (data: any) => {
          // this.blur = "Active";
          if (data.status == 'success') {
            dataToBeSentToSnackBar.message =
              this.data.actionName === 'add-recruiter'
                ? 'Recruiter added successfully'
                : 'Recruiter updated successfully';
            this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
            this.recruiterForm.reset();
          }
          else {
            // this.blur = "enable"
            dataToBeSentToSnackBar.message =
              this.data.actionName === 'add-recruiter'
                ? 'Recruiter addition is failed'
                : 'Recruiter updation is failed';
            dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
            this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
          }
          this.dialogRef.close();
        },
        error: (err) => {
          //this.blur = 'enable';
          dataToBeSentToSnackBar.message =
            this.data.actionName === 'add-recruiter'
              ? 'Employee addition is failed'
              : 'Employee updation is failed';
          dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
        },
  });
      
  }

  flg!: any;
  dept = 'all';

  getvendorcompanydetails() {
    this.flg = localStorage.getItem('department');
    const role = localStorage.getItem('role');

    if (role == 'Super Admin' || role == 'Admin') {
      this.dept = "all";
    }
    if (this.flg == 'Recruiting') {
      this.dept = 'Recruiting'
    }
    if (this.flg == 'Bench Sales') {
      this.dept = 'Bench Sales'
    }
    this.recruiterServ.getCompanies(this.dept).subscribe(
      (response: any) => {
        console.log(response.data);
        this.rolearr = response.data;
        console.log(this.rolearr)
        // for( let i =0 ; i< this.rolearr.length; i++){
        //   console.log(this.rolearr[i]);
        //   this.rolearr = this.rolearr[i];
        // }
      }
    )
  }

  displayFormErrors() {
    Object.keys(this.recruiterForm.controls).forEach((field) => {
      const control = this.recruiterForm.get(field);
      if (control && control.invalid) {
        control.markAsTouched();
      }
    });
  }

  emailDuplicate(event: any) {
    const email = event.target.value;
    this.recruiterServ.duplicatecheckEmail(email).subscribe(
      (response: any) => {
        if (response.status == 'success') {
          //this.message = '';
        }
        else if (response.status == 'duplicate') {
          const cn = this.recruiterForm.get('email');
          cn.setValue('');
          //this.message = 'Record already available with given Mail address';
        }
        else {
          //alertify.error("Internal Server Error");
        }
      }
    )
  }


  onCancel() {
    this.dialogRef.close();
  }

  /**
   * filters the data for searched input query
   * @param term
   * @returns
   */
  getFilteredValue(term: any): Observable<any> {
    if (term && this.rolearr) {
      const sampleArr = this.rolearr.filter((val: any) => val.company.trim().toLowerCase().includes(term.trim().toLowerCase()) == true)
      this.companySearchData = sampleArr;
      return of(this.companySearchData);
    }
    return of([])
  }

  navigateToAddVendor() {
    const actionData = {
      title: 'Add Vendor',
      vendorData: null,
      actionName: 'add',
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '65vw';
    // dialogConfig.height = "100vh";
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'add-vendor';
    dialogConfig.data = actionData;

    this.dialogServ.openDialogWithComponent(AddVendorComponent, dialogConfig);

  }

  goToVendorList() {
    this.dialogRef.close();
    this.router.navigate(['/usit/vendors']);
  }

  onVendorSelect(vendor: any){
    console.log(vendor);
    this.recruiterForm.get('vendor.vmsid').setValue(vendor.id);
  }

}

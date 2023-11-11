import { Component, Inject, OnInit, inject } from '@angular/core';
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
} from 'rxjs';
import { Company } from 'src/app/usit/models/company';

@Component({
  selector: 'app-add-vendor',
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
  ],
  providers: [
    {
      provide: Loader,
      useValue: new Loader({
        apiKey: 'AIzaSyCT0z0QHwdq202psuLbL99GGd-QZMTm278',
        libraries: ['places'],
      }),
    },
  ],
  templateUrl: './add-vendor.component.html',
  styleUrls: ['./add-vendor.component.scss'],
})
export class AddVendorComponent implements OnInit {
  entity = new Vms();
  vendorForm: any = FormGroup;
  submitted = false;
  rolearr: any = [];
  cityarr: any = [];
  pinarr: any = [];
  statearr: any = [];
  private vendorServ = inject(VendorService);
  private snackBarServ = inject(SnackBarService);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  options = {
    componentRestrictions: { country: ['IN', 'US'] },
  };

  companySearchData: any[] = [];
  searchObs$!: Observable<any>;
  selectOptionObj = {
    companyType: COMPANY_TYPE,
    tierType: TIER_TYPE,
    vendorType: VENDOR_TYPE,
    statusType: STATUS_TYPE,
  };
  constructor(
    @Inject(MAT_DIALOG_DATA) protected data: any,
    public dialogRef: MatDialogRef<AddVendorComponent>
  ) {}
  ngOnInit(): void {
    this.getvendorcompanydetails(); //This method will be  called for company auto-complete search
    this.iniVendorForm();
  }

  /**
   * initializes vendor Form
   */
  private iniVendorForm() {
    this.vendorForm = this.formBuilder.group({
      company: [
        this.data.vendorData ? this.data.vendorData.company : '',
        [Validators.required],
      ],
      //  fedid: [this.data.vendorData ? this.data.vendorData.fedid : ''],
      vendortype: [
        this.data.vendorData ? this.data.vendorData.vendortype : '',
        Validators.required,
      ],
      companytype: [
        this.data.vendorData ? this.data.vendorData.companytype : '',
      ],
      tyretype: [this.data.vendorData ? this.data.vendorData.tyretype : ''],
      client: [this.data.vendorData ? this.data.vendorData.client : ''],
      addedby: [this.entity.addedby],
      updatedby: [this.entity.updatedby],
      details: [this.data.vendorData ? this.data.vendorData.details : ''],
      staff: [this.data.vendorData ? this.data.vendorData.staff : ''],
      revenue: [this.data.vendorData ? this.data.vendorData.revenue : ''],
      website: [this.data.vendorData ? this.data.vendorData.website : ''],
      facebook: [this.data.vendorData ? this.data.vendorData.facebook : ''],
      industrytype: [
        this.data.vendorData ? this.data.vendorData.industrytype : '',
      ],
      linkedinid: [this.data.vendorData ? this.data.vendorData.linkedinid : ''],
      twitterid: [this.data.vendorData ? this.data.vendorData.twitterid : ''],
      user: this.formBuilder.group({
        userid: localStorage.getItem('userid'),
      }),
      headquerter: [
        this.data.vendorData ? this.data.vendorData.headquerter : '',
        Validators.required,
      ],
    });
    if (this.data.actionName === 'edit-vendor') {
      this.vendorForm.addControl(
        'status',
        this.formBuilder.control(
          this.data.vendorData ? this.data.vendorData.status : ''
        )
      );
      this.vendorForm.addControl(
        'vmsid',
        this.formBuilder.control(
          this.data.vendorData ? this.data.vendorData.id : ''
        )
      );
      this.vendorForm.addControl(
        'vms_stat',
        this.formBuilder.control(
          this.data.vendorData ? this.data.vendorData.vms_stat : ''
        )
      );
    }
    this.validateControls(this.data.actionName);
  }

  validateControls(action = 'add-vendor') {
    if (action === 'edit-vendor') {
      this.vendorForm.get('status').valueChanges.subscribe((res: any) => {
        const remarks = this.vendorForm.get('remarks');
        if (res === 'Rejected') {
          //this.rejectionflg = true;
          remarks.setValidators(Validators.required);
        } else {
          //this.rejectionflg = false;
          remarks.clearValidators();
        }
        remarks.updateValueAndValidity();
        if (res == 'Active') {
          this.vendorForm.get('vms_stat').setValue('Initiated');
        }
      });
      return;
    }
    this.vendorForm.get('vendortype').valueChanges.subscribe((res: any) => {
      const vntype = this.vendorForm.get('vendortype').value;
      const trtype = this.vendorForm.get('tyretype');
      if (vntype == 'Primary Vendor') {
        trtype.setValue('Primary Vendor');
      } else if (vntype == 'Implementation Partner') {
        trtype.setValue('Implementation Partner');
      } else if (vntype == 'Client') {
        trtype.setValue('Client');
      } else {
        trtype.setValue('');
      }
      if (res == 'Tier') {
        trtype.setValidators(Validators.required);
      } else {
        trtype.clearValidators();
      }
      trtype.updateValueAndValidity();
    });
    this.companyAutoCompleteSearch();
  }

  /**
   * getVendor Company Details
   */
  getvendorcompanydetails() {
    this.vendorServ.getCompanies().subscribe({
      next: (response: any) => {
        this.rolearr = response.data;
        console.log('rolearr.data', response.data);
      },
      error: (err) => {
        // error
      },
    });
  }

  dupcheck(event: any) {
    const vendor = event.target.value;
    this.vendorServ.duplicatecheck(vendor, 0).subscribe((response: any) => {
      if (response.status == 'success') {
        // this.message = '';
      } else if (response.status == 'duplicate') {
        const cn = this.vendorForm.get('company');
        cn.setValue('');
        // this.message = 'Vendor Company already exist';
        // alertify.error("Vendor Company already exist");
      } else {
        // alertify.error("Internal Server Error");
      }
    });
  }

  /**
   * Submit
   */
  onSubmit() {
    this.submitted = true;
    const dataToBeSentToSnackBar: ISnackBarData = {
      message: '',
      duration: 2500,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      direction: 'above',
      panelClass: ['custom-snack-success'],
    };

    if (this.vendorForm.invalid) {
      this.displayFormErrors();
      return;
    }
    this.vendorForm.controls.updatedby.setValue(localStorage.getItem('userid'));
    console.log('form.value  ===', this.vendorForm.value);
    this.vendorServ
      .addORUpdateVendor(this.vendorForm.value, this.data.actionName)
      .subscribe({
        next: (data: any) => {
          if (data.status == 'success') {
            dataToBeSentToSnackBar.message =
              this.data.actionName === 'add-vendor'
                ? 'Vendor added successfully'
                : 'Vendor updated successfully';
            this.dialogRef.close();
          } else {
            dataToBeSentToSnackBar.message = 'Vendor already Exists';
          }
          this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
        },
        error: (err) => {
          dataToBeSentToSnackBar.message =
            this.data.actionName === 'add-vendor'
              ? 'Vendor addition is failed'
              : 'Vendor updation is failed';
          dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
        },
      });
  }

  /** to display form validation messages */
  displayFormErrors() {
    Object.keys(this.vendorForm.controls).forEach((field) => {
      const control = this.vendorForm.get(field);
      if (control && control.invalid) {
        control.markAsTouched();
      }
    });
  }

  companyAutoCompleteSearch() {
    this.searchObs$ = this.vendorForm.get('company').valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((term: any) => {
        if (term) {
          console.log(term);
          return this.getFilteredValue(term);
        } else {
          this.companySearchData = [];
          return of<any>([]);
        }
      })
      // Uncomment below to verify the searched result
      // tap((res) => {
      //   console.log({res})

      // }),
    );
  }
  /**
   * filters the data for searched input query
   * @param term
   * @returns
   */
  getFilteredValue(term: any): Observable<any> {
    if (term && this.rolearr) {
      const sampleArr = this.rolearr.filter(
        (val: any) =>
          val.company
            .trim()
            .toLowerCase()
            .includes(term.trim().toLowerCase()) == true
      );
      this.companySearchData = sampleArr;
      return of(this.companySearchData);
    }
    return of([]);
  }

  /**
   * handle address change
   * @param address
   */

  handleAddressChange(address: any) {
    console.log('address', address.formatted_address);
    this.vendorForm.controls.headquerter.setValue(address.formatted_address);
    // this.entity.headquerter = address.formatted_address;
  }
  /**
   * Cancel
   */
  onCancel() {
    this.dialogRef.close();
  }
}

export const VENDOR_TYPE = [
  'Primary Vendor',
  'Implementation Partner',
  'Client',
  'Tier',
] as const;

export const TIER_TYPE = [
  'Tier One',
  'Tier Two',
  'Tier Three',
  'Primary Vendor',
  'Implementation Partner',
  'Client',
] as const;

export const COMPANY_TYPE = ['Recruiting', 'Bench Sales', 'Both'] as const;

export const STATUS_TYPE = ['Active', 'Approved', 'Rejected'] as const;

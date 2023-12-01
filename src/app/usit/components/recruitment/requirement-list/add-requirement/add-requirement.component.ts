import { CommonModule } from '@angular/common';
import {
  Component,
  Inject,
  inject,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  ISnackBarData,
  SnackBarService,
} from 'src/app/services/snack-bar.service';
import { RequirementService } from 'src/app/usit/services/requirement.service';
import { MatCardModule } from '@angular/material/card';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Observable, debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
import { NgxGpAutocompleteModule } from '@angular-magic/ngx-gp-autocomplete';
import { Loader } from '@googlemaps/js-api-loader';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-requirement',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatAutocompleteModule,
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
  templateUrl: './add-requirement.component.html',
  styleUrls: ['./add-requirement.component.scss'],
})
export class AddRequirementComponent {

  requirementForm!: FormGroup;
  private formBuilder = inject(FormBuilder);
  private requirementServ = inject(RequirementService);
  private snackBarServ = inject(SnackBarService);
  private router = inject(Router);
  protected isFormSubmitted: boolean = false;
  allowAction = false;
  reqnumber!: any;
  maxnumber!: number;
  currentDate = new Date();
  todayDate = formatDate(this.currentDate, 'yyyy-MM-dd', 'en-US');
  reqNumberDate = formatDate(this.currentDate, 'yyMM', 'en-US');
  vendordata: any = [];
  searchObs$!: Observable<any>;
  options = {
    componentRestrictions: { country: ['IN', 'US'] },
  };
  vendorCompanyArr: { company: string }[] = [];



  constructor(
    @Inject(MAT_DIALOG_DATA) protected data: any,
    public dialogRef: MatDialogRef<AddRequirementComponent>
  ) {}

  ngOnInit(): void {
    if(this.data.actionName === "edit-requirement"){
      this.initializeTechnologyForm(this.data.requirementData);
    }else{
      this.initializeTechnologyForm(this.data.requirementData);
      this.requirementServ.getReqNumber().subscribe(
        (response: any) => {
          console.log(response);
          if (response.data == null) {
            this.reqnumber = 101;
            this.maxnumber = 101;
          }
          else {
            this.maxnumber = parseInt(response.data) + 1;
            this.reqnumber = parseInt(response.data) + 1;
          }
          this.reqnumber = "NVT" + this.reqNumberDate + ("00000" + this.reqnumber).slice(-5);
          this.requirementForm.get('reqnumber')?.setValue(this.reqnumber);
          this.requirementForm.get('postedon')?.setValue(this.todayDate);
        })
        this.requirementServ.getVendorCompanies('Recruiting').subscribe(
          (response: any) => {
            this.vendordata = response.data;
            console.log(this.vendordata)
          }
        );
    }
  }

  private initializeTechnologyForm(data : any) {
    this.requirementForm = this.formBuilder.group({
      reqnumber: [data ? data.reqnumber : '', Validators.required],
      postedon: [data ? data.postedon : '', Validators.required],
      location: [data ? data.location : '', Validators.required],
      vendor: [data ? data.vendor : '', Validators.required],
      client: [data ? data.client : '',],
      jobexperience: [data ? data.jobexperience : '',],
      employmenttype: [data ? data.employmenttype : '', Validators.required],
      jobtitle: [data ? data.jobtitle : '', Validators.required],

    });
    this.validateControls()
  }

  validateControls() {
    this.companyAutoCompleteSearch()
  }

  companyAutoCompleteSearch() {
    this.searchObs$ = this.requirementForm.get('vendor')!.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((term: any) => {
        if (term) {
          console.log(term)
          return this.getFilteredValue(term);
        }
        else {
          this.vendordata = [];
          return of<any>([]);
        }
      }
      ),
    );
  }

  getFilteredValue(term: any): Observable<any> {
    if (term && this.vendorCompanyArr) {
      const sampleArr = this.vendorCompanyArr.filter((val: any) => val.company.trim().toLowerCase().includes(term.trim().toLowerCase()) == true)
      this.vendordata = sampleArr;
      return of(this.vendordata);
    }
    return of([])
  }

  onSubmit () {

  }

  onCancel() {
    this.dialogRef.close();
  }

  handleAddressChange(address: any) {
    console.log('address', address.formatted_address);
    this.requirementForm.controls['location'].setValue(address.formatted_address);
    // this.entity.headquerter = address.formatted_address;
  }

  goToVendorList() {
    this.dialogRef.close();
    this.router.navigate(['/usit/vendors']);
  }

  onVendorSelect(vendor: any){
    console.log(vendor);
    this.requirementForm.get('vendor')!.setValue(vendor.id);
  }

}

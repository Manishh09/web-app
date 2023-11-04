import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorService } from 'src/app/usit/services/vendor.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SnackBarService } from 'src/app/services/snack-bar.service';
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

  constructor(
    @Inject(MAT_DIALOG_DATA) protected data: any,
    public dialogRef: MatDialogRef<AddRecruiterComponent>
  ) {}
  ngOnInit(): void {
    this.iniVendorForm();
  }

  /**
   * initializes vendor Form
   */
  private iniVendorForm() {
    this.vendorForm = this.formBuilder.group(
      {
        company: ['', [Validators.required]],
        fedid: [this.vendorForm.fedid],
        vendortype: ['', Validators.required],
        companytype: ['', Validators.required],
        tyretype: [''],
        client: [this.entity.client],
        addedby: [this.entity.addedby],
        updatedby: [this.entity.updatedby],
        details: [this.vendorForm.details],
        staff: [this.entity.staff],
        revenue: [this.entity.revenue],
        website: [this.entity.website],
        facebook: [this.entity.facebook],
        industrytype: [this.entity.industrytype],
        linkedinid: [this.entity.linkedinid],
        twitterid: [this.entity.twitterid],
        user: this.formBuilder.group({
          userid: localStorage.getItem('userid'),
        }),
        headquerter: ['', Validators.required],

          // edit form
          vmsid: [this.entity.vmsid],
          vms_stat: [this.entity.vms_stat],
      }
    );
    //this.validateControls()
  }


  onSubmit(){
    if (this.vendorForm.invalid) {
      // this.blur = "enable"
      //this.displayFormErrors();
      return;
    }
    else {
      // this.blur = "Active"
    }
    // this.ngxService.start();
   // console.log(JSON.stringify(this.form.value, null, 2));
    this.vendorServ.registerEntity(this.vendorForm.value)
      .subscribe(
        (data: any) => {
          // this.ngxService.stop();
          // this.blur = "Active";
          if (data.status == 'success') {
            // alertify.success("Vendor Added successfully");
            // this.form.reset();
            // this.router.navigate(['list-vendor']);
            this.dialogRef.close();
          }
          else {
            // this.ngxService.stop();
            // this.blur = "enable"
            // this.message = data.message;
            // alertify.error("Vendor Already Exists");
          }
        }
      );
  }


  onCancel(){
    this.dialogRef.close();
  }

}

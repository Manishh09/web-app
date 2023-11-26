import { CommonModule } from '@angular/common';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  Inject,
  InjectionToken,
  inject,
  ViewChild,
  ElementRef,
} from '@angular/core';
import {
  Validators,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  FormControl,
  AbstractControl,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {MatSelectChange, MatSelectModule} from '@angular/material/select';
import { Router } from '@angular/router';
import { Observable, startWith, map, takeUntil, Subject } from 'rxjs';
import { EmployeeManagementService } from 'src/app/usit/services/employee-management.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  ISnackBarData,
  SnackBarService,
} from 'src/app/services/snack-bar.service';
import { SearchPipe } from 'src/app/pipes/search.pipe';
import { NgxMatIntlTelInputComponent } from 'ngx-mat-intl-tel-input';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { saveAs } from 'file-saver';
import { ConfirmComponent } from 'src/app/dialogs/confirm/confirm.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogService } from 'src/app/services/dialog.service';
import { IConfirmDialogData } from 'src/app/dialogs/models/confirm-dialog-data';
import { MatDialogConfig } from '@angular/material/dialog';
import { FileManagementService } from 'src/app/usit/services/file-management.service';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss'],
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
    NgxMatIntlTelInputComponent,
    MatTableModule,
  ],
  providers: [DatePipe],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AddEmployeeComponent {
  departmentOptions: string[] = [
    'Administration',
    'Recruiting',
    'Bench Sales',
    'Sourcing',
    'Accounts',
  ];

  roleOptions: any[] = [
    // 'Super Admin',
    // 'Admin',
    // 'Manager',
    // 'Team Lead',
    // 'Employee',
  ];

  managerOptions: any[] = [
    // 'John Smith', 'Sarah Johnson', 'David Anderson'
  ];

  teamLeadOptions: any[] = [
    // 'Alice', 'Bob', 'Charlie', 'David', 'Eva'
  ];

  filteredDepartmentOptions!: Observable<string[]>;
  filteredRoleOptions!: Observable<any[]>;
  filteredManagerOptions!: Observable<any[]>;
  filteredTeamLeadOptions!: Observable<any[]>;

  employeeForm: any = FormGroup;
  submitted = false;
  rolearr: any = [];
  message!: string;
  blur!: string;
  managerflg = false;
  teamleadflg = false;
  managerarr: any = [];
  tlarr: any = [];
  uploadedfiles: string[] = []
  uploadedFileNames: string[] = [];
  displayedColumns: string[] = ['date', 'document_name', 'delete'];
  // allDocumentsData = new MatTableDataSource<any>([]);
  allDocumentsData: any = [];
  tech: any;
  filesArr!: any;
  id!: number;
  // snack bar data
  dataTobeSentToSnackBarService: ISnackBarData = {
    message: '',
    duration: 2500,
    verticalPosition: 'top',
    horizontalPosition: 'center',
    direction: 'above',
    panelClass: ['custom-snack-success'],
  };
  // services
  private empManagementServ = inject(EmployeeManagementService);
  private snackBarServ = inject(SnackBarService);
  private formBuilder = inject(FormBuilder);
  private dialogServ = inject(DialogService);
  private datePipe = inject(DatePipe);
  data = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<AddEmployeeComponent>);
  private fileServ = inject(FileManagementService);
  // to clear subscriptions
  private destroyed$ = new Subject<void>();

  ngOnInit(): void {
    console.log('empdata, ', this.data);

    this.getRoles(); // common for add employee
    this.getManager();// common for add employee
    if (this.data.actionName === 'edit-employee') {
      this.getDataOnEdit(this.data.employeeData.userid);
      const managerId = this.data.employeeData.manager;
      // this.initilizeAddEmployeeForm(this.data.employeeData);
      this.getTeamLead(managerId);
    } else {
    //  for add employee
      this.initilizeAddEmployeeForm(null);

    }
   // common for add employee
    this.validateControls();
    //this.optionsMethod();

    
  }

  private initilizeAddEmployeeForm(employeeData: any) {
    // console.log(employeeData);
    // console.log(employeeData.fullname);
    this.employeeForm = this.formBuilder.group({
      fullname: [
        employeeData ? employeeData.fullname : '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
      pseudoname: [employeeData ? employeeData.pseudoname : ''],
      email: [
        employeeData ? employeeData.email : '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        ],
      ],
      personalcontactnumber: [employeeData ? employeeData.personalcontactnumber.internationalNumber : '', [Validators.required]],
      //['', [Validators.required]],
      companycontactnumber: [employeeData && employeeData.companycontactnumber ? employeeData.companycontactnumber.internationalNumber : ''],
      designation: [employeeData ? employeeData.designation : ''],
      department: [employeeData ? employeeData.department : '', Validators.required],
      joiningdate: [employeeData ? employeeData.joiningdate : '', Validators.required],
      relievingdate: [employeeData ? employeeData.relievingdate : '', [this.relievingDateValidator]],
      personalemail: [
        employeeData ? employeeData.personalemail : '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        ],
      ],
      manager: [employeeData ? employeeData.manager : ''],
      aadharno: [
        employeeData ? employeeData.aadharno : '',
        [Validators.required, Validators.pattern(/^\d{12}$/)],
      ],

      panno: [
        employeeData ? employeeData.panno : '',
        [Validators.required, Validators.pattern(/^[A-Z]{5}\d{4}[A-Z]{1}$/)],
      ],
      bankname: [employeeData ? employeeData.bankname : '', [Validators.required, Validators.maxLength(100)]],
      accno: [employeeData ? employeeData.accno : '', [Validators.required,  Validators.pattern(/^\d{1,15}$/)]],
      ifsc: [
        employeeData ? employeeData.ifsc : '',
        [Validators.required, Validators.pattern(/^([A-Za-z]{4}\d{7})$/)],
      ],
      branch: [employeeData ? employeeData.branch : '', [Validators.required]],
      teamlead: [employeeData ? employeeData.teamlead : ''],
     // role: [employeeData ? employeeData.role.rolename : '', Validators.required],
      role: this.formBuilder.group({
        roleid: new FormControl(employeeData ? employeeData.role.roleid : '', [
          Validators.required
        ]),
      })
    });

  }  

  validateControls() {
    // for psuedo name validation
    this.employeeForm.get('department').valueChanges.subscribe((res: any) => {
      const pseudoname = this.employeeForm.get('pseudoname');
      if (res == 'Bench Sales') {
        pseudoname.setValidators(Validators.required);
      } else {
        pseudoname.clearValidators();
      }
      pseudoname.updateValueAndValidity();
    });
    // for manager validation
    this.employeeForm.get('role.roleid').valueChanges.subscribe((res: any) => {
      const manager = this.employeeForm.get('manager');
      const tl = this.employeeForm.get('teamlead');
      if (res == 4) {
        this.managerflg = true;
        this.teamleadflg = false;
        manager.setValidators(Validators.required);
      } else if (res == 5) {
        this.managerflg = true;
        this.teamleadflg = true;
        manager.setValidators(Validators.required);
        // tl.setValidators(Validators.required);
      } else {
        this.managerflg = false;
        this.teamleadflg = false;
        manager.clearValidators();
        // tl.clearValidators();
      }
      manager.updateValueAndValidity();
      // tl.updateValueAndValidity();
    });

    // for team lead validation

    // this.employeeForm.get('role.roleid').valueChanges.subscribe((res: any) => {
    //   const manager = this.employeeForm.get('manager');
    //   if (res == 4) {
    //     this.teamleadflg = false;
    //     this.managerflg = true;
    //     manager.setValidators(Validators.required);
    //   }
    //   else {
    //     this.teamleadflg = false;
    //     this.managerflg = false;
    //     manager.clearValidators();
    //   }
    //   manager.updateValueAndValidity();
    // });
  }
  get addEmpForm() {
    return this.employeeForm.controls;
  }

  private optionsMethod(type = "roles") {

    if(type === "roles"){
    this.filteredRoleOptions =
      this.employeeForm.controls.role.valueChanges.pipe(
        startWith(''),
        map((value: any) => {
          console.log("value in map", value)
          const name = typeof value === 'string' ? value : value?.name;
          return name ? this._filter(value) : this.roleOptions.slice();
        }

        )
      );
      return
    }else if(type === "manager"){
      this.filteredManagerOptions =
      this.employeeForm.controls.manager.valueChanges.pipe(
        startWith(''),
        map((value: any) =>{
          console.log("value in map", value)
          const name = typeof value === 'string' ? value : value?.name;
          return name ? this._filter(value) : this.managerOptions.slice();
        }
        )
      );
    }else if(type === "department"){
      this.filteredDepartmentOptions =
      this.employeeForm.controls.department.valueChanges.pipe(
        startWith(''),
        map((value: any) =>
          this._filterOptions(value || '', this.departmentOptions)
        )
      );
    }else{
      this.filteredTeamLeadOptions =
      this.employeeForm.controls.teamlead.valueChanges.pipe(
        startWith(''),
        map((value: any) =>{
          console.log("value in map", value)
          const name = typeof value === 'string' ? value : value?.name;
          return name ? this._filter(value) : this.teamLeadOptions.slice();
        }
        )
      );
    }

  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();

    return this.roleOptions.filter(option => option.rolename.toLowerCase().includes(filterValue));
  }

  private _filterOptions(value: string, options: string[]): string[] {
    const filterValue = value.toLowerCase();
    console.log("filtervalu", value)
    return options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  displayFn(obj: any): string {
    return obj && obj.rolename ? obj.rolename : '';
  }

  getRoles() {
    this.empManagementServ
      .getRolesDropdown()
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (response: any) => {
          this.rolearr = response.data;
          this.roleOptions = response.data;
          //TBD: auto-complete -
          // this.optionsMethod("roles")
        },
        error: (err) => {
          this.dataTobeSentToSnackBarService.message = err.message;
          this.dataTobeSentToSnackBarService.panelClass = [
            'custom-snack-failure',
          ];
          this.snackBarServ.openSnackBarFromComponent(
            this.dataTobeSentToSnackBarService
          );
        },
      });
  }

  getManager() {
    this.empManagementServ
      .getManagerDropdown()
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (response: any) => {
          this.managerarr = response.data;
          this.managerOptions = response.data;
          //TBD: auto-complete -
          //  this.optionsMethod("manager")
        },
        error: (err) => {
          this.dataTobeSentToSnackBarService.message = err.message;
          this.dataTobeSentToSnackBarService.panelClass = [
            'custom-snack-failure',
          ];
          this.snackBarServ.openSnackBarFromComponent(
            this.dataTobeSentToSnackBarService
          );
        },
      });
  }

  managerid(event: MatSelectChange) {
    const selectedManagerId = event.value;
    if(selectedManagerId){
      this.getTeamLead(selectedManagerId);
    }
  }

  getTeamLead(id: number) {
    this.empManagementServ
      .getTLdropdown(id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (response: any) => {
          this.tlarr = response.data;
          this.teamLeadOptions = response.data;
          //  console.log(response.data)
          // TBD autocomplete:
          // this.optionsMethod("teamLead")
        },
        error: (err) => {
          this.dataTobeSentToSnackBarService.message = err.message;
          this.dataTobeSentToSnackBarService.panelClass = [
            'custom-snack-failure',
          ];
          this.snackBarServ.openSnackBarFromComponent(
            this.dataTobeSentToSnackBarService
          );
        },
      });
  }

  onSubmit() {
    this.submitted = true;
    const joiningDateFormControl = this.employeeForm.get('joiningdate');
    const relievingDateFormControl = this.employeeForm.get('relievingdate')
    if (joiningDateFormControl.value) {
      const formattedJoiningDate  = this.datePipe.transform(joiningDateFormControl.value, 'yyyy-MM-dd');
      const formattedRelievingDate   = this.datePipe.transform(relievingDateFormControl.value, 'yyyy-MM-dd');
      joiningDateFormControl.setValue(formattedJoiningDate);
      relievingDateFormControl.setValue(formattedRelievingDate);
    }
    if (this.employeeForm.invalid) {
      this.displayFormErrors();
      return;
    }
    console.log(this.data.actionName+" employeeForm.value",this.employeeForm.value);
    this.uploadFileOnSubmit(1);
    // this.empManagementServ.addOrUpdateEmployee(this.employeeForm.value, this.data.actionName).pipe(takeUntil(this.destroyed$)).subscribe({
    //   next: (data: any) => {
    //     this.blur = 'Active';
    //     if (data.status == 'Success') {
    //       // this.uploadFileOnSubmit(data.data.userid);
    //       this.dataTobeSentToSnackBarService.message =
    //         this.data.actionName === 'add-employee'
    //           ? 'Employee added successfully'
    //           : 'Employee updated successfully';
    //       this.snackBarServ.openSnackBarFromComponent(this.dataTobeSentToSnackBarService);
    //       this.employeeForm.reset();
    //       this.dialogRef.close();
    //     } else {
    //       this.dataTobeSentToSnackBarService.message =
    //         this.data.actionName === 'add-employee'
    //           ? 'Employee addition is failed'
    //           : 'Employee updation is failed';
    //         this.dataTobeSentToSnackBarService.panelClass = ['custom-snack-failure'];
    //       this.snackBarServ.openSnackBarFromComponent(this.dataTobeSentToSnackBarService);
    //     }

    //   },
    //   error: (err) => {
    //     this.dataTobeSentToSnackBarService.message =
    //       this.data.actionName === 'add-employee'
    //         ? 'Employee addition is failed'
    //         : 'Employee updation is failed';
    //       this.dataTobeSentToSnackBarService.panelClass = ['custom-snack-failure'];
    //     this.snackBarServ.openSnackBarFromComponent(this.dataTobeSentToSnackBarService);
    //   },
    // });
  }

  displayFormErrors() {
    Object.keys(this.employeeForm.controls).forEach((field) => {
      const control = this.employeeForm.get(field);
      if (control && control.invalid) {
        control.markAsTouched();
      }
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  onContryChange(ev: any) {

  }

  resumeError: boolean = false;
  aadharError: boolean = false;
  panError: boolean = false;
  bankError: boolean = false;
  multifilesError: boolean = false;
  resumeFileNameLength: boolean = false;
  aadharFileNameLength: boolean = false;
  panFileNameLength: boolean = false;
  bankFileNameLength: boolean = false;
  multifilesFileNameLength: boolean = false;

  @ViewChild('multifiles')
  multifiles: any = ElementRef;
  sum = 0;
  onFileChange(event: any) {
    this.uploadedFileNames = [];
    for (var i = 0; i < event.target.files.length; i++) {
      const file = event.target.files[i];
      var items = file.name.split(".");
      const str = items[0];
      const fileSizeInKB = Math.round(file.size / 1024);
      this.sum = this.sum + fileSizeInKB;
      if (str.length > 20) {
        this.multifilesFileNameLength = true;
      }
      if (fileSizeInKB < 4048) {
        this.uploadedfiles.push(event.target.files[i]);
        this.uploadedFileNames.push(file.name);
        this.multifilesError = false;
      }
      else {
        this.multifiles.nativeElement.value = "";
        this.uploadedfiles = [];
        this.multifilesError = true;
        this.multifilesFileNameLength = false;
      }
    }
  }

  flg = true;
  @ViewChild('resume')
  resume: any = ElementRef;
  resumeupload!: any;
  uploadResume(event: any) {
    this.resumeupload = event.target.files[0];
    const file = event.target.files[0];
    const fileSizeInKB = Math.round(file.size / 1024);
    var items = file.name.split(".");
    const str = items[0];
    if (str.length > 20) {
      this.resumeFileNameLength = true;
    }
    if (fileSizeInKB > 2048) {
      this.flg = false;
      this.resumeError = true;
    }
    else {
      this.resumeError = false;
      this.flg = true;
    }
  }



  @ViewChild('aadhar') aadhar: any = ElementRef;
  aadharUpload!: any;
  uploadAadhar(event: any) {
    this.aadharUpload = event.target.files[0];
    const file = event.target.files[0];
    const fileSizeInKB = Math.round(file.size / 1024);
    var items = file.name.split(".");
    const str = items[0];
    if (str.length > 20) {
      this.aadharFileNameLength = true;
    }
    if (fileSizeInKB > 2048) {
      this.flg = false;
      this.aadharError = true;
      return;
    }
    else {
      this.aadharError = false;
      this.flg = true;
    }
  }
  @ViewChild('pan')
  pan: any = ElementRef;
  panUpload!: any;
  uploadPan(event: any) {
    this.panUpload = event.target.files[0];
    const file = event.target.files[0];
    const fileSizeInKB = Math.round(file.size / 1024);
    var items = file.name.split(".");
    const str = items[0];
    if (str.length > 20) {
      this.panFileNameLength = true;
    }

    if (fileSizeInKB > 2048) { 
      this.flg = false;
      this.panError = true;
      return;
    }
    else {
      this.panError = false;
    }
  }

  @ViewChild('bank')
  bank: any = ElementRef;
  bankUpload!: any;
  uploadBank(event: any) {
    this.bankUpload = event.target.files[0];
    const file = event.target.files[0];
    const fileSizeInKB = Math.round(file.size / 1024);
    var items = file.name.split(".");
    const str = items[0];
    if (str.length > 20) {
      this.bankFileNameLength = true;
    }

    if (fileSizeInKB > 2048) { 
      this.flg = false;
      this.bankError = true;
      return;
    }
    else {
      this.bankError = false;
      this.flg = true;
    }
  }


  uploadFileOnSubmit(id: number) {
    const formData = new FormData();
    for (var i = 0; i < this.uploadedfiles.length; i++) {
      formData.append("files", this.uploadedfiles[i]);
    }

    if (this.resumeupload != null) {
      formData.append('resume', this.resumeupload, this.resumeupload.name);
    }

    if (this.aadharUpload != null) {
      formData.append('aadhar', this.aadharUpload, this.aadharUpload.name);
    }

    if (this.panUpload != null) {
      formData.append('pan', this.panUpload, this.panUpload.name);
    }

    if (this.bankUpload != null) {
      formData.append('bank', this.bankUpload, this.bankUpload.name);
    }

    // console.log("formData:", formData);

    for (let pair of (formData as any).entries()) {
      console.log(pair);
      // console.log(`File: ${pair[1].name}, Size: ${pair[1].size} bytes, Type: ${pair[1].type}`);
    }
    // this.fileServ.uploadFile(formData, id)
    //   .subscribe((response: any) => {
    //     if (response.status === 200) {
    // console.log('Files uploaded successfully:', response);
    //     } else {
    // console.error('Failed to upload files:', response);
    //     }
    //   }
    //   );
  }

  relievingDateValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const joiningDate = control.root.get('joiningdate')?.value;
    const relievingDate = control.value;

    if (joiningDate && relievingDate && new Date(relievingDate) < new Date(joiningDate)) {
      return { 'relievingBeforeJoining': true };
    }

    return null;
  }

  onlyNumberKey(evt: any) {
    var ASCIICode = (evt.which) ? evt.which : evt.keyCode
    if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57))
      return false;
    return true;
  }

  onlyAlphanumericKey(evt: any) {
    var ASCIICode = (evt.which) ? evt.which : evt.keyCode;
    if (!((ASCIICode >= 48 && ASCIICode <= 57) || (ASCIICode >= 65 && ASCIICode <= 90))) {
      return false;
    }
    return true;
  }
  

  downloadfile(id: number, filename: string) {
    // var items = filename.split(".");
    // this.fileServ
    //   .downloadresume(id, true)
    //   .subscribe( (blob: Blob )=> {
    //     if (items[1] == 'pdf' || items[1] == 'PDF') {
    //       var fileURL: any = URL.createObjectURL(blob);
    //       var a = document.createElement("a");
    //       a.href = fileURL;
    //       a.target = '_blank';
    //       // Don't set download attribute
    //       //a.download = filename;
    //       a.click();
    //     }
    //     else {
    //       saveAs(blob, filename)
    //     }
    //   }
    //   );
  }

  deletefile(id: number) {
    const did = this.data?.id;
    // const fl = doctype.toUpperCase();
  
    const dataToBeSentToDailog: Partial<IConfirmDialogData> = {
      title: 'Confirmation',
      message: `Are you sure you want to remove the File?`,
      confirmText: 'Yes',
      cancelText: 'No',
      actionData: { id },
      actionName: 'delete-file'
    };
  
    const dialogConfig = this.getDialogConfigData(dataToBeSentToDailog, { delete: true, edit: false, add: false });
    const dialogRef = this.dialogServ.openDialogWithComponent(
      ConfirmComponent,
      dialogConfig
    );
  
    dialogRef.afterClosed().subscribe({
      next: (resp) => {
      if (dialogRef.componentInstance.allowAction) {
        // this.fileServ.removefile(id, doctype).subscribe(
        //   (response: any) => {
        //     if (response.status === 'success') {
        //       this.dataTobeSentToSnackBarService.message = `Removed File successfully`;
        //       this.dataTobeSentToSnackBarService.panelClass = ['custom-snack-success'];
        //       this.snackBarServ.openSnackBarFromComponent(this.dataTobeSentToSnackBarService);
        //       this.getDataOnEdit(did);
        //     } else {
        //       this.dataTobeSentToSnackBarService.message = `Failed to remove File`;
        //       this.dataTobeSentToSnackBarService.panelClass = ['custom-snack-failure'];
        //       this.snackBarServ.openSnackBarFromComponent(this.dataTobeSentToSnackBarService);
        //     }
        //   }
        // );
      }
    }
    });
  }

  private getDialogConfigData(dataToBeSentToDailog: Partial<IConfirmDialogData>, action: {delete: boolean; edit: boolean; add: boolean, updateSatus?: boolean}) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = action.edit ||  action.add  ? '65vw' : action.delete ? 'fit-content' : '400px';
    dialogConfig.height = 'auto';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = dataToBeSentToDailog.actionName;
    dialogConfig.data = dataToBeSentToDailog;
    return dialogConfig;
  }
  
  deletemultiple(id: number) {
    const dataToBeSentToDailog: Partial<IConfirmDialogData> = {
      title: 'Confirmation',
      message: 'Are you sure you want to remove the file?',
      confirmText: 'Yes',
      cancelText: 'No',
      actionData: { id },
      actionName: 'delete-multiple-files'
    };
  
    const dialogConfig = this.getDialogConfigData(dataToBeSentToDailog, { delete: true, edit: false, add: false });
    const dialogRef = this.dialogServ.openDialogWithComponent(
      ConfirmComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe({
      next: (resp) => {
      if (dialogRef.componentInstance.allowAction) {
        // this.fileServ.removingfiles(id).subscribe(
        //   (response: any) => {
        //     if (response.status === 'success') {
        //       this.dataTobeSentToSnackBarService.message = `File removed successfully`;
        //       this.dataTobeSentToSnackBarService.panelClass = ['custom-snack-success'];
        //       this.snackBarServ.openSnackBarFromComponent(this.dataTobeSentToSnackBarService);
        //       this.ngOnInit();
        //     } else {
        //       this.dataTobeSentToSnackBarService.message = `Failed to remove File`;
        //       this.dataTobeSentToSnackBarService.panelClass = ['custom-snack-failure'];
        //       this.snackBarServ.openSnackBarFromComponent(this.dataTobeSentToSnackBarService);
        //     }
        //   }
        // );
      }
    }
    });
  }

  fileList?: [];
  type!: any;
  filedetails(fileData: any) {
    this.type = fileData.filename;
    var items = this.type.split(".");
    // this.fileServ
    //   .downloadfile(fileData.docid)
    //   .subscribe((blob: Blob) => {
    //     if (items[1] == 'pdf' || items[1] == 'PDF') {
    //       var fileURL: any = URL.createObjectURL(blob);
    //       var a = document.createElement("a");
    //       a.href = fileURL;
    //       a.target = '_blank';
    //       // a.download = filename;
    //       a.click();
    //     }
    //     else {
    //       saveAs(blob, fileData.filename)
    //     }
    //   }
    //     // saveAs(blob, fileData.filename)
    //   );
  }

  

  getDataOnEdit(id: number) {
    this.empManagementServ.getEmployeeById(id).subscribe(
      (response: any) => {
        this.tech = response.data;
        console.log(this.tech);
        if(this.data.actionName === 'edit-employee'){
          this.initilizeAddEmployeeForm(this.tech);
        }
        this.filesArr = response.data.edoc;
        this.filesArr = [
        {
          createddate: "16-10-2023",
          filename: " doc5.pdf",
          docid: '5'
        },
        {
          createddate: "17-10-2023",
          filename: " doc6.pdf",
          docid: '6'
        },
        {
          createddate: "18-10-2023",
          filename: " doc7.pdf",
          docid: '7'
        },
        ];
        this.allDocumentsData = [
          // { createddate: this.tech.createddate, filename: this.tech.resume },
          // { createddate: this.tech.createddate, filename: this.tech.pan },
          // { createddate: this.tech.createddate, filename: this.tech.aadhar },
          // { createddate: this.tech.createddate, filename: this.tech.bpassbook },
          {
            createddate: "12-10-2023",
            filename: " doc1.pdf",
            docid: '1'
          },
          {
            createddate: "13-10-2023",
            filename: " doc2.pdf",
            docid: '2'
          },
          {
            createddate: "14-10-2023",
            filename: " doc3.pdf",
            docid: '3'
          },
          {
            createddate: "15-10-2023",
            filename: " doc4.pdf",
            docid: '4'
          },
          ...this.filesArr
        ];
      })
  }
}

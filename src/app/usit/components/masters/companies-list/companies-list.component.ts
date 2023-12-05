import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ConfirmComponent } from 'src/app/dialogs/confirm/confirm.component';
import { IConfirmDialogData } from 'src/app/dialogs/models/confirm-dialog-data';
import { DialogService } from 'src/app/services/dialog.service';
import { MatDialogConfig } from '@angular/material/dialog';
import { ISnackBarData, SnackBarService } from 'src/app/services/snack-bar.service';
import {MatTooltipModule} from '@angular/material/tooltip';
import { CompanyService } from 'src/app/usit/services/company.service';
import { AddCompanyComponent } from './add-company/add-company.component';
import { Company } from 'src/app/usit/models/company';
import { Router } from '@angular/router';

@Component({
  selector: 'app-companies-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatSortModule,
    MatPaginatorModule,
    CommonModule,
    MatTooltipModule
  ],
  templateUrl: './companies-list.component.html',
  styleUrls: ['./companies-list.component.scss']
})
export class CompaniesListComponent implements OnInit, AfterViewInit {

  private companyServ = inject(CompanyService);
  private dialogServ = inject(DialogService);
  private snackBarServ = inject(SnackBarService);
  private router = inject(Router);

  dataSource = new MatTableDataSource<Company>([]);
  displayedColumns: string[] = ['Company', 'Actions'];
  @ViewChild(MatSort) sort!: MatSort;
  companyList: Company[]= [];

  ngOnInit(): void {
    this.getAllCompanies()
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  getAllCompanies() {
    return this.companyServ.getAllCompanies().subscribe(
      {
        next:(response: any) => {
          this.companyList = response.data;
          //console.log("companies",this.companyList);
          this.dataSource.data = response.data;
        },
        error: (err)=> console.log(err)
      }
    );
  }

  addCompany() {
    const actionData = {
      title: 'Add Company',
      buttonCancelText: 'Cancel',
      buttonSubmitText: 'Submit',
      actionName: 'add-company'
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "450px";
    dialogConfig.height = "auto";
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = "add-company";
    dialogConfig.data = actionData;
    const dialogRef = this.dialogServ.openDialogWithComponent(AddCompanyComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => {
      if(dialogRef.componentInstance.allowAction){
        this.getAllCompanies();
      }
    })
  }

  editCompany(company: any) {
    const actionData = {
      title: 'Update Company',
      buttonCancelText: 'Cancel',
      buttonSubmitText: 'Submit',
      actionName: 'update-company',
      companyData: company
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "400px";
    dialogConfig.height = "auto";
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = "update-company";
    dialogConfig.data = actionData;
    const dialogRef = this.dialogServ.openDialogWithComponent(AddCompanyComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => {
      if(dialogRef.componentInstance.allowAction){
        this.getAllCompanies();
      }
    })

  }

  deleteCompany(company: any) {
    const dataToBeSentToDailog : Partial<IConfirmDialogData> = {
      title: 'Confirmation',
      message: 'Are you sure you want to delete?',
      confirmText: 'Yes',
      cancelText: 'No',
      actionData: company,
    }
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "400px";
    dialogConfig.height = "auto";
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = "delete-company";
    dialogConfig.data = dataToBeSentToDailog;
    const dialogRef = this.dialogServ.openDialogWithComponent(ConfirmComponent, dialogConfig);

    dialogRef.afterClosed().subscribe({
      next: () =>{
        if (dialogRef.componentInstance.allowAction) {
          const dataToBeSentToSnackBar: ISnackBarData = {
            message: '',
            duration: 1500,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            direction: 'above',
            panelClass: ['custom-snack-success'],
          };
          this.companyServ.deleteCompany(company.companyid).subscribe
            ({
              next: (resp: any) => {
                if (resp.status == 'success') {
                  dataToBeSentToSnackBar.message =
                    'Company Deleted successfully';
                  this.snackBarServ.openSnackBarFromComponent(
                    dataToBeSentToSnackBar
                  );
                  // call get api after deleting a role
                  this.getAllCompanies();
                } else {
                  dataToBeSentToSnackBar.message = resp.message;
                  this.snackBarServ.openSnackBarFromComponent(
                    dataToBeSentToSnackBar
                  );
                }

              }, error: (err: any) => console.log(`Company delete error: ${err}`)
            });
        }
      }
    })
  }

  onFilter(event: any) {
    this.dataSource.filter = event.target.value;
  }

  onSort(event: any) {
    const sortDirection = event.direction;
    const sortColumn = event.active;
  
    if (sortDirection !== null && sortDirection !== undefined) {
      this.dataSource.data = this.sortData(this.dataSource.data, sortColumn, sortDirection);
    } else {
      this.dataSource.data = [...this.companyList];
    }
  }
  
  private sortData(data: Company[], sortColumn: string, sortDirection: string): Company[] {
    return data.sort((a, b) => {
      switch (sortColumn) {
        case 'Company':
          const valueA = (a.companyname as string) || '';
          const valueB = (b.companyname as string) || '';
          if (sortDirection === 'asc') {
            return valueA.localeCompare(valueB);
          } else if (sortDirection === 'desc') {
            return valueB.localeCompare(valueA);
          } else {
            return valueA.localeCompare(valueB);
          }
  
        default:
          return 0;
      }
    });
  }

  getRowClass(row: any): string {
    const rowIndex = this.dataSource.filteredData.indexOf(row);
    return rowIndex % 2 === 0 ? 'even-row' : 'odd-row';
  }

  navigateToDashboard() {
    this.router.navigateByUrl('/usit/dashboard');
  }

}

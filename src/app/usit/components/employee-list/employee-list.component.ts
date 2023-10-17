import { AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, Component, ViewChild, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import { DialogService } from 'src/app/services/dialog.service';
import { IConfirmDialogData } from 'src/app/dialogs/models/confirm-dialog-data';
import { IStatusData } from 'src/app/dialogs/models/status-model.data';
import { StatusComponent } from 'src/app/dialogs/status/status.component';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatSortModule,
    MatPaginatorModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EmployeeListComponent implements AfterViewInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  elements = ELEMENT_DATA;
  // paginator
  length = 50;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;


  pageEvent!: PageEvent;
  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private dialogServ = inject(DialogService)

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  onSort(event: Sort) {

  }

  onFilter(event: any) {
    this.dataSource.filter = event.target.value
  }

  addEmployee() {
    // // add employee form
    // const dataToBeSentToDailog : IConfirmDialogData = {
    //   title: 'Confirmation',
    //   message: 'Are you sure you want to delete?',
    //   confirmText: 'Yes',
    //   cancelText: 'No'
    // }
    // this.dialogServ.openDialogWithComponent(dataToBeSentToDailog)

    const dataToBeSentToDailog : IStatusData = {
      title: 'Status Update',
      updateText: 'in-activating',
      type: 'Employee',
      buttonText: 'Update'
    }
    const compType  = StatusComponent;
    this.dialogServ.openDialogWithComponent(compType, dataToBeSentToDailog)

  }


  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;

  }

}

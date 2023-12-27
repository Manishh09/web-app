import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PaginatorIntlService } from 'src/app/services/paginator-intl.service';
import { DialogService } from 'src/app/services/dialog.service';
import { ISnackBarData, SnackBarService } from 'src/app/services/snack-bar.service';
import { QuizService } from 'src/app/usit/services/quiz.service';
import { MOCK_RESP } from '../attempt-quiz/attempt-quiz.component';
import { QuestionGroup } from 'src/app/usit/models/questionnnaire';
import { MatDialogConfig } from '@angular/material/dialog';
import { QuizComponent } from '../quiz.component';
import { IConfirmDialogData } from 'src/app/dialogs/models/confirm-dialog-data';
import { ConfirmComponent } from 'src/app/dialogs/confirm/confirm.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quiz-list',
  standalone: true,
  imports: [ MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatSortModule,
    MatPaginatorModule,
    CommonModule,
    MatTooltipModule],
  templateUrl: './quiz-list.component.html',
  styleUrls: ['./quiz-list.component.scss'],
  providers: [{ provide: MatPaginatorIntl, useClass: PaginatorIntlService }],
})
export class QuizListComponent implements OnInit{

  displayedColumns: string[] = ['Id', 'Department', 'Category','Status', 'Action'];
  dataSource = new MatTableDataSource<any>([]);
  quizList: QuestionGroup[] = [];
  // paginator
  pageSize = 50; // items per page
  currentPageIndex = 0;
  pageSizeOptions = [5, 10, 25, 50];
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  totalItems = 0;
  pageEvent!: PageEvent;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  // snackbar
  dataTobeSentToSnackBarService: ISnackBarData = {
    message: '',
    duration: 2500,
    verticalPosition: 'top',
    horizontalPosition: 'center',
    direction: 'above',
    panelClass: ['custom-snack-success'],
  };
  // services
  private dialogServ = inject(DialogService);
  private snackBarServ = inject(SnackBarService);
  private quizServ = inject(QuizService);
  private router = inject(Router);

  ngOnInit(): void {
    this.getQuizList();
  }

  /**
   * fetches all the quizes
   */
  private getQuizList() {
    this.quizServ.getMockQuiz().subscribe({
      next: (resp: any) => {
        if (resp.status === "success") {

          if (resp.data) {
            this.quizList = resp.data;
            this.dataSource.data = this.quizList;
            this.totalItems = this.quizList.length;
          }
          else {
            this.dataTobeSentToSnackBarService.message = "No Questions Available under the selected category and department, Please select valid data";
            this.dataTobeSentToSnackBarService.panelClass = ["custom-snack-failure"];
            this.snackBarServ.openSnackBarFromComponent(this.dataTobeSentToSnackBarService);
          }
        }
      },
      error: err => {
        this.dataTobeSentToSnackBarService.message = "Internal server error";
        this.dataTobeSentToSnackBarService.panelClass = ["custom-snack-failure"];
        this.snackBarServ.openSnackBarFromComponent(this.dataTobeSentToSnackBarService);
      }
    });
  }

  /**
   * Add Questionnaire
   */
  addQuiz() {
    const actionData = {
      title: 'Add Quiz',
      buttonCancelText: 'Cancel',
      buttonSubmitText: 'Submit',
      actionName: 'add-quiz'
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '65vw';;
    dialogConfig.height = "auto";
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = "add-quiz";
    dialogConfig.data = actionData;
    const dialogRef = this.dialogServ.openDialogWithComponent(QuizComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => {
      if(dialogRef.componentInstance.allowAction){
        this.getQuizList();
      }
    })

  }

  /**
   * update questionnaire
   * @param quiz
   */
  editQuiz(quiz: QuestionGroup) {
    const actionData = {
      title: 'Update Quiz',
      buttonCancelText: 'Cancel',
      buttonSubmitText: 'Submit',
      actionName: 'edit-quiz',
      quizData: quiz
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width =  '65vw';;
    dialogConfig.height = "auto";
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = "update-quiz";
    dialogConfig.data = actionData;
    const dialogRef = this.dialogServ.openDialogWithComponent(QuizComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => {
      if(dialogRef.componentInstance.allowAction){
        this.getQuizList();
      }
    })
  }

  /**
   * delete quiz from the list
   * @param quiz
   */
  deleteQuiz(quiz: QuestionGroup) {
    const dataToBeSentToDailog : Partial<IConfirmDialogData> = {
      title: 'Confirmation',
      message: 'Are you sure you want to delete?',
      confirmText: 'Yes',
      cancelText: 'No',
      actionData: quiz,
    }
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "400px";
    dialogConfig.height = "auto";
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = "delete-quiz";
    dialogConfig.data = dataToBeSentToDailog;
    const dialogRef = this.dialogServ.openDialogWithComponent(ConfirmComponent, dialogConfig);

    dialogRef.afterClosed().subscribe({
      next: () =>{
        if (dialogRef.componentInstance.allowAction) {

          // this.quizServ.deleteQuiz(quiz.qid).subscribe
          //   ({
          //     next: (resp: any) => {
          //       if (resp.status == 'success') {
          //         this.dataTobeSentToSnackBarService.message =
          //           'Quiz Deleted successfully';
          //         this.snackBarServ.openSnackBarFromComponent(
          //           this.dataTobeSentToSnackBarService
          //         );
          //         // call get api after deleting a technology
          //         this.getQuizList();
          //       } else {
          //         this.dataTobeSentToSnackBarService.message = resp.message;
          //         this.snackBarServ.openSnackBarFromComponent(
          //           this.dataTobeSentToSnackBarService
          //         );
          //       }

          //     }, error: (err: any) => console.log(`quiz delete error: ${err}`)
          //   });
        }
      }
    })
  }

  /**
   * initiate quiz
   * @param quiz
   */
  onStatusUpdate(quiz: QuestionGroup){

    const dataToBeSentToDailog : Partial<IConfirmDialogData> = {
      title: 'Confirmation',
      message: 'Are you sure you want to Initate Quiz?',
      confirmText: 'Yes',
      cancelText: 'No',
      actionData: quiz,
    }
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "fit-content";
    dialogConfig.height = "auto";
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = "initiate-quiz";
    dialogConfig.data = dataToBeSentToDailog;
    const dialogRef = this.dialogServ.openDialogWithComponent(ConfirmComponent, dialogConfig);

    dialogRef.afterClosed().subscribe({
        next: (resp) => {
          if (dialogRef.componentInstance.allowAction) {

              this.router.navigate(["/usit/attempt-quiz"])
          }
        },
      });

  }

  /**
   * pagination control
   * @param event
   */
  handlePageEvent(event: PageEvent) {
    if (event) {
      this.pageEvent = event;
      const currentPageIndex = event.pageIndex;
      this.currentPageIndex = currentPageIndex;
    }
    return;
  }

   // search
   onFilter(event: any){
    this.dataSource.filter = event.target.value;
  }

  onSort(event: any) {
    //this.dataSource.filter = event.target.value;
  }

}

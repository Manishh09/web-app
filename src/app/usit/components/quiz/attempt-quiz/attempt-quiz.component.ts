import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DialogService } from 'src/app/services/dialog.service';
import { DEPARTMENT } from 'src/app/constants/department';
import {
  ISnackBarData,
  SnackBarService,
} from 'src/app/services/snack-bar.service';
import { QuizService } from 'src/app/usit/services/quiz.service';
import { Questionnaire } from '../quiz.component';
import { CATEGORY } from 'src/app/constants/category';
import { Option, QuestionGroup } from 'src/app/usit/models/questionnnaire';
import { pauseTimer, transform } from 'src/app/functions/timer';

@Component({
  selector: 'app-attempt-quiz',
  standalone: true,
  imports: [
    CommonModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  templateUrl: './attempt-quiz.component.html',
  styleUrls: ['./attempt-quiz.component.scss'],
})
export class AttemptQuizComponent implements OnInit {
  objectK = Object;
  deptOptions = DEPARTMENT;
  categoryOptions = CATEGORY;
  // snack bar data
  dataTobeSentToSnackBarService: ISnackBarData = {
    message: '',
    duration: 2500,
    verticalPosition: 'top',
    horizontalPosition: 'center',
    direction: 'above',
    panelClass: ['custom-snack-success'],
  };
  quizForm: any = FormGroup;
  formObj!: QuestionGroup;
  // services
  private dialogServ = inject(DialogService);
  private snackBarServ = inject(SnackBarService);
  private fb = inject(FormBuilder);
  private quizServ = inject(QuizService);
  selectedDepartment: any;
  selectedCategory: any;
  clock: string = "";

  ngOnInit(): void {
   // this.getQuestionnaire();
   this.initForm([
    {
      department: '',
      category: '',
      question: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      answer: '',
      userans: ''
    },
  ]);
  }

  onSelect(event: MatSelectChange, type: 'dept'| 'cat'){

    if(type === "dept"){
      this.selectedDepartment = event.value;
    }
    if(type === "cat"){
      this.selectedCategory = event.value;
    }

    if(this.selectedDepartment && this.selectedCategory){
      this.getQuestionnaire();
      this.onTimeout()
    }
  }
  /**
   * fetch questionnaire
   */
  getQuestionnaire() {
    this.initForm([
      {
        department: '',
        category: '',
        question: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        answer: '',
      },
    ]);
    this.quizServ.getQuestionnaire(this.selectedDepartment, this.selectedCategory).subscribe({
      next: (resp: any) => {
        if (resp.status === "success") {
          this.formObj = resp.data;
          if(resp.data){
            this.initForm(this.formObj.options);
          }
          else{

            this.dataTobeSentToSnackBarService.message = "No Questions Available under the selected category and department, Please select valid data";
            this.dataTobeSentToSnackBarService.panelClass = ["custom-snack-failure"]
            this.snackBarServ.openSnackBarFromComponent(this.dataTobeSentToSnackBarService);
            this.initForm('')
          }
        }
      },
      error: err => {
        this.dataTobeSentToSnackBarService.message = "Internal server error";
        this.dataTobeSentToSnackBarService.panelClass = ["custom-snack-failure"]
        this.snackBarServ.openSnackBarFromComponent(this.dataTobeSentToSnackBarService);
      }
    });
  }

  /**
   * initialize form
   */
  initForm(data: any) {
    this.quizForm = this.fb.group({
      department: [this.selectedDepartment, [Validators.required]],
      category: [this.selectedCategory, [Validators.required]],
      options: this.fb.array(data ? this.initFormArrayElements(data): []),
    });

  }
  /**
   *
   * @returns form array controls
   */
  private initFormArrayElements(data: Option[]): FormGroup<any>[] {
    return data.map((control: any) =>
      // this.fb.group({
      //   optionA: [control.optionA, [Validators.required]],
      //   optionB: [control.optionB, [Validators.required]],
      //   optionC: [control.optionC, [Validators.required]],
      //   optionD: [control.optionD, [Validators.required]],
      //   question: [control.question],
      //   answer: [control.answer],
      //   userans: [control.userans]
      // })

      this.fb.group({
        optionA: [control.optionA, [Validators.required]],
        optionB: [control.optionB, [Validators.required]],
        optionC: [control.optionC, [Validators.required]],
        optionD: [control.optionD, [Validators.required]],
        question: [control.question],
        answer: [control.answer],
        userans: []
      })
    );
  }

  /**
   *
   * @param event selected answer
   * @param questId question index
   */
  selectAnswer(event: MatRadioChange, questId: number) {
    if (event) {
      const formArr = this.quizForm.controls.options;
      const userAnsControl = formArr.controls[questId]?.get('userans');
      const answerControl = formArr.controls[questId]?.get('answer');
      answerControl?.patchValue(event.value);
      userAnsControl?.patchValue(event.value);
    }
  }

  onTimeout(){
    let timeVal = 30;
    let interval = setInterval(() => {
      if (timeVal === 0) {
       this.pauseTimer(interval);
      } else {
        timeVal--;
      }
      this.clock = transform(timeVal);
    }, 1000);
  }

  pauseTimer(interval: any){
    clearInterval(interval);
    this.onSubmit()
  }
  /**
   *
   * submit form
   */
  onSubmit() {
    console.log('form.value for save:', JSON.stringify(this.quizForm.value));
    if (this.quizForm.invalid) {
      // show errors
      this.displayFormErrors();
      return;
    }
    const saveObj = {
      ...this.quizForm.value,
      userid: localStorage.getItem('userid'),
      qid: this.formObj.qid,
    };
    this.quizServ.attemptQuiz(saveObj).subscribe({
      next: (resp: any) => {
        if (resp.status == 'success') {
          this.dataTobeSentToSnackBarService.message = 'Quiz submitted successfully';
        } else {
          this.dataTobeSentToSnackBarService.message = 'Quiz submission failed';
          this.dataTobeSentToSnackBarService.panelClass = ["custom-snack-failure"];
        }
        this.snackBarServ.openSnackBarFromComponent(this.dataTobeSentToSnackBarService);
      },
      error: (err: any) => {
        console.log(err.message);
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

  /** to display form validation messages */
  displayFormErrors() {
    this.quizForm.controls.options.controls.forEach((fg: any) => {
      if (fg && fg.invalid) {
        Object.keys(fg.controls).forEach((fgc) => {
          const control = fg.get(fgc);
          if (control && control.invalid) {
            control.markAsTouched();
          }
        });
      }
    });
  }

  /**
   * cancels data entered
   */
  onCancel() {
    this.quizForm.reset();
    this.selectedCategory = this.selectedDepartment = '';
  }
}
export const MOCK_RESP = {
  userid: 56,
  department: 'IT',
  category: 'Basic java Quations L1',
  qid: 2,
  options: [
    {
      id: 6,
      optionA: '6',
      optionB: '7',
      optionC: '8',
      optionD: '9',
      question: 'Number of primitive data types in Java are?',
      userans: 'C',
      answer: 'optionC',
    },
    {
      id: 7,
      optionA: '32 and 64',
      optionB: '32 and 32',
      optionC: '64 and 32',
      optionD: '64 and 64',
      question: 'What is the size of float and double in java?',
      userans: 'A',
      answer: 'optionA',
    },
    {
      id: 8,
      optionA: 'short to int ',
      optionB: 'long to int',
      optionC: 'byte to int',
      optionD: 'int to long',
      question:
        'Automatic type conversion is possible in which of the possible cases?',
      userans: 'B',
      answer: 'optionD',
    },
    {
      id: 9,
      optionA: 'char[] ch = new char()',
      optionB: 'char[] ch = new char(5)',
      optionC: 'char[] ch = new char[5]',
      optionD: 'char[] ch = new char()',
      question: 'Select the valid statement',
      userans: 'C',
      answer: 'optionC',
    },
    {
      id: 10,
      optionA: 'int []a=(1,2,3)',
      optionB: 'int []a={}',
      optionC: 'int [][]a={1,2,3}',
      optionD: 'int []a={1,2,3}',
      question: 'Select the valid statement to declare and initialize an array',
      userans: 'D',
      answer: 'optionD',
    },
  ],
};

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DialogService } from 'src/app/services/dialog.service';
import { DEPARTMENT } from 'src/app/constants/department';
import { ISnackBarData, SnackBarService } from 'src/app/services/snack-bar.service';
import { QuizService } from 'src/app/usit/services/quiz.service';
import { Questionnaire } from '../quiz.component';

@Component({
  selector: 'app-attempt-quiz',
  standalone: true,
  imports: [CommonModule, MatSelectModule, ReactiveFormsModule,MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatRadioModule, MatButtonModule, MatTooltipModule],
  templateUrl: './attempt-quiz.component.html',
  styleUrls: ['./attempt-quiz.component.scss']
})
export class AttemptQuizComponent implements OnInit{
  objectK = Object;
  deptOptions = DEPARTMENT;
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
  // formObj = [
  //   {
  //     question: '',
  //     optionA: '',
  //     optionB: '',
  //     optionC: '',
  //     optionD: '',
  //     answer: '',
  //   },
  //   {
  //     question: '',
  //     optionA: '',
  //     optionB: '',
  //     optionC: '',
  //     optionD: '',
  //     answer: '',
  //   },
  // ];
  formObj = MOCK_RESP.options;
  isFormSubmitted = false;
    // services
  private dialogServ = inject(DialogService);
  private snackBarServ = inject(SnackBarService);
  private fb = inject(FormBuilder)
  private quizServ = inject(QuizService)
  ngOnInit(): void {
    // this.getQuestionnaire();
     this.initForm();
   }

   /**
   * initialize form
   */
  initForm() {
    this.quizForm = this.fb.group({
      department: ['', [ Validators.required]],
      category: ['',[Validators.required,Validators.maxLength(100)]],
      options: this.fb.array(this.initFormArrayElements()),
    });

    (this.quizForm.get('options') as FormArray).controls.map(x => x.disable())
  }
  /**
   *
   * @returns form array controls
   */
  private initFormArrayElements(): FormGroup<Questionnaire>[] {
    return this.formObj.map((control: any) =>
      this.fb.group({
        optionA: [control.optionA, [ Validators.required,Validators.maxLength(100)] ],
        optionB: [control.optionB,[ Validators.required,Validators.maxLength(100)] ],
        optionC: [control.optionC, [Validators.required,Validators.maxLength(100)] ],
        optionD: [control.optionD, [Validators.required,Validators.maxLength(100)] ],
        question: [control.question, [Validators.required,Validators.maxLength(200)] ],
        answer: [control.answer,[Validators.required,Validators.maxLength(1)] ],

      }, )
    );
  }


   /**
   *
   * @param event selected answer
   * @param questId question index
   */
   selectAnswer(event: any, questId: number) {
    if(event){
      const formArr = this.quizForm.controls.options;
      const control = formArr.controls[questId]?.get('answer');
      control?.patchValue(event.target.value);
    }
  }

   /**
   *
   * submit form
   */
   onSubmit() {
    this.isFormSubmitted = true;
    console.log('form.value for save:', JSON.stringify(this.quizForm.value));
    if (this.quizForm.invalid) {
      // show errors
      this.displayFormErrors();
      return;
    }
    this.quizServ.attemptQuiz(this.quizForm.value).subscribe({
      next:(resp: any) => {

        // if (resp.status == 'success') {
        //   this.dataTobeSentToSnackBarService.message = 'Question added Successfully';
        // } else {
        //   this.dataTobeSentToSnackBarService.message = 'Question addition failed';
        //   this.dataTobeSentToSnackBarService.panelClass = ["custom-snack-failure"];
        // }
        // this.snackBarServ.openSnackBarFromComponent(this.dataTobeSentToSnackBarService);
      }, error: (err : any) =>{
        console.log(err.message);
        this.dataTobeSentToSnackBarService.message = err.message;
        this.dataTobeSentToSnackBarService.panelClass = ["custom-snack-failure"];
        this.snackBarServ.openSnackBarFromComponent(this.dataTobeSentToSnackBarService);
      }
    })
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
  onCancel(){
    this.quizForm.reset();
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

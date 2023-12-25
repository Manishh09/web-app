import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { QuizService } from '../../services/quiz.service';
import { ISnackBarData, SnackBarService } from 'src/app/services/snack-bar.service';
import { DialogService } from 'src/app/services/dialog.service';
import { DEPARTMENT } from 'src/app/constants/department';
import { MatSelectModule } from '@angular/material/select';
import { CATEGORY } from 'src/app/constants/category';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface Questionnaire {
  optionA: FormControl<string | null>;
  optionB: FormControl<string | null>;
  optionC: FormControl<string | null>;
  optionD: FormControl<string | null>;
  question: FormControl<string | null>;
  answer: FormControl<string | null>;
  userans?:FormControl<string | null>;
}

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, MatSelectModule, ReactiveFormsModule,MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatRadioModule, MatButtonModule, MatTooltipModule],
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit{
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
  formObj = [
    {
      question: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      answer: '',
    },
    {
      question: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      answer: '',
    },
  ];
  isFormSubmitted = false;
    // services
  private dialogServ = inject(DialogService);
  private snackBarServ = inject(SnackBarService);
  private fb = inject(FormBuilder)
  private quizServ = inject(QuizService);
  data = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<QuizComponent>);
  ngOnInit(): void {
    if(this.data.actionName === 'edit-quiz'){
      this.initForm('');
    this.getQuestionnaire();
    }
   else{
    this.initForm();
   }

  }
  /**
   * fetch questionnaire
   */
  getQuestionnaire(){
    const department = this.data.quizData.department;
    const category = this.data.quizData.category;
    this.quizServ.getQuestionnaire(department,category).subscribe({
      next: (resp: any) => {
        if(resp.data){
          this.formObj = resp.data;
          this.initForm(this.formObj);
        }
      }
    });
  }

  /**
   * initialize form
   */
  initForm(data?: any) {
    this.quizForm = this.fb.group({
      department: ['', [ Validators.required]],
      category: ['',[Validators.required] ],
      options: this.fb.array(this.initFormArrayElements(data)),
    });
  }

  /**
   *
   * @returns form array controls
   */
  private initFormArrayElements(data?: any): FormGroup<Questionnaire>[] {
    const response = data ? data.options : this.formObj;
    return response.map((control: any) =>
      this.fb.group({
        optionA: [control.optionA,[ Validators.required,Validators.maxLength(100)] ],
        optionB: [control.optionB,[ Validators.required,Validators.maxLength(100)] ],
        optionC: [control.optionC, [Validators.required,Validators.maxLength(100)] ],
        optionD: [control.optionD, [Validators.required,Validators.maxLength(100)] ],
        question: [control.question, [Validators.required,Validators.maxLength(200)] ],
        answer: [control.answer],
      })
    );
  }

  /**
   *
   * @param event selected answer
   * @param questId question index
   */
  selectAnswer(event: MatRadioChange, questId: number) {
    if(event){
      const formArr = this.quizForm.controls.options;
      const control = formArr.controls[questId]?.get('answer');
      control?.patchValue(event.value);
    }
  }

  /**
   * To Question dynamically
   */
  addQuestion() {
    const controls = {
      optionA: ['', [Validators.required, Validators.maxLength(100)]],
      optionB: ['', [Validators.required, Validators.maxLength(100)]],
      optionC: ['', [Validators.required, Validators.maxLength(100)]],
      optionD: ['',[Validators.required, Validators.maxLength(100)]],
      question: ['',[ Validators.required, Validators.maxLength(200)]],
      answer: [''],
    };

    this.quizForm.controls.options.push(this.fb.group(controls))
  }

  /**
   * removes question
   * @param id question id
   */
  removeQuestion(id: number) {
    this.quizForm.controls.options.removeAt(id);
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
    this.quizServ.saveQuestionnaire(this.quizForm.value).subscribe({
      next:(resp: any) => {

        if (resp.status == 'success') {
          this.dataTobeSentToSnackBarService.message = 'Question added Successfully';
        } else {
          this.dataTobeSentToSnackBarService.message = 'Question addition failed';
          this.dataTobeSentToSnackBarService.panelClass = ["custom-snack-failure"];
        }
        this.snackBarServ.openSnackBarFromComponent(this.dataTobeSentToSnackBarService);
        this.dialogRef.close();
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
  onAction(actionName : string){
    if(actionName === "CANCEL"){
      this.quizForm.reset();
    }
    this.dialogRef.close()


  }
}

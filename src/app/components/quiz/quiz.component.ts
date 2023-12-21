import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatRadioModule, MatButtonModule, MatTooltipModule],
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit{
  objectK = Object;
  quizForm: any = FormGroup;
  forms: FormGroup[] = [];
  formObj = [
    {
      question: 'q1',
      optionA: 'a1',
      optionB: '',
      optionC: '',
      optionD: '',
      answer: 'optionA',
    },
    {
      question: 'q2',
      optionA: '',
      optionB: '',
      optionC: 'c2',
      optionD: '',
      answer: 'optionC',
    },
  ];
  questObj = {
    question: 'question',
    options: [
      { name: 'optionA', selected: false },
      { name: 'optionB', selected: false },
      { name: 'optionC', selected: false },
      { name: 'optionD', selected: false },
    ],
    answer: 'answer',
  };
  questArr: any[] = [this.questObj];
  isFormSubmitted = false;
  private fb = inject(FormBuilder)

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.quizForm = this.fb.group({
      options: this.fb.array(this.initFormArrayElements()),
    });
  }
  private initFormArrayElements(): FormGroup<{
    optionA: FormControl<string | null>;
    optionB: FormControl<string | null>;
    optionC: FormControl<string | null>;
    optionD: FormControl<string | null>;
    question: FormControl<string | null>;
    answer: FormControl<string | null>;
  }>[] {
    return this.formObj.map((control) =>
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

  refForm() {
    console.log(
      'form-arr',
      (this.quizForm.get('options') as FormArray).controls
    );
    return this.quizForm.get('options') as FormArray;
  }

  selectAnswer(event: any, fg: any, ansId: number, questId: number) {
    const formArr = this.quizForm.controls.options;
    const control = formArr.controls[questId]?.get('answer');
    control?.patchValue(event.target.value);
  }
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
    console.log("this.quizForm.controls.options", this.quizForm.controls.options)
  }

  removeQuestion(id: number) {
    this.quizForm.controls.options.removeAt(id);
  }

  onSubmit() {
    this.isFormSubmitted = true;
    console.log('form.value for save:', JSON.stringify(this.quizForm.value));
    if (this.quizForm.invalid) {
      // show errors
      this.displayFormErrors();
      return;
    }
    console.log('form.value for save:', JSON.stringify(this.quizForm.value));
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

  onCancel(){
    this.quizForm.reset();
  }
}

import { Injectable, inject } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';
import { Questionnaire } from '../components/quiz/quiz.component';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private apiServ = inject(ApiService);

  // get questionnaire
  getQuestionnaire(department: string, category: string){
    return this.apiServ.get(`kpt/getTest/${department}/${category}`)
  }

  // get all quizes
  getAllQuizes(){
    return this.apiServ.get(`kpt/getTests/`);
  }


  //register questionnaire
  saveQuestionnaire(entity: any) {
    return this.apiServ.post("kpt/save", entity);
  }

  // write quiz
  attemptQuiz(entity: any) {
    return this.apiServ.post("kpt/writeTest", entity);
  }

  // delete quiz
  deleteQuiz(entity: any) {
    return this.apiServ.post("kpt/deleteTest", entity);
  }


  getMockQuiz(){
   return this.apiServ.getJson('assets/mock-quiz-data.json')
  }

}

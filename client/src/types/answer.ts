export interface IAnswer {
  _id?: string;
  question_id: string;
  answer: string[];
}

export interface IResult {
  user_id: string;
  quizz_id: string;
  answers: [
    {
      question_id: string;
      answer: string[];
      isCorrect: boolean;
      correctAnswer: string[];
      _id: string;
    },
  ];
  score: number;
  totalScore: number;
  _id: string;
  user: {
    _id: string;
    username: string;
  };
  quizz: {
    _id: string;
    title: string;
    imageLink: string;
  };
}

export interface IQuizz {
  _id: string;
  title: string;
  description: string;
  imageLink?: string;
  questions?: IQuestion[];
  author_id: string;
  author?: {
    _id?: string;
    username?: string;
    avatarLink?: string;
  };
  category_ids: string[];
  categories?: {
    _id?: string;
    name?: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IQuestion {
  _id?: string;
  text: string;
  options: {
    _id?: string;
    key: string;
    value: string;
  }[];
  isMultipleChoice: boolean;
  correctAnswer: string[];
  points: number;
}

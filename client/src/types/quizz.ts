export interface IQuizz {
  _id: string;
  author_id: string;
  author: {
    _id: string;
    username: string;
    avatarLink: string;
  };
  categories: {
    _id: string;
    name: string;
  }[];
  category_ids: string[];
  description: string;
  imageLink: string;
  title: string;
}

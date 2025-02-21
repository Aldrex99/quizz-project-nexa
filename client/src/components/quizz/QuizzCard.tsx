import { IQuizz } from '@/types/quizz';
import { Link } from 'react-router-dom';
import ButtonLink from '../buttons/ButtonLink';

type TQuizzCardProps = {
  quizz: IQuizz;
  quizzLink: string;
  forUpdate: boolean;
  forReponse?: boolean;
};

export default function QuizzCard({
  quizz,
  quizzLink,
  forUpdate,
  forReponse = false,
}: TQuizzCardProps) {
  return (
    <article className="lg:max-w-auto relative mx-auto flex max-w-64 flex-col space-y-2 rounded-lg bg-themedBg p-4 shadow-theme">
      {forUpdate && (
        <Link
          to={quizzLink}
          className="absolute left-0 top-0 z-20 h-full w-full rounded-lg border-2 border-transparent hover:border-primary"
        />
      )}
      <div className="relative h-56 w-56 rounded-lg">
        <img
          src={quizz.imageLink}
          alt="Quizz image"
          className="absolute h-full w-full rounded-lg object-cover text-themedText"
        />
        <div className="absolute flex h-full w-full items-center rounded-lg bg-black bg-opacity-50">
          <h1 className="flex w-full justify-center rounded-b-lg p-2 text-lg font-bold text-gray-100">
            {quizz.title}
          </h1>
        </div>
      </div>
      <p className="text-sm text-themedText">{quizz.description}</p>
      <div className="flex flex-col justify-between space-y-4">
        <div className="flex flex-wrap space-x-2">
          {quizz.categories?.map((category) => (
            <span
              key={category._id}
              className="rounded-full bg-primary px-2 py-1 text-xs font-semibold text-primary-text"
            >
              {category.name}
            </span>
          ))}
        </div>
        <p className="text-xs text-themedText">
          <span>Par</span>
          <span className="font-semibold text-primary">
            {' '}
            {quizz.author?.username}
          </span>
        </p>
      </div>
      {forReponse && (
        <ButtonLink
          to={`/quizz/response/${quizz._id}`}
          className="w-full"
          variant="primary"
        >
          Répondre
        </ButtonLink>
      )}
    </article>
  );
}

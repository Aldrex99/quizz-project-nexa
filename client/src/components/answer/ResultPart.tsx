import useDocumentTitle from '@/hooks/useDocumentTitle';
import { IResult } from '@/types/answer';
import { IQuizz } from '@/types/quizz';
import { classNames } from '@/utils/style';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

type TResultPartProps = {
  result: IResult;
  questions: IQuizz['questions'];
};

export default function ResultPart({ result, questions }: TResultPartProps) {
  useDocumentTitle('Résultat');
  return (
    <div className="space-y-4">
      <h1 className="text-center text-3xl font-bold text-primary">
        Résultat de votre quizz !
      </h1>
      <div className="space-y-4">
        <p className="text-center text-2xl font-semibold text-themedText">
          {result.score} / {result.totalScore}
        </p>
      </div>
      <div className="space-y-4 px-4">
        <div className="space-y-4">
          {result.answers.map((answer) => (
            <div key={answer.question_id} className="space-y-2">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold text-themedText">
                  {
                    questions!.find(
                      (question) => question._id === answer.question_id
                    )?.text
                  }
                </h3>
                {answer.isCorrect ? (
                  <CheckIcon className="h-6 w-6 text-green-500" />
                ) : (
                  <XMarkIcon className="h-6 w-6 text-red-500" />
                )}
              </div>
              <div className="space-y-2">
                {questions!
                  .find((question) => question._id === answer.question_id)
                  ?.options.map((option) => (
                    <div
                      key={answer.question_id + option.key}
                      className={`flex items-center space-x-2 rounded-md px-4 py-2 ${
                        answer.correctAnswer.includes(option.key) &&
                        answer.answer.includes(option.key)
                          ? 'bg-green-200'
                          : ''
                      } ${
                        answer.correctAnswer.includes(option.key) &&
                        !answer.answer.includes(option.key)
                          ? 'bg-red-200'
                          : ''
                      }`}
                    >
                      <p
                        className={classNames(
                          (answer.correctAnswer.includes(option.key) &&
                            answer.answer.includes(option.key)) ||
                            (answer.correctAnswer.includes(option.key) &&
                              !answer.answer.includes(option.key))
                            ? 'text-black'
                            : 'text-themedText',
                          'font-semibold'
                        )}
                      >
                        {option.value}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

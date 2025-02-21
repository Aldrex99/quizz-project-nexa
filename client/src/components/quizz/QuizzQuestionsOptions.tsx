import Button from '@/components/buttons/Button';
import CustomSwitch from '@/components/buttons/CustomSwitch';
import { TQuestion } from '@/pages/user/UpsertQuizz';
import TextInputLength from '@/components/inputs/TextInputLength';
import { TrashIcon } from '@heroicons/react/24/outline';

type TQuizzQuestionsProps = {
  question: TQuestion;
  questions: TQuestion[];
  setQuestions: React.Dispatch<React.SetStateAction<TQuestion[]>>;
  index: number;
};

const optionsKey = ['A', 'B', 'C', 'D', 'E', 'F'];

export default function QuizzQuestionsOptions({
  question,
  questions,
  setQuestions,
  index,
}: TQuizzQuestionsProps) {
  const handleAddOption = () => {
    setQuestions([
      ...questions.slice(0, index),
      {
        ...question,
        options: [
          ...question.options,
          {
            key: optionsKey[question.options.length],
            value: '',
          },
        ],
      },
      ...questions.slice(index + 1),
    ]);
  };

  const handleRemoveOption = (optionIndex: number) => {
    setQuestions([
      ...questions.slice(0, index),
      {
        ...question,
        options: [
          ...question.options.slice(0, optionIndex),
          ...question.options.slice(optionIndex + 1),
        ].map((option, i) => ({
          ...option,
          key: optionsKey[i],
        })),
        correctAnswer: question.correctAnswer.filter(
          (key) => key !== question.options[optionIndex].key
        ),
      },
      ...questions.slice(index + 1),
    ]);
  };

  const handleCorrectAnswer = (optionIndex: number) => {
    if (!question.isMultipleChoice) {
      setQuestions([
        ...questions.slice(0, index),
        {
          ...question,
          correctAnswer: [question.options[optionIndex].key],
        },
        ...questions.slice(index + 1),
      ]);
      return;
    }

    const correctAnswerIndex = question.correctAnswer.indexOf(
      question.options[optionIndex].key
    );

    if (correctAnswerIndex === -1) {
      setQuestions([
        ...questions.slice(0, index),
        {
          ...question,
          correctAnswer: [
            ...question.correctAnswer,
            question.options[optionIndex].key,
          ],
        },
        ...questions.slice(index + 1),
      ]);
    } else {
      setQuestions([
        ...questions.slice(0, index),
        {
          ...question,
          correctAnswer: [
            ...question.correctAnswer.slice(0, correctAnswerIndex),
            ...question.correctAnswer.slice(correctAnswerIndex + 1),
          ],
        },
        ...questions.slice(index + 1),
      ]);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      {question.options.map((option, optionIndex) => (
        <div key={optionIndex} className="flex w-full items-center space-x-4">
          <span className="text-lg font-semibold text-primary">
            {option.key}.
          </span>
          <TextInputLength
            label={`Texte de la réponse`}
            type="text"
            placeholder="Texte de la réponse"
            value={option.value}
            className="w-full flex-grow"
            onChange={(e) =>
              setQuestions([
                ...questions.slice(0, index),
                {
                  ...question,
                  options: [
                    ...question.options.slice(0, optionIndex),
                    { ...option, value: e.target.value },
                    ...question.options.slice(optionIndex + 1),
                  ],
                },
                ...questions.slice(index + 1),
              ])
            }
            maxLength={100}
          />
          <CustomSwitch
            text="Bonne réponse"
            checked={question.correctAnswer.includes(option.key)}
            onChange={() => handleCorrectAnswer(optionIndex)}
          />
          <Button
            type="button"
            onClick={() => handleRemoveOption(optionIndex)}
            className="rounded-md bg-red-500 p-1 text-white hover:bg-red-600"
            variant="none"
          >
            <TrashIcon className="h-5 w-5" />
          </Button>
        </div>
      ))}
      {question.options.length < 6 && (
        <Button type="button" onClick={handleAddOption}>
          Ajouter une réponse
        </Button>
      )}
    </div>
  );
}

import { TQuestion } from "@/pages/user/UpsertQuizz";
import { classNames } from "@/utils/style";
import TextInputLength from "./inputs/TextInputLength";
import TextInput from "./inputs/TextInput";
import Button from "./buttons/Button";
import CustomSwitch from "./buttons/CustomSwitch";
import { TrashIcon } from "@heroicons/react/24/outline";
import QuizzQuestionsOptions from "./QuizzQuestionsOptions";

type TQuizzQuestionsProps = {
  questions: TQuestion[];
  setQuestions: React.Dispatch<React.SetStateAction<TQuestion[]>>;
};

export default function QuizzQuestions({
  questions,
  setQuestions,
}: TQuizzQuestionsProps) {
  return (
    <div className="flex flex-col space-y-4">
      {questions.map((question, index) => (
        <article
          key={index}
          className={classNames(
            index != questions.length - 1
              ? "border-b-2 border-themedBorder pb-4"
              : "",
            "flex flex-col space-y-4",
          )}
        >
          <div className="flex items-center justify-between space-x-2">
            <h2 className="text-lg font-bold text-primary">
              Question {index + 1}
            </h2>

            <div className="flex items-center space-x-6">
              <TextInput
                label={`Points`}
                type="number"
                placeholder="Points de la question"
                value={question.points.toString()}
                className="w-16"
                onChange={(e) =>
                  setQuestions([
                    ...questions.slice(0, index),
                    { ...question, points: parseInt(e.target.value) },
                    ...questions.slice(index + 1),
                  ])
                }
              />
              <div className="flex items-center justify-center space-x-2">
                <CustomSwitch
                  text="Question à choix multiples"
                  checked={question.isMultipleChoice}
                  onChange={(value) =>
                    setQuestions([
                      ...questions.slice(0, index),
                      { ...question, isMultipleChoice: value },
                      ...questions.slice(index + 1),
                    ])
                  }
                />
                <span className="w-28 text-primary">
                  {question.isMultipleChoice
                    ? "Choix multiple"
                    : "Choix unique"}
                </span>
              </div>
              <Button
                type="button"
                onClick={() =>
                  setQuestions([
                    ...questions.slice(0, index),
                    ...questions.slice(index + 1),
                  ])
                }
                className="rounded-md bg-red-500 p-1 text-white hover:bg-red-600"
                variant="none"
              >
                <TrashIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <TextInputLength
            label={`Question`}
            type="text"
            placeholder="Texte de la question"
            className="w-full"
            value={question.text}
            onChange={(e) =>
              setQuestions([
                ...questions.slice(0, index),
                { ...question, text: e.target.value },
                ...questions.slice(index + 1),
              ])
            }
            maxLength={200}
          />
          <QuizzQuestionsOptions
            question={question}
            questions={questions}
            setQuestions={setQuestions}
            index={index}
          />
          {/* options */}
          {/* correctAnswer */}
        </article>
      ))}
    </div>
  );
}

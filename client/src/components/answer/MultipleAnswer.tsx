import { IAnswer } from "@/types/answer";
import { IQuestion } from "@/types/quizz";
import { Checkbox } from "@headlessui/react";

type TMultipleAnswerProps = {
  question: IQuestion;
  answers: IAnswer[];
  setAnswers: React.Dispatch<React.SetStateAction<IAnswer[]>>;
};

export default function MultipleAnswer({
  question,
  answers,
  setAnswers,
}: TMultipleAnswerProps) {
  const handleCheckboxChange = (checked: boolean, value: string) => {
    const newAnswers = [...answers];
    const answerIndex = newAnswers.findIndex(
      (a) => a.question_id === question._id,
    );

    if (answerIndex === -1) {
      newAnswers.push({
        question_id: question._id as string,
        answer: [value],
      });
    } else {
      if (checked) {
        newAnswers[answerIndex].answer.push(value);
      } else {
        newAnswers[answerIndex].answer = newAnswers[answerIndex].answer.filter(
          (a) => a !== value,
        );
      }
    }

    setAnswers(newAnswers);
  };

  return (
    <div className="flex flex-col space-y-4">
      {question?.options.map((option) => (
        <span key={option._id} className="flex space-x-2">
          <Checkbox
            checked={answers.some(
              (a) =>
                a.question_id === question._id && a.answer.includes(option.key),
            )}
            onChange={(checked) => handleCheckboxChange(checked, option.key)}
            value={option.key}
            className="group block size-6 rounded border border-themedBorder bg-themedBg shadow-theme data-[checked]:bg-primary"
          >
            <svg
              className="stroke-white opacity-0 group-data-[checked]:opacity-100"
              viewBox="0 0 14 14"
              fill="none"
            >
              <path
                d="M3 8L6 11L11 3.5"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Checkbox>
          <label className="text-themedText">{option.value}</label>
        </span>
      ))}
    </div>
  );
}

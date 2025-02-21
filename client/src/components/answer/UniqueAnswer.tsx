import { IAnswer } from '@/types/answer';
import { IQuestion } from '@/types/quizz';
import { Field, Label, Radio, RadioGroup } from '@headlessui/react';
import { useEffect, useState } from 'react';

type TMultipleAnswerProps = {
  question: IQuestion;
  answers: IAnswer[];
  setAnswers: React.Dispatch<React.SetStateAction<IAnswer[]>>;
};

export default function UniqueAnswer({
  question,
  answers,
  setAnswers,
}: TMultipleAnswerProps) {
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const newAnswers = [...answers];
    const answerIndex = newAnswers.findIndex(
      (a) => a.question_id === question._id
    );

    if (answerIndex === -1) {
      newAnswers.push({
        question_id: question._id as string,
        answer: [selected!],
      });
    } else {
      newAnswers[answerIndex].answer = [selected!];
    }

    setAnswers(newAnswers);
  }, [selected]);

  return (
    <RadioGroup
      value={selected}
      onChange={setSelected}
      aria-label="Choix de réponse unique"
      className={`flex flex-col space-y-4`}
    >
      {question?.options.map((option) => (
        <Field key={option.key} className="flex space-x-2">
          <Radio
            value={option.key}
            className="group flex size-6 items-center justify-center rounded-full border border-themedBorder bg-themedFg shadow-theme data-[checked]:bg-primary"
          >
            <span className="invisible size-3 rounded-full bg-white group-data-[checked]:visible" />
          </Radio>
          <Label className="flex text-themedText">{option.value}</Label>
        </Field>
      ))}
    </RadioGroup>
  );
}

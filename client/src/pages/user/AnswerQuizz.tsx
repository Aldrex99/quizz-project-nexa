import useDocumentTitle from "@/hooks/useDocumentTitle";
import { fetcher } from "@/utils/fetch";
import { IAnswer, IResult } from "@/types/answer";
import { IQuizz } from "@/types/quizz";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import Loading from "../common/Loading";
import MultipleAnswer from "@/components/answer/MultipleAnswer";
import UniqueAnswer from "@/components/answer/UniqueAnswer";
import Button from "@/components/buttons/Button";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import ResultPart from "@/components/answer/ResultPart";

export default function AnswerQuizz() {
  useDocumentTitle("Répondre au Quizz");
  const { quizzId } = useParams();
  const { user } = useUser();
  const [quizz, setQuizz] = useState<IQuizz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<IAnswer[]>([]);
  const [result, setResult] = useState<IResult | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const fetchQuizz = async () => {
      try {
        const data = await fetcher(`/quizz/for-user/${quizzId}`);

        if (!data) {
          setError("Quizz introuvable.");
          return;
        }

        if (data.author_id === user?.id) {
          navigate(`/quizz/update/${quizzId}`);
        }

        setQuizz(data);
      } catch (error) {
        setError((error as Error).message || "Une erreur s'est produite.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizz();
  }, [navigate, quizzId, user?.id]);

  const handleChangePage = (index: number, next: boolean) => {
    setError("");

    const questionAnswered = answers.find(
      (answer) => answer.question_id === quizz?.questions![index]._id,
    );

    if (!questionAnswered && next) {
      setError("Vous devez répondre à cette question.");
      return;
    }

    if (next) {
      setQuestionIndex(index + 1);
    } else {
      setQuestionIndex(index - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const data = await fetcher(`/answer/${quizzId}`, {
        method: "POST",
        body: JSON.stringify({ answers: answers }),
      });

      setResult(data);
    } catch (error) {
      setError((error as Error).message || "Une erreur s'est produite.");
    }
  };

  return (
    <div className="flex flex-col space-y-4 pb-4">
      <section className="space-y-6 rounded-lg bg-themedFg p-4">
        {loading && <Loading width="full" height="52" />}
        {error && (
          <div className="rounded-md bg-red-100 px-4 py-2 text-red-500">
            {error}
          </div>
        )}
        {quizz && !result ? (
          <>
            <h1 className="text-center text-4xl font-bold text-themedText">
              {quizz.title}
            </h1>
            {quizz.questions!.map(
              (question, index) =>
                questionIndex === index && (
                  <div key={question._id} className="space-y-6 px-4">
                    <h2 className="text-2xl font-semibold text-primary">
                      {question.text}
                    </h2>
                    <div className="space-y-2">
                      {question.isMultipleChoice ? (
                        <MultipleAnswer
                          key={question._id}
                          question={question}
                          answers={answers}
                          setAnswers={setAnswers}
                        />
                      ) : (
                        <UniqueAnswer
                          key={question._id}
                          question={question}
                          answers={answers}
                          setAnswers={setAnswers}
                        />
                      )}
                    </div>
                  </div>
                ),
            )}
            <div className="flex justify-between">
              <Button
                type="button"
                variant={questionIndex === 0 ? "none" : "primary"}
                onClick={() => handleChangePage(questionIndex, false)}
                disabled={questionIndex === 0}
                className="w-1/3 rounded-md border-2 border-primary text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <span className="flex space-x-2">
                  <ArrowLeftIcon className="h-6 w-6" />
                  <span>Précédente</span>
                </span>
              </Button>
              {questionIndex < quizz.questions!.length - 1 ? (
                <Button
                  type="button"
                  onClick={() => handleChangePage(questionIndex, true)}
                  className="w-1/3"
                >
                  <span className="flex space-x-2">
                    <span>Suivante</span>
                    <ArrowRightIcon className="h-6 w-6" />
                  </span>
                </Button>
              ) : (
                <Button type="button" onClick={handleSubmit} className="w-1/3">
                  Terminer
                </Button>
              )}
            </div>
          </>
        ) : null}
        {result && <ResultPart result={result} questions={quizz?.questions} />}
      </section>
    </div>
  );
}

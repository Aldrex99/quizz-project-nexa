import { useUser } from '@/hooks/useUser';
import { fetcher } from '@/utils/fetch';
import { IQuizz } from '@/types/quizz';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { IResult } from '@/types/answer';
import Loading from '../common/Loading';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { classNames } from '@/utils/style';
import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
  CheckIcon,
  ChevronDownIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import Button from '@/components/buttons/Button';
import ButtonLink from '@/components/buttons/ButtonLink';

export default function QuizzInfo() {
  const { user } = useUser();
  const { quizzId } = useParams<{ quizzId: string }>();
  const [loading, setLoading] = useState<{
    general: boolean;
    answers: boolean;
    changePage: boolean;
  }>({
    general: true,
    answers: true,
    changePage: false,
  });
  const [quizz, setQuizz] = useState<IQuizz | null>(null);
  const [answers, setAnswers] = useState<IResult[] | null>(null);
  const [totalAnswers, setTotalAnswers] = useState<number>(0);
  const [answerLimit, setAnswerLimit] = useState<number>(5);
  const [answerPage, setAnswerPage] = useState<number>(1);
  const [answersortBy, setAnswerSortBy] = useState<string>('createdAt');
  const [answersortOrder, setAnswerSortOrder] = useState<string>('desc');

  useEffect(() => {
    const fetchQuizz = async () => {
      try {
        const data = await fetcher(`/quizz/for-user/${quizzId}`);

        setQuizz(data);
        setLoading((prev) => ({ ...prev, general: false }));
      } catch (error) {
        console.error(error);
      }
    };

    fetchQuizz();
  }, [quizzId]);

  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const data = await fetcher(
          `/answer/by-quizz/${quizzId}?limit=${answerLimit}&page=${answerPage}&sortBy=${answersortBy}&sortOrder=${answersortOrder}`
        );

        setAnswers(data.answers);
        setTotalAnswers(data.total);
        setLoading((prev) => ({ ...prev, answers: false, changePage: false }));
      } catch (error) {
        console.error(error);
      }
    };

    if (quizz?.author_id === user?.id) {
      fetchAnswers();
    } else {
      setLoading((prev) => ({ ...prev, answers: false, changePage: false }));
    }
  }, [
    quizz,
    user,
    quizzId,
    answerLimit,
    answerPage,
    answersortBy,
    answersortOrder,
  ]);

  useEffect(() => {
    setLoading((prev) => ({ ...prev, changePage: false }));
  }, [answerPage]);

  return (
    <div className="relative flex flex-col space-y-4 pb-4">
      <section
        id="upsert-quizz-general"
        className="flex space-y-6 rounded-lg bg-themedFg p-4"
      >
        {loading.general ? (
          <Loading width="full" height="h-96" />
        ) : (
          <div className="flex w-full flex-col space-y-4">
            <div className="relative flex w-full items-center justify-center">
              <h1 className="w-full text-center text-2xl font-bold text-themedText">
                {quizz?.title}
              </h1>
              {quizz?.author_id !== user?.id ? (
                <ButtonLink
                  to={`/quizz/response/${quizz?._id}`}
                  className="absolute right-4"
                  variant="primary"
                >
                  Répondre
                </ButtonLink>
              ) : (
                <ButtonLink
                  to={`/quizz/update/${quizz?._id}`}
                  className="absolute right-4"
                  variant="primary"
                >
                  Modifier
                </ButtonLink>
              )}
            </div>
          </div>
        )}
      </section>
      {quizz?.author_id === user?.id &&
        (loading.answers ? (
          <Loading width="full" height="h-96" />
        ) : (
          answers && (
            <section
              id="quizz-answers"
              className="flex flex-col rounded-lg bg-themedFg p-4"
            >
              <h2 className="pb-4 text-lg font-bold text-themedText">
                Réponses
              </h2>
              <div className="flex flex-col rounded-md border border-themedBorder">
                {loading.changePage ? (
                  <Loading width="full" height="h-12" />
                ) : (
                  answers.map((answer, index) => (
                    <Disclosure key={answer._id}>
                      <DisclosureButton
                        className={classNames(
                          index % 2 === 0 ? 'bg-themedBg' : 'bg-themedFg',
                          index === 0 ? 'rounded-t-lg' : '',
                          index === answers.length - 1 ? 'rounded-b-lg' : '',
                          'group flex justify-between p-4 text-themedText'
                        )}
                      >
                        <span className="flex items-center space-x-2">
                          <span>{answer.user.username}</span>
                          <span>
                            le {new Date(answer.createdAt!).toLocaleString()}
                          </span>
                        </span>
                        <span className="flex items-center space-x-2">
                          <span>
                            {answer.score}/{answer.totalScore}
                          </span>
                          {
                            <ChevronDownIcon className="h-6 w-6 text-themedText group-data-[open]:rotate-180" />
                          }
                        </span>
                      </DisclosureButton>
                      <DisclosurePanel
                        className={classNames(
                          index % 2 === 0 ? 'bg-themedBg' : 'bg-themedFg',
                          'max-h-96 overflow-y-scroll p-4'
                        )}
                      >
                        {answer.answers.map((ans) => (
                          <div key={ans.question_id} className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <h3 className="text-lg font-semibold text-themedText">
                                {
                                  quizz?.questions!.find(
                                    (question) =>
                                      question._id === ans.question_id
                                  )?.text
                                }
                              </h3>
                              {ans.isCorrect ? (
                                <CheckIcon className="h-6 w-6 text-green-500" />
                              ) : (
                                <XMarkIcon className="h-6 w-6 text-red-500" />
                              )}
                            </div>
                            <div className="space-y-2">
                              {quizz
                                ?.questions!.find(
                                  (question) => question._id === ans.question_id
                                )
                                ?.options.map((option) => (
                                  <div
                                    key={ans.question_id + option.key}
                                    className={`flex items-center space-x-2 rounded-md px-4 py-2 ${
                                      ans.correctAnswer.includes(option.key) &&
                                      ans.answer.includes(option.key)
                                        ? 'bg-green-200'
                                        : ''
                                    } ${
                                      ans.correctAnswer.includes(option.key) &&
                                      !ans.answer.includes(option.key)
                                        ? 'bg-red-200'
                                        : ''
                                    }`}
                                  >
                                    <p
                                      className={classNames(
                                        (ans.correctAnswer.includes(
                                          option.key
                                        ) &&
                                          ans.answer.includes(option.key)) ||
                                          (ans.correctAnswer.includes(
                                            option.key
                                          ) &&
                                            !ans.answer.includes(option.key))
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
                      </DisclosurePanel>
                    </Disclosure>
                  ))
                )}
              </div>
              <nav className="flex items-center justify-between pt-4 sm:px-0 lg:px-4">
                <div className="-mt-px flex w-0 flex-1">
                  <Button
                    type="button"
                    onClick={() => setAnswerPage((prev) => prev - 1)}
                    disabled={answerPage === 1}
                    className=""
                  >
                    <ArrowLongLeftIcon
                      aria-hidden="true"
                      className="mr-3 size-5 text-themedText"
                    />
                    Précédent
                  </Button>
                </div>
                <div className="hidden md:-mt-px md:flex">
                  {Array.from({ length: Math.ceil(totalAnswers / answerLimit) })
                    .map((_, index) => index + 1)
                    .map((page) => (
                      <Button
                        type="button"
                        variant="none"
                        key={page}
                        className={classNames(
                          page === answerPage
                            ? 'border-primary text-primary'
                            : 'border-transparent text-themedText hover:border-primary hover:text-primary',
                          'inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium'
                        )}
                        onClick={() => setAnswerPage(page)}
                      >
                        {page}
                      </Button>
                    ))}
                </div>
                <div className="-mt-px flex w-0 flex-1 justify-end">
                  <Button
                    type="button"
                    onClick={() => setAnswerPage((prev) => prev + 1)}
                    disabled={
                      answerPage === Math.ceil(totalAnswers / answerLimit)
                    }
                    className=""
                  >
                    Suivant
                    <ArrowLongRightIcon
                      aria-hidden="true"
                      className="ml-3 size-5 text-themedText"
                    />
                  </Button>
                </div>
              </nav>
            </section>
          )
        ))}
    </div>
  );
}

import useDocumentTitle from "@/hooks/useDocumentTitle";
import ButtonLink from "@/components/buttons/ButtonLink";
import { fetcher } from "@/utils/fetch";
import { IQuizz } from "@/types/quizz";
import { useState, useEffect } from "react";
import QuizzCard from "@/components/quizz/QuizzCard";
import Loading from "../common/Loading";
import { useUser } from "@/hooks/useUser";

export default function Home() {
  const [quizz, setQuizz] = useState<IQuizz[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useDocumentTitle("Accueil");

  useEffect(() => {
    setLoading(true);
    const fetchQuizz = async () => {
      try {
        const data = await fetcher("/quizz/all?limit=5");
        setQuizz(data.quizzes);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };
    fetchQuizz();
  }, []);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center space-y-4">
      <section className="flex w-full justify-end">
        <ButtonLink to="/quizz/create">Créer un quizz</ButtonLink>
      </section>
      <div className="flex w-full flex-col space-y-4 pb-4">
        <section
          id="upsert-quizz-general"
          className="space-y-6 rounded-lg bg-themedFg p-4"
        >
          <h1 className="text-2xl font-bold text-primary">Vos quizz</h1>
          {loading ? (
            <Loading width="full" height="full" />
          ) : (
            <div className="grid grid-cols-1 gap-4 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
              {quizz?.map((item) => (
                <QuizzCard
                  key={item._id}
                  quizz={item}
                  forUpdate={user?.id === item.author?._id}
                  forReponse={user?.id !== item.author?._id}
                  quizzLink={`/quizz/update/${item._id}`}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

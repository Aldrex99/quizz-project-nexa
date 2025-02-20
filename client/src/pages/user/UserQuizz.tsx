import { useEffect, useState } from "react";
import { fetcher } from "@/utils/fetch";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import QuizzCard from "@/components/quizz/QuizzCard";
import Loading from "../common/Loading";
import { useUser } from "@/hooks/useUser";
import { IQuizz } from "@/types/quizz";

export default function UserQuizz() {
  const { user } = useUser();
  const [quizz, setQuizz] = useState<IQuizz[]>([]);
  const [loading, setLoading] = useState(true);
  useDocumentTitle("Vos quizz");

  useEffect(() => {
    const fetchQuizz = async () => {
      try {
        const data = await fetcher(`/quizz/author/${user?.id}`);
        setQuizz(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchQuizz();
  }, []);

  return (
    <div className="flex w-full flex-col space-y-4 pb-4">
      <section
        id="upsert-quizz-general"
        className="w-full space-y-6 rounded-lg bg-themedFg p-4"
      >
        <h1 className="text-2xl font-bold text-primary">Vos quizz</h1>
        {loading ? (
          <Loading width="full" height="full" />
        ) : (
          quizz.map((item) => (
            <QuizzCard
              key={item._id}
              quizz={item}
              forUpdate={user?.id === item.author._id}
              forReponse={user?.id !== item.author._id}
              quizzLink={`/quizz/update/${item._id}`}
            />
          ))
        )}
      </section>
    </div>
  );
}

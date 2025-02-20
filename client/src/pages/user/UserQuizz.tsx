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
        console.error(error);
        setLoading(false);
      }
    };
    fetchQuizz();
  }, [user?.id]);

  return (
    <div className="flex flex-col space-y-4 pb-4">
      <section
        id="upsert-quizz-general"
        className="space-y-6 rounded-lg bg-themedFg p-4"
      >
        <h1 className="text-2xl font-bold text-primary">Vos quizz</h1>
        {loading ? (
          <Loading width="full" height="full" />
        ) : (
          <div className="grid grid-cols-1 gap-4 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
            {quizz.map((item) => (
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
  );
}

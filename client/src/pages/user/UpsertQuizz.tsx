import { useState, useEffect } from "react";
import { fetcher } from "@/utils/fetch";
import Button from "@/components/buttons/Button";
import TextInputLength from "@/components/inputs/TextInputLength";
import TextAreaLength from "@/components/inputs/TextAreaLength";
import MultiSelect from "@/components/inputs/MultiSelect";
import FileZone from "@/components/inputs/FileZone";
import QuizzQuestions from "@/components/quizz/QuizzQuestions";
import useDocumentTitle from "@/hooks/useDocumentTitle";

export type TQuestion = {
  text: string;
  points: number;
  isMultipleChoice: boolean;
  options: {
    key: string;
    value: string;
  }[];
  correctAnswer: string[];
};

type TAvailableCategory = {
  key: string;
  value: string;
};

export default function UpsertQuizz() {
  const [availableCategories, setAvailableCategories] = useState<
    TAvailableCategory[]
  >([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  // const [imageLink, setImageLink] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [questions, setQuestions] = useState<TQuestion[]>([
    {
      text: "",
      points: 1,
      isMultipleChoice: false,
      options: [
        {
          key: "A",
          value: "",
        },
        {
          key: "B",
          value: "",
        },
      ],
      correctAnswer: [],
    },
  ]);
  const [error, setError] = useState("");

  useDocumentTitle("Créer un quizz");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await fetcher("/category/all?limit=100");
        const formattedData = data.categories?.map(
          (category: { _id: string; name: string }) => ({
            key: category._id,
            value: category.name,
          }),
        );
        setAvailableCategories(formattedData);
      } catch (error) {
        setError((error as Error).message ?? "Une erreur s'est produite");
      }
    };

    fetchCategories();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleNewQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: "",
        points: 1,
        isMultipleChoice: false,
        options: [
          {
            key: "A",
            value: "",
          },
          {
            key: "B",
            value: "",
          },
        ],
        correctAnswer: [],
      },
    ]);
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError("");

    try {
      const data = await fetcher("/quizz/create", {
        method: "POST",
        body: JSON.stringify({
          title,
          description,
          categories,
          questions,
        }),
      });

      const formData = new FormData();
      formData.append("quizz", selectedFile!);
      formData.append("quizzId", data.quizzId);

      await fetcher(`/quizz/upload`, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });
    } catch (error) {
      setError((error as Error).message ?? "Une erreur s'est produite");
    }
  };

  return (
    <div className="flex flex-col space-y-4 pb-4">
      <section
        id="upsert-quizz-general"
        className="space-y-6 rounded-lg bg-themedFg p-4"
      >
        <h1 className="text-2xl font-bold text-primary">
          Informations générales
        </h1>
        <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
          <article className="md:max-w-1/2 flex flex-col space-y-4 md:w-1/2">
            <TextInputLength
              label="Titre"
              type="text"
              placeholder="Titre du quizz"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={50}
            />
            <TextAreaLength
              label="Description"
              placeholder="Description du quizz"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={250}
              rows={5}
            />
            <MultiSelect
              text="Sélectionner une ou plusieurs catégories"
              options={
                availableCategories.length > 0 ? availableCategories : []
              }
              selectedOptions={categories}
              setSelectedOptions={setCategories}
            />
          </article>
          <div className="md:max-w-1/2 md:w-1/2">
            <FileZone
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              handleFileChange={handleFileChange}
            />
          </div>
        </div>
      </section>
      <section
        id="upsert-quizz-questions"
        className="space-y-8 rounded-lg bg-themedFg p-4"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">Questions</h1>
          <Button type="button" onClick={handleNewQuestion}>
            Ajouter une question
          </Button>
        </div>
        <QuizzQuestions questions={questions} setQuestions={setQuestions} />
      </section>
      <section id="upsert-quizz-submit" className="flex flex-col space-y-4">
        <Button type="submit" onClick={handleSubmit} className="w-full">
          Créer le quizz
        </Button>
        {error && (
          <div className="rounded-md bg-red-100 px-4 py-2 text-red-500">
            {error}
          </div>
        )}
      </section>
    </div>
  );
}

import { useState } from "react";
import TextInputLength from "@/components/inputs/TextInputLength";
import TextAreaLength from "@/components/inputs/TextAreaLength";
import { fetcher } from "@/utils/fetch";
import Button from "@/components/buttons/Button";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import { TrashIcon } from "@heroicons/react/24/outline";
import TextInput from "@/components/inputs/TextInput";
import { classNames } from "@/utils/style";

type TGeneral = {
  title: string;
  description: string;
  imageLink?: string;
  selectedFile?: File | null;
  categories: string[];
};

type TQuestion = {
  text: string;
  points: number;
  isMultipleChoice: boolean;
  options: { key: string; value: string }[];
  correctAnswer: string[];
};

export default function UpsertQuizz() {
  const [general, setGeneral] = useState<TGeneral>({
    title: "",
    description: "",
    categories: [],
  });
  const [questions, setQuestions] = useState<TQuestion[]>([]);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setGeneral({ ...general, selectedFile: e.target.files[0] });
    }
  };

  const handleNewQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: "",
        points: 1,
        isMultipleChoice: false,
        options: [],
        correctAnswer: [],
      },
    ]);
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    try {
      await fetcher("/quizz/create", {
        method: "POST",
        body: JSON.stringify({}),
      });
    } catch (error) {
      setError((error as Error).message ?? "Une erreur s'est produite");
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <section
        id="upsert-quizz-general"
        className="space-y-4 rounded-lg bg-themedFg p-4"
      >
        <h1 className="text-2xl font-bold text-primary">
          Informations générales
        </h1>
        <div className="flex space-x-4">
          <article className="flex flex-1 flex-col space-y-4">
            <TextInputLength
              label="Titre"
              type="text"
              placeholder="Titre du quizz"
              value={general.title}
              onChange={(e) =>
                setGeneral({ ...general, title: e.target.value })
              }
              maxLength={50}
            />
            <TextAreaLength
              label="Description"
              placeholder="Description du quizz"
              value={general.description}
              onChange={(e) =>
                setGeneral({ ...general, description: e.target.value })
              }
              maxLength={250}
              rows={5}
            />
            {/* TODO : Multi selecteur basé sur les catégories qui sont en base. faire un composant réutilisable */}
            {/* Categories */}
          </article>
          <div className="flex-1">
            <div className="flex flex-col space-y-4">
              <div className="flex w-full flex-col items-center justify-center object-cover">
                {general.selectedFile && (
                  <p className="flex flex-col text-center text-lg text-themedText">
                    Mettre comme photo pour le quizz :{" "}
                    <span className="font-semibold text-primary">
                      {general.selectedFile?.name}
                    </span>
                  </p>
                )}
                <label
                  htmlFor="dropzone-file"
                  className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-themedBorder hover:bg-themedBg"
                >
                  {general.selectedFile ? (
                    <div className="relative">
                      <button
                        type="button"
                        className="absolute -right-8 rounded-lg bg-red-500 p-1"
                        onClick={() =>
                          setGeneral({ ...general, selectedFile: null })
                        }
                      >
                        <span className="sr-only">Supprimer</span>
                        <TrashIcon className="h-4 w-4 text-themedText" />
                      </button>
                      <img
                        src={URL.createObjectURL(general.selectedFile)}
                        alt="Image du quizz"
                        className="h-60 w-full rounded-lg object-contain"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center pb-6 pt-5">
                      <CloudArrowUpIcon className="h-8 w-8 text-primary" />
                      <p className="mb-2 text-sm text-primary">
                        <span className="font-semibold">
                          Cliquez pour télécharger
                        </span>
                      </p>
                      <p className="text-xs text-themedPlaceholder">
                        Accepte les fichiers de type image
                      </p>
                    </div>
                  )}
                  <input
                    id="dropzone-file"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={!!general.selectedFile}
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        id="upsert-quizz-questions"
        className="space-y-4 rounded-lg bg-themedFg p-4"
      >
        <h1 className="text-2xl font-bold text-primary">Questions</h1>
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
              <TextInputLength
                label={`Question ${index + 1}`}
                type="text"
                placeholder="Texte de la question"
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
              <TextInput
                label={`Points`}
                type="number"
                placeholder="Points de la question"
                value={question.points.toString()}
                onChange={(e) =>
                  setQuestions([
                    ...questions.slice(0, index),
                    { ...question, points: parseInt(e.target.value) },
                    ...questions.slice(index + 1),
                  ])
                }
              />
              {/* isMultipleChoice */}
              {/* options */}
              {/* correctAnswer */}
            </article>
          ))}
        </div>

        <article>
          {/* text */} {/* points */} {/* multipleChoice */}
          {/* options */}
        </article>
        <Button type="button" onClick={handleNewQuestion}>
          Ajouter une question
        </Button>
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

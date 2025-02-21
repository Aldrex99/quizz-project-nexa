import { useState, useEffect } from 'react';
import { fetcher } from '@/utils/fetch';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '@/components/buttons/Button';
import TextInputLength from '@/components/inputs/TextInputLength';
import TextAreaLength from '@/components/inputs/TextAreaLength';
import MultiSelect from '@/components/inputs/MultiSelect';
import FileZone from '@/components/inputs/FileZone';
import QuizzQuestions from '@/components/quizz/QuizzQuestions';
import useDocumentTitle from '@/hooks/useDocumentTitle';
import { toast } from 'react-toastify';
import { useUser } from '@/hooks/useUser';

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
  const { user } = useUser();
  const [availableCategories, setAvailableCategories] = useState<
    TAvailableCategory[]
  >([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [questions, setQuestions] = useState<TQuestion[]>([
    {
      text: '',
      points: 1,
      isMultipleChoice: false,
      options: [
        {
          key: 'A',
          value: '',
        },
        {
          key: 'B',
          value: '',
        },
      ],
      correctAnswer: [],
    },
  ]);
  const [quizzToEdit, setQuizzToEdit] = useState<boolean>(false);

  useDocumentTitle('Créer un quizz');

  const { quizzId } = useParams<{ quizzId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await fetcher('/category/all?limit=100');
        const formattedData = data.categories?.map(
          (category: { _id: string; name: string }) => ({
            key: category._id,
            value: category.name,
          })
        );
        setAvailableCategories(formattedData);
      } catch (error) {
        toast.error((error as Error).message ?? "Une erreur s'est produite", {
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          closeButton: false,
          className:
            'bg-themedFg text-themedText shadow-theme top-14 sm:right-1',
        });
      }
    };

    fetchCategories();

    if (quizzId) {
      setQuizzToEdit(true);
      const fetchQuizz = async () => {
        try {
          const data = await fetcher(`/quizz/one/${quizzId}`);

          if (data.author_id !== user?.id) {
            navigate(`/quizz/response/${quizzId}`);
          }

          setTitle(data.title);
          setDescription(data.description);
          setCategories(data.category_ids);
          setQuestions(data.questions);
        } catch (error) {
          toast.error((error as Error).message ?? "Une erreur s'est produite", {
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            closeButton: false,
            className:
              'bg-themedFg text-themedText shadow-theme top-14 sm:right-1',
          });
        }
      };

      fetchQuizz();
    }
  }, [navigate, quizzId, user?.id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleNewQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: '',
        points: 1,
        isMultipleChoice: false,
        options: [
          {
            key: 'A',
            value: '',
          },
          {
            key: 'B',
            value: '',
          },
        ],
        correctAnswer: [],
      },
    ]);
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const postUrl = quizzToEdit ? `/quizz/update/${quizzId}` : '/quizz/create';
    const formData = new FormData();

    try {
      formData.append('title', title);
      formData.append('description', description);
      formData.append('categories', JSON.stringify(categories));
      formData.append('questions', JSON.stringify(questions));
      if (selectedFile) {
        formData.append('quizzImage', selectedFile!);
      }

      await fetcher(
        postUrl,
        {
          method: quizzToEdit ? 'PUT' : 'POST',
          body: formData,
        },
        true,
        false
      );

      toast.success(quizzToEdit ? 'Quizz modifié' : 'Quizz créé', {
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        closeButton: false,
        className: 'bg-themedFg text-themedText shadow-theme top-14 sm:right-1',
      });
    } catch (error) {
      toast.error((error as Error).message ?? "Une erreur s'est produite", {
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        closeButton: false,
        className: 'bg-themedFg text-themedText shadow-theme top-14 sm:right-1',
      });
    }
  };

  return (
    <div className="relative flex flex-col space-y-4 pb-4">
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
          {quizzToEdit ? 'Modifier le quizz' : 'Créer le quizz'}
        </Button>
      </section>
    </div>
  );
}

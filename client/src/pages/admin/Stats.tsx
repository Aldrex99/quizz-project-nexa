import { useState } from 'react';
import { fetcher } from '@/utils/fetch';
import TextInput from '@/components/inputs/TextInput';
import Button from '@/components/buttons/Button';
import { toast } from 'react-toastify';

export default function Stats() {
  const [category, setCategory] = useState('');

  const handleSubmitCategory = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    try {
      await fetcher('/category/create', {
        method: 'POST',
        body: JSON.stringify({ name: category }),
      });

      toast.success('Catégorie ajoutée', {
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        closeButton: false,
        className: 'bg-themedFg text-themedText shadow-theme top-14 sm:right-1',
      });

      setCategory('');
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
    <div className="flex w-full flex-col space-y-4 pb-4">
      <section
        id="upsert-quizz-general"
        className="w-full space-y-6 rounded-lg bg-themedFg p-4"
      >
        <h1 className="text-2xl font-bold text-primary">
          Ajouter une catégorie
        </h1>
        <div className="flex items-center space-x-4">
          <TextInput
            type="text"
            label="Nom de la catégorie"
            value={category}
            className="w-full"
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Nom de la catégorie"
          />
          <Button type="button" onClick={handleSubmitCategory}>
            Ajouter
          </Button>
        </div>
      </section>
    </div>
  );
}

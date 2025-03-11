import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetcher } from '@utils/fetch';
import { useUser } from '@/hooks/useUser';
import TextInput from '@components/inputs/TextInput';
import Button from '@components/buttons/Button';
import ButtonLink from '@/components/buttons/ButtonLink';
import useDocumentTitle from '@/hooks/useDocumentTitle';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { getMe, isAuthenticated } = useUser();
  const navigate = useNavigate();

  useDocumentTitle('Se connecter');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    try {
      await fetcher('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      await getMe();

      navigate('/home');
    } catch (error) {
      setError((error as Error).message ?? "Une erreur s'est produite");
    }
  };

  return (
    <div className="flex min-h-[100vh] items-center justify-center">
      <div className="mx-4 flex w-full flex-col space-y-4 rounded-lg border-transparent bg-themedFg px-6 py-12 shadow-theme sm:m-0 sm:w-1/2 sm:px-12 lg:w-1/3">
        <h1 className="mb-4 flex justify-center text-2xl font-semibold text-primary">
          Se connecter
        </h1>
        <TextInput
          label="Email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
        />
        <div className="flex flex-col items-end">
          <div className="relative w-full">
            <TextInput
              label="Mot de passe"
              type="password"
              placeholder="Mot de passe"
              className="w-full"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
            />
          </div>
          {/* <Link
            to="/forgot-password"
            className="pt-1 text-sm text-primary hover:text-primary-gradient"
          >
            Mot de passe oublié ?
          </Link> */}
        </div>
        {error && (
          <div className="rounded-md bg-red-100 px-4 py-2 text-red-700">
            {error}
          </div>
        )}
        <Button
          type="button"
          onClick={handleSubmit}
          className="w-full"
          variant="primary"
        >
          Connexion
        </Button>
        <ButtonLink to="/register" className="w-full" variant="primaryFlat">
          Créer un compte
        </ButtonLink>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { useNavigate } from 'react-router-dom';
import { fetcher } from '@utils/fetch';
import TextInput from '@components/inputs/TextInput';
import Button from '@components/buttons/Button';
import ButtonLink from '@/components/buttons/ButtonLink';
import useDocumentTitle from '@/hooks/useDocumentTitle';
import { ICustomError } from '@/types/error';

export default function Register() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<ICustomError>();
  const [loading, setLoading] = useState(false);

  const { isAuthenticated } = useUser();
  const navigate = useNavigate();

  useDocumentTitle('Créer un compte');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  const updatingErroredField = (field: string) => {
    if (error?.validationErrors?.find((e) => e.path === field)) {
      const newError = { ...error };
      newError.validationErrors = error.validationErrors.filter(
        (e) => e.path !== field
      );
      setError(newError);
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);
    if (!email || !username || !password || !confirmPassword) {
      const missingFields = [
        !email && { path: 'email', errors: ['Email requis'] },
        !username && { path: 'username', errors: ["Nom d'utilisateur requis"] },
        !password && { path: 'password', errors: ['Mot de passe requis'] },
        !confirmPassword && {
          path: 'confirmPassword',
          errors: ['Confirmation du mot de passe requise'],
        },
      ].filter(Boolean) as ICustomError['validationErrors'];
      setError({
        message: 'Veuillez remplir tous les champs',
        name: 'MissingFields',
        validationErrors: missingFields,
      });
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError({
        message: 'Les mots de passe ne correspondent pas',
        name: 'PasswordMismatch',
      });
      setLoading(false);
      return;
    }

    try {
      const { error } = await fetcher(
        '/auth/register',
        {
          method: 'POST',
          body: JSON.stringify({ email, username, password, confirmPassword }),
        },
        false
      );

      if (error) {
        setError(error);
        return;
      }

      navigate('/login');
    } catch (error) {
      setError({
        message: (error as Error).message ?? "Une erreur s'est produite",
        name: 'UnknownError',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[100vh] items-center justify-center">
      <div className="mx-4 flex w-full flex-col space-y-4 rounded-lg border-transparent bg-themedFg px-6 py-12 shadow-theme sm:m-0 sm:w-1/2 sm:px-12 lg:w-1/3">
        <h1 className="mb-4 flex justify-center text-2xl font-semibold text-primary">
          Créer un compte
        </h1>
        <div className="relative w-full">
          <TextInput
            label="Email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setEmail(e.target.value);
              updatingErroredField('email');
            }}
            error={!!error?.validationErrors?.find((e) => e.path === 'email')}
          />
          {error?.validationErrors?.find((e) => e.path === 'email') && (
            <span className="text-sm text-red-500">Adresse email invalide</span>
          )}
        </div>
        <div className="relative w-full">
          <TextInput
            label="Nom d'utilisateur"
            type="text"
            placeholder="Nom d'utilisateur"
            value={username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setUsername(e.target.value);
              updatingErroredField('username');
            }}
            error={
              !!error?.validationErrors?.find((e) => e.path === 'username')
            }
          />
          {error?.validationErrors?.find((e) => e.path === 'username') && (
            <span className="text-sm text-red-500">
              Nom d'utilisateur invalide
            </span>
          )}
        </div>
        <div className="relative w-full">
          <TextInput
            label="Mot de passe"
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setPassword(e.target.value);
              updatingErroredField('password');
            }}
            error={
              !!error?.validationErrors?.find((e) => e.path === 'password')
            }
          />
          {error?.validationErrors?.find((e) => e.path === 'password') &&
            (error.name === 'ValidationError' ? (
              <span className="text-sm text-red-500">
                Le mot de passe :
                <ul className="list-inside list-disc">
                  {error.validationErrors
                    .filter((e) => e.path === 'password')
                    .flatMap((e) => e.errors)
                    .map((e, i) => (
                      <li key={i}>{e}</li>
                    ))}
                </ul>
              </span>
            ) : (
              <span className="text-sm text-red-500">
                Le mot de passe est requis
              </span>
            ))}
        </div>
        <div className="relative w-full">
          <TextInput
            label="Confirmer le mot de passe"
            type="password"
            placeholder="Confirmer le mot de passe"
            value={confirmPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setConfirmPassword(e.target.value);
              updatingErroredField('confirmPassword');
            }}
          />
          {error?.validationErrors?.find(
            (e) => e.path === 'confirmPassword'
          ) && (
            <span className="text-sm text-red-500">
              Les mots de passe ne correspondent pas
            </span>
          )}
        </div>
        {error && (
          <div className="rounded-md bg-red-100 px-4 py-2 text-red-700">
            {error.message}
          </div>
        )}
        <Button
          type="button"
          onClick={handleSubmit}
          className="w-full"
          variant="primary"
        >
          {loading ? 'Chargement...' : 'Créer un compte'}
        </Button>
        <ButtonLink to="/login" className="w-full" variant="primaryFlat">
          Se connecter
        </ButtonLink>
      </div>
    </div>
  );
}

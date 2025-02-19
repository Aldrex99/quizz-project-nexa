import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { useNavigate } from "react-router-dom";
import { fetcher } from "@utils/fetch";
import TextInput from "@components/inputs/TextInput";
import Button from "@components/buttons/Button";
import ButtonLink from "@/components/buttons/ButtonLink";

export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { isAuthenticated } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Quizz universe | Créer un compte";
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);
    if (!email || !password || !confirmPassword) {
      setError("Veuillez remplir tous les champs");
      return;
    }
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      await fetcher(
        "/auth/register",
        {
          method: "POST",
          body: JSON.stringify({ email, username, password, confirmPassword }),
        },
        false,
      );

      navigate("/login");
    } catch (error) {
      setError((error as Error).message ?? "Une erreur s'est produite");
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
        <TextInput
          label="Email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
        />
        <TextInput
          label="Nom d'utilisateur"
          type="text"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setUsername(e.target.value)
          }
        />
        <TextInput
          label="Mot de passe"
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
        />
        <TextInput
          label="Confirmer le mot de passe"
          type="password"
          placeholder="Confirmer le mot de passe"
          value={confirmPassword}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setConfirmPassword(e.target.value)
          }
        />
        <Button
          type="button"
          onClick={handleSubmit}
          className="w-full"
          variant="primary"
        >
          {loading ? "Chargement..." : "Créer un compte"}
        </Button>
        {error && (
          <div className="rounded-md bg-red-100 px-4 py-2 text-red-500">
            {error}
          </div>
        )}
        <ButtonLink to="/login" className="w-full" variant="primaryFlat">
          Se connecter
        </ButtonLink>
      </div>
    </div>
  );
}

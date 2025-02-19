import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { Link, useNavigate } from "react-router-dom";
import { fetcher } from "@utils/fetch";
import TextInput from "@components/inputs/TextInput";
import Button from "@components/buttons/Button";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { isAuthenticated } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Quizz universe | Mot de passe oublié";
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);
    if (!email) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    try {
      await fetcher(
        "/auth/forgot-password",
        {
          method: "POST",
          body: JSON.stringify({ email }),
        },
        false,
      );
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
          Mot de passe oublié
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
        <Button
          type="button"
          onClick={handleSubmit}
          className="w-full"
          variant="primary"
        >
          {loading ? "Chargement..." : "Envoyer"}
        </Button>
        {error && (
          <div className="rounded-md bg-red-100 px-4 py-2 text-red-500">
            {error}
          </div>
        )}
        <Link to="/login" className="text-primary hover:text-primary-gradient">
          Se connecter
        </Link>
      </div>
    </div>
  );
}

import ButtonLink from "@/components/buttons/ButtonLink";

export default function Home() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center space-y-4">
      <section className="flex w-full justify-end">
        <ButtonLink to="/quizz/create">Créer un quizz</ButtonLink>
      </section>
      <div className="flex w-full flex-col space-y-6 rounded-lg border border-transparent bg-themedFg px-6 py-12 shadow-theme sm:m-0 sm:w-1/2 sm:px-12 lg:w-full">
        <h1 className="mb-4 flex justify-center text-2xl font-semibold text-primary">
          Quizz universe
        </h1>
        <p className="text-center text-lg text-themedText">
          Bienvenue sur Quizz universe, le meilleur endroit pour tester vos
          connaissances.
        </p>
        <div className="flex justify-center">
          Et ici un petit bouton pour commencer à jouer
        </div>
      </div>
    </div>
  );
}

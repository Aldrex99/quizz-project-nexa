import { TrashIcon, CloudArrowUpIcon } from "@heroicons/react/24/outline";

type TFileZoneProps = {
  selectedFile: File | null;
  setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function FileZone({
  selectedFile,
  setSelectedFile,
  handleFileChange,
}: TFileZoneProps) {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex w-full flex-col items-center justify-center space-y-2 object-cover">
        {selectedFile && (
          <p className="flex flex-col text-center text-lg text-themedText">
            Mettre comme photo pour le quizz :{" "}
            <span className="font-semibold text-primary">
              {selectedFile?.name}
            </span>
          </p>
        )}
        <label
          htmlFor="dropzone-file"
          className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-themedBorder hover:bg-themedBg"
        >
          {selectedFile ? (
            <div className="relative">
              <button
                type="button"
                className="absolute -right-8 rounded-lg bg-red-500 p-1"
                onClick={() => setSelectedFile((prev) => (prev ? null : prev))}
              >
                <span className="sr-only">Supprimer</span>
                <TrashIcon className="h-4 w-4 text-themedText" />
              </button>
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Image du quizz"
                className="h-60 w-full rounded-lg object-contain"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center pb-6 pt-5">
              <CloudArrowUpIcon className="h-8 w-8 text-primary" />
              <p className="mb-2 text-sm text-primary">
                <span className="font-semibold">Cliquez pour télécharger</span>
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
            disabled={!!selectedFile}
            onChange={handleFileChange}
          />
        </label>
      </div>
    </div>
  );
}

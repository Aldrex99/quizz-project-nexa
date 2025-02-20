import { useState } from "react";
import { useUser } from "@/hooks/useUser";
import BaseModal from "@components/modals/BaseModal";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import Button from "@/components/buttons/Button";
import { DialogTitle } from "@headlessui/react";
import { fetcher } from "@/utils/fetch";
import { toast } from "react-toastify";

type TAvatarProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function Avatar({ open, setOpen }: TAvatarProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { getMe } = useUser();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("Veuillez sélectionner un fichier", {
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        closeButton: false,
        className: "bg-themedFg text-themedText shadow-theme top-14 sm:right-1",
      });
      return;
    }

    const formData = new FormData();
    formData.append("avatar", selectedFile);

    try {
      await fetcher(`/user/avatar`, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      await getMe();

      toast.success("Avatar changé", {
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        closeButton: false,
        className: "bg-themedFg text-themedText shadow-theme top-14 sm:right-1",
      });
    } catch (error) {
      toast.error((error as Error).message ?? "Une erreur s'est produite", {
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        closeButton: false,
        className: "bg-themedFg text-themedText shadow-theme top-14 sm:right-1",
      });
    }
  };

  return (
    <BaseModal open={open} setOpen={setOpen}>
      <div className="flex flex-col space-y-6">
        <DialogTitle
          as="h3"
          className="text-center text-base font-semibold text-themedText"
        >
          Modifier ma photo de profil
        </DialogTitle>
        <div className="flex flex-col space-y-4">
          <div className="flex w-full flex-col items-center justify-center space-y-2 object-cover">
            {selectedFile && (
              <p className="flex flex-col text-center text-lg text-themedText">
                Mettre comme photo de profil :{" "}
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
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Photo de profil de votre compte"
                  className="size-36 rounded-full object-cover"
                />
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
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center space-y-4">
        <Button type="button" onClick={handleUpload} className="w-full">
          Mettre à jour
        </Button>
        <Button
          type="button"
          onClick={() => setOpen(false)}
          variant="primaryFlat"
          className="w-full"
        >
          Annuler
        </Button>
      </div>
    </BaseModal>
  );
}

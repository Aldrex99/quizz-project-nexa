import { DialogTitle } from '@headlessui/react';
import { fetcher } from '@/utils/fetch';
import { useState } from 'react';
import { useUser } from '@/hooks/useUser';
import BaseModal from '@components/modals/BaseModal';
import Button from '@components/buttons/Button';
import TextInput from '@components/inputs/TextInput';

type TEditProfileProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function EditProfile({ open, setOpen }: TEditProfileProps) {
  const { user, getMe } = useUser();
  const [username, setUsername] = useState(user?.username ?? '');
  const [email, setEmail] = useState(user?.email ?? '');

  const handleUpdate = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await fetcher(`/user/me`, {
        method: 'PUT',
        body: JSON.stringify({ username, email }),
      });

      await getMe();
      setOpen(false);
    } catch (error) {
      console.error((error as Error).message ?? "Une erreur s'est produite");
    }
  };

  return (
    <BaseModal open={open} setOpen={setOpen}>
      <div className="flex flex-col space-y-6">
        <DialogTitle
          as="h3"
          className="text-center text-base font-semibold text-themedText"
        >
          Modifier mon profil
        </DialogTitle>
        <div className="flex flex-col space-y-4">
          <TextInput
            label="Nom d'utilisateur"
            type="text"
            placeholder="Nom d'utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextInput
            label="Email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center space-y-4">
        <Button type="button" onClick={handleUpdate} className="w-full">
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

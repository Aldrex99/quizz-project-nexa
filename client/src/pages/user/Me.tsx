import useDocumentTitle from '@/hooks/useDocumentTitle';
import { useState, useContext } from 'react';
import { useUser } from '@/hooks/useUser';
import Button from '@/components/buttons/Button';
import Avatar from '@/components/modals/user/Avatar';
import EditProfile from '@/components/modals/user/EditProfile';
import { ThemeContext } from '@/contexts/ThemeContext';

const themeColorList = ['purple', 'red', 'green', 'orange', 'turquoise'];

export default function Me() {
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const { user } = useUser();
  const { changeThemeColor } = useContext(ThemeContext)!;

  useDocumentTitle('Mon profil');

  const handleThemeColorChange = (color: string) => {
    changeThemeColor(color);
  };

  return (
    <div className="space-y-4 py-2">
      <EditProfile
        open={showEditProfileModal}
        setOpen={setShowEditProfileModal}
      />
      <Avatar open={showAvatarModal} setOpen={setShowAvatarModal} />
      <div className="flex flex-col rounded-lg bg-themedFg p-4 shadow-theme">
        <div className="flex items-center p-2">
          <h1 className="flex-1 py-2 pl-2 text-2xl font-semibold text-primary">
            Mon profil
          </h1>
          <Button type="button" onClick={() => setShowEditProfileModal(true)}>
            Modifier
          </Button>
        </div>
        <div className="flex flex-col p-2">
          <div className="flex items-center space-x-4">
            <Button
              type="button"
              variant="none"
              className="rounded-full border"
              defaultPadding={false}
              onClick={() => setShowAvatarModal(true)}
            >
              <img
                src={user?.avatarLink}
                alt="Photo de profil de votre compte"
                className="size-36 rounded-full object-cover"
              />
              <div className="absolute z-10 flex size-36 items-center justify-center rounded-full bg-black bg-opacity-50 font-semibold text-white opacity-0 hover:opacity-100">
                <p>Modifier</p>
              </div>
            </Button>
            <div className="text-themedText">
              <h2 className="text-xl font-semibold">{user?.username}</h2>
              <p>{user?.email}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col rounded-lg bg-themedFg p-4 shadow-theme">
        <div className="flex items-center p-2">
          <h1 className="flex-1 py-2 pl-2 text-2xl font-semibold text-primary">
            Couleur de l'application
          </h1>
        </div>
        <div className="flex gap-4 p-2">
          <button
            onClick={() => handleThemeColorChange('')}
            className={`h-10 w-10 rounded-full bg-[#3498db] hover:bg-[#3498dbbf]`}
          ></button>
          {themeColorList.map((color) => (
            <button
              key={color}
              onClick={() => handleThemeColorChange(color)}
              className={`${color} h-10 w-10 rounded-full bg-primary hover:bg-primary-gradient`}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
}

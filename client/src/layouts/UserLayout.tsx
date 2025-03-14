import { Link, useLocation } from 'react-router-dom';
import { useUser } from '@/hooks/useUser';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Popover,
  PopoverButton,
  PopoverPanel,
} from '@headlessui/react';
import {
  Bars3Icon,
  ChevronDownIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { AcademicCapIcon } from '@heroicons/react/24/solid';
import { classNames } from '@utils/style';
import ThemeSwitch from '@/components/buttons/ThemeSwitch';

const navigation = [
  {
    name: 'Accueil',
    to: '/home',
    authorizedRole: ['user', 'moderator', 'admin'],
    current: false,
  },
  {
    name: 'Vos quiz',
    to: '/my-quizzes',
    authorizedRole: ['user', 'moderator', 'admin'],
    current: false,
  },
];

const staffNavigation = [
  {
    name: 'Signalements',
    to: '/reports',
    authorizedRole: ['moderator', 'admin'],
    current: false,
  },
  {
    name: 'Commentaires',
    to: '/comments',
    authorizedRole: ['moderator', 'admin'],
    current: false,
  },
  {
    name: 'Utilisateurs',
    to: '/users',
    authorizedRole: ['moderator', 'admin'],
    current: false,
  },
  {
    name: 'Statistiques',
    to: '/stats',
    authorizedRole: ['admin'],
    current: false,
  },
];

const userNavigation = [
  { name: 'Votre profil', to: '/me' },
  { name: 'Déconnexion', to: '/logout' },
];

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUser();
  const actualPath = useLocation().pathname;

  navigation.map((item) => {
    item.current = item.to === actualPath;
    return item;
  });

  staffNavigation.map((item) => {
    item.current = item.to === actualPath;
    return item;
  });

  return (
    <div>
      <Disclosure as="nav" className="bg-themedFg shadow-theme">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="shrink-0">
                <AcademicCapIcon className="h-8 w-8 text-primary" />
              </div>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex items-center">
                  {navigation.map(
                    (item) =>
                      item.authorizedRole?.includes(user!.role) && (
                        <Link
                          key={item.name}
                          to={item.to}
                          className={classNames(
                            item.current
                              ? 'bg-themedBg text-themedText'
                              : 'text-themedText hover:text-primary',
                            'rounded-md px-3 py-2 text-sm font-medium text-themedText'
                          )}
                          aria-current={item.current ? 'page' : undefined}
                        >
                          {item.name}
                        </Link>
                      )
                  )}
                  {user?.role === 'moderator' || user?.role === 'admin' ? (
                    <Popover className="relative px-3 py-2">
                      <PopoverButton className="inline-flex items-center gap-x-1 text-sm/6 text-themedText hover:text-primary focus:outline-none focus:ring-0 focus:ring-offset-themedBg">
                        <span>Staff</span>
                        <ChevronDownIcon
                          aria-hidden="true"
                          className="size-4"
                        />
                      </PopoverButton>

                      <PopoverPanel
                        transition
                        className="absolute left-1/2 z-30 mt-5 flex w-screen max-w-min -translate-x-1/2 px-4 transition data-[closed]:translate-y-1 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in"
                      >
                        <div className="w-56 shrink rounded-xl bg-themedFg p-4 text-sm/6 font-semibold text-themedText shadow-theme ring-1 ring-gray-900/5">
                          {staffNavigation.map((item) => (
                            <Link
                              key={item.name}
                              to={item.to}
                              className={classNames(
                                item.current
                                  ? 'text-primary'
                                  : 'text-themedText hover:text-primary',
                                'block py-1'
                              )}
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </PopoverPanel>
                    </Popover>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex items-center">
                <ThemeSwitch />

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <MenuButton className="relative flex rounded-full bg-themedFg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-themedBg">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      <img
                        alt="your profile picture"
                        src={user?.avatarLink}
                        className="size-8 rounded-full object-cover"
                      />
                    </MenuButton>
                  </div>
                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-themedFg py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                  >
                    {userNavigation.map((item) => (
                      <MenuItem key={item.name}>
                        <Link
                          to={item.to}
                          className="block px-4 py-2 text-sm text-themedText data-[focus]:bg-primary data-[focus]:text-primary-text data-[focus]:outline-none"
                        >
                          {item.name}
                        </Link>
                      </MenuItem>
                    ))}
                  </MenuItems>
                </Menu>
              </div>
            </div>
            <div className="-mr-2 flex sm:hidden">
              {/* Mobile menu button */}
              <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-themedText hover:bg-themedBg hover:text-primary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary">
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                <Bars3Icon
                  aria-hidden="true"
                  className="block size-6 group-data-[open]:hidden"
                />
                <XMarkIcon
                  aria-hidden="true"
                  className="hidden size-6 group-data-[open]:block"
                />
              </DisclosureButton>
            </div>
          </div>
        </div>

        <DisclosurePanel className="sm:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {navigation.map(
              (item) =>
                item.authorizedRole?.includes(user!.role) && (
                  <Link
                    key={item.name}
                    to={item.to}
                    className={classNames(
                      item.current
                        ? 'bg-themedBg text-themedText'
                        : 'text-themedText hover:text-primary',
                      'block rounded-md px-3 py-2 text-base font-medium'
                    )}
                    aria-current={item.current ? 'page' : undefined}
                  >
                    {item.name}
                  </Link>
                )
            )}
            {user?.role === 'moderator' || user?.role === 'admin'
              ? staffNavigation.map(
                  (item) =>
                    item.authorizedRole?.includes(user!.role) && (
                      <Link
                        key={item.name}
                        to={item.to}
                        className={classNames(
                          item.current
                            ? 'bg-themedBg text-themedText'
                            : 'text-themedText hover:text-primary',
                          'block rounded-md px-3 py-2 text-base font-medium'
                        )}
                        aria-current={item.current ? 'page' : undefined}
                      >
                        {item.name}
                      </Link>
                    )
                )
              : null}
          </div>
          <div className="border-t border-themedBorder pb-3 pt-4">
            <div className="flex items-center justify-between px-5">
              <div className="flex items-center">
                <div className="shrink-0">
                  <img
                    alt="your profile picture"
                    src={user?.avatarLink}
                    className="size-10 rounded-full object-cover"
                  />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-themedText">
                    {user?.username}
                  </div>
                  <div className="text-sm font-medium text-themedPlaceholder">
                    {user?.email}
                  </div>
                </div>
              </div>
              <ThemeSwitch />
            </div>
            <div className="mt-3 space-y-1 px-2">
              {userNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.to}
                  className="block rounded-md px-3 py-2 text-base font-medium text-themedText hover:bg-primary hover:text-primary-text"
                >
                  <DisclosureButton>{item.name}</DisclosureButton>
                </Link>
              ))}
            </div>
          </div>
        </DisclosurePanel>
      </Disclosure>
      <div className="mx-auto max-w-6xl px-4 pt-4 sm:px-6 lg:px-8">
        <main>{children}</main>
      </div>
    </div>
  );
}

import { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { BoltIcon } from "@heroicons/react/24/solid";
import { Field, Form, Formik } from "formik";

import pb from "../../helpers/pocketbase";


const userNavigation = [
  { name: "Your Profile", href: "#" },
  { name: "Settings", href: "#" },
  { name: "Sign out", href: "#" },
];

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

function LoginModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const cancelButtonRef = useRef(null);

  // Login query

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden py-16 px-4 rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <button
                  type="button"
                  className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block"
                  onClick={() => setOpen(false)}
                  ref={cancelButtonRef}
                >
                  <XMarkIcon
                    className="h-6 w-6 text-gray-500"
                    aria-hidden="true"
                  />
                </button>
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                  <BoltIcon className="h-12 mx-auto" />
                  <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Sign in to your account
                  </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                  {/* <form className="space-y-6" action="http://localhost:3000/api/auth/login" method="POST"> */}
                  <Formik
                    initialValues={{
                      email: "",
                      password: "",
                    }}
                    
                    onSubmit={async (values) => {
                      try {
                        await pb.collection('users').authWithPassword(values.email.trim(), values.password.trim());
                        setOpen(false);
                        // Reload the page
                        window.location.reload();
                      } catch (error) {
                        alert("Login failed. Please try again.");
                      }

                    }}

                  >
                    <Form className="space-y-6">
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Email address
                        </label>
                        <div className="mt-2">
                          <Field
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between">
                          <label
                            htmlFor="password"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Password
                          </label>
                        </div>
                        <div className="mt-2">
                          <Field
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>

                      <div>
                        <button
                          type="submit"
                          className="flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                        >
                          Sign in
                        </button>
                      </div>
                    </Form>
                  </Formik>

                  <p className="mt-10 text-center text-sm text-gray-500">
                    Note: This demo has a pre-defined user. Look at the
                    documentation to find it.
                  </p>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default function Header() {
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [user, setUser] = useState<object | null>(null);

  useEffect(() => {
    const user = pb.authStore.model;
    if (user) {
      setUser(user);
    }
    else {
      setUser(null);
    }

  }, []);

  return (
    
        <div className=" bg-white">
          <LoginModal open={showLoginModal} setOpen={setShowLoginModal} />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-4">
                    Dashboard
                  </div>
                </div>
              </div>
              <div className="">
                <div className="ml-4 flex items-center md:ml-6">
                  {/* Profile dropdown */}
                  <Menu as="div" className="relative ml-3">
                    <div>
                      {/* <Menu.Button className="flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                            <span className="sr-only">Open user menu</span>
                            <img
                              className="h-8 w-8 rounded-full"
                              src={user.imageUrl}
                              alt=""
                            />
                          </Menu.Button> */}
                      {user ? (
                        <p>{pb.authStore.model?.username}{" "} 
                          <button onClick={
                          () => {
                            pb.authStore.clear();
                            setUser(null);
                          }
                        }
                        className="cursor-pointer text-gray-500 hover:text-gray-500 focus:outline-none focus:underline transition ease-in-out duration-150"
                        >
                            (Log out)
                          </button></p>
                      ) : (
                        <button
                          onClick={() => setShowLoginModal(true)}
                          className="flex items-center text-sm focus:outline-none focus:ring-1"
                        >
                          <span>Login</span>
                        </button>
                      )}
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {userNavigation.map((item) => (
                          <Menu.Item key={item.name}>
                            {({ active }) => (
                              <a
                                href={item.href}
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700"
                                )}
                              >
                                {item.name}
                              </a>
                            )}
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
              
            </div>
          </div>

         
        </div>
     
  );
}

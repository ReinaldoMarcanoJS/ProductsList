"use client";
import { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { permanentRedirect, redirect } from "next/navigation";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import Link from "next/link";
// import { login } from "@/lib/store/actions"; // Asegúrate de tener una acción de login en tu store
interface userLoginTypes {
  username: string;
  email: string;
  password: string;
}

const SignupSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!")
    .max(70, "Too Long!")
    .required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string()
    .min(6, "Too Short!")
    .max(70, "Too Long!")
    .required("Required"),
});

function Register() {
  const logged = useAppSelector((state) => state.app.logged);
  if (logged) {
    permanentRedirect("/dashboard");
  }
  const dispatch = useAppDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // dispatch(login({ username, password }));
  };

  const initialValues: userLoginTypes = {
    username: "",
    password: "",
    email: "",
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold text-center">Registrate</h1>
        <div className="text-center">
          <p className="text-sm text-gray-600">
            bienvenido/a ! Crea tu cuenta!.
          </p>
          <Link href="/login" className="text-indigo-600 hover:underline">
            Iniciar sesión
          </Link>
        </div>
        <Formik
          initialValues={initialValues}
          onSubmit={(values, actions) => {
              
              console.log({ values, actions });
              alert(JSON.stringify(values, null, 2));
              actions.setSubmitting(false);
            }}
            validationSchema={SignupSchema}
        >
          {() => (
            <Form className="space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Usuario:
                </label>
                <Field
                  type="text"
                  id="username"
                  name="username"
                  className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <ErrorMessage name="username" className="text-red-500" />
              </div>
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email:
                </label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <ErrorMessage name="email" className="text-red-500" />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Contrasena:
                </label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <ErrorMessage name="password" className="text-red-500" />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Log in
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default Register;

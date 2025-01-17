"use client";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import { registerQuery } from "../api/authquerys";
import { useToast } from "@/hooks/use-toast";
import { log } from "console";
import { ToastAction } from "@radix-ui/react-toast";

interface userRegisterTypes {
  name: string;
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
  const router = useRouter();
  const logged = useAppSelector((state) => state.app.logged);
  // if (logged) {
  //   permanentRedirect("/dashboard");
  // }
  const { toast } = useToast();

  const handleSubmit = async (
    values: userRegisterTypes,
    actions: FormikHelpers<userRegisterTypes>
  ) => {
  
    try {
      const res = await registerQuery(
        values.email,
        values.password,
        values.name
      );
      if (res.message == "error" && res.type) {
        console.log(res.type);
        console.log(res);

        toast({
          variant: "destructive",
          title: res.message,
          description: res.type,
        })
        return
      }
      toast({
        variant: "default",
        title: "Exitoso",
        description: "Usuario creado con exito",
      })
      router.push("/login");
    } catch (error) {
      console.log(error);
    }

    actions.setSubmitting(false);
  };

  const initialValues: userRegisterTypes = {
    name: "",
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
          validationSchema={SignupSchema}
          initialValues={initialValues}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Usuario:
                </label>
                <Field
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <ErrorMessage name="name" className="text-red-500" />
              </div>
              <div>
                <label
                  htmlFor="name"
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

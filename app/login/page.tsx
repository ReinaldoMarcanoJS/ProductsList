"use client";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import { loginQuery, verifyToken } from "../api/authquerys";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

interface userLoginTypes {
  email: string;
  password: string;
}

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string()
    .min(6, "Too Short!")
    .max(70, "Too Long!")
    .required("Required"),
});
function Login() {
  const supabase = createClient();
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      const token = Cookies.get("token");
      if (token) {
        const tokenValidated = await verifyToken(token);
        if (tokenValidated && tokenValidated.user) {
          router.push("/stats");
        }
      }
    };
    checkToken();
  }, [router]);
  const handleSubmit = async (
    values: userLoginTypes,
    actions: FormikHelpers<userLoginTypes>
  ) => {
    const { email, password } = values;
    console.log("Login values:", values);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
        actions.setSubmitting(false);
        return;
      }

      // Guardar token si lo necesitas
      if (data.session?.access_token && data.user?.id) {
        Cookies.set("token", data.session.access_token, { expires: 10 });
        Cookies.set("user_id", data.user.id, { expires: 10 });
        router.push(`/stats`);
      }
    } catch (error) {
      toast.toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al iniciar sesión.",
      });
    }
    actions.setSubmitting(false);
  };

  const initialValues: userLoginTypes = {
    email: "",
    password: "",
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold text-center">Login</h1>
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Welcome back! Please login to your account.
          </p>
          <Link href="/register" className="text-indigo-600 hover:underline">
            Create an account
          </Link>
        </div>
        <Formik
          validationSchema={LoginSchema}
          initialValues={initialValues}
          onSubmit={handleSubmit}
        >
          <Form className="space-y-4">
            <div>
              <label
                htmlFor="email"
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
                Password:
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
        </Formik>
      </div>
    </div>
  );
}

export default Login;

"use client";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import { loginQuery, verifyToken } from "../api/authquerys";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { log } from "console";

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
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {}, []);
  useEffect(() => {
    const checkToken = async () => { 
      const token = Cookies.get("token");
      if (token) {
        const tokenValidated = await verifyToken(token);
        if (tokenValidated && tokenValidated.user) {
          router.push("/dashboard");
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
    console.log(email, password);
    try {
      // toast.toast({
      //   variant: "default",
      //   title: email,
      //   description: password,
      // })
      const res = await loginQuery(email, password);
      console.log(await res);

      if (res.message == "error") {
        console.log(res.type);
        return;
      }
      if (res.token) {
        const tokenValidated = await verifyToken(res.token);
        console.log(tokenValidated);

        if (tokenValidated && tokenValidated.user) {
            Cookies.set("token", res.token, { expires: 10 });
          router.push(`/dashboard`);
        }
      }
    } catch (error) {
      console.log(error);
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

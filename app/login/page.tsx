"use client";
import { useRouter } from "next/navigation";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/utils/supabase/client";
import Cookies from "js-cookie";

interface userLoginTypes {
  email: string;
  password: string;
}

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Correo inválido").required("Requerido"),
  password: Yup.string()
    .min(6, "Mínimo 6 caracteres")
    .max(70, "Muy largo")
    .required("Requerido"),
});

function Login() {
  const supabase = createClient();
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (
    values: userLoginTypes,
    actions: FormikHelpers<userLoginTypes>
  ) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
        actions.setSubmitting(false);
        return;
      }

      // Guardar el user_id en las cookies
      if (data.user) {
        Cookies.set("user_id", data.user.id, { expires: 7 }); // Expira en 7 días
      }

      toast({
        variant: "default",
        title: "¡Bienvenido!",
        description: "Inicio de sesión exitoso.",
      });
      router.push("/dashboard");
    } catch (error) {
      toast({
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
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow">
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-2">
          Iniciar sesión
        </h1>
        <div className="text-center mb-4">
          <p className="text-sm text-gray-600 mb-2">
            ¡Bienvenido de nuevo! Ingresa tus datos para acceder.
          </p>
          <Link href="/register" className="text-indigo-600 hover:underline">
            ¿No tienes cuenta? Regístrate
          </Link>
        </div>
        <Formik
          validationSchema={LoginSchema}
          initialValues={initialValues}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Correo electrónico
                </label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  placeholder="correo@ejemplo.com"
                  className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Contraseña
                </label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Tu contraseña"
                  className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Iniciar sesión
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default Login;

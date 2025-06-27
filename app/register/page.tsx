"use client";
import { useRouter } from "next/navigation";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/utils/supabase/client";

interface userRegisterTypes {
  name: string;
  email: string;
  password: string;
}

const SignupSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Muy corto")
    .max(70, "Muy largo")
    .required("Requerido"),
  email: Yup.string().email("Correo inválido").required("Requerido"),
  password: Yup.string()
    .min(6, "Mínimo 6 caracteres")
    .max(70, "Muy largo")
    .required("Requerido"),
});

function Register() {
  const supabase = createClient();
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (
    values: userRegisterTypes,
    actions: FormikHelpers<userRegisterTypes>
  ) => {
    try {
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: { name: values.name },
        },
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

      toast({
        variant: "default",
        title: "¡Registro exitoso!",
        description:
          "Usuario creado correctamente. Revisa tu correo para confirmar tu cuenta.",
      });
      router.push("/login");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al registrar el usuario.",
      });
    }
    actions.setSubmitting(false);
  };

  const initialValues: userRegisterTypes = {
    name: "",
    password: "",
    email: "",
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow">
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-2">
          Crear cuenta
        </h1>
        <div className="text-center mb-4">
          <p className="text-sm text-gray-600 mb-2">
            ¡Bienvenido/a! Crea tu cuenta para comenzar.
          </p>
          <Link href="/login" className="text-indigo-600 hover:underline">
            ¿Ya tienes cuenta? Inicia sesión
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
                  Nombre de usuario
                </label>
                <Field
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Tu nombre"
                  className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>
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
                  placeholder="Mínimo 6 caracteres"
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
                Registrarme
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default Register;

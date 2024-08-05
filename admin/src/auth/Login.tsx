import { useForm } from "@mantine/form";
import {
  TextInput,
  PasswordInput,
  Paper,
  Button,
  Stack,
  Center,
} from "@mantine/core";
import { FC, useCallback } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import { FirebaseError } from "firebase/app";
import { notifications } from "@mantine/notifications";
import { useStore } from "@nanostores/react";
import { authStore } from "../store";

export const Login: FC = () => {
  const user = useStore(authStore).token;

  const form = useForm({
    initialValues: {
      email: "admin@admin.com",
      password: "98admin",
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: (val) =>
        val.length <= 6
          ? "Password should include at least 6 characters"
          : null,
    },
  });
  const [loading, { open, close }] = useDisclosure();

  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async ({ email, password }: typeof form.values) => {
      open();
      try {
        await fetch("https://admin.ventihairclinic.com/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        })
          .then(async (res) => res.json())
          .then((data) => {
            authStore.set({ token: data.token });
          });
        navigate("/");
      } catch (err: FirebaseError | unknown) {
        if (err instanceof FirebaseError) {
          if (err.code === "auth/invalid-credential") {
            notifications.show({
              color: "red",
              title: "Error",
              message: "Invalid credentials",
            });
          }
        }
      } finally {
        close();
      }
    },
    []
  );

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <Center h="100vh" bg="gray">
      <Paper radius="md" p="xl" w="420px" withBorder>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              required
              label="Email"
              placeholder="example@gmail.com"
              value={form.values.email}
              onChange={(event) =>
                form.setFieldValue("email", event.currentTarget.value)
              }
              error={form.errors.email && "Invalid email"}
              radius="md"
            />

            <PasswordInput
              required
              label="Password"
              placeholder="Your password"
              value={form.values.password}
              onChange={(event) =>
                form.setFieldValue("password", event.currentTarget.value)
              }
              error={
                form.errors.password &&
                "Password should include at least 6 characters"
              }
              radius="md"
            />
          </Stack>

          <Button type="submit" radius="xl" mt="xl" fullWidth loading={loading}>
            Login
          </Button>
        </form>
      </Paper>
    </Center>
  );
};

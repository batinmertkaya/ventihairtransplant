import { AppShell, Burger, Button, Flex, NavLink, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useStore } from "@nanostores/react";
import { IconArticle, IconHomeEdit, IconLogout } from "@tabler/icons-react";
import { FC } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { authStore, logout } from "./store";

const originalFetch = window.fetch;

window.fetch = async (...args) => {
  const res = await originalFetch(...args);

  if (res.status === 401) {
    logout();
    return new Response("Unauthorized", { status: 401 });
  }

  return res;
};

export const PrivateRoute: FC = () => {
  const [opened, { toggle }] = useDisclosure();
  const navigate = useNavigate();

  const token = useStore(authStore).token;

  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <AppShell
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Flex direction="column" justify="space-between" h="100%">
          <Stack>
            <NavLink
              onClick={() => {
                navigate("/");
              }}
              label="Blogs"
              leftSection={<IconArticle size="1rem" stroke={1.5} />}
            />
            <NavLink
              onClick={() => {
                navigate("/homepage");
              }}
              label="Homepage"
              leftSection={<IconHomeEdit size="1rem" stroke={1.5} />}
            />
          </Stack>
          <Stack>
            <Button
              justify="center"
              fullWidth
              leftSection={<IconLogout />}
              color="red"
              variant="transparent"
              onClick={async () => {
                logout();
                navigate("/login");
              }}
            >
              Logout
            </Button>
          </Stack>
        </Flex>
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};

import { AppShell, Burger, Button, Flex, NavLink, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconArticle, IconLogout } from "@tabler/icons-react";
import { FC } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { auth } from "./firebase";

export const PrivateRoute: FC = () => {
  const [opened, { toggle }] = useDisclosure();
  const navigate = useNavigate();

  const user = auth.currentUser;
  if (!user) {
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
              href="/"
              label="Blogs"
              leftSection={<IconArticle size="1rem" stroke={1.5} />}
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
                await auth.signOut();
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

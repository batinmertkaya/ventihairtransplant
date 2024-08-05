import {
  ScrollArea,
  Table,
  Text,
  AspectRatio,
  Image,
  Group,
  Button,
} from "@mantine/core";
import { FC } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { IconPlus } from "@tabler/icons-react";
import { authStore } from "../../store";
import { useStore } from "@nanostores/react";

export const BlogTable: FC = () => {
  const navigate = useNavigate();
  const token = useStore(authStore).token;
  const { data } = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      const c = await fetch("https://admin.ventihairclinic.com/blogs", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });
      const docs = await c.json();

      return docs.map(
        (doc: {
          id: number;
          slug: string;
          data: {
            title: string;
            content: string;
            slug: string;
            image: string;
          };
        }) => {
          return {
            id: doc.id,
            title: doc.data.title,
            content: doc.data.content,
            slug: doc.data.slug,
            image: doc.data.image,
          };
        }
      ) as Array<{
        id: number;
        title: string;
        content: string;
        slug: string;
        image: string;
      }>;
    },
  });

  return (
    <ScrollArea>
      {/* <TextInput
        placeholder="Search by any field"
        mb="md"
        leftSection={
          <IconSearch
            style={{ width: rem(16), height: rem(16) }}
            stroke={1.5}
          />
        }
        value={search}
        onChange={handleSearchChange}
      /> */}
      <Group justify="flex-end">
        <Button
          leftSection={<IconPlus />}
          onClick={() => navigate("/blog/create")}
        >
          Create
        </Button>
      </Group>
      <Table
        horizontalSpacing="md"
        verticalSpacing="xs"
        miw={700}
        layout="fixed"
      >
        <Table.Tbody>
          <Table.Tr>
            <Table.Th>Title</Table.Th>
            <Table.Th>Image</Table.Th>
            <Table.Th>Delete</Table.Th>
          </Table.Tr>
        </Table.Tbody>
        <Table.Tbody>
          {data?.map((blog) => (
            <Table.Tr key={blog.id}>
              <Table.Td>
                <Text fw={500} ta="left">
                  <Link to={`/blog/${blog.id}`}>{blog.title}</Link>
                </Text>
              </Table.Td>
              <Table.Td>
                {blog.image && (
                  <AspectRatio ratio={16 / 9}>
                    <Image src={blog.image} h="100" w="100" fit="contain" />
                  </AspectRatio>
                )}
              </Table.Td>
              <Table.Td>
                <Button
                  color="red"
                  variant="outline"
                  onClick={async () => {
                    await fetch(
                      `https://admin.ventihairclinic.com/blogs/${blog.id}`,
                      {
                        headers: {
                          Authorization: `Token ${token}`,
                        },
                        method: "DELETE",
                      }
                    );

                    window.location.reload();
                  }}
                >
                  Delete
                </Button>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
};

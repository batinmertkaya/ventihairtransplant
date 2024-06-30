import {
  ScrollArea,
  TextInput,
  rem,
  Table,
  Text,
  AspectRatio,
  Image,
} from "@mantine/core";
import { FC, useCallback, useState } from "react";
import { IconSearch } from "@tabler/icons-react";
import { db } from "../../firebase";
import { collection, doc, getDocs } from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

export const BlogTable: FC = () => {
  const [search, setSearch] = useState<string>("");

  const { data } = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      const col = collection(db, "blogs");
      const docs = await getDocs(col);

      return docs.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as {
          title: string;
          content: string;
          slug: string;
          image: string;
        }),
      }));
    },
  });

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.currentTarget;
      setSearch(value);
    },
    []
  );

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
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
};

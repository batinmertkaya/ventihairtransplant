import {
  Box,
  Group,
  Stack,
  TextInput,
  rem,
  Text,
  Button,
  useMantineTheme,
  InputWrapper,
  Image,
  AspectRatio,
  ActionIcon,
  CloseIcon,
  LoadingOverlay,
} from "@mantine/core";
import { FC, useCallback, useRef, useState } from "react";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import { IconCloudUpload, IconDownload, IconX } from "@tabler/icons-react";
import { RichTextEditor, Link } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import { useForm, SubmitHandler } from "react-hook-form";
import slugify from "slugify";
import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useDisclosure } from "@mantine/hooks";
import { useNavigate, useParams } from "react-router-dom";

type Form = {
  title: string;
  image: string | null;
  content: string;
  slug: string;
};

export const BlogCreate: FC = () => {
  const { register, handleSubmit, setValue, watch, reset } = useForm<Form>();
  const [defaultContent, setDefaultContent] = useState<string | undefined>(
    undefined
  );
  const [visible, { open, close }] = useDisclosure(false);

  const theme = useMantineTheme();
  const openRef = useRef<() => void>(null);
  const fetchForm = useRef<boolean>(false);
  const { id } = useParams();

  if (id && !fetchForm.current) {
    open();
    fetchForm.current = true;
    const document = doc(db, "blogs", id);

    getDoc(document).then((snap) => {
      reset(snap.data());
      setDefaultContent(snap.data()?.content);
      close();
    });
  }

  const navigate = useNavigate();

  const editor = useEditor(
    {
      extensions: [
        StarterKit,
        Underline,
        Link,
        Superscript,
        SubScript,
        Highlight,
        TextAlign.configure({ types: ["heading", "paragraph"] }),
      ],
      content: defaultContent,
      onUpdate({ editor }) {
        setValue("content", editor.getHTML());
      },
    },
    [defaultContent]
  );

  const onSubmit: SubmitHandler<Form> = useCallback(
    async (data) => {
      console.log("data");
      open();

      if (!id) {
        const document = collection(db, "blogs");

        await addDoc(document, data);
        close();

        navigate("/");
        return;
      }

      const document = doc(db, "blogs", id);
      await setDoc(document, data);

      close();
      navigate("/");

      return;
    },
    [id]
  );

  const image = watch("image");

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} pos="relative">
      <LoadingOverlay
        visible={visible}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      <Stack>
        <TextInput
          label="Title"
          placeholder="Enter blog title"
          {...register("title", {
            onChange(event) {
              setValue("slug", slugify(event.target.value));
            },
          })}
        />
        <InputWrapper label="Image">
          <Box pos="relative" mb={rem(30)}>
            <Group>
              {image && (
                <Group justify="flex-start">
                  <AspectRatio ratio={16 / 9}>
                    <Image src={image} alt="Blog image" fit="cover" h="400" />
                  </AspectRatio>
                  <ActionIcon onClick={() => setValue("image", null)}>
                    <CloseIcon />
                  </ActionIcon>
                </Group>
              )}
            </Group>
            <Dropzone
              openRef={openRef}
              onDrop={(files) => {
                const file = files[0];

                const reader = new FileReader();
                reader.onloadend = () => {
                  setValue("image", reader.result as string);
                };
                reader.readAsDataURL(file);
              }}
              pb={rem(50)}
              bd={`${rem(1)} dashed gray`}
              style={{
                borderRadius: rem(10),
              }}
              accept={[MIME_TYPES.png, MIME_TYPES.jpeg]}
              maxSize={10 * 1024 ** 2}
            >
              <div style={{ pointerEvents: "none" }}>
                <Group justify="center">
                  <Dropzone.Accept>
                    <IconDownload
                      style={{ width: rem(50), height: rem(50) }}
                      color={theme.colors.blue[6]}
                      stroke={1.5}
                    />
                  </Dropzone.Accept>
                  <Dropzone.Reject>
                    <IconX
                      style={{ width: rem(50), height: rem(50) }}
                      color={theme.colors.red[6]}
                      stroke={1.5}
                    />
                  </Dropzone.Reject>
                  <Dropzone.Idle>
                    <IconCloudUpload
                      style={{ width: rem(50), height: rem(50) }}
                      stroke={1.5}
                    />
                  </Dropzone.Idle>
                </Group>

                <Text ta="center" fw={700} fz="lg" mt="xl">
                  <Dropzone.Accept>Drop images here</Dropzone.Accept>
                  <Dropzone.Reject>Pdf file less than 10mb</Dropzone.Reject>
                  <Dropzone.Idle>Upload image</Dropzone.Idle>
                </Text>
                <Text ta="center" fz="sm" mt="xs" c="dimmed">
                  Drag&apos;n&apos;drop image here to upload. We can accept only{" "}
                  <i>.png</i>, <i>.jpeg</i> files that are less than 10mb in
                  size.
                </Text>
              </div>
            </Dropzone>

            <Button
              pos="absolute"
              w={rem(250)}
              left={`calc(50% - ${rem(125)})`}
              bottom={rem(-20)}
              size="md"
              radius="xl"
              onClick={() => openRef.current?.()}
            >
              Select files
            </Button>
          </Box>
        </InputWrapper>
        <InputWrapper label="Content">
          <RichTextEditor editor={editor}>
            <RichTextEditor.Toolbar sticky stickyOffset={60}>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Bold />
                <RichTextEditor.Italic />
                <RichTextEditor.Underline />
                <RichTextEditor.Strikethrough />
                <RichTextEditor.ClearFormatting />
                <RichTextEditor.Highlight />
                <RichTextEditor.Code />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.H1 />
                <RichTextEditor.H2 />
                <RichTextEditor.H3 />
                <RichTextEditor.H4 />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Blockquote />
                <RichTextEditor.Hr />
                <RichTextEditor.BulletList />
                <RichTextEditor.OrderedList />
                <RichTextEditor.Subscript />
                <RichTextEditor.Superscript />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Link />
                <RichTextEditor.Unlink />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.AlignLeft />
                <RichTextEditor.AlignCenter />
                <RichTextEditor.AlignJustify />
                <RichTextEditor.AlignRight />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Undo />
                <RichTextEditor.Redo />
              </RichTextEditor.ControlsGroup>
            </RichTextEditor.Toolbar>

            <RichTextEditor.Content />
          </RichTextEditor>
        </InputWrapper>
        <Group>
          <Button type="submit">Submit</Button>
        </Group>
      </Stack>
    </Box>
  );
};

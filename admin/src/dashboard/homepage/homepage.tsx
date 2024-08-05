import {
  Group,
  Stack,
  TextInput,
  rem,
  Text,
  useMantineTheme,
  Button,
  Box,
  InputWrapper,
  ActionIcon,
  AspectRatio,
  CloseIcon,
  Image,
  LoadingOverlay,
} from "@mantine/core";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import { IconDownload, IconX, IconCloudUpload } from "@tabler/icons-react";
import { FC, useCallback, useEffect, useRef } from "react";
import { useDisclosure } from "@mantine/hooks";
import { useStore } from "@nanostores/react";
import { authStore } from "../../store";

type Form = {
  bannerTitle: string;
  bannerImage: string | null;
  bannerDescription: string;

  selfTitle: string;
  selfDescription: string;

  aboutTitle: string;
  aboutDescription: string;
  aboutImage: string | null;
};

export const Homepage: FC = () => {
  const token = useStore(authStore).token;

  const {
    getInputProps,
    setFieldValue,
    getValues,
    values,
    onSubmit,
    setInitialValues,
    reset,
  } = useForm<Form>({
    initialValues: {
      bannerTitle: "",
      bannerImage: null,
      bannerDescription: "",

      selfTitle: "",
      selfDescription: "",

      aboutTitle: "",
      aboutDescription: "",
      aboutImage: null,
    },

    validate: {},
  });

  const openRef = useRef<() => void>(null);
  const theme = useMantineTheme();
  const [visible, { open, close }] = useDisclosure(false);
  const bannerImage = getValues().bannerImage;
  const aboutImage = getValues().aboutImage;

  console.log(bannerImage);

  const handleSubmit = useCallback(async (data: typeof values) => {
    await fetch("https://admin.ventihairclinic.com/static/homepage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({
        data: JSON.stringify(data),
      }),
    });
  }, []);

  useEffect(() => {
    open();
    fetch("https://admin.ventihairclinic.com/static/homepage", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    })
      .then(async (res) => {
        const snap = (await res.json()) as { id: string; data: Form };

        setInitialValues(snap.data);
        reset();
      })
      .finally(() => {
        close();
      });
  }, []);

  return (
    <form onSubmit={onSubmit(handleSubmit)} style={{ position: "relative" }}>
      <LoadingOverlay
        visible={visible}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      <Stack>
        <TextInput
          label="Title"
          placeholder="Enter banner title"
          {...getInputProps("bannerTitle")}
        />
        <TextInput
          label="Description"
          placeholder="Enter banner description"
          {...getInputProps("bannerDescription")}
        />
        <InputWrapper label="Banner Image">
          <Box pos="relative" mb={rem(30)}>
            <Group>
              {bannerImage && (
                <Group justify="flex-start">
                  <AspectRatio ratio={16 / 9}>
                    <Image
                      src={bannerImage}
                      alt="Banner image"
                      fit="cover"
                      h="400"
                    />
                  </AspectRatio>
                  <ActionIcon
                    onClick={() => setFieldValue("bannerImage", null)}
                  >
                    <CloseIcon />
                  </ActionIcon>
                </Group>
              )}
            </Group>
            <Dropzone
              openRef={openRef}
              onDrop={(files) => {
                const file = files[0];

                console.log(file);

                const reader = new FileReader();
                reader.onloadend = () => {
                  setFieldValue("bannerImage", reader.result as string);
                };
                reader.readAsDataURL(file);
              }}
              pb={rem(50)}
              bd={`${rem(1)} dashed gray`}
              style={{
                borderRadius: rem(10),
              }}
              accept={[MIME_TYPES.png, MIME_TYPES.jpeg]}
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
                  <Dropzone.Reject>Image file less than 10mb</Dropzone.Reject>
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

        <TextInput
          label="What we do"
          placeholder="What we do Title"
          {...getInputProps("selfTitle")}
        />
        <TextInput
          label="Description"
          placeholder="What we do description"
          {...getInputProps("selfDescription")}
        />

        <TextInput
          label="About us"
          placeholder="About us Title"
          {...getInputProps("aboutTitle")}
        />
        <TextInput
          label="Description"
          placeholder="About us description"
          {...getInputProps("aboutDescription")}
        />

        <InputWrapper label="About Image">
          <Box pos="relative" mb={rem(30)}>
            <Group>
              {aboutImage && (
                <Group justify="flex-start">
                  <AspectRatio ratio={16 / 9}>
                    <Image
                      src={aboutImage}
                      alt="About image"
                      fit="cover"
                      h="400"
                    />
                  </AspectRatio>
                  <ActionIcon onClick={() => setFieldValue("aboutImage", null)}>
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
                  setFieldValue("aboutImage", reader.result as string);
                };
                reader.readAsDataURL(file);
              }}
              pb={rem(50)}
              bd={`${rem(1)} dashed gray`}
              style={{
                borderRadius: rem(10),
              }}
              accept={[MIME_TYPES.png, MIME_TYPES.jpeg]}
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
                  <Dropzone.Reject>Image file less than 10mb</Dropzone.Reject>
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
      </Stack>
      <Group mt="12">
        <Button type="submit">Submit</Button>
      </Group>
    </form>
  );
};

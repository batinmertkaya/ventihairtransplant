import { FC, useRef } from "react";
import { Text, Group, Button, rem, useMantineTheme, Box } from "@mantine/core";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import { IconCloudUpload, IconX, IconDownload } from "@tabler/icons-react";

export const DropzoneButton: FC = () => {
  const theme = useMantineTheme();
  const openRef = useRef<() => void>(null);

  return (
    <Box pos="relative" mb={rem(30)}>
      <Dropzone
        openRef={openRef}
        onDrop={() => {}}
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
            <i>.png</i>, <i>.jpeg</i> files that are less than 10mb in size.
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
  );
};

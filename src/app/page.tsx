"use client";

import { Button, Group, Paper, SimpleGrid, Stack, Text } from "@mantine/core";
import SubmissionsPage from "./(dev)/read/page";
import { useRouter } from "next/navigation";
import { useShallowEffect } from "@mantine/hooks";
import { useState } from "react";

export default function MainPage() {
  const router = useRouter();
  const [version, setVersion] = useState("");
  useShallowEffect(() => {
    fetch("/api/version")
      .then((res) => res.text())
      .then(setVersion);
  }, []);
  
  return (
    <>
      <Stack p={"lg"}>
        <Group>
          <Text>Version: {version}</Text>

          <Button w={100} onClick={() => router.push("/create")}>
            Tambah
          </Button>
        </Group>
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
          <Paper withBorder p="xl">
            <SubmissionsPage />
          </Paper>
        </SimpleGrid>
      </Stack>
    </>
  );
}

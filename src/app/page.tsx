"use client";

import { Button, Paper, SimpleGrid, Stack } from "@mantine/core";
import SubmissionsPage from "./(dev)/read/page";
import { useRouter } from "next/navigation";

export default function MainPage() {
  const router = useRouter()
  return (
    <>
      <Stack p={"lg"}>
        <Button w={100} onClick={() => router.push("/create")}>Tambah</Button>
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
          <Paper withBorder p="xl">
            <SubmissionsPage />
          </Paper>
        </SimpleGrid>
      </Stack>
    </>
  );
}

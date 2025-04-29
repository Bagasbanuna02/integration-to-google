"use client";

import { Paper, SimpleGrid, Stack, Title } from "@mantine/core";
import ContactForm from "./(dev)/create/page";
import SubmissionsPage from "./(dev)/read/page";

export default function MainPage() {
  return (
    <>
      <Stack>
        <Title order={3}>Test input</Title>
        <SimpleGrid cols={2} spacing="md" p={"lg"}>
          <Paper withBorder p="xl">
            <ContactForm />
          </Paper>
          
        </SimpleGrid>
        <SimpleGrid cols={1} spacing="md" p={"lg"}>
          <Paper withBorder p="xl">
            <SubmissionsPage />
          </Paper>
        </SimpleGrid>
      </Stack>
    </>
  );
}

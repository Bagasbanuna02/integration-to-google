/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useState } from "react";
import {
  Card,
  Text,
  Image,
  Grid,
  Container,
  SimpleGrid,
  Paper,
} from "@mantine/core";
import UploadedCard from "./_uploaded";

interface Submission {
  name: string;
  email: string;
  message: string;
  fileId: string;
  imageUrl: string | null;
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/get-submissions");
      const data = await res.json();
      setSubmissions(data);
    };
    fetchData();
  }, []);

  // console.log("data >", submissions)

  return (
    <SimpleGrid cols={2}>
      <Paper withBorder p="lg">
        <Grid>
          {submissions.map((item, idx) => (
            <Grid.Col key={idx} span={4}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    height={200}
                    width={200}
                  />
                ) : null}
                <Text>{item.name}</Text>
                <Text>{item.email}</Text>
                <Text>{item.message}</Text>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      </Paper>

      <Paper withBorder p="lg">
        <Grid>
          {submissions.map((item, idx) => (
            <Grid.Col key={idx} span={4}>
              <UploadedCard
                name={item.name}
                email={item.email}
                fileId={item.fileId}
                message={item.message}
              />
            </Grid.Col>
          ))}
        </Grid>
      </Paper>
    </SimpleGrid>
  );
}

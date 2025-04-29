"use client";
import { useEffect, useState } from "react";
import { Card, Text, Image, Grid } from "@mantine/core";

interface Submission {
  name: string;
  email: string;
  message: string;
  fileId?: string;
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/get-submissions");
      const data = await res.json();
      const mapped = data.map((row: string[]) => ({
        name: row[0],
        email: row[1],
        message: row[2],
        fileId: row[3],
      }));
      setSubmissions(mapped);
    };
    fetchData();
  }, []);

  return (
    <Grid>
      {submissions.map((item, idx) => (
        <Grid.Col key={idx} span={6}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            {item.fileId && (
              <Image
                src={`https://drive.google.com/uc?export=view&id=${item.fileId}`}
                alt="Uploaded file"
                height={200}
                fit="contain"
              />
            )}
            <Text size="lg" mt="md">
              {item.name}
            </Text>
            <Text color="dimmed" size="sm">
              {item.email}
            </Text>
            <Text mt="sm">{item.message}</Text>
            <Text>{item.fileId}</Text>
          </Card>
        </Grid.Col>
      ))}
    </Grid>
  );
}

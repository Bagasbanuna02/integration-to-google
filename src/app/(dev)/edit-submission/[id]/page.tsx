/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import {
  Button,
  FileInput,
  Notification,
  Paper,
  Stack,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useShallowEffect } from "@mantine/hooks";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

interface Submission {
  name: string;
  email: string;
  message: string;
  rowIndex: number;
}

export default function EditSubmissionPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const rowIndex = Number(params.id);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      message: "",
      oldFileId: "",
    },
  });

  useShallowEffect(() => {
    console.log("front >>", rowIndex);
    const fetchData = async () => {
      const res = await fetch(`/api/get-submissions/${params.id}`);
      const data = await res.json();

      if (data) {
        form.setValues({
          name: data.name,
          email: data.email,
          message: data.message,
          oldFileId: data.fileId,
        });

        setLoading(false);
      } else {
        setLoading(false);
      }
    };
    fetchData();
  }, [rowIndex]);

  const handleSubmit = async (values: typeof form.values) => {
    setSubmitting(true);
    setSuccess(false);
    setError("");

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("message", values.message);
    formData.append("rowIndex", rowIndex.toString());
    if (file) {
      formData.append("file", file);
      formData.append("oldFileId", values.oldFileId);
    }

    const res = await fetch("/api/edit-form", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      setSuccess(true);
      setTimeout(() => router.push("/"), 1500);
    } else {
      setError("Update failed");
    }

    setSubmitting(false);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <Paper withBorder m={"auto"} mt={"md"} p={"xs"} w={300} pos="relative">
      <form
        onSubmit={form.onSubmit((v) => handleSubmit(v))}
        encType="multipart/form-data"
      >
        <Stack>
          <TextInput label="Name" {...form.getInputProps("name")} />
          <TextInput label="Email" {...form.getInputProps("email")} />
          <Textarea label="Message" {...form.getInputProps("message")} />
          <FileInput
            label="Update Image (optional)"
            onChange={setFile}
            accept="image/*"
          />
          <Button loading={submitting} type="submit">
            Update
          </Button>
          {success && (
            <Notification
              color="green"
              title="Success"
              onClose={() => setSuccess(false)}
            >
              Data updated successfully!
            </Notification>
          )}
          {error && (
            <Notification
              color="red"
              title="Error"
              onClose={() => setError("")}
            >
              {error}
            </Notification>
          )}
        </Stack>
      </form>
    </Paper>
  );
}

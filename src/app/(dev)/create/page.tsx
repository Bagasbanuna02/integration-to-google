"use client";

import { useForm } from "@mantine/form";
import { TextInput, Textarea, Button, Box, FileInput } from "@mantine/core";
import { useState } from "react";

export default function ContactForm() {
  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      message: "",
      photo: null as File | null,
    },
    validate: {
      name: (value: string) =>
        value.trim().length < 2 ? "Name too short" : null,
      email: (value: string) =>
        /^\S+@\S+$/.test(value) ? null : "Invalid email",
      message: (value: string) =>
        value.trim().length < 5 ? "Message too short" : null,
    },
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(""); // ✅ tampilkan pesan error

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    setSuccess(false);
    setError("");

    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("message", values.message);
      if (values.photo) {
        formData.append("photo", values.photo);
      }

      const res = await fetch("/api/submit-form", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        form.reset();
        setSuccess(true);
      } else {
        const err = await res.json();
        setError(err.message || "Failed to submit");
      }
    } catch (err) {
      console.error("Error submitting:", err);
      setError("Terjadi kesalahan saat mengirim.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maw={400} mx="auto" mt="xl">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Name"
          placeholder="Your name"
          {...form.getInputProps("name")}
        />
        <TextInput
          mt="md"
          label="Email"
          placeholder="your@email.com"
          {...form.getInputProps("email")}
        />
        <Textarea
          mt="md"
          label="Message"
          placeholder="Your message"
          autosize
          minRows={3}
          {...form.getInputProps("message")}
        />
        <FileInput
          mt="md"
          label="Upload Photo"
          placeholder="Choose file"
          accept="image/*"
          clearable
          {...form.getInputProps("photo")}
        />

        <Button type="submit" mt="xl" loading={loading} fullWidth>
          Submit
        </Button>

        {success && (
          <p style={{ color: "green", marginTop: 10 }}>
            ✅ Thank you! Your message has been sent.
          </p>
        )}
        {error && <p style={{ color: "red", marginTop: 10 }}>❌ {error}</p>}
      </form>
    </Box>
  );
}

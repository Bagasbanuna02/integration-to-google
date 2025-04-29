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
      photo: null as File | null, // ➔ TAMBAHKAN photo
    },
    validate: {
      name: (value: string) => (value.length < 2 ? "Name too short" : null),
      email: (value: string) =>
        /^\S+@\S+$/.test(value) ? null : "Invalid email",
      message: (value: string) =>
        value.length < 5 ? "Message too short" : null,
    },
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("message", values.message);
      if (values.photo) {
        formData.append("photo", values.photo); // tambahkan photo
      }

      const res = await fetch("/api/submit-form", {
        method: "POST",
        body: formData, // ➔ multipart/form-data otomatis
      });

      if (res.ok) {
        form.reset();
        setSuccess(true);
      } else {
        console.error("Failed to submit");
      }
    } catch (error) {
      console.error("Error submitting:", error);
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
          {...form.getInputProps("message")}
        />
        <FileInput
          mt="md"
          label="Upload Photo"
          placeholder="Choose file"
          accept="image/*"
          {...form.getInputProps("photo")}
        />

        <Button type="submit" mt="xl" loading={loading} fullWidth>
          Submit
        </Button>

        {success && (
          <p style={{ color: "green", marginTop: 10 }}>
            Thank you! Your message has been sent.
          </p>
        )}
      </form>
    </Box>
  );
}

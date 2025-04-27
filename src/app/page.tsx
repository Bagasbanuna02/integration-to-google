"use client"; // kalau pakai app dir
import { useForm } from "@mantine/form";
import { TextInput, Textarea, Button, Box } from "@mantine/core";
import { useState } from "react";

export default function ContactForm() {
  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      message: "",
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
      const res = await fetch("/api/submit-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
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

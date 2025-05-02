"use client";
import {
  Image,
  Paper,
  Stack,
  Text,
  Button,
  Modal,
  Group,
  Loader,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Submission {
  name: string;
  email: string;
  message: string;
  fileId: string;
  imageUrl: string | null;
  rowIndex: number;
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [deleting, setDeleting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Submission | null>(null);
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/get-submissions");
      const data = await res.json();
      setSubmissions(data);
    };
    fetchData();
  }, []);

  const confirmDelete = (submission: Submission) => {
    setDeleteTarget(submission);
    open();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);

    const res = await fetch("/api/delete-submission", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rowIndex: deleteTarget.rowIndex,
        fileId: deleteTarget.fileId, // Mengirim fileId untuk menghapus gambar
      }),
    });

    setDeleting(false);
    close();

    if (res.ok) {
      setSubmissions((prev) =>
        prev.filter((s) => s.rowIndex !== deleteTarget.rowIndex)
      );
      setDeleteTarget(null);
    } else {
      alert("Gagal menghapus data dan gambar.");
    }
  };

  return (
    <>
      <Stack>
        {submissions.map((v, k) => (
          <Paper withBorder key={k} p={"lg"}>
            <Stack>
              <Text>{v.name}</Text>
              <Text>{v.email}</Text>
              <Text>{v.message}</Text>

              <Image
                w={100}
                h={100}
                bg={"gray"}
                p={"xs"}
                src={`/api/drive-image?fileId=${v.fileId}`}
                onLoad={() => {
                  <Loader size={20} color="yellow" />;
                }}
                alt={`Gambar untuk ${v.name}`}
              />

              <Group mt="sm">
                <Link href={`/edit-submission/${v.rowIndex}`} passHref>
                  <Button>Edit</Button>
                </Link>
                <Button color="red" onClick={() => confirmDelete(v)}>
                  Hapus
                </Button>
              </Group>
            </Stack>
          </Paper>
        ))}
      </Stack>

      <Modal opened={opened} onClose={close} title="Konfirmasi Hapus" centered>
        <Text>Apakah Anda yakin ingin menghapus data ini?</Text>
        <Group mt="md" justify="flex-end">
          <Button variant="default" onClick={close} disabled={deleting}>
            Batal
          </Button>
          <Button color="red" onClick={handleDelete} loading={deleting}>
            Hapus
          </Button>
        </Group>
      </Modal>
    </>
  );
}

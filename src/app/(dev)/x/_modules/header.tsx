// src/components/Header.tsx
import { Box, Text } from "@mantine/core";

export default function Header() {
  return (
    <Box
      pos="fixed"
      top={0}
      left={0}
      right={0}
      h={60}
      px="md"
      bg="white"
      style={{ zIndex: 1000, borderBottom: "1px solid #eee" }}
    >
      <Text size="lg" pt="sm" fw={700}>
        Twitter Clone
      </Text>
    </Box>
  );
}

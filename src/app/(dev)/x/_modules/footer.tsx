// src/components/Footer.tsx
import { Box, Text } from "@mantine/core";

interface FooterProps {
  visible: boolean;
}

export default function Footer({ visible }: FooterProps) {
  return (
    <Box
      pos="fixed"
      bottom={0}
      left={0}
      right={0}
      h={60}
      px="md"
      bg="white"
      style={{
        transition: "transform 0.3s ease",
        transform: visible ? "translateY(0)" : "translateY(100%)",
        borderTop: "1px solid #eee",
        zIndex: 1000,
      }}
    >
      <Text size="sm" pt="sm" ta="center">
        Footer Area
      </Text>
    </Box>
  );
}

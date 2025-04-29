// src/components/Feed.tsx
import { Box, Card, Text } from "@mantine/core";
import { useShallowEffect } from "@mantine/hooks";
import { useRef, useState } from "react";

export default function Feed() {
  const [items, setItems] = useState<string[]>([]);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useShallowEffect(() => {
    loadMore();
  }, []);

  const loadMore = () => {
    const newItems = Array.from(
      { length: 10 },
      (_, i) => `Post #${items.length + i + 1}`
    );
    setItems((prev) => [...prev, ...newItems]);
  };

  useShallowEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [items]);

  return (
    <Box>
      {items.map((item, i) => (
        <Card key={i} withBorder my="xs">
          <Text>{item}</Text>
        </Card>
      ))}
      <div ref={loaderRef} style={{ height: 20 }} />
    </Box>
  );
}

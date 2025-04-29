// src/components/Layout.tsx
import { useEffect, useRef, useState } from "react";
import { Box, Container } from "@mantine/core";
import Header from "./header";
import Footer from "./footer";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [showFooter, setShowFooter] = useState(true);
  const lastScrollY = useRef(0);

  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY.current) {
      // Scrolling down
      setShowFooter(false);
    } else {
      // Scrolling up
      setShowFooter(true);
    }

    lastScrollY.current = currentScrollY;
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Box>
      <Header />

      <Container size="sm" pt={60} pb={80}>
        {children}
      </Container>

      <Footer visible={showFooter} />
    </Box>
  );
}

"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import CartDrawer from "@/components/cart/CartDrawer";

export function StoreHeader() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  // Add/remove body padding for the right sidebar
  useEffect(() => {
    if (!isAdmin) {
      document.body.classList.add("has-sidebar");
    } else {
      document.body.classList.remove("has-sidebar");
    }
    return () => document.body.classList.remove("has-sidebar");
  }, [isAdmin]);

  if (isAdmin) return null;
  return (
    <>
      <Navbar />
      <CartDrawer />
    </>
  );
}

export function StoreFooter() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return <Footer />;
}

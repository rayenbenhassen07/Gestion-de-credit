"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Login from "@/components/Login";
import getCurrentUser from "@/actions/getCurrentUser";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        router.push("/");
      }
    };

    checkUser();
  }, [router]);

  return (
    <>
      <Login />
    </>
  );
}

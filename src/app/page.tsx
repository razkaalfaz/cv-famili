"use client";

import Button from "@/components/button/Button";
import TextField from "@/components/inputs/TextField";
import Snackbar from "@/components/snackbar/Snackbar";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";

export default function Home() {
  const [user, setUser] = useState<UserLogin | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const router = useRouter();

  function inputChangeHandler(e: ChangeEvent<HTMLInputElement>) {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setSuccess(null);
    setIsLoading(true);
    return await signIn("credentials", {
      redirect: false,
      username: user?.username,
      password: user?.password,
    }).then((res) => {
      if (res?.error) {
        setMessage("Username atau password salah.");
        setIsLoading(false);
      } else {
        setSuccess("Berhasil masuk, mengarahkan ke halaman dashboard...");
        setTimeout(() => {
          router.push("/barang");
          setIsLoading(false);
        }, 3000);
      }
    });
  }

  return (
    <div className="w-full h-screen grid place-items-center relative">
      <Image
        src="/bg.jpg"
        fill
        alt="background"
        className="object-cover -z-20"
      />
      <div className="w-full h-screen absolute top-0 left-0 bg-black bg-opacity-10 -z-10" />

      {message && <Snackbar variant="ERROR" message={message} />}
      {success && <Snackbar variant="SUCCESS" message={success} />}
      <form
        className="w-fit rounded-lg bg-white flex flex-col gap-8 px-8 py-8"
        onSubmit={login}
      >
        <div className="flex flex-col gap-2">
          <p className="text-2xl">Login</p>
          <p className="text-gray-500">
            Harap login dengan menggunakan akun yang telah terdaftar.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="w-full flex flex-col gap-2">
            <label htmlFor="username">Username</label>
            <TextField
              type="text"
              required
              name="username"
              placeholder="username..."
              onChange={inputChangeHandler}
            />
          </div>
          <div className="w-full flex flex-col gap-2">
            <label htmlFor="password">Password</label>
            <TextField
              type="password"
              required
              name="password"
              placeholder="password..."
              onChange={inputChangeHandler}
            />
          </div>
        </div>

        <Button variants="PRIMARY" fullWidth type="submit" disabled={isLoading}>
          {isLoading ? "Sedang masuk..." : "Masuk"}
        </Button>
      </form>
    </div>
  );
}

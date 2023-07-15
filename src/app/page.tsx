"use client";

import Button from "@/components/button/Button";
import TextField from "@/components/inputs/TextField";
import Snackbar from "@/components/snackbar/Snackbar";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";

export default function Home() {
  const [user, setUser] = useState<UserLogin | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

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
    <form
      className="w-full h-screen px-8 py-8 flex flex-row bg-white text-neutral-900"
      onSubmit={login}
    >
      <div className="w-1/2 flex flex-col gap-8">
        <div className="flex flex-row items-center gap-2">
          <Image src="/logo.png" width={64} height={64} alt="logo" />
          <div className="flex flex-col">
            <p className="text-lg font-semibold text-orange-700">FAMILI</p>
            <p className="text-sm">CV. Famili Sejahtera Utama</p>
          </div>
        </div>

        <div className="w-full h-full flex flex-col px-8 justify-center items-center gap-8">
          <div className="w-full flex flex-col gap-2 items-center">
            <b className="text-2xl">Login ke akun anda</b>
            <p className="text-base text-gray-500">
              Harap login dengan menggunakan akun yang telah terdaftar.
            </p>
          </div>

          <div className="w-full flex flex-col items-center gap-4">
            <div className="w-full flex flex-col gap-2">
              <label htmlFor="username" className="font-bold">
                Username
              </label>
              <TextField
                type="text"
                id="username"
                name="username"
                placeholder="Username..."
                required
                onChange={inputChangeHandler}
              />
            </div>

            <div className="w-full flex flex-col gap-2">
              <label htmlFor="password" className="font-bold">
                Password
              </label>
              <div className="w-full flex flex-row gap-2 items-center overflow-hidden border border-gray-300 rounded-md px-2 py-2">
                <TextField
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password..."
                  required
                  className="border-none px-0 py-0"
                  onChange={inputChangeHandler}
                />
                <div
                  className="h-full cursor-pointer grid place-items-center"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-4 h-4" />
                  ) : (
                    <EyeIcon className="w-4 h-4" />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="w-full">
            <Button
              variants="PRIMARY"
              type="submit"
              disabled={isLoading}
              fullWidth
            >
              {isLoading ? "Memproses..." : "Masuk"}
            </Button>
          </div>
        </div>
      </div>

      <div className="w-1/2 flex flex-col items-center justify-end gap-8 relative rounded-lg overflow-hidden z-30">
        <Image
          src="/bg-image.jpg"
          alt="bg"
          fill
          className="object-cover -z-20"
        />
        <div className="w-full h-full absolute top-0 left-0 bg-orange-700 bg-opacity-10 -z-10" />
        <div className="w-full rounded-lg bg-black bg-opacity-30 flex flex-col gap-4 px-16 py-4">
          <div className="w-full flex flex-col gap-2 text-white items-center">
            <p className="text-2xl">Temukan alat dan bahan terbaik dari</p>
            <p className="text-2xl">CV. Famili Sejahtera Utama</p>
          </div>
          <p className="text-center text-white">
            Alat dan bahan yang kami sediakan merupakan alat yang mempunyai
            kualitas terbaik untuk digunakan pada pekerjaan proyek yang anda
            kerjakan.
          </p>
        </div>
      </div>

      {message && (
        <Snackbar variant="ERROR" message={message} autoHide duration={3000} />
      )}
      {success && (
        <Snackbar
          variant="SUCCESS"
          message={success}
          autoHide
          duration={3000}
        />
      )}
    </form>
  );
}

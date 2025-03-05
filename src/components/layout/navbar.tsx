"use client";
import Link from "next/link";
import { Button } from "~/components/ui/button";

const Navbar = () => {
  return (
    <nav className="bg-dark-1 sticky left-0 top-0 z-10 flex w-full items-center justify-center border-b bg-black">
      <div className="container flex h-full min-h-14 items-center justify-between gap-4">
        <Link
          prefetch={false}
          href={"/"}
          className="shrink-0 text-lg font-medium"
        >
          DavStream
        </Link>

        <div className="hidden flex-1 items-center justify-end gap-4 lg:flex">
          <div className="flex shrink-0 gap-1">
            <Button variant={"ghost"} asChild>
              <Link prefetch={false} href={"/"}>
                Accueil
              </Link>
            </Button>

            <Button variant={"ghost"} asChild>
              <Link prefetch={false} href={"/watchlist"}>
                Watchlist
              </Link>
            </Button>
          </div>
        </div>

        <div>
          <Button asChild variant={"ghost"}>
            <Link href={"/search"}>Recherche</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

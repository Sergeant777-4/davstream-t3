"use client";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
} from "@clerk/nextjs";
import { Bookmark, Home, Menu, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";

const MobileNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const closeSheet = () => setIsOpen(false);

  return (
    <Sheet open={isOpen} onOpenChange={(value) => setIsOpen(value)}>
      <SheetTrigger asChild>
        <Button
          size="icon"
          variant={"ghost"}
          aria-label="Menu"
          className="shrink-0"
        >
          <Menu />
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full px-4">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>

        <div className="mt-4 flex w-full flex-col gap-2">
          <Button
            className="justify-start px-4"
            onClick={closeSheet}
            variant={"outline"}
            size={"lg"}
            asChild
          >
            <Link prefetch={false} href={"/"}>
              <Home />
              Accueil
            </Link>
          </Button>

          <Button
            className="justify-start px-4"
            onClick={closeSheet}
            variant={"outline"}
            size={"lg"}
            asChild
          >
            <Link prefetch={false} href={"/watchlist"}>
              <Bookmark />
              Watchlist
            </Link>
          </Button>

          <Button
            className="justify-start px-4"
            onClick={closeSheet}
            variant={"outline"}
            size={"lg"}
            asChild
          >
            <a target="_blank" href={"https://discord.gg/M7gRTuXc6d"}>
              <MessageCircle />
              Communauté
            </a>
          </Button>

          <SignedOut>
            <Button
              className="justify-start px-4"
              onClick={closeSheet}
              variant={"outline"}
              size={"lg"}
              asChild
            >
              <SignInButton>Connexion</SignInButton>
            </Button>
          </SignedOut>

          <SignedIn>
            <Button
              className="justify-start px-4"
              onClick={closeSheet}
              variant={"outline"}
              size={"lg"}
              asChild
            >
              <SignOutButton>Se Deconnecter</SignOutButton>
            </Button>
          </SignedIn>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavbar;

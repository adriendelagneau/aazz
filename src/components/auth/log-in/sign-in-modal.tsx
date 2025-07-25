"use client";

import Link from "next/link";

import { useAuthModal } from "@/lib/store/useAuthStore";

import { AuthModal } from "../auth-modal";
import { SignInView } from "./sign-in-view";

export const SignInModal = () => {
  const { isOpen, close } = useAuthModal();

  return (
    <AuthModal
      open={isOpen}
      onOpenChange={(open) => (open ? null : close())}
      title="Connexion ou inscription"
      footer={
        <p className="text-muted-foreground text-xs">
          En continuant, vous acceptez notre{" "}
          <Link href="/legal" className="cursor-pointer hover:underline">
            politique de confidentialité.
          </Link>
        </p>
      }
    >
      <SignInView />
    </AuthModal>
  );
};

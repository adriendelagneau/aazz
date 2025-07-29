import { cookies } from "next/headers";

import { getCategories } from "@/actions/category-actions";
import { SidebarProvider } from "@/components/ui/sidebar";

import { Footer } from "./components/footer/footer";
import { HomeNavbar } from "./components/navbar/home-navbar";
import { HomeSidebar } from "./components/sidebar/hoeme-sidebar";
import Title from "./components/title";

export default async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Make sidebar open state persist through reload
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  const categories = await getCategories();

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <div className="w-full">
        <HomeNavbar />
        <div className="flex">
          <HomeSidebar categories={categories} />
          <main className="mx-auto w-full max-w-screen-xl flex-1 pt-[4rem] min-h-screen">
            <Title />
            {children}
          </main>
        </div>
        <Footer />
      </div>
    </SidebarProvider>
  );
}

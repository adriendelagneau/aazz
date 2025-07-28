
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { ThemeSwitch } from "../navbar/theme-switch";

const links = [
  {
    title: "Company",
    links: [
      {
        label: "About",
        href: "#",
      },
      {
        label: "Careers",
        href: "#",
      },
      {
        label: "Blog",
        href: "#",
      },
    ],
  },
  {
    title: "Contact",
    links: [
      {
        label: "Help Center",
        href: "#",
      },
      {
        label: "Twitter",
        href: "#",
      },
      {
        label: "Facebook",
        href: "#",
      },
    ],
  },
  {
    title: "Legal",
    links: [
      {
        label: "Privacy Policy",
        href: "#",
      },
      {
        label: "Terms of Service",
        href: "#",
      },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container  px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/">
              <h1 className="text-2xl font-bold">Wwwzzz</h1>
            </Link>
            <p className="mt-4 text-muted-foreground">
              Your source for the latest news and articles.
            </p>
          </div>
          {links.map((column) => (
            <div key={column.title}>
              <h3 className="text-lg font-medium">{column.title}</h3>
              <ul className="mt-4 space-y-2">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <Separator className="my-8" />
        <div className="flex flex-col items-center justify-between sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Wwwzzz. All rights reserved.
          </p>
          <div className="mt-4 sm:mt-0">
            <ThemeSwitch />
          </div>
        </div>
      </div>
    </footer>
  );
}

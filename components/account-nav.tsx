"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/account/dashboard", label: "实战记录" },
  { href: "/account/profile", label: "个人资料" },
  { href: "/account/password", label: "登录密码" },
  { href: "/account/security", label: "安全记录" },
];

export function AccountNav() {
  const pathname = usePathname();

  return (
    <nav className="account-nav" aria-label="账户导航">
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`account-nav-item${pathname === item.href ? " active" : ""}`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

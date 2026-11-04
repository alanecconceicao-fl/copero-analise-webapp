import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { FooterNav } from "./footer-nav";

const { usePathname } = vi.hoisted(() => ({ usePathname: vi.fn() }));
vi.mock("next/navigation", () => ({ usePathname }));

test("marks início active on the home route", () => {
  usePathname.mockReturnValue("/");
  render(<FooterNav />);
  expect(screen.getByRole("link", { name: /início/i })).toHaveClass("active");
  expect(screen.getByRole("link", { name: /sobre nós/i })).not.toHaveClass("active");
});

test("marks sobre nós active on its route", () => {
  usePathname.mockReturnValue("/sobre-nos");
  render(<FooterNav />);
  expect(screen.getByRole("link", { name: /sobre nós/i })).toHaveClass("active");
  expect(screen.getByRole("link", { name: /início/i })).not.toHaveClass("active");
});

test("neither shortcut is active on an unrelated route", () => {
  usePathname.mockReturnValue("/o-que-e");
  render(<FooterNav />);
  expect(screen.getByRole("link", { name: /início/i })).not.toHaveClass("active");
  expect(screen.getByRole("link", { name: /sobre nós/i })).not.toHaveClass("active");
});

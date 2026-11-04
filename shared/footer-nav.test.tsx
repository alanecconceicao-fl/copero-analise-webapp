import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { FooterNav } from "./footer-nav";

const { usePathname } = vi.hoisted(() => ({ usePathname: vi.fn() }));
vi.mock("next/navigation", () => ({ usePathname }));

test("marks Home active on the home route", () => {
  usePathname.mockReturnValue("/");
  render(<FooterNav />);
  expect(screen.getByRole("link", { name: /home/i })).toHaveClass("active");
  expect(screen.getByRole("link", { name: /about us/i })).not.toHaveClass("active");
});

test("marks About Us active on its route", () => {
  usePathname.mockReturnValue("/about-us");
  render(<FooterNav />);
  expect(screen.getByRole("link", { name: /about us/i })).toHaveClass("active");
  expect(screen.getByRole("link", { name: /home/i })).not.toHaveClass("active");
});

test("neither shortcut is active on an unrelated route", () => {
  usePathname.mockReturnValue("/what-is-copero");
  render(<FooterNav />);
  expect(screen.getByRole("link", { name: /home/i })).not.toHaveClass("active");
  expect(screen.getByRole("link", { name: /about us/i })).not.toHaveClass("active");
});

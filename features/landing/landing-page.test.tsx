import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { LandingPage } from "./landing-page";
import { carouselItems, sellingText } from "./content";

test("shows the brand logo", () => {
  render(<LandingPage />);
  expect(screen.getByTestId("logo")).toBeInTheDocument();
});

test("shows the selling text", () => {
  render(<LandingPage />);
  expect(screen.getByTestId("selling-text")).toHaveTextContent(sellingText);
});

test("renders every carousel item", () => {
  render(<LandingPage />);
  expect(screen.getAllByTestId("carousel-item")).toHaveLength(carouselItems.length);
});

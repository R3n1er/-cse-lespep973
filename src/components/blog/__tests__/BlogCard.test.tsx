import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import BlogCard from "../BlogCard";

// Mock des dépendances
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    className,
  }: {
    children: React.ReactNode;
    href: string;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

vi.mock("../ReactionButton", () => ({
  default: ({ postId }: { postId: string }) => (
    <div data-testid="reaction-button" data-post-id={postId}>
      Reaction Button
    </div>
  ),
}));

const mockPost = {
  id: "1",
  title: "Test Article Title",
  content: "This is a test article content that should be truncated properly.",
  category: "Actualités",
  published_at: "2025-01-27T10:00:00Z",
  created_at: "2025-01-27T09:00:00Z",
};

describe("BlogCard", () => {
  it("renders correctly with all required elements", () => {
    render(<BlogCard post={mockPost} />);

    expect(screen.getByText("Test Article Title")).toBeInTheDocument();
    expect(screen.getByText("Actualités")).toBeInTheDocument();
    expect(
      screen.getByText(/This is a test article content/)
    ).toBeInTheDocument();
    expect(screen.getByTestId("reaction-button")).toBeInTheDocument();
  });

  it("displays correct category icon", () => {
    render(<BlogCard post={mockPost} />);
    // Vérifier que l'icône de catégorie est présente (📰 pour Actualités)
    expect(
      screen.getByLabelText("Icône catégorie Actualités")
    ).toBeInTheDocument();
  });

  it("handles different categories correctly", () => {
    const ticketsPost = { ...mockPost, category: "Tickets" };
    render(<BlogCard post={ticketsPost} />);
    // Vérifier que l'icône de catégorie Tickets est présente (🎫)
    expect(
      screen.getByLabelText("Icône catégorie Tickets")
    ).toBeInTheDocument();
  });

  it("formats date correctly", () => {
    render(<BlogCard post={mockPost} />);
    // Vérifier que la date est formatée et affichée
    expect(screen.getByText(/27 janvier 2025/)).toBeInTheDocument();
  });

  it("truncates content properly", () => {
    const longContentPost = {
      ...mockPost,
      content: "A".repeat(200), // Contenu très long
    };
    render(<BlogCard post={longContentPost} />);
    // Vérifier que le contenu est tronqué (présence de ...)
    expect(screen.getByText(/\.\.\.$/)).toBeInTheDocument();
  });

  it("applies correct styling classes", () => {
    render(<BlogCard post={mockPost} />);
    const card = screen.getByRole("link");
    expect(card.className).toMatch(/block/);
    expect(card.className).toMatch(/group/);
  });

  it("handles missing dates gracefully", () => {
    const postWithoutDates = {
      ...mockPost,
      published_at: null,
      created_at: null,
    };
    render(<BlogCard post={postWithoutDates} />);
    // Vérifier que le composant ne plante pas
    expect(screen.getByText("Test Article Title")).toBeInTheDocument();
  });
});

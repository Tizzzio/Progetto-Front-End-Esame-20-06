import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { FavoritesProvider, useFavorites } from "../FavoritesContext";

function TestComp() {
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  return (
    <div>
      <div data-testid="count">{favorites.length}</div>
      <button onClick={() => toggleFavorite({ id: 1, title: "X" } as any)}>toggle</button>
      <div data-testid="isFav">{String(isFavorite(1))}</div>
    </div>
  );
}

describe("FavoritesContext", () => {
  test("adds and removes favorites", () => {
    render(
      <FavoritesProvider>
        <TestComp />
      </FavoritesProvider>,
    );

    expect(screen.getByTestId("count").textContent).toBe("0");
    fireEvent.click(screen.getByText("toggle"));
    expect(screen.getByTestId("isFav").textContent).toBe("true");
    fireEvent.click(screen.getByText("toggle"));
    expect(screen.getByTestId("isFav").textContent).toBe("false");
  });
});

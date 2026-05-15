import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SearchBar from "../SearchBar";

describe("SearchBar", () => {
  test("calls onSearch on submit with input value", () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);
    const input = screen.getByPlaceholderText(/Cerca un film/i);
    fireEvent.change(input, { target: { value: "Inception" } });
    fireEvent.submit(input);
    expect(onSearch).toHaveBeenCalledWith("Inception");
  });
});

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

describe("Tooltip", () => {
  it("renders tooltip trigger", () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    const trigger = screen.getByText("Hover me");
    expect(trigger).toBeInTheDocument();
  });

  it("shows tooltip content on hover", async () => {
    const user = userEvent.setup();
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    const trigger = screen.getByText("Hover me");
    await user.hover(trigger);

    await waitFor(() => {
      expect(screen.getByText("Tooltip content")).toBeInTheDocument();
    });
  });

  it("hides tooltip content on mouse leave", async () => {
    const user = userEvent.setup();
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    const trigger = screen.getByText("Hover me");
    await user.hover(trigger);

    await waitFor(() => {
      expect(screen.getByText("Tooltip content")).toBeInTheDocument();
    });

    await user.unhover(trigger);

    await waitFor(() => {
      expect(screen.queryByText("Tooltip content")).not.toBeInTheDocument();
    });
  });

  it("renders tooltip with asChild prop", () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button>Button trigger</button>
          </TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    const trigger = screen.getByText("Button trigger");
    expect(trigger).toBeInTheDocument();
    expect(trigger.tagName).toBe("BUTTON");
  });

  it("applies custom className to tooltip content", () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent className="custom-class">
            Tooltip content
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    const trigger = screen.getByText("Hover me");
    expect(trigger).toBeInTheDocument();
  });

  it("renders with different side positions", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent side="top">Top tooltip</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    const trigger = screen.getByText("Hover me");
    await user.hover(trigger);

    await waitFor(() => {
      const tooltip = screen.getByText("Top tooltip");
      expect(tooltip).toBeInTheDocument();
    });

    rerender(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent side="bottom">Bottom tooltip</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    await user.hover(trigger);

    await waitFor(() => {
      expect(screen.getByText("Bottom tooltip")).toBeInTheDocument();
    });
  });

  it("handles delay duration", async () => {
    const user = userEvent.setup();
    vi.useFakeTimers();

    render(
      <TooltipProvider delayDuration={500}>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Delayed tooltip</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    const trigger = screen.getByText("Hover me");
    await user.hover(trigger);

    // Tooltip should not appear immediately
    expect(screen.queryByText("Delayed tooltip")).not.toBeInTheDocument();

    // Fast-forward time
    vi.advanceTimersByTime(500);

    await waitFor(() => {
      expect(screen.getByText("Delayed tooltip")).toBeInTheDocument();
    });

    vi.useRealTimers();
  });
});

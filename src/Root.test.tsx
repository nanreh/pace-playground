import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Root from "./Root";

function renderAt(pathAndQuery: string) {
  window.history.replaceState(null, "", pathAndQuery);
  return render(<Root />);
}

const splitCount = (container: HTMLElement) =>
  container.querySelectorAll(".interval").length;

describe("Pace Playground", function () {
  it("shows mile splits for a marathon by default", function () {
    const { container } = renderAt("/hacks/paceplayground/");

    expect(splitCount(container)).toBe(27);
    expect(screen.getByText("1mi in 06:51")).toBeVisible();
  });

  it("lays out the splits described by the URL", function () {
    const { container } = renderAt(
      "/hacks/paceplayground/?d=Marathon&t=12600&u=km",
    );

    expect(splitCount(container)).toBe(43);
    expect(screen.getByText("1km in 04:58")).toBeVisible();
  });

  it("puts the starting splits in the URL", function () {
    renderAt("/hacks/paceplayground/");

    const params = new URLSearchParams(window.location.search);
    expect(params.get("d")).toBe("Marathon");
    expect(params.get("u")).toBe("mi");
  });

  it("keeps the splits across a visit to the About page", async function () {
    const { container } = renderAt(
      "/hacks/paceplayground/?d=Marathon&t=12600&u=mi",
    );
    await userEvent.click(screen.getByLabelText("Km"));
    expect(splitCount(container)).toBe(43);

    await userEvent.click(screen.getByRole("link", { name: "About" }));

    expect(screen.getByRole("heading", { name: "About" })).toBeVisible();
    expect(screen.getByText("1km in 04:58")).not.toBeVisible();
    expect(window.location.pathname).toBe("/hacks/paceplayground/about");

    await userEvent.click(screen.getByRole("link", { name: "Splits" }));

    expect(screen.queryByRole("heading", { name: "About" })).toBeNull();
    expect(screen.getByText("1km in 04:58")).toBeVisible();
    expect(screen.getByLabelText("Km")).toBeChecked();
    expect(splitCount(container)).toBe(43);
    expect(window.location.pathname).toBe("/hacks/paceplayground/");
    const params = new URLSearchParams(window.location.search);
    expect(params.get("u")).toBe("km");
    expect(params.get("t")).toBe("12600");
  });

  it("does not start the splits when the About page is opened directly", function () {
    const { container } = renderAt("/hacks/paceplayground/about");

    expect(screen.getByRole("heading", { name: "About" })).toBeVisible();
    expect(splitCount(container)).toBe(0);
    expect(window.location.search).toBe("");
  });
});

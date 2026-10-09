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

  it("honours locked splits from the URL", function () {
    const { container } = renderAt(
      "/hacks/paceplayground/?d=5K&t=1200&u=km&f=0-300",
    );

    expect(splitCount(container)).toBe(5);
    expect(screen.getByText("1km in 05:00")).toBeVisible();
    expect(screen.getByText("2km in 08:45")).toBeVisible();
    expect(new URLSearchParams(window.location.search).get("f")).toBe("0-300");
  });

  it.each([
    ["one longer than the whole race", "0-1300"],
    ["every split locked", "0-200_1-200_2-200_3-200_4-200"],
    ["a split that does not exist", "9-240"],
    ["a split of zero seconds", "0-0"],
  ])("ignores impossible locks from the URL: %s", function (_name, locks) {
    const { container } = renderAt(
      `/hacks/paceplayground/?d=5K&t=1200&u=km&f=${locks}`,
    );

    // all five splits are there and the goal time is intact
    expect(splitCount(container)).toBe(5);
    expect(screen.getByText(/^5km in 20:00$/)).toBeVisible();
  });

  it("removes impossible locks from the URL", function () {
    renderAt("/hacks/paceplayground/?d=5K&t=1200&u=km&f=0-1300");

    expect(screen.getByText("1km in 04:00")).toBeVisible();
    expect(new URLSearchParams(window.location.search).get("f")).toBe("");
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

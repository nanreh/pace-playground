import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ShareButton from "./ShareButton";

function setNavigator(parts: { share?: unknown; clipboard?: unknown }) {
  Object.defineProperty(window.navigator, "share", {
    value: parts.share,
    configurable: true,
  });
  Object.defineProperty(window.navigator, "clipboard", {
    value: parts.clipboard,
    configurable: true,
  });
}

describe("ShareButton", function () {
  beforeEach(function () {
    window.history.replaceState(
      null,
      "",
      "/hacks/paceplayground/?d=5K&t=1200&u=km",
    );
    window.alert = jest.fn();
    window.prompt = jest.fn();
  });

  it("uses the device's share sheet when there is one", async function () {
    const share = jest.fn(async () => {});
    setNavigator({ share });
    render(<ShareButton />);

    await userEvent.click(screen.getByRole("button", { name: "Share" }));

    expect(share).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "http://localhost/hacks/paceplayground/?d=5K&t=1200&u=km",
      }),
    );
    expect(window.alert).not.toHaveBeenCalled();
  });

  it("does not complain when the share sheet is dismissed", async function () {
    setNavigator({
      share: jest.fn(async () => {
        throw new Error("AbortError");
      }),
    });
    render(<ShareButton />);

    await userEvent.click(screen.getByRole("button", { name: "Share" }));

    expect(window.alert).not.toHaveBeenCalled();
    expect(window.prompt).not.toHaveBeenCalled();
  });

  it("copies the link when there is no share sheet", async function () {
    const writeText = jest.fn(async () => {});
    setNavigator({ clipboard: { writeText } });
    render(<ShareButton />);

    await userEvent.click(screen.getByRole("button", { name: "Share" }));

    expect(writeText).toHaveBeenCalledWith(
      "http://localhost/hacks/paceplayground/?d=5K&t=1200&u=km",
    );
    await waitFor(() =>
      expect(window.alert).toHaveBeenCalledWith(
        "Link has been copied to clipboard!",
      ),
    );
  });

  it("shows the link to copy by hand when the clipboard is unavailable", async function () {
    setNavigator({
      clipboard: {
        writeText: jest.fn(async () => {
          throw new Error("denied");
        }),
      },
    });
    render(<ShareButton />);

    await userEvent.click(screen.getByRole("button", { name: "Share" }));

    await waitFor(() =>
      expect(window.prompt).toHaveBeenCalledWith(
        "Copy this link to share:",
        "http://localhost/hacks/paceplayground/?d=5K&t=1200&u=km",
      ),
    );
    expect(window.alert).not.toHaveBeenCalled();
  });
});

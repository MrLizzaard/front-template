import { render, screen } from "@testing-library/react";
import About from "../pages/About";

describe("About 테스트", () => {
  test("스냅샷", () => {
    // render();
    const utils = render(<About />);
    expect(utils.container).toMatchSnapshot();
  });

  it("h2 test", () => {
    render(<About />);

    const h2 = screen.getByRole("banner");
    expect(h2?.innerHTML).toBe("About");
  });
});

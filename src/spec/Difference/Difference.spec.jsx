import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { beforeEach, afterEach } from "vitest";

import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import Difference from "../../ui/components/Difference";

const createComponentWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <Difference />
      </MemoryRouter>
    </QueryClientProvider>
  );
};

beforeEach(() => {
  render(createComponentWrapper());
});

afterEach(() => {
  cleanup();
});

describe("Difference Component Test", () => {
  it("비교 페이지에서 버전 재선택 버튼이 렌더 되어야 합니다", () => {
    const newVersionElement = screen.getByText("Re-select Version");

    expect(newVersionElement).toBeInTheDocument();
  });

  it("버전 재선택 버튼을 클릭 시 모달 창이 렌더링 되어야 합니다", () => {
    const newVersionElement = screen.getByText("Re-select Version");

    fireEvent.click(newVersionElement);

    const newVersionModalElement = screen.getByText("Compare new version?");
    const confirmButtonElement = screen.getByText("Let's compare!");
    const cancelButtonElement = screen.getByText("No");

    expect(newVersionModalElement).toBeInTheDocument();
    expect(confirmButtonElement).toBeInTheDocument();
    expect(cancelButtonElement).toBeInTheDocument();
  });

  it("버전 재선택 모달 창에서 아니오 버튼 클릭 시 모달 창이 닫혀야 합니다", () => {
    const newVersionElement = screen.getByText("Re-select Version");

    fireEvent.click(newVersionElement);

    const newVersionModalElement = screen.getByText("Compare new version?");
    const cancelButtonElement = screen.getByText("No");

    fireEvent.click(cancelButtonElement);

    expect(newVersionModalElement).not.toBeInTheDocument();
    expect(cancelButtonElement).not.toBeInTheDocument();
  });

  it("비교 페이지에서 페이지 소개 텍스트가 렌더 되어야 합니다", () => {
    const headerTextElement = screen.getByText(
      "Check out the design changes! 👀",
    );

    expect(headerTextElement).toBeInTheDocument();
  });

  it("비교 페이지에서 이용 가이드 텍스트가 렌더 되어야 합니다", () => {
    const serviceGuideTextElement = screen.getByText(
      /Select the orange(changed elements), green(new elements) areas to examine the changes in detail./,
    );

    expect(serviceGuideTextElement).toBeInTheDocument();
  });

  it("비교 페이지에서 변경 텍스트 영역이 렌더 되어야 합니다", () => {
    const differenceAreaElement = screen.getByText(
      "Please select the changes.",
    );

    expect(differenceAreaElement).toBeInTheDocument();
  });

  it("비교 페이지에서 페이지네이션 버튼이 렌더 되어야 합니다", () => {
    const prevButtonElement = screen.getByText("Previous");
    const nextButtonElement = screen.getByText("Next");

    expect(prevButtonElement).toBeInTheDocument();
    expect(nextButtonElement).toBeInTheDocument();
  });

  it("비교 페이지에서 페이지네이션 정보가 렌더 되어야 합니다", () => {
    const paginationTextElement = screen.getByText("- / -");

    expect(paginationTextElement).toBeInTheDocument();
  });
});

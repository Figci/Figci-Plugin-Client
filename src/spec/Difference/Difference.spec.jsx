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
}

beforeEach(() => {
  render(createComponentWrapper());
});

afterEach(() => {
  cleanup();
});

describe("Difference Component Test", () => {
  it("비교 페이지에서 버전 재선택 버튼이 렌더 되어야 합니다", () => {
    const newVersionElement = screen.getByText("버전 재선택");

    expect(newVersionElement).toBeInTheDocument();
  });

  it("버전 재선택 버튼을 클릭 시 모달 창이 렌더링 되어야 합니다", () => {
    const newVersionElement = screen.getByText("버전 재선택");

    fireEvent.click(newVersionElement);

    const newVersionModalElement = screen.getByText("새 버전을 비교하시겠어요?");
    const confirmButtonElement = screen.getByText("비교할래요!");
    const cancelButtonElement = screen.getByText("아니오");

    expect(newVersionModalElement).toBeInTheDocument();
    expect(confirmButtonElement).toBeInTheDocument();
    expect(cancelButtonElement).toBeInTheDocument();
  });

  it("버전 재선택 모달 창에서 아니오 버튼 클릭 시 모달 창이 닫혀야 합니다", () => {
    const newVersionElement = screen.getByText("버전 재선택");

    fireEvent.click(newVersionElement);

    const newVersionModal = screen.getByText("새 버전을 비교하시겠어요?");
    const cancelButtonElement = screen.getByText("아니오");

    fireEvent.click(cancelButtonElement);

    expect(newVersionModal).not.toBeInTheDocument();
    expect(cancelButtonElement).not.toBeInTheDocument();
  });

  it("비교 페이지에서 페이지 소개 텍스트가 렌더 되어야 합니다", () => {
    const headerTextElement = screen.getByText("디자인 변경 사항을 확인해 보세요! 👀");

    expect(headerTextElement).toBeInTheDocument();
  });

  it("비교 페이지에서 이용 가이드 텍스트가 렌더 되어야 합니다", () => {
    const serviceGuideTextElement = screen.getByText(
      /주황(변경 요소)\/초록(신규 요소) 영역을 선택하시면,*해당 영역에 있는 변경 사항을 자세하게 살펴볼 수 있어요.*/
    );

    expect(serviceGuideTextElement).toBeInTheDocument();
  });

  it("비교 페이지에서 변경 텍스트 영역이 렌더 되어야 합니다", () => {
    const differenceAreaElement = screen.getByText("변경사항을 선택해주세요.");

    expect(differenceAreaElement).toBeInTheDocument();
  });

  it("비교 페이지에서 페이지네이션 버튼이 렌더 되어야 합니다", () => {
    const prevButtonElement = screen.getByText("이전");
    const nextButtonElement = screen.getByText("다음");

    expect(prevButtonElement).toBeInTheDocument();
    expect(nextButtonElement).toBeInTheDocument();
  });

  it("비교 페이지에서 페이지네이션 정보가 렌더 되어야 합니다", () => {
    const paginationTextElement = screen.getByText("- / -");

    expect(paginationTextElement).toBeInTheDocument();
  });
});

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { nanoid } from "nanoid";

import Description from "../shared/Description";
import Button from "../shared/Button";
import ToastPopup from "../shared/Toast";
import Loading from "../shared/Loading";
import Modal from "../shared/Modal";
import Popup from "../shared/Popup";

import usePageListStore from "../../../store/projectPage";
import useProjectStore from "../../../store/project";

import getDiffingResultQuery from "../../../services/getDiffingResultQuery";

import isOwnProperty from "../../../utils/isOwnProperty";
import postMessage from "../../../utils/postMessage";
import processDifferences from "../../../utils/processDifferences";

function Difference() {
  const [toast, setToast] = useState({});
  const [isOpenedPopup, setIsOpenedPopup] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [pageId, setPageId] = useState("");
  const [displayText, setDisplayText] = useState({
    titleOfChanges: null,
    detailOfChanges: ["변경사항을 선택해주세요."],
    className: "default",
  });

  const { allPageIds } = usePageListStore();
  const { project } = useProjectStore();

  const { data: diffingResult, isLoading } = getDiffingResultQuery(
    project.projectKey,
    project.beforeVersionId,
    project.afterVersionId,
    pageId,
    accessToken,
  );

  const handleRectangleClick = ev => {
    if (ev.data.pluginMessage.type === "RENDER_DIFFERENCE_INFORMATION") {
      const differences = ev.data.pluginMessage.content;

      if (differences === "UNCHANGED_NODE") {
        setDisplayText({
          titleOfChanges: null,
          detailOfChanges: ["변경사항을 선택해주세요."],
          className: "default",
        });
      } else {
        const differencesInformation = processDifferences(differences);

        setDisplayText(differencesInformation);
      }
    }

    if (ev.data.pluginMessage.type === "GET_ACCESS_TOKEN") {
      const token = ev.data.pluginMessage.content;

      setAccessToken(token);
    }

    if (ev.data.pluginMessage.type === "CHANGED_CURRENT_PAGE_ID") {
      const pageId = ev.data.pluginMessage.content;
      const isComparablePage = allPageIds.includes(pageId);

      if (!isComparablePage) {
        setToast({
          status: true,
          message: "이전 버전에 존재하지 않는 페이지 입니다.",
        });

        setPageId("");

        return;
      }

      setPageId(pageId);
    }
  };

  useEffect(() => {
    setDisplayText({
      titleOfChanges: null,
      detailOfChanges: ["변경사항을 선택해주세요."],
      className: "default",
    });
  }, [pageId]);

  useEffect(() => {
    if (!diffingResult) {
      return;
    }

    if (diffingResult.result === "error") {
      setToast({ status: true, message: diffingResult.message });

      return;
    }

    const { differences } = diffingResult.content;
    const modifiedFrames = {};

    for (const frameId in diffingResult.content.frames) {
      if (isOwnProperty(diffingResult.content.frames, frameId)) {
        const frameNode = diffingResult.content.frames[frameId];

        modifiedFrames[frameId] = frameNode.property.absoluteBoundingBox;
        modifiedFrames[frameId].isNew = true;
      }
    }

    postMessage("POST_DIFFING_RESULT", { differences, modifiedFrames });
  }, [diffingResult]);

  useEffect(() => {
    postMessage("GET_ACCESS_TOKEN");

    window.addEventListener("message", handleRectangleClick);

    return () => {
      window.removeEventListener("message", handleRectangleClick);
    };
  }, []);

  return (
    <>
      {isLoading && (
        <Modal>
          <Loading
            title="변경사항 정보를 가져오고 있어요."
            text="변경사항 정보를 가져오고 있어요.\n정보를 가져오는 동안 잠깐만 기다려주세요."
          />
        </Modal>
      )}
      {isOpenedPopup && (
        <Popup
          title="새 버전을 비교하시겠어요?"
          text="비교하기 버튼을 누르면 현재 페이지의\n변경 사항들이 모두 삭제돼요."
          buttonName="비교할래요!"
          path="/version"
          isOpenedPopup={setIsOpenedPopup}
        />
      )}
      <Content>
        <h1 className="title">디자인 변경 사항을 확인해 보세요! 👀</h1>
        <Description
          className="description"
          size="large"
          align="left"
          text="빨강/초록 영역을 선택하시면, 해당 영역에 있는 변경사항을\n자세하게 살펴볼 수 있어요."
        />
        <div className={`difference-area ${displayText.className}`}>
          {!displayText.titleOfChanges ? displayText.detailOfChanges[0] : null}
          {displayText.titleOfChanges &&
            displayText.titleOfChanges.map((title, index) => (
              <Sentence key={nanoid(10)}>
                <h5 className="subtitle">{title}</h5>
                <p className="detail">{displayText.detailOfChanges[index]}</p>
              </Sentence>
            ))}
        </div>
        <div className="button">
          <Button
            className="re-version"
            size="medium"
            usingCase="line"
            handleClick={ev => {
              ev.preventDefault();

              setPageId("");

              setIsOpenedPopup(true);
            }}
          >
            버전 재선택
          </Button>
        </div>
        {toast.status && (
          <ToastPopup setToast={setToast} message={toast.message} />
        )}
      </Content>
    </>
  );
}

const Content = styled.div`
  box-sizing: border-box;
  width: 100%;
  padding: 0px 24px;

  .title {
    margin-bottom: 4px;

    color: #000000;
    font-size: 1.125rem;
    line-height: 24px;
    text-align: left;
    font-weight: 800;
  }

  .difference-area {
    box-sizing: border-box;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 280px;
    margin-bottom: 24px;
    padding: 16px;
    border-radius: 8px;

    background-color: #f1f3f5;
    font-size: 0.875rem;
    line-height: 22px;
    word-break: keep-all;
  }

  .difference-area.default {
    align-items: center;
    justify-content: center;

    color: #868e96;
    text-align: center;
  }

  .difference-area.active {
    color: #000000;
    text-align: left;
  }

  .description {
    color: #868e96;
    margin-bottom: 24px;
  }

  .button {
    position: fixed;
    bottom: 24px;
  }
`;

const Sentence = styled.div`
  width: auto;

  word-break: keep-all;

  .subtitle {
    font-weight: 700;
  }

  .detail {
    margin-bottom: 8px;

    color: #343e40;
  }
`;

export default Difference;

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
  const [pagination, setPagination] = useState({
    result: false,
    frameCounts: "- / -",
  });
  const [accessToken, setAccessToken] = useState("");
  const [pageId, setPageId] = useState("");
  const [clickedType, setClickedType] = useState({ type: "" });
  const [displayText, setDisplayText] = useState({
    titleOfChanges: null,
    detailOfChanges: ["Please select the changes."],
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
          detailOfChanges: ["Please select the changes."],
          className: "default",
        });

        return;
      }

      const differencesInformation = processDifferences(differences);

      setDisplayText(differencesInformation);
    }

    if (ev.data.pluginMessage.type === "GET_ACCESS_TOKEN") {
      const token = ev.data.pluginMessage.content;

      setAccessToken(token);
    }

    if (ev.data.pluginMessage.type === "GET_CURRENT_PAGE_ID") {
      const pageId = ev.data.pluginMessage.content;

      setPageId(pageId);
    }

    if (ev.data.pluginMessage.type === "CHANGED_CURRENT_PAGE_ID") {
      const pageId = ev.data.pluginMessage.content;
      const isComparablePage = allPageIds.includes(pageId);

      if (!isComparablePage) {
        setPageId("");
        setPagination({ result: false, frameCounts: "- / -" });
        setToast({
          status: true,
          message: "선택하신 버전에는 현재 페이지가 존재하지 않습니다!",
        });

        return;
      }

      setPageId(pageId);
    }

    if (ev.data.pluginMessage.type === "FRAME_PAGINATION") {
      const framePagination = ev.data.pluginMessage.content;

      setPagination(framePagination);
    }
  };

  useEffect(() => {
    window.addEventListener("message", handleRectangleClick);

    postMessage("GET_CURRENT_PAGE_ID");
    postMessage("GET_ACCESS_TOKEN");

    return () => {
      window.removeEventListener("message", handleRectangleClick);
    };
  }, []);

  useEffect(() => {
    setDisplayText({
      titleOfChanges: null,
      detailOfChanges: ["Please select the changes."],
      className: "default",
    });
  }, [pageId]);

  useEffect(() => {
    if (!diffingResult) {
      return;
    }

    if (diffingResult.result === "error") {
      setPagination({ result: false, frameCounts: "- / -" });
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

    setPagination({
      result: true,
      currentCount: 0,
      frameCounts: Object.keys(differences).length,
    });

    postMessage("POST_DIFFING_RESULT", { differences, modifiedFrames });
  }, [diffingResult]);

  useEffect(() => {
    if (clickedType.type === "prev") {
      postMessage("PAGINATION_BUTTON", "prev");

      return;
    }

    if (clickedType.type === "next") {
      postMessage("PAGINATION_BUTTON", "next");

      return;
    }
  }, [clickedType]);

  return (
    <>
      {isLoading && (
        <Modal>
          <Loading
            title="Fetching change information."
            text="Please wait a moment\nwhile we retrieve the information."
          />
        </Modal>
      )}
      {isOpenedPopup && (
        <Popup
          title="Compare new version?"
          text="Clicking the compare button will delete\nall changes on the current page."
          buttonName="Let's compare!"
          path="/version"
          isOpenedPopup={setIsOpenedPopup}
        />
      )}
      <Content>
        <Button
          className="button-position"
          size="xsmall"
          usingCase="void"
          handleClick={ev => {
            ev.preventDefault();

            setIsOpenedPopup(true);
          }}
        >
          Re-select Version
        </Button>
        <h1 className="title">Check out the design changes! 👀</h1>
        <Description
          className="description"
          size="large"
          align="left"
          text="Select the orange(changed elements), green(new elements) areas to examine the changes in detail."
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
        <Pagination>
          <div className="pagination-content">
            {pagination.result
              ? `${pagination.currentCount} / ${pagination.frameCounts}`
              : `${pagination.frameCounts}`}
          </div>
          {diffingResult?.result === "success" ? (
            <>
              <Button
                className="pagination-prev-button"
                size="small"
                usingCase="line"
                handleClick={() => setClickedType({ type: "prev" })}
              >
                Previous
              </Button>
              <Button
                className="pagination-next-button"
                size="small"
                usingCase="line"
                handleClick={() => setClickedType({ type: "next" })}
              >
                Next
              </Button>
            </>
          ) : (
            <>
              <Button
                className="pagination-prev-button pagination-button-disable"
                size="small"
                usingCase="line"
                disabled
                handleClick={() => {}}
              >
                Previous
              </Button>
              <Button
                className="pagination-next-button pagination-button-disable"
                size="small"
                usingCase="line"
                disabled
                handleClick={() => {}}
              >
                Next
              </Button>
            </>
          )}
        </Pagination>
        {toast.status && (
          <ToastPopup setToast={setToast} message={toast.message} />
        )}
      </Content>
    </>
  );
}

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;

  .pagination-content {
    display: flex;
    align-items: center;
    width: 100px;
    margin-right: 10px;

    text-align: left;
  }

  .pagination-prev-button {
    min-width: 140px !important;
    margin-right: 10px;
    border: 1px solid #adb5bd;

    text-align: center;
  }

  .pagination-next-button {
    min-width: 140px !important;
    border: 1px solid #adb5bd;

    text-align: center;
  }

  .pagination-button-disable {
    border: 1px solid #868e96;

    background-color: #868e96;
  }
`;

const Content = styled.div`
  box-sizing: border-box;
  width: 100%;
  padding: 0px 24px;

  .button-position {
    position: fixed;
    top: 20px;
    right: 20px;
  }

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
    margin-bottom: 24px;

    color: #868e96;
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

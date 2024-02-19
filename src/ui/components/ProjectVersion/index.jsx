import { useState, useEffect } from "react";
import styled from "styled-components";

import Button from "../shared/Button";
import Description from "../shared/Description";
import ToastPopup from "../shared/Toast";

import useProjectStore from "../../../store/project";
import useProjectVersionStore from "../../../store/projectVersion";

import postMessage from "../../../utils/postMessage";
import createOption from "../../../utils/createOption";
import isCommonPage from "../../../utils/isCommonPage";
import getCommonPages from "../../../services/getCommonPages";
import getDiffingResultQuery from "../../../services/getDiffingResultQuery";

const [GET_CURRENT_PAGE_ID, GET_PROJECT_KEY, GET_ACCESS_TOKEN] = [
  "GET_CURRENT_PAGE_ID",
  "GET_PROJECT_KEY",
  "GET_ACCESS_TOKEN",
];

function ProjectVersion() {
  const [toast, setToast] = useState({});
  const [projectInformation, setProjectInformation] = useState({});
  const [selectedVersion, setSelectedVersion] = useState("");
  const [commonPageId, setCommonPageId] = useState("");

  const { project, setProject, clearProject } = useProjectStore();
  const { byDates, allDates } = useProjectVersionStore();

  const {
    data: diffingResult,
    isLoading,
    isError,
    error,
  } = getDiffingResultQuery(
    projectInformation.projectKey,
    projectInformation.beforeVersion,
    projectInformation.afterVersion,
    commonPageId,
  );

  const handleProjectInformation = ev => {
    switch (ev.data.pluginMessage.type) {
      case GET_CURRENT_PAGE_ID:
        const pageId = ev.data.pluginMessage.content;

        setProjectInformation(currentState => ({ ...currentState, pageId }));

        break;

      case GET_PROJECT_KEY:
        const projectKey = ev.data.pluginMessage.content;

        setProjectInformation(currentState => ({
          ...currentState,
          projectKey,
        }));

        break;

      case GET_ACCESS_TOKEN:
        const accessToken = ev.data.pluginMessage.content;

        setProjectInformation(currentState => ({
          ...currentState,
          accessToken,
        }));

        break;

      default:
        break;
    }
  };

  const handleChange = ev => {
    ev.preventDefault();

    setSelectedVersion({
      ...selectedVersion,
      [ev.currentTarget.className]: ev.target.value,
    });
  };

  const handleClick = async ev => {
    ev.preventDefault();

    if (!selectedVersion.beforeVersion) {
      setToast({ status: true, messaeg: "선택하지 않은 버전이 존재합니다." });

      return;
    }

    const { beforeVersionId } = selectedVersion;
    const { afterVersionId } = project;
    const { projectKey, accessToken } = projectInformation;

    const responseResult = await getCommonPages(
      projectKey,
      beforeVersionId,
      afterVersionId,
      accessToken,
    );

    if (responseResult.result === "error") {
      setToast({ status: true, messaeg: responseResult.message });

      return;
    }

    const commonPageList = responseResult.content;
    const currentPageId = projectInformation.pageId;

    if (!isCommonPage(commonPageList, currentPageId)) {
      setToast({
        status: true,
        message: "선택하신 버전에는 현재 페이지가 존재하지 않습니다!",
      });
    }
  };

  useEffect(() => {
    clearProject();

    postMessage(GET_CURRENT_PAGE_ID);
    postMessage(GET_PROJECT_KEY);
    postMessage(GET_ACCESS_TOKEN);

    window.addEventListener("message", handleProjectInformation);

    return () => {
      window.removeEventListener("message", handleProjectInformation);
    };
  }, []);

  return (
    <>
      <ContentsWrapper>
        <div>
          <h1 className="step">STEP 02</h1>
          <h1 className="title">
            현재 버전과 비교할 <br />
            이전 버전을 선택해 주세요.
          </h1>
        </div>
        <form>
          <label htmlFor="beforeVersion">
            이전 버전 선택
            <select className="beforeDate" onChange={handleChange}>
              <option value="" disabled selected>
                날짜 선택
              </option>
              {allDates.map(date => {
                return (
                  <option key={date} value={date}>
                    {date}
                  </option>
                );
              })}
            </select>
            <select className="beforeVersion" onChange={handleChange}>
              <option value="" disabled selected>
                버전 선택
              </option>
              {selectedVersion.beforeDate &&
                createOption(byDates[selectedVersion.beforeDate])}
            </select>
            <Description
              className="description"
              size="medium"
              align="left"
              text="지정한 버전 명이 없으면 시간으로 보여요!"
            />
          </label>
          <Button
            handleClick={handleClick}
            usingCase="solid"
            size="small"
            className="next"
          >
            비교하기
          </Button>
        </form>
      </ContentsWrapper>
      {toast.status && (
        <ToastPopup setToast={setToast} message={toast.message} />
      )}
    </>
  );
}

const ContentsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 24px;

  .step {
    color: #2623fb;
    font-size: 1.125rem;
    line-height: 24px;
    text-align: left;
    font-weight: 800;
  }

  .title {
    margin-bottom: 48px;

    color: #000000;
    font-size: 1.125rem;
    line-height: 24px;
    text-align: left;
    font-weight: 800;
  }

  form {
    width: 100%;
    height: 100%;
  }

  label {
    height: 100%;

    color: #000000;
    font-size: 0.813rem;
    text-align: left;
    line-height: 16px;
    font-weight: 700;
  }

  select {
    width: 100%;
    height: 48px;
    padding: 10px 16px;
    margin-top: 12px;
    border: 1.5px solid #000000;
    border-radius: 4px;
  }

  .description {
    margin-top: 12px;

    color: #868e96;
  }
`;

export default ProjectVersion;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

function ProjectVersion() {
  const navigate = useNavigate();

  const [toast, setToast] = useState({});
  const [projectInformation, setProjectInformation] = useState({});
  const [selectedBefore, setSelectedBefore] = useState({});
  const [commonPageId, setCommonPageId] = useState("");

  const { project, setProject } = useProjectStore();
  const { byDates, allDates } = useProjectVersionStore();
  const {
    data: diffingResult,
    isLoading,
    isError,
    error,
  } = getDiffingResultQuery(
    projectInformation.projectKey,
    project.beforeVersionId,
    project.afterVersionId,
    commonPageId,
    projectInformation.accessToken,
  );

  useEffect(() => {
    if (diffingResult) {
      if (diffingResult.result === "error") {
        setToast({ status: true, message: diffingResult.message });

        return;
      }

      postMessage("POST_DIFFING_RESULT", diffingResult.content.differences);

      navigate("/result");
    }
  }, [diffingResult]);

  const handleProjectInformation = ev => {
    if (ev.data.pluginMessage.type === "GET_CURRENT_PAGE_ID") {
      const pageId = ev.data.pluginMessage.content;

      setProjectInformation(currentState => ({ ...currentState, pageId }));
    }

    if (ev.data.pluginMessage.type === "GET_PROJECT_KEY") {
      const projectKey = ev.data.pluginMessage.content;

      setProjectInformation(currentState => ({
        ...currentState,
        projectKey,
      }));
    }

    if (ev.data.pluginMessage.type === "GET_ACCESS_TOKEN") {
      const accessToken = ev.data.pluginMessage.content;

      setProjectInformation(currentState => ({
        ...currentState,
        accessToken,
      }));
    }
  };

  const handleChange = ev => {
    ev.preventDefault();
    ev.stopPropagation();

    setSelectedBefore({
      ...selectedBefore,
      [ev.currentTarget.className]: ev.target.value,
    });
  };

  const handleClick = async ev => {
    ev.preventDefault();

    if (!selectedBefore.beforeVersion) {
      setToast({ status: true, messaeg: "선택하지 않은 버전이 존재합니다." });

      return;
    }

    const { beforeVersion } = selectedBefore;
    const { afterVersionId } = project;
    const { projectKey, accessToken } = projectInformation;

    const responseResult = await getCommonPages(
      projectKey,
      beforeVersion,
      afterVersionId,
      accessToken,
      projectInformation.accessToken,
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

      return;
    }

    setProject({ beforeVersionId: selectedBefore.beforeVersion });
    setCommonPageId(currentPageId);
  };

  useEffect(() => {
    postMessage("GET_CURRENT_PAGE_ID");
    postMessage("GET_PROJECT_KEY");
    postMessage("GET_ACCESS_TOKEN");

    window.addEventListener("message", handleProjectInformation);

    return () => {
      window.removeEventListener("message", handleProjectInformation);
    };
  }, []);

  return (
    <>
      <Wrapper>
        <ContentHeader>
          <h1 className="title">
            현재 버전과 비교할 <br />
            이전 버전을 선택해 주세요.
          </h1>
          <Description
            className="title-description"
            size="medium"
            align="left"
            text="현재 보고 있으신 페이지 기준으로 비교해드려요."
          />
        </ContentHeader>
        <VersionForm>
          <label htmlFor="beforeVersion">
            이전 버전
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
              {selectedBefore.beforeDate &&
                createOption(byDates[selectedBefore.beforeDate])}
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
            size="medium"
            className="next"
          >
            비교하기
          </Button>
        </VersionForm>
      </Wrapper>
      {toast.status && (
        <ToastPopup setToast={setToast} message={toast.message} />
      )}
    </>
  );
}

const Wrapper = styled.div`
  padding: 24px;
`;

const ContentHeader = styled.div`
  padding: 0 0 48px 0;

  .title {
    color: #000000;
    font-size: 1.125rem;
    line-height: 24px;
    text-align: left;
    font-weight: 800;
  }
`;

const VersionForm = styled.form`
  width: 100%;

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

  .beforeVersion {
    margin-bottom: 12px;
  }

  .description {
    color: #868e96;
  }

  Button {
    position: fixed;

    width: 355px;
    bottom: 24px;
  }
`;

export default ProjectVersion;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import Button from "../shared/Button";
import ToastPopup from "../shared/Toast";

import useProjectStore from "../../../store/project";
import useProjectVersionStore from "../../../store/projectVersion";
import usePageListStore from "../../../store/projectPage";

import getLastVersion from "../../../utils/getLastVersion";
import getCommonPages from "../../../service/getCommonPages";

function ProjectVersion() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [toast, setToast] = useState({});
  const [projectVersion, setProjectVersion] = useState({});

  const navigate = useNavigate();

  const { project, setProject, clearProjectVersion } = useProjectStore();
  const { allDates, byDates } = useProjectVersionStore();
  const { setPages, clearPages } = usePageListStore();

  useEffect(() => {
    clearProjectVersion();
    clearPages();
  }, []);

  const handleChange = ev => {
    setProjectVersion({
      ...projectVersion,
      [ev.currentTarget.className]: ev.target.value,
    });
  };

  const handleClick = async ev => {
    ev.preventDefault();

    if (ev.target.classList.contains("prev")) {
      navigate("/new");

      return;
    }

    const lastVersion = getLastVersion(allDates, byDates);

    setProjectVersion(lastVersion);

    const { beforeDate, beforeVersion, afterDate, afterVersion } =
      projectVersion;

    if (!(beforeVersion && afterVersion)) {
      setToast({ status: true, message: "선택하지 않은 버전이 존재합니다." });

      return;
    }

    const beforeCreatedAt = new Date(
      byDates[beforeDate][beforeVersion].createdAt,
    );
    const afterCreatedAt = new Date(byDates[afterDate][afterVersion].createdAt);

    if (beforeCreatedAt >= afterCreatedAt) {
      setToast({
        status: true,
        message: "이후 버전은 이전 버전보다 나중이여야 합니다.",
      });

      return;
    }

    setProject(projectVersion);
    setIsLoaded(true);

    const pageList = await getCommonPages(
      project.projectKey,
      beforeVersion,
      afterVersion,
    );

    if (pageList.result === "error") {
      setIsLoaded(false);

      setToast({ statue: true, message: pageList.message });

      navigate("/new");
    }

    setPages(pageList.content);
    setIsLoaded(false);

    navigate("/page");
  };

  const createOption = versions => {
    const optionList = [];

    for (const versionId in versions) {
      const versionTitle = versions[versionId].label;

      optionList.push(
        <option value={versionId} key={versionId}>
          {versionTitle}
        </option>,
      );
    }

    return optionList;
  };

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
              {projectVersion.beforeDate &&
                createOption(byDates[projectVersion.beforeDate])}
            </select>
            <p className="description">
              지정한 버전 명이 없으면 시간으로 보여요!
            </p>
          </label>
          <div className="buttons">
            <Button
              handleClick={handleClick}
              usingCase="line"
              size="small"
              className="prev"
            >
              이전
            </Button>
            <Button
              handleClick={handleClick}
              usingCase="solid"
              size="small"
              className="next"
            >
              다음
            </Button>
          </div>
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
    font-size: 0.75rem;
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
    font-size: 0.75rem;
    line-height: 16px;
    text-align: left;
    font-weight: 500;
  }

  .buttons {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    column-gap: 12px;
    margin-top: 48px;
  }
`;

export default ProjectVersion;

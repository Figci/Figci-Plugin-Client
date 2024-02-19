import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import Button from "../shared/Button";
import ToastPopup from "../shared/Toast";

import useProjectStore from "../../../store/project";
import useProjectVersionStore from "../../../store/projectVersion";

import getProjectKeyFromURI from "../../../utils/getProjectKeyfromURI";
import isValidFigmaUrl from "../../../utils/isValidFigmaUrl";
import postMessage from "../../../utils/postMessage";
import getAllVersions from "../../../service/getAllVersions";

function NewProject() {
  const navigate = useNavigate();
  const [toast, setToast] = useState(false);

  const { project, setProject, clearProject } = useProjectStore();
  const { setVersion, clearVersion } = useProjectVersionStore();

  useEffect(() => {
    clearProject();
    clearVersion();
  }, []);

  const handleChangeInput = ev => {
    setProject({ projectUrl: ev.target.value });
  };

  const handleMessage = async ev => {
    if (ev.data.pluginMessage.type === "GET_ACCESS_TOKEN") {
      const token = ev.data.pluginMessage.content;
      const projectKey = getProjectKeyFromURI(project.projectUrl);
      const allVersions = await getAllVersions(projectKey, token);

      if (allVersions.result === "error") {
        setToast({ status: true, message: allVersions.message });

        return;
      }

      setProject({ projectKey });
      setVersion(allVersions.content);

      navigate("/version");
    }
  };

  useEffect(() => {
    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [project.projectUrl]);

  const handleSubmitURI = async ev => {
    ev.preventDefault();

    if (!isValidFigmaUrl(project.projectUrl)) {
      setToast({
        status: true,
        message: "피그마 파일 URL 주소가 아니에요. 다시 입력해주세요🥲",
      });

      return;
    }

    postMessage("GET_ACCESS_TOKEN");
  };

  return (
    <>
      <ContentsWrapper>
        <form>
          <div>
            <h1 className="step">STEP 01</h1>
            <h1 className="title">
              디자인 변경사항을 확인할 <br />
              피그마 프로젝트 URL을 입력해주세요.
            </h1>
          </div>
          <label htmlFor="projectUrl" className="label">
            피그마 프로젝트 URL 입력
            <input
              id="projectUrl"
              defaultValue={project.projectUrl}
              placeholder="url 주소를 입력해주세요. (예: www.figma.com/abc)"
              onChange={handleChangeInput}
            />
          </label>
          <Button
            handleClick={handleSubmitURI}
            usingCase="solid"
            size="small"
            className="next"
          >
            다음
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
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 24px;

  .step {
    margin-bottom: 4px;

    color: #2623fb;
    font-size: 1.125rem;
    line-height: 28px;
    text-align: left;
    font-weight: 800;
  }

  .title {
    margin-bottom: 48px;

    color: #000000;
    font-size: 1.125rem;
    line-height: 28px;
    text-align: left;
    font-weight: 800;
  }

  form {
    width: 100%;
    height: 100%;
  }

  input {
    display: flex;
    width: 100%;
    height: 48px;
    padding: 0px 12px;
    border-radius: 4px;
    border: 1px solid #000000;
    margin-top: 12px;
    margin-bottom: 12px;

    background-color: #ffffff;
    font-size: 0.75rem;
    font-style: normal;
    font-weight: 500;
    line-height: 18px;
  }

  label {
    height: 100%;

    color: #000000;
    font-size: 0.813rem;
    text-align: left;
    line-height: 16px;
    font-weight: 700;
  }

  Button {
    width: 100%;
  }
`;

export default NewProject;

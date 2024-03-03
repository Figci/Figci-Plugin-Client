import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import Button from "../shared/Button";
import Description from "../shared/Description";
import Modal from "../shared/Modal";
import Loading from "../shared/Loading";
import ToastPopup from "../shared/Toast";

import useProjectVersionStore from "../../../store/projectVersion";
import useProjectStore from "../../../store/project";

import getAllVersions from "../../../services/getAllVersions";

import getProjectKeyFromURI from "../../../utils/getProjectKeyFromURI";
import isValidFigmaUrl from "../../../utils/isValidFigmaUrl";
import postMessage from "../../../utils/postMessage";

function NewProject() {
  const navigate = useNavigate();

  const [toast, setToast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [projectUrl, setProjectUrl] = useState("");

  const { setVersion, clearVersion } = useProjectVersionStore();
  const { project, setProject, clearProject } = useProjectStore();

  useEffect(() => {
    clearProject();
    clearVersion();
  }, []);

  const handleChangeInput = ev => {
    setProjectUrl(ev.target.value);
  };

  const handleMessage = async ev => {
    setIsLoading(true);

    if (ev.data.pluginMessage.type === "GET_ACCESS_TOKEN") {
      const token = ev.data.pluginMessage.content;
      const projectKey = getProjectKeyFromURI(projectUrl);
      const allVersions = await getAllVersions(projectKey, token);

      if (allVersions.result === "error") {
        setIsLoading(false);
        setToast({ status: true, message: allVersions.message });

        return;
      }

      setProject({ projectKey });
      setVersion(allVersions.content);

      postMessage("GET_NEW_VERSION_ID");
    }

    if (ev.data.pluginMessage.type === "GET_NEW_VERSION_ID") {
      const newVersionId = ev.data.pluginMessage.content;

      setProject({ afterVersionId: newVersionId.id });
      setIsLoading(false);

      navigate("/version");
    }

    setIsLoading(false);
  };

  useEffect(() => {
    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [projectUrl]);

  const handleSubmitURI = async ev => {
    ev.preventDefault();

    if (!isValidFigmaUrl(projectUrl)) {
      setToast({
        status: true,
        message: "This is not a Figma file URL. Please enter it again🥲",
      });

      return;
    }

    postMessage("GET_ACCESS_TOKEN");
  };

  return (
    <>
      {isLoading && (
        <Modal>
          <Loading
            title="Fetching version information!"
            text="Saving the previous and current versions.\nPlease wait while we retrieve the versions."
          />
        </Modal>
      )}
      <ContentsWrapper>
        <form>
          <div>
            <h1 className="step">STEP 01</h1>
            <h1 className="title">
              Please enter the Figma project URL <br />
              to check design changes.
            </h1>
          </div>
          <label htmlFor="projectUrl" className="label">
            Enter Figma Project URL
            <input
              id="projectUrl"
              defaultValue={project.projectUrl}
              placeholder="Please enter the url address. (e.g., www.figma.com/abc)"
              onChange={handleChangeInput}
            />
            <Description
              className="description"
              size="medium"
              align="left"
              text="On Mac, press 'Command+L', on Windows, 'Ctrl+L' to copy the link!"
            />
          </label>
          <Button
            handleClick={handleSubmitURI}
            usingCase="solid"
            size="medium"
            className="next"
          >
            Next
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
    padding: 0 0 40px 0;

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
    margin-top: 12px;
    margin-bottom: 12px;
    border: 1.5px solid #000000;
    border-radius: 4px;

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

  .description {
    color: #868e96;
  }

  Button {
    position: fixed;

    width: 355px;
    bottom: 24px;
  }
`;

export default NewProject;

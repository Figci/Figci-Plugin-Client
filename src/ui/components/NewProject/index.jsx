import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import Button from "../shared/Button";
import Modal from "../shared/Modal";
import Loading from "../shared/Loading";
import ToastPopup from "../shared/Toast";
import Information from "../shared/Information";
import Tooltip from "../shared/Tooltip";

import useProjectVersionStore from "../../../store/projectVersion";
import useProjectStore from "../../../store/project";

import getAllVersions from "../../../services/getAllVersions";

import getProjectKeyFromURI from "../../../utils/getProjectKeyFromURI";
import isValidFigmaUrl from "../../../utils/isValidFigmaUrl";
import postMessage from "../../../utils/postMessage";
import shortCut from "../../../../assets/shortcut_key.png";

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
            <div className="subtitle">
              Enter Figma Project URL
              <Tooltip message="The project URL links to the current Figma file. Click the Share button > Copy link in the top right popup, or use a shortcut to easily copy it." />
            </div>
            <input
              id="projectUrl"
              defaultValue={project.projectUrl}
              placeholder="Please enter the url address. (e.g., www.figma.com/abc)"
              onChange={handleChangeInput}
            />
          </label>
          <Information text="Check the image below and press the appropriate shortcut for your system to copy the Figma project URL!">
            <img src={shortCut} className="content-shortcut" alt="shortcut" />
          </Information>
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
  }

  .subtitle {
    display: flex;
    flex-direction: row;
    align-items: end;

    color: #000000;
    font-size: 0.813rem;
    text-align: left;
    line-height: 14px;
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

  .question-mark {
    width: 16px;
    margin-left: 4px;
  }

  .content-shortcut {
    width: 300px;
  }
`;

export default NewProject;

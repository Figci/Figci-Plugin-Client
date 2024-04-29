import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import Button from "../shared/Button";
import Description from "../shared/Description";
import ToastPopup from "../shared/Toast";
import Modal from "../shared/Modal";
import Loading from "../shared/Loading";

import useProjectStore from "../../../store/project";
import useProjectVersionStore from "../../../store/projectVersion";
import usePageListStore from "../../../store/projectPage";

import getCommonPages from "../../../services/getCommonPages";
import getDiffingResultQuery from "../../../services/getDiffingResultQuery";

import postMessage from "../../../utils/postMessage";
import createOption from "../../../utils/createOption";
import isCommonPage from "../../../utils/isCommonPage";
import isOwnProperty from "../../../utils/isOwnProperty";

function ProjectVersion() {
  const navigate = useNavigate();

  const [toast, setToast] = useState({});
  const [isVersionLoading, setIsVersionLoading] = useState(false);
  const [projectInformation, setProjectInformation] = useState({});
  const [selectedBefore, setSelectedBefore] = useState({});
  const [commonPageId, setCommonPageId] = useState("");
  const [isClick, setIsClick] = useState(false);

  const { project, setProject } = useProjectStore();
  const { byDates, allDates } = useProjectVersionStore();
  const { setPages } = usePageListStore();

  const {
    data: diffingResult,
    isLoading,
    isError,
    error,
  } = getDiffingResultQuery(
    project.projectKey,
    project.beforeVersionId,
    project.afterVersionId,
    commonPageId,
    projectInformation.accessToken,
    isClick,
  );

  useEffect(() => {
    if (diffingResult && isClick) {
      if (diffingResult.result === "error") {
        setToast({ status: true, message: diffingResult.message });
        setIsClick(false);

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
      setIsClick(false);

      navigate("/result");
    }
  }, [diffingResult, isClick]);

  const handleProjectInformation = ev => {
    setIsVersionLoading(true);

    if (ev.data.pluginMessage.type === "GET_CURRENT_PAGE_ID") {
      const pageId = ev.data.pluginMessage.content;

      setProjectInformation(currentState => ({ ...currentState, pageId }));
    }

    if (ev.data.pluginMessage.type === "GET_ACCESS_TOKEN") {
      const accessToken = ev.data.pluginMessage.content;

      setProjectInformation(currentState => ({
        ...currentState,
        accessToken,
      }));
    }

    if (ev.data.pluginMessage.type === "CHANGED_CURRENT_PAGE_ID") {
      const pageId = ev.data.pluginMessage.content;

      setProjectInformation(currentState => ({ ...currentState, pageId }));
    }

    setIsVersionLoading(false);
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

    setIsVersionLoading(true);

    if (!selectedBefore.beforeVersion) {
      setIsVersionLoading(false);

      setToast({
        status: true,
        message: "A version is not selected.",
      });

      return;
    }

    const { beforeVersion } = selectedBefore;
    const responseResult = await getCommonPages(
      project.projectKey,
      beforeVersion,
      project.afterVersionId,
      projectInformation.accessToken,
    );

    if (responseResult.result === "error") {
      setIsVersionLoading(false);

      setToast({ status: true, message: responseResult.message });

      return;
    }

    const commonPageList = responseResult.content;
    const currentPageId = projectInformation.pageId;

    if (!isCommonPage(commonPageList, currentPageId)) {
      setIsVersionLoading(false);

      setToast({
        status: true,
        message: "The selected version doesn't have the current page!",
      });

      return;
    }

    setPages(responseResult.content);
    setProject({ beforeVersionId: selectedBefore.beforeVersion });
    setCommonPageId(currentPageId);
    setIsClick(true);

    setIsVersionLoading(false);
  };

  useEffect(() => {
    postMessage("GET_CURRENT_PAGE_ID");
    postMessage("GET_ACCESS_TOKEN");

    window.addEventListener("message", handleProjectInformation);

    return () => {
      window.removeEventListener("message", handleProjectInformation);
    };
  }, []);

  return (
    <>
      {(isLoading || isVersionLoading) && (
        <Modal>
          <Loading
            title="Comparing versions!"
            text="Large Figma files may take over\na minute to compare."
          />
        </Modal>
      )}
      <Wrapper>
        <ContentHeader>
          <h1 className="step">STEP 02</h1>
          <h1 className="title">
            Please select the previous version <br />
            to compare with the current version.
          </h1>
          <Description
            className="title-description"
            size="large"
            align="left"
            text="We compare based on the page you are currently viewing."
          />
        </ContentHeader>
        <VersionForm>
          <label htmlFor="beforeVersion">
            Previous version
            <select className="beforeDate" onChange={handleChange}>
              <option value="" disabled selected>
                Select date
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
                Select version
              </option>
              {selectedBefore.beforeDate &&
                createOption(byDates[selectedBefore.beforeDate])}
            </select>
            <Description
              className="description"
              size="medium"
              align="left"
              text="If there's no specified version name, it's displayed by time!"
            />
          </label>
          <Button
            handleClick={handleClick}
            usingCase="solid"
            size="medium"
            className="next"
          >
            Compare
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
  padding: 0 0 40px 0;

  .step {
    margin-bottom: 4px;

    color: #2623fb;
    font-size: 1.125rem;
    line-height: 28px;
    text-align: left;
    font-weight: 800;
  }

  .title {
    color: #000000;
    font-size: 1.125rem;
    line-height: 24px;
    text-align: left;
    font-weight: 800;
  }

  .title-description {
    margin-top: 4px;
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

    appearance: none;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='currentColor' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' %3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 1rem top 0.65rem;
    background-size: 24px;
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

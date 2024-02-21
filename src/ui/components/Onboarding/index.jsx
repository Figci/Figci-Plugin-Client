import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import Modal from "../shared/Modal";
import Loading from "../shared/Loading";
import Button from "../shared/Button";
import ToastPopup from "../shared/Toast";

import useProjectVersionStore from "../../../store/projectVersion";
import useProjectStore from "../../../store/project";

import postMessage from "../../../utils/postMessage";
import getAllVersions from "../../../services/getAllVersions";
import figciLogo from "../../../../assets/logo_figci.png";
import onboarding from "../../../../assets/onboarding.png";

function Onboarding() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [projectInformation, setProjectInformation] = useState({});
  const [toast, setToast] = useState({});

  const { setVersion, clearVersion } = useProjectVersionStore();
  const { setProject } = useProjectStore();

  const handleMessage = async ev => {
    if (ev.data.pluginMessage.type === "GET_ACCESS_TOKEN") {
      const token = ev.data.pluginMessage.content;

      setProjectInformation(currentState => ({
        ...currentState,
        token,
      }));
    }

    if (ev.data.pluginMessage.type === "GET_PROJECT_KEY") {
      const projectKey = ev.data.pluginMessage.content;

      setProjectInformation(currentState => ({
        ...currentState,
        projectKey,
      }));
    }

    if (ev.data.pluginMessage.type === "GET_NEW_VERSION_ID") {
      const newVersionId = ev.data.pluginMessage.content;

      setProject({ afterVersionId: newVersionId.id });

      setIsLoading(false);

      navigate("/version");
    }
  };

  useEffect(() => {
    clearVersion();
  }, []);

  useEffect(() => {
    postMessage("GET_ACCESS_TOKEN");
    postMessage("GET_PROJECT_KEY");

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const handleClick = async ev => {
    ev.preventDefault();

    setIsLoading(true);

    const allVersions = await getAllVersions(
      projectInformation.projectKey,
      projectInformation.token,
    );

    if (allVersions.result === "error") {
      setIsLoading(false);

      setToast({ status: true, message: allVersions.message });

      return;
    }

    setVersion(allVersions.content);

    postMessage("GET_NEW_VERSION_ID");
  };

  return (
    <>
      {isLoading && (
        <Modal>
          <Loading
            title="버전 정보를 가져오고 있어요!"
            text={
              "이전 버전과 현재 버전을 저장하고 있어요.\\n버전을 받아오는 동안 잠깐만 기다려주세요."
            }
          />
        </Modal>
      )}
      <OnboardingContainer>
        <img className="logo" src={figciLogo} alt="figci-logo-img" />
        <Title>
          이전 버전만 선택하면 ✨
          <br />
          디자인된 화면의 변경사항을
          <br />
          모두 확인할 수 있어요!
        </Title>
        <ImgOnboarding src={onboarding} alt="onboarding" />
        <div className="button">
          <Button handleClick={handleClick} usingCase="solid" size="medium">
            좋아요!
          </Button>
        </div>
      </OnboardingContainer>
      {toast.status && (
        <ToastPopup setToast={setToast} message={toast.message} />
      )}
    </>
  );
}

const OnboardingContainer = styled.div`
  box-sizing: border-box;
  padding: auto;

  .logo {
    height: 20px;
    padding: 20px 24px;
  }

  .button {
    box-sizing: border-box;
    padding: 0px 24px 24px;

    background-color: #bab9fe;
  }
`;

const Title = styled.h1`
  padding: 0px 24px 6px;

  color: #000000;
  font-size: 22px;
  font-family: Noto Sans KR;
  font-weight: 900;
  line-height: 36px;
  letter-spacing: 0%;
`;

const ImgOnboarding = styled.img`
  box-sizing: border-box;
  width: 100%;
`;

export default Onboarding;

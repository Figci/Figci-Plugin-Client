import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import Button from "../shared/Button";

import figciLogo from "../../../../assets/logo_figci.png";
import onboarding from "../../../../assets/onboarding.png";

function Onboarding() {
  const navigate = useNavigate();

  const handleClick = async ev => {
    ev.preventDefault();

    navigate("/new");
  };

  return (
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

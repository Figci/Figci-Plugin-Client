import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import Container from "../shared/Container";
import Button from "../shared/Button";

import figciLogo from "../../../../assets/logo_figci.png";
import { openAuth, getToken } from "../../../services/getAuth";

function Onboarding() {
  const navigate = useNavigate();
  const [isClicked, setIsClicked] = useState(false);
  const [accessToken, setAccessToken] = useState("");

  const onLoginClick = ev => {
    ev.preventDefault();

    setIsClicked(true);
  };

  const getTokenPolling = () => {
    const pollingId = setInterval(async () => {
      const accessToken = await getToken();

      if (accessToken) {
        setAccessToken(accessToken);
        clearInterval(pollingId);
      }
    }, 2000);
  };

  useEffect(() => {
    if (isClicked) {
      openAuth();
      getTokenPolling();

      setIsClicked(false);
    }

    return;
  }, [isClicked]);

  useEffect(() => {
    if (accessToken) {
      window.parent.postMessage(
        {
          pluginMessage: {
            type: "SAVE_ACCESS_TOKEN",
            accessToken,
          },
        },
        "*",
      );

      navigate("/new");
    }
  }, [accessToken]);

  return (
    <Container>
      <LogoImage className="logo-icon" src={figciLogo} alt="figci-logo-icon" />
      <Description className="description">
        이전 버전과 현재 실행중인 프로젝트 버전과 비교해서
        <br />
        디자인 화면의 변경사항을 한눈에 보여드려요!
      </Description>
      <Button className="login-button" handleClick={onLoginClick} size="medium">
        로그인 하기
      </Button>
    </Container>
  );
}

const LogoImage = styled.img`
  width: 145px;
  margin-bottom: 24px;
`;

const Description = styled.span`
  display: block;
  margin-bottom: 36px;

  font-size: 1rem;
  color: #343e40;
  text-align: center;
  line-height: 24px;
`;

export default Onboarding;

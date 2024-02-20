import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import Description from "../shared/Description";
import Button from "../shared/Button";

function Difference() {
  const navigate = useNavigate();
  const [displayText, setDisplayText] = useState({
    text: "변경사항을 선택해주세요.",
    className: "default",
  });

  const processDifferences = ({ differenceInformation }) => {
    const NEW_NODE = "선택하신 이전 버전에는 존재하지 않는 노드입니다!";
    const NEW_FRAME = "선택하신 이전 버전에는 존재하지 않는 프레임입니다!";

    if (
      differenceInformation === NEW_NODE ||
      differenceInformation === NEW_FRAME
    ) {
      return { text: differenceInformation, className: "active" };
    }

    const modifiedInformation = JSON.parse(differenceInformation);
    let differenceTexts = "";

    for (const key in modifiedInformation) {
      differenceTexts += `${key}(변경)\n${modifiedInformation[key]}\n`;
    }

    return { text: differenceTexts, className: "active" };
  };

  const handleRectangleClick = ev => {
    if (ev.data.pluginMessage.type === "RENDER_DIFFERENCE_INFORMATION") {
      const differences = ev.data.pluginMessage.content;

      const differencesInformation = processDifferences(differences);

      setDisplayText(differencesInformation);
    }
  };

  useEffect(() => {
    window.addEventListener("message", handleRectangleClick);

    return () => {
      window.removeEventListener("message", handleRectangleClick);
    };
  }, []);

  return (
    <Content>
      <h1 className="title">디자인 변경 사항을 확인해 보세요! 👀</h1>
      <Description
        className="description"
        size="large"
        align="left"
        text="빨강/초록 영역을 선택하시면, 해당 영역에 있는 변경사항을\n자세하게 살펴볼 수 있어요."
      />
      <div className={`difference-area ${displayText.className}`}>
        {displayText.text}
      </div>
      <div className="button">
        <Button
          className="re-version"
          size="medium"
          usingCase="line"
          handleClick={ev => {
            ev.preventDefault();

            navigate("/version");
          }}
        >
          버전 재선택
        </Button>
      </div>
    </Content>
  );
}

const Content = styled.div`
  box-sizing: border-box;
  width: 100%;
  padding: 0px 24px;

  .title {
    margin-bottom: 4px;

    color: #000000;
    font-size: 1.125rem;
    line-height: 24px;
    text-align: left;
    font-weight: 800;
  }

  .difference-area {
    box-sizing: border-box;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 280px;
    margin-bottom: 24px;
    padding: 16px;
    border-radius: 8px;

    background-color: #f1f3f5;
    font-size: 0.875rem;
    line-height: 22px;
  }

  .difference-area.default {
    align-items: center;
    justify-content: center;

    color: #868e96;
    text-align: center;
  }

  .difference-area.active {
    color: #000000;
    text-align: left;

    white-space: pre;
  }

  .description {
    color: #868e96;
    margin-bottom: 24px;
  }

  .button {
    position: fixed;
    bottom: 24px;
  }
`;

export default Difference;

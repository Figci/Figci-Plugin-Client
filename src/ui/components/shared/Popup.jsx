import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import Modal from "./Modal";
import Description from "./Description";
import Button from "./Button";

function Popup({ title, text, path, buttonName, isOpenedPopup }) {
  const navigate = useNavigate();

  return (
    <Modal>
      <TextWrapper>
        <h1 className="title">{title}</h1>
        <Description size="medium" align="center" text={text} />
      </TextWrapper>
      <ButtonWrapper>
        <Button
          className="navigate-button"
          size="small"
          usingCase="solid"
          handleClick={ev => {
            ev.preventDefault();

            navigate(path);
          }}
        >
          {buttonName}
        </Button>
        <Button
          className="close-button"
          size="small"
          usingCase="line"
          handleClick={ev => {
            ev.preventDefault();

            isOpenedPopup(false);
          }}
        >
          No
        </Button>
      </ButtonWrapper>
    </Modal>
  );
}

const ButtonWrapper = styled.div`
  box-sizing: border-box;
  display: grid;
  grid-template-rows: repeat(2, 1fr);
  row-gap: 8px;
  padding: 0px 24px 12px;
`;

const TextWrapper = styled.div`
  box-sizing: border-box;
  width: 260px;
  margin: 24px;

  .title {
    margin-bottom: 8px;

    color: #000000;
    font-size: 1rem;
    font-weight: 900;
    font-style: normal;
    line-height: 24px;
    text-align: center;
  }
`;

export default Popup;

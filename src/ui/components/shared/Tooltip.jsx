import React from "react";
import styled from "styled-components";

import questionMark from "../../../../assets/question_mark.png";

function Tooltip({ message }) {
  return (
    <TooltipWrapper data-tooltip={message}>
      <TooltipIcon
        src={questionMark}
        alt="question-mark-icon"
        className="question-mark"
      />
    </TooltipWrapper>
  );
}

const TooltipWrapper = styled.div`
  position: relative;
  display: inline-block;
  cursor: pointer;

  &::after {
    content: attr(data-tooltip);
    position: absolute;
    z-index: 100;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);

    min-width: 200px;
    max-width: 300px;
    padding: 8px 12px;
    border-radius: 4px;

    background-color: rgba(0, 0, 0, 0.8);
    color: #ffffff;
    font-size: 0.75rem;
    font-weight: 500;
    opacity: 0;
    visibility: hidden;
    transition:
      opacity 0.2s ease-in-out,
      visibility 0.2s ease-in-out;
    white-space: break-spaces;
  }

  &:hover::after {
    opacity: 1;
    visibility: visible;
  }
`;

const TooltipIcon = styled.img`
  display: inline-block;
`;

export default Tooltip;

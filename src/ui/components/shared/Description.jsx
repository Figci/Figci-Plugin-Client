import React from "react";
import styled, { css } from "styled-components";
import { nanoid } from "nanoid";

const DESCRIPTION_SIZES = {
  medium: css`
    --description-font-size: 0.75rem;
    --description-line-height: 18px;
  `,
  large: css`
    --description-font-size: 0.875rem;
    --description-line-height: 22px;
  `,
};

const TEXT_ALIGN = {
  center: css`
    --description-text-align: center;
  `,
  left: css`
    --description-text-align: left;
  `,
};

function Description({ className, size, text, align }) {
  const descriptionSize = DESCRIPTION_SIZES[size];
  const textAlign = TEXT_ALIGN[align];

  return (
    <StyledSpan
      className={className}
      $descriptionSize={descriptionSize}
      $textAlign={textAlign}
    >
      {text.split("\\n").map(txt => (
        <React.Fragment key={nanoid(10)}>
          {txt}
          <br />
        </React.Fragment>
      ))}
    </StyledSpan>
  );
}

const StyledSpan = styled.span`
  ${props => props.$descriptionSize}
  ${props => props.$textAlign}

  display: block;

  color: #495057;
  font-size: var(--description-font-size);
  text-align: var(--description-text-align);
  font-family: "Noto Sans KR";
  font-style: normal;
  font-weight: 500;
  line-height: var(--description-line-height);
`;

export default Description;

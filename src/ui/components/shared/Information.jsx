import React from "react";
import styled from "styled-components";

function Information({ text, children }) {
  return (
    <InformationWrapper>
      <h1 className="text">{text}</h1>
      {children}
    </InformationWrapper>
  );
}

const InformationWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  padding: 20px;
  border-radius: 4px;

  background-color: #f1f3f5;
  color: #495057;
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 16px;

  .text {
    margin-bottom: 12px;
  }
`;

export default Information;

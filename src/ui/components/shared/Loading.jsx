import styled, { keyframes } from "styled-components";
import Description from "./Description";

function Loading({ title, text }) {
  return (
    <Wrapper>
      <Circle />
      <TextWrapper>
        <h1 className="title">{title}</h1>
        <Description
          className="description"
          size="medium"
          align="center"
          text={text}
        />
      </TextWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 280px;
  height: 200px;
`;

const TextWrapper = styled.div`
  padding: 20px;

  .title {
    margin-top: 4px;
    margin-bottom: 8px;

    color: #000000;
    text-align: center;
    font-size: 1rem;
    font-style: normal;
    font-weight: 800;
    line-height: 24px;
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const Circle = styled.div`
  animation: ${rotate} 1.5s linear infinite;

  width: 56px;
  height: 56px;
  border-radius: 100%;
  border-top: 4px solid #ced4da;
  border-right: 4px solid #ced4da;
  border-bottom: 4px solid #ced4da;
  border-left: 4px solid #2623fb;

  background-color: transparent;
`;

export default Loading;

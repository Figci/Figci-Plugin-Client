import { useState } from "react";
import styled from "styled-components";

import Button from "../shared/Button";
import Description from "../shared/Description";
import ToastPopup from "../shared/Toast";

import useProjectStore from "../../../store/project";
import useProjectVersionStore from "../../../store/projectVersion";

function ProjectVersion() {
  const [toast, setToast] = useState({});

  const { project, setProject, clearProject } = useProjectStore();
  const { byDates, allDates } = useProjectVersionStore();

  const handleChange = () => {};
  const handleClick = () => {};

  return (
    <>
      <ContentsWrapper>
        <div>
          <h1 className="step">STEP 02</h1>
          <h1 className="title">
            현재 버전과 비교할 <br />
            이전 버전을 선택해 주세요.
          </h1>
        </div>
        <form>
          <label htmlFor="beforeVersion">
            이전 버전 선택
            <select className="beforeDate" onChange={handleChange}>
              <option value="" disabled selected>
                날짜 선택
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
                버전 선택
              </option>
            </select>
            <Description
              className="description"
              size="medium"
              align="left"
              text="지정한 버전 명이 없으면 시간으로 보여요!"
            />
          </label>
          <div className="buttons">
            <Button
              handleClick={handleClick}
              usingCase="line"
              size="small"
              className="prev"
            >
              이전
            </Button>
            <Button
              handleClick={handleClick}
              usingCase="solid"
              size="small"
              className="next"
            >
              다음
            </Button>
          </div>
        </form>
      </ContentsWrapper>
      {toast.status && (
        <ToastPopup setToast={setToast} message={toast.message} />
      )}
    </>
  );
}

const ContentsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 24px;

  .step {
    color: #2623fb;
    font-size: 1.125rem;
    line-height: 24px;
    text-align: left;
    font-weight: 800;
  }

  .title {
    margin-bottom: 48px;

    color: #000000;
    font-size: 1.125rem;
    line-height: 24px;
    text-align: left;
    font-weight: 800;
  }

  form {
    width: 100%;
    height: 100%;
  }

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
  }

  .description {
    margin-top: 12px;

    color: #868e96;
  }
`;

export default ProjectVersion;

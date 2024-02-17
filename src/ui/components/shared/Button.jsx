import styled, { css } from "styled-components";

const BUTTON_SIZES = {
  small: css`
    --button-min-width: 150px;
    --button-min-height: 45px;
    --button-font-size: 0.815rem;
    --button-font-weight: 700;
    --button-padding: 12px 24px;
    --button-border: 1px solid #000000;
    --button-radius: 4px;
  `,
  medium: css`
    --button-min-width: 350px;
    --button-min-height: 45px;
    --button-font-size: 0.875rem;
    --button-padding: 12px 24px;
    --button-border: 1px solid #000000;
    --button-radius: 4px;
  `,
};

const USING_CASES = {
  solid: css`
    --button-color: #ffffff;
    --button-background-color: #000000;
  `,
  line: css`
    --button-color: #000000;
    --button-background-color: #ffffff;
  `,
};

function Button({
  className,
  handleClick,
  disabled,
  size,
  usingCase,
  children,
}) {
  const buttonStyle = BUTTON_SIZES[size];
  const buttonMode = USING_CASES[usingCase];

  return (
    <StyledButton
      className={className}
      onClick={handleClick}
      disabled={disabled}
      $buttonStyle={buttonStyle}
      $usedAt={buttonMode}
    >
      {children}
    </StyledButton>
  );
}

const StyledButton = styled.button`
  ${props => props.$buttonStyle}
  ${props => props.$usedAt}

  min-width: var(--button-min-width);
  min-height: var(--button-min-height);
  margin: 0;
  padding: var(--button-padding, 12px 16px);
  border: var(--button-border);
  border-radius: var(--button-radius, 8px);

  font-size: var(--button-font-size, 1rem);
  font-weight: var(--button-font-weight, 600);
  color: var(--button-color, #ffffff);
  background-color: var(--button-background-color, #2623fb);
  cursor: pointer;

  &:disabled {
    cursor: default;
    opacity: 0.5;
    background-color: var(--button-background-color, #adb5bd);
  }
`;

export default Button;

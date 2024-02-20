import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import figciLogo from "../../../../assets/logo_figci.png";

function Header() {
  return (
    <HeadWrapper>
      <Link to="/">
        <img className="logo" src={figciLogo} alt="figci-logo-img" />
      </Link>
    </HeadWrapper>
  );
}

const HeadWrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding: 24px;

  .logo {
    height: 20px;
  }
`;

export default Header;

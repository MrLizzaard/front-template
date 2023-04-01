import styled from "styled-components";

export const MainpageWrapper = styled.div`
  position: absolute;
  background: grey;
  top: calc(${(props) => props.theme.navbarHeight} + ${(props) => props.theme.subHeaderHeight});
  left: ${(props) => props.theme.sidebarWidth};
  width: calc(100vw - ${(props) => props.theme.sidebarWidth});
  height: calc(100vh - ${(props) => props.theme.navbarHeight} - ${(props) => props.theme.subHeaderHeight});
`;

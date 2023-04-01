import styled from "styled-components";

export const SubHeaderWrapper = styled.div`
  position: absolute;
  background: brown;
  top: ${(props) => props.theme.navbarHeight};
  left: ${(props) => props.theme.sidebarWidth};
  width: calc(100vw - ${(props) => props.theme.sidebarWidth});
  height: calc(${(props) => props.theme.subHeaderHeight});
`;

import styled from "styled-components";

export const SidebarWrapper = styled.div`
  background: blue;
  width: ${(props) => props.theme.sidebarWidth};
  height: calc(100vh - ${(props) => props.theme.navbarHeight});
`;

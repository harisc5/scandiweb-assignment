import styled from "styled-components";

export const StyledOverlay = styled.div`
  position:fixed;
  left:0;
  top:0;
  width:100vw;
  height:100vh;
  background-color:#000;
  opacity:0.5;
`;

export const ImageWrapper = styled.div`
  margin-right: 5px;
  &:hover {
    cursor: pointer;
  }
;`

export const TextCenter = styled.div`
  text-align: center;
`;

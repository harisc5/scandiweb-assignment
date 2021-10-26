import styled from "styled-components";

export const StyledOverlay = styled.div`
  position:fixed;
  left:0;
  top:0;
  width:100vw;
  height:100vh;
  background: rgba(57, 55, 72, 0.22);
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

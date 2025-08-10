import React, { useState } from "react";
import styled from "styled-components";

export default function ImageSwitcher({ img1, img2, title1, title2 }) {
  const [showAlt, setShowAlt] = useState(false);

  return (
    <Wrapper onClick={() => setShowAlt(!showAlt)}>
      <Title>{showAlt ? title2 : title1}</Title>
      <Image src={img1} alt="Image 1" visible={!showAlt} />
      <Image src={img2} alt="Image 2" visible={showAlt} />
      <Hint>click to change photo</Hint>
    </Wrapper>
  );
}

const Title = styled.div`
  position: absolute;
  top: 8px;
  left: 8px;
  color: #fff;
  background: rgba(0, 0, 0, 0.6);
  padding: 4px 8px;
  border-radius: 4px;
  z-index: 2;
  user-select: none;
  pointer-events: none;
`;

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 500px;
  cursor: pointer;
  overflow: hidden;
  margin-bottom: 1.45rem;

  @media (max-width: 640px) {
    height: auto;
    padding-top: 130%;
  }
`;

const Image = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 2px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
  transition: opacity 0.5s ease-in-out;
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  pointer-events: none;
  user-select: none;
`;

const Hint = styled.div`
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  pointer-events: none;
`;

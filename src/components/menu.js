import React, { useState, useCallback } from "react";
import styled from "styled-components";
import { Link } from "gatsby";
import { useTranslation } from "react-i18next";
import { scroller } from "react-scroll";

export function useToggle(initialState = false) {
  const [state, setState] = useState(initialState);
  const toggle = useCallback(() => setState((s) => !s), []);
  return [state, toggle];
}

const StyledMenu = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 0;
  background: none;
  border: none;

  @media (max-width: 960px) {
    font-size: 1.5rem;
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    padding: 0;
  }
`;

const StyledMenuTitle = styled.span`
  font-size: 1.15rem;
  font-weight: 400;
  padding: 0 0 0.2rem;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.grey7};
  }

  a:focus {
    opacity: 0.5;
  }

  @media (max-width: 960px) {
    margin-bottom: 1rem;
    user-select: none;
  }

  transition: transform 0.45s cubic-bezier(0.19, 1, 0.22, 1);
`;

const StyledLinkBase = `
  white-space: nowrap;
  display: block;
  width: 100%;
  margin: 0.25rem 0;
  padding: 0;
  text-decoration: none;
  cursor: pointer;
  position: relative;
  color: inherit;

  &::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -2px;
    height: 2px;
    width: 0%;
    background: currentColor;
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 100%;
  }

  &:focus {
    outline: 0;
    opacity: 0.9;
  }
`;

const StyledInternalLink = styled(Link)`
  ${StyledLinkBase}
`;

const StyledExternalLink = styled.a`
  ${StyledLinkBase}
`;

const StyledScrollLink = styled.div`
  ${StyledLinkBase}
`;

const isExternal = (url) => {
  try {
    const linkUrl = new URL(url, window.location.origin);
    return linkUrl.origin !== window.location.origin;
  } catch {
    return false;
  }
};

export default function Menu({ data, onClick }) {
  const { t } = useTranslation();

  const scrollToBottom = () => {
    setTimeout(() => {
      scroller.scrollTo("kontakt", {
        duration: 1000,
        smooth: true,
        offset: -57,
      });
    }, 100);
  };

  const content = data.link ? (
    isExternal(data.link) ? (
      <StyledExternalLink
        href={data.link}
        target={data.target}
        onClick={() => {
          if (onClick) onClick();
        }}
      >
        {t(data.name)}
      </StyledExternalLink>
    ) : (
      <StyledInternalLink
        to={data.link}
        target={data.target}
        onClick={() => {
          if (onClick) onClick();
        }}
      >
        {t(data.name)}
      </StyledInternalLink>
    )
  ) : (
    <StyledScrollLink
      onClick={() => {
        if (onClick) onClick();
        scrollToBottom();
      }}
    >
      {t(data.name)}
    </StyledScrollLink>
  );

  return (
    <StyledMenu tabIndex={0}>
      {/* <StyledMenuTitle>{content}</StyledMenuTitle> */}
    </StyledMenu>
  );
}

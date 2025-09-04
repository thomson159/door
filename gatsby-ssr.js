import React from "react";
export { wrapRootElement } from "./src/apollo/wrapper";

const MagicScriptTag = () => {
  const colorModeScript = `
    (function() {
      function getInitialColorMode() {
        const persistedColorPreference = window.localStorage.getItem('color-mode');
        const hasPersistedPreference = typeof persistedColorPreference === 'string';
        if (hasPersistedPreference) {
          return persistedColorPreference;
        }
        const mql = window.matchMedia('(prefers-color-scheme: dark)');
        const hasMediaQueryPreference = typeof mql.matches === 'boolean';
        if (hasMediaQueryPreference) {
          return mql.matches ? 'dark' : 'light';
        }
        return 'light';
      }

      const colorMode = getInitialColorMode();
      const root = document.documentElement;
      root.style.setProperty('--initial-color-mode', colorMode);
    })();



    new InPostGeoWidget({
      element: "inpost-widget",
      language: "pl",
      config: { layout: "search" },
      onSelect: function(point) {
        console.log(point);
      }
    });
  `;

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: colorModeScript }} />

      <script
        src="https://geowidget.inpost.pl/inpost-geowidget.js"
        async
      ></script>
    </>
  );
};

export const onRenderBody = ({ setPreBodyComponents }) => {
  setPreBodyComponents([<MagicScriptTag key="magic-scripts" />]);
};

import React, { useEffect } from "react";

const InPostWidget = ({ form, setForm }) => {
  // useEffect(() => {
  //   if (typeof window === "undefined") return;
  //   if (form.deliveryMethod !== "PACZKOMAT") return;

  //   const initWidget = () => {
  //     if (!window.InPostGeoWidget) {
  //       console.warn("InPostGeoWidget not loaded yet");
  //       return;
  //     }

  //     new window.InPostGeoWidget({
  //       element: "inpost-widget",
  //       language: "pl",
  //       config: { layout: "search" },
  //       onSelect: (point) => {
  //         setForm((prev) => ({
  //           ...prev,
  //           locker: {
  //             name: point.name,
  //             address: point.address.line1,
  //             city: point.address.city,
  //             zip: point.address.post_code,
  //             locationDescription: point.description || "",
  //           },
  //         }));
  //       },
  //     });
  //     console.log("Widget InPost zainicjowany.");
  //   };

  //   if (window.InPostGeoWidget) {
  //     initWidget();
  //   } else {
  //     const interval = setInterval(() => {
  //       if (window.InPostGeoWidget) {
  //         clearInterval(interval);
  //         initWidget();
  //       }
  //     }, 100);
  //   }
  // }, [form.deliveryMethod, setForm]);

  return (
    <div id="inpost-widget" style={{ width: "100%", height: "200px" }}></div>
  );
};

export default InPostWidget;

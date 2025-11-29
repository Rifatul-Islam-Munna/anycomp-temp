import ServicePage from "@/components/Specialist/ServicePage";
import React, { Suspense } from "react";

const page = () => {
  return (
    <Suspense>
      <ServicePage />{" "}
    </Suspense>
  );
};

export default page;

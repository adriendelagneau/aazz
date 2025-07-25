import Link from "next/link";
import React from "react";

const Title = () => {
  return (
    <div className="mb-16 w-full text-center mt-6">
      <Link href={"/"}>
        <h1 className="font-poppins text-4xl sm:text-5xl lg:text-6xl xl:text-7xl">La voie de l&apos;info</h1>
        <p className="text-md  lg:text-lg xl:text-xl font-semibold opacity-60 mt-1 lg:mt-2">
          Votre repère dans l’actualité.
        </p>
      </Link>
    </div>
  );
};

export default Title;

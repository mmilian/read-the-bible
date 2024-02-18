"use client";
import React, { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import Link from "next/link";

const HamburgerMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn"
        data-variant="outline"
      >
        {isOpen ? <FiX size={25} /> : <FiMenu size={25} />}
      </button>
      {isOpen && (
        <div className="menuLayer">
          <ul>
            <li>
              <Link href="/pages/intro">Wprowadzenie</Link>
            </li>
            <li>
              <Link href="/pages/issue">Zgłoś problem</Link>
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

export default HamburgerMenu;

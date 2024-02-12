"use client";
import React, { useState } from 'react';
import { FiMenu } from 'react-icons/fi';
import Link from 'next/link';

const HamburgerMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div>
      <FiMenu onClick={() => setIsOpen(!isOpen)} style={{ cursor: 'pointer' }} />
      {isOpen && (
        <div style={{ position: 'absolute', top: '100%', right: 0, backgroundColor: 'white', padding: '10px' }}>
          <Link href="/pages/intro">Wprowadzenie</Link>
          <br />
          <Link href="/pages/issue">Zgłoś problem</Link>
        </div>
      )}
    </div>
  );
};

export default HamburgerMenu;
import React from "react";

const BacteriaIcon = ({ className = "", ...props }) => (
  <svg
    viewBox="0 0 256 256"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path d="M16 128C16 56.5482 56.5482 16 128 16C199.452 16 240 56.5482 240 128C240 199.452 199.452 240 128 240C56.5482 240 16 199.452 16 128Z" stroke="currentColor" strokeWidth="24"/>
    <circle cx="88" cy="88" r="24" stroke="currentColor" strokeWidth="24"/>
    <circle cx="168" cy="168" r="24" stroke="currentColor" strokeWidth="24"/>
    <circle cx="128" cy="128" r="16" stroke="currentColor" strokeWidth="24"/>
    <path d="M128 16V0" stroke="currentColor" strokeWidth="24"/>
    <path d="M128 256V240" stroke="currentColor" strokeWidth="24"/>
    <path d="M16 128H0" stroke="currentColor" strokeWidth="24"/>
    <path d="M256 128H240" stroke="currentColor" strokeWidth="24"/>
    <path d="M45.2548 45.2548L33.9411 33.9411" stroke="currentColor" strokeWidth="24"/>
    <path d="M210.745 210.745L222.059 222.059" stroke="currentColor" strokeWidth="24"/>
    <path d="M45.2548 210.745L33.9411 222.059" stroke="currentColor" strokeWidth="24"/>
    <path d="M210.745 45.2548L222.059 33.9411" stroke="currentColor" strokeWidth="24"/>
  </svg>
);

export default BacteriaIcon; 
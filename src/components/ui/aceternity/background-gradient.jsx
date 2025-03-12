"use client";
import React from "react";
import { motion } from "framer-motion";

export const BackgroundGradient = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`relative group/card ${className}`}
      {...props}
    >
      <div className="absolute -inset-px bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl blur-lg opacity-75 group-hover/card:opacity-100 transition duration-500" />
      <div className="relative bg-zinc-900 rounded-xl p-4">
        {children}
      </div>
    </div>
  );
};
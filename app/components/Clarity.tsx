"use client";

import { useEffect } from "react";
import Clarity from "@microsoft/clarity";

export default function ClarityProvider() {
  useEffect(() => {
    Clarity.init("x9lai623ed");
  }, []);

  return null;
}
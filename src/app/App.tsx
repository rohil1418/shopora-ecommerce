import { MotionConfig } from "motion/react";
import { Navbar } from "../features/navbar";
import HomePage from "../pages/HomePage";

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Navbar />
      <HomePage />
    </MotionConfig>
  );
}
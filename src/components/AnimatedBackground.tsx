import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

type AnimatedBackgroundProps = HTMLMotionProps<"div"> & {
  children: React.ReactNode;
};

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  children,
  style,
  ...rest
}) => (
  <motion.div
    initial={{ backgroundPosition: "0% 50%" }}
    animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
    transition={{ duration: 10, repeat: Infinity }}
    style={{
      minHeight: "100vh",
      backgroundImage:
        "linear-gradient(120deg, #ffafbd, #ffc3a0, #2193b0, #6dd5ed)",
      backgroundSize: "200% 200%",
      ...style,
    }}
    {...rest}
  >
    {children}
  </motion.div>
);

export default AnimatedBackground;

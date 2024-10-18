import { useEffect, useState } from "react";

export default function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState("up");

  useEffect(() => {
    let prevScrollPosition = window.scrollY;

    const onScroll = () => {
      const currentScrollPosition = window.scrollY;
      if (prevScrollPosition > currentScrollPosition) {
        setScrollDirection("up");
      } else {
        setScrollDirection("down");
      }
      prevScrollPosition = currentScrollPosition;
    };

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollDirection]);

  return scrollDirection;
}

import React, { useEffect, useState } from "react";
import { Bounce, toast } from "react-toastify";

export default function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isPrompted, setIsPrompted] = useState(false);

  useEffect(() => {
    if (typeof navigator === "undefined") return;

    const userAgent = navigator.userAgent || navigator.vendor;
    const isAppleDevice = /iPad|iPhone|iPod/.test(userAgent);
    const isTouchMac =
      /Macintosh/.test(navigator.platform) && navigator.maxTouchPoints > 1;

    if (isAppleDevice || isTouchMac) {
      setIsIOS(true);
    }
  }, []);

  if (isIOS && !isPrompted) {
    toast.info("📲 Tap the Share icon and then 'Add to Home Screen'", {
      position: "top-right",
      autoClose: false,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce
    });
    setIsPrompted(true);
  }

  return null;
}

import { useEffect } from "react";
import { useProgress } from "@/lib/progress";

export function ProgressHydrate() {
  useEffect(() => {
    void useProgress.persist.rehydrate();
  }, []);
  return null;
}

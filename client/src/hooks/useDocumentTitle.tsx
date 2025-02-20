import { useEffect } from "react";

export default function useDocumentTitle(title: string, appendTitle = true) {
  useEffect(() => {
    document.title = title + (appendTitle ? " | Quizz Universe" : "");
  }, [title]);
}

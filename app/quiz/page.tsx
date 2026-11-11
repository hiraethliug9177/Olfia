import type { Metadata } from "next";
import { Quiz } from "@/components/quiz/Quiz";

export const metadata: Metadata = { title: "Scent quiz" };

/** The quiz and the person's own result. Other personalities are not shown (Tiffany 11/10). */
export default function QuizPage() {
  return (
    <div className="wrap page">
      <Quiz />
    </div>
  );
}

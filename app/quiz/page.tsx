import type { Metadata } from "next";
import { Quiz } from "@/components/quiz/Quiz";

export const metadata: Metadata = { title: "Scent quiz" };

export default function QuizPage() {
  return (
    <div className="wrap page">
      <Quiz />
    </div>
  );
}

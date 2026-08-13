import { createFileRoute } from "@tanstack/react-router";
import { LessonPlay } from "@/components/lesson-play";

export const Route = createFileRoute("/lekcija/$id")({
  component: LessonPage,
});

function LessonPage() {
  const { id } = Route.useParams();
  return <LessonPlay id={id} />;
}

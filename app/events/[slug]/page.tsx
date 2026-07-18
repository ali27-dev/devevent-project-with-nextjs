import EventDetails from "@/app/components/EventDetails";
import { Suspense } from "react";

const EventDetailsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
<<<<<<< Updated upstream
}) {
  const { slug } = await params;

  const request = await fetch(`${BASE_URL}/api/events/${slug}`);

  const {
    event: {
      description,
      image,
      title,
      location,
      date,
      time,
      mode,
      agenda,
      audience,
      overview,
      tags,
      organizer,
    },
  } = await request.json();

  if (!description) return notFound();

  const similarEvents: IEvent[] = await getSimilarEventBySlug(slug);
=======
}) => {
  const slug = params.then((p) => p.slug);
>>>>>>> Stashed changes

  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <EventDetails params={slug} />
      </Suspense>
    </main>
  );
};
export default EventDetailsPage;

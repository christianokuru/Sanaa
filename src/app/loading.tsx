import { Container } from "@/components/ui/Container";
import { CourseCardSkeleton, Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <Container className="pt-8">
      <Skeleton className="h-10 w-64 rounded-lg" />
      <div className="mt-8 grid grid-cols-1 gap-6 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => <CourseCardSkeleton key={i} />)}
      </div>
    </Container>
  );
}

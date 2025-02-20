import { Suspense } from "react";
import UserLayout from "@layouts/UserLayout";
import Loading from "@/pages/common/Loading";

export default function UserRouteWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserLayout>
      <Suspense fallback={<Loading />}>{children}</Suspense>
    </UserLayout>
  );
}

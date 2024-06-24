import { Card, Skeleton } from '@nextui-org/react';

export function TableLoadingSkeleton() {
  return (
    <div className="w-full h-4/5 rounded-md">
      <Card className="w-5/4 space-y-5 p-4" radius="lg">
        <Skeleton className="rounded-lg">
          <div className="h-8 rounded-lg bg-default-300"></div>
        </Skeleton>
        <div className="space-y-3">
          {[...Array(5)].map((value, index) => (
            <Skeleton className="rounded-lg" key={index}>
              <div className="h-3 rounded-lg bg-default-200"></div>
            </Skeleton>
          ))}
        </div>
      </Card>
    </div>
  );
}

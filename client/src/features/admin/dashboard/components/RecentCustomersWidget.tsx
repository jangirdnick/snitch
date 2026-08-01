import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { UserResponseDto } from '@snitch/types';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

interface Props {
  customers: UserResponseDto[];
}

export function RecentCustomersWidget({ customers }: Props) {
  return (
    <Card className="col-span-1 flex flex-col h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              New Customers
            </CardTitle>
            <CardDescription>Latest registered users</CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="h-8" asChild>
            <Link to="/admin/customers">View All</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        <div className="space-y-6">
          {customers.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground py-4">
              No recent customers
            </div>
          ) : (
            customers.map((customer) => (
              <div key={customer.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={customer.avatar || ''} alt={customer.firstName} />
                    <AvatarFallback className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400">
                      {customer.firstName.charAt(0).toUpperCase()}
                      {customer.lastName?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium leading-none">
                      {customer.firstName} {customer.lastName}
                    </span>
                    <span className="text-xs text-muted-foreground mt-1 truncate max-w-[150px]">
                      {customer.email}
                    </span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {dayjs(customer.createdAt).fromNow()}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

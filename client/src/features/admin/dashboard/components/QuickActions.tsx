import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PackagePlus, TicketPlus, LineChart, PackageSearch } from 'lucide-react';
import { Link } from 'react-router';

export function QuickActions() {
  const actions = [
    {
      title: 'Add Product',
      icon: PackagePlus,
      href: '/admin/inventory',
      color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400',
    },
    {
      title: 'Create Coupon',
      icon: TicketPlus,
      href: '/admin/coupons',
      color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400',
    },
    {
      title: 'View Orders',
      icon: PackageSearch,
      href: '/admin/orders',
      color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-400',
    },
    {
      title: 'Analytics',
      icon: LineChart,
      href: '/admin/analytics',
      color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400',
    },
  ];

  return (
    <Card className="col-span-1 lg:col-span-1 flex flex-col h-full bg-gradient-to-br from-card to-card/50">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
        <CardDescription>Common administrative tasks</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <Button
            key={action.title}
            variant="outline"
            className="h-auto flex-col gap-2 py-4 shadow-sm hover:border-primary/30 hover:bg-muted/50 transition-all"
            asChild
          >
            <Link to={action.href}>
              <div className={`p-2 rounded-full ${action.color}`}>
                <action.icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium">{action.title}</span>
            </Link>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}

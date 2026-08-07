import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Product } from '@snitch/types';

export default function ProductTabs({ product }: { product: Product }) {
  return (
    <div className="mt-12">
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent overflow-x-auto no-scrollbar">
          <TabsTrigger
            value="description"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
          >
            Description
          </TabsTrigger>
          <TabsTrigger
            value="specifications"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
          >
            Specifications
          </TabsTrigger>
          <TabsTrigger
            value="shipping"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
          >
            Shipping & Returns
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="description"
          className="pt-6 prose dark:prose-invert max-w-none text-muted-foreground text-sm"
        >
          <div dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, '<br/>') }} />
        </TabsContent>

        <TabsContent value="specifications" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
            {product.fabric && (
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Fabric</span>
                <span className="font-medium">{product.fabric}</span>
              </div>
            )}
            {product.fit && (
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Fit</span>
                <span className="font-medium capitalize">{product.fit.replace('_', ' ')}</span>
              </div>
            )}
            {product.pattern && (
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Pattern</span>
                <span className="font-medium capitalize">{product.pattern.replace('_', ' ')}</span>
              </div>
            )}
            {product.neckType && (
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Neck Type</span>
                <span className="font-medium capitalize">{product.neckType.replace('_', ' ')}</span>
              </div>
            )}
            {product.sleeveType && (
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Sleeve Type</span>
                <span className="font-medium capitalize">
                  {product.sleeveType.replace('_', ' ')}
                </span>
              </div>
            )}
            {product.countryOfOrigin && (
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Country of Origin</span>
                <span className="font-medium">{product.countryOfOrigin}</span>
              </div>
            )}
            {product.careInstructions && product.careInstructions.length > 0 && (
              <div className="col-span-1 md:col-span-2 mt-4 p-4 bg-muted/50 rounded-lg">
                <span className="font-medium block mb-2">Care Instructions</span>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  {product.careInstructions.map((instruction: string, idx: number) => (
                    <li key={idx}>{instruction}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="shipping" className="pt-6 text-sm text-muted-foreground space-y-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium text-foreground mb-1">Free Shipping</h4>
            <p>
              We offer free standard shipping on all orders over ₹2000. Orders are typically
              processed within 1-2 business days.
            </p>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium text-foreground mb-1">Express Delivery</h4>
            <p>
              Need it sooner? Select Express Shipping at checkout for delivery within 1-2 business
              days for an additional fee.
            </p>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium text-foreground mb-1">Easy Returns</h4>
            <p>
              We accept returns within 15 days of delivery. Items must be unworn, unwashed, and have
              original tags attached.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

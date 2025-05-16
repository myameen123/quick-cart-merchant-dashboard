/* eslint-disable import/order */
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Custom from "./_components/Custom";
import Aggressive from "./_components/Aggressive";
import Balanced from "./_components/Balanced";
import Conservative from "./_components/Conservative";

function Checkout() {
  return (
    <div className="p-6">
    <Tabs defaultValue="aggressive"  >
  <TabsList className="space-x-12 ">
    <TabsTrigger value="aggressive">Aggresive</TabsTrigger>
    <TabsTrigger value="balanced">Balanced</TabsTrigger>
    <TabsTrigger value="conservative">Conservative</TabsTrigger>
    <TabsTrigger value="custom">Custom (Live)</TabsTrigger>
  </TabsList>
 <TabsContent value="aggressive">
          <Aggressive />
        </TabsContent>
        <TabsContent value="balanced">
          <Balanced />
        </TabsContent>
        <TabsContent value="conservative">
          <Conservative />
        </TabsContent>
  <TabsContent value="custom" className=""> <Custom/> </TabsContent>
</Tabs>

    </div>
  )
}

export default Checkout
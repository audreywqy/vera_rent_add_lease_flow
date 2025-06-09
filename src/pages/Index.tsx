
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import AddLeaseWizard from "@/components/AddLeaseWizard";

const Index = () => {
  const [showAddLease, setShowAddLease] = useState(false);
  
  const existingLeases = [
    {
      id: 1,
      tenant: "Sunshine Yoga Studio",
      unit: "11730",
      sqft: "950 sq ft",
      rent: "$2,850",
      startDate: "2023-01-15",
      endDate: "2025-01-14",
      status: "Active"
    },
    {
      id: 2,
      tenant: "Corner Coffee Shop",
      unit: "11740",
      sqft: "650 sq ft", 
      rent: "$2,200",
      startDate: "2022-06-01",
      endDate: "2025-05-31",
      status: "Active"
    }
  ];

  if (showAddLease) {
    return (
      <AddLeaseWizard 
        onClose={() => setShowAddLease(false)}
        propertyName="Totem Square II Shopping Center"
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Property Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Totem Square II Shopping Center</h1>
              <p className="text-slate-600 mt-1">15200 Shady Grove Rd, Rockville, MD 20850</p>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Active Property
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-slate-900">24</div>
                <div className="text-sm text-slate-600">Total Units</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-slate-900">22</div>
                <div className="text-sm text-slate-600">Occupied Units</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-slate-900">92%</div>
                <div className="text-sm text-slate-600">Occupancy Rate</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-slate-900">$42,850</div>
                <div className="text-sm text-slate-600">Monthly Revenue</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Property Details Tabs */}
        <Tabs defaultValue="leases" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="leases">Leases</TabsTrigger>
            <TabsTrigger value="units">Units</TabsTrigger>
            <TabsTrigger value="financials">Financials</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="leases" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Active Leases</CardTitle>
                  <Button 
                    onClick={() => setShowAddLease(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    + Add New Lease
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {existingLeases.map((lease) => (
                    <div key={lease.id} className="border rounded-lg p-4 hover:bg-slate-50 transition-colors">
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                        <div>
                          <div className="font-semibold text-slate-900">{lease.tenant}</div>
                          <div className="text-sm text-slate-600">Unit {lease.unit}</div>
                        </div>
                        <div className="text-sm text-slate-600">{lease.sqft}</div>
                        <div className="font-semibold text-slate-900">{lease.rent}/mo</div>
                        <div className="text-sm text-slate-600">
                          {lease.startDate} - {lease.endDate}
                        </div>
                        <div>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            {lease.status}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">View</Button>
                          <Button variant="outline" size="sm">Edit</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Property Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">Property overview content would go here...</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="units">
            <Card>
              <CardHeader>
                <CardTitle>Units</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">Units management content would go here...</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="financials">
            <Card>
              <CardHeader>
                <CardTitle>Financials</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">Financial reports would go here...</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="maintenance">
            <Card>
              <CardHeader>
                <CardTitle>Maintenance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">Maintenance requests would go here...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;

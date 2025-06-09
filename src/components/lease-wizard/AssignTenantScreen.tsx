
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import { LeaseData } from "../AddLeaseWizard";

interface AssignTenantScreenProps {
  leaseData: LeaseData;
  updateLeaseData: (data: Partial<LeaseData>) => void;
}

const AssignTenantScreen = ({ leaseData, updateLeaseData }: AssignTenantScreenProps) => {
  const [selectionType, setSelectionType] = useState("existing");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock existing tenants data
  const existingTenants = [
    {
      id: "1",
      name: "Karin Kirkland School of Dance, LLC",
      contact: "Karine Melikyan",
      email: "karine@danceacademy.com",
      phone: "(555) 123-4567"
    },
    {
      id: "2", 
      name: "Bright Minds Learning Center",
      contact: "Sarah Johnson",
      email: "sarah@brightminds.com",
      phone: "(555) 987-6543"
    },
    {
      id: "3",
      name: "Tech Solutions Inc.",
      contact: "Michael Chen",
      email: "mike@techsolutions.com", 
      phone: "(555) 456-7890"
    }
  ];

  const filteredTenants = existingTenants.filter(tenant =>
    tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.contact.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTenantSelect = (tenant: typeof existingTenants[0]) => {
    updateLeaseData({
      selectedTenant: tenant,
      newTenant: undefined
    });
  };

  const handleNewTenantChange = (field: string, value: string) => {
    updateLeaseData({
      newTenant: {
        ...leaseData.newTenant,
        [field]: value
      } as any,
      selectedTenant: undefined
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Assign a Tenant</h2>
        <p className="text-slate-600">Connect this lease to a tenant by selecting an existing one or creating a new tenant record.</p>
      </div>

      <RadioGroup
        value={selectionType}
        onValueChange={setSelectionType}
        className="space-y-6"
      >
        {/* Select Existing Tenant */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="existing" id="existing" />
            <Label htmlFor="existing" className="text-base font-medium">
              Select an Existing Tenant
            </Label>
          </div>
          
          {selectionType === "existing" && (
            <div className="ml-6 space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search tenants by name or contact person..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Tenants List */}
              <div className="grid gap-3">
                {filteredTenants.map((tenant) => (
                  <Card
                    key={tenant.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      leaseData.selectedTenant?.id === tenant.id
                        ? 'ring-2 ring-blue-500 bg-blue-50'
                        : 'hover:bg-slate-50'
                    }`}
                    onClick={() => handleTenantSelect(tenant)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-slate-900">{tenant.name}</div>
                          <div className="text-sm text-slate-600">{tenant.contact}</div>
                          <div className="text-sm text-slate-500">{tenant.email} • {tenant.phone}</div>
                        </div>
                        {leaseData.selectedTenant?.id === tenant.id && (
                          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Create New Tenant */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="new" id="new" />
            <Label htmlFor="new" className="text-base font-medium">
              Create a New Tenant
            </Label>
          </div>
          
          {selectionType === "new" && (
            <div className="ml-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tenant Company Name</Label>
                  <Input
                    placeholder="e.g., ABC Dance Studio LLC"
                    value={leaseData.newTenant?.companyName || ""}
                    onChange={(e) => handleNewTenantChange("companyName", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Contact Person's Full Name</Label>
                  <Input
                    placeholder="e.g., John Smith"
                    value={leaseData.newTenant?.contactName || ""}
                    onChange={(e) => handleNewTenantChange("contactName", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Contact Email</Label>
                  <Input
                    type="email"
                    placeholder="john@company.com"
                    value={leaseData.newTenant?.email || ""}
                    onChange={(e) => handleNewTenantChange("email", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Contact Phone</Label>
                  <Input
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={leaseData.newTenant?.phone || ""}
                    onChange={(e) => handleNewTenantChange("phone", e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Mailing Address</Label>
                <Textarea
                  placeholder="Enter complete mailing address..."
                  value={leaseData.newTenant?.address || ""}
                  onChange={(e) => handleNewTenantChange("address", e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}
        </div>
      </RadioGroup>

      {/* Guarantor Information */}
      <div className="space-y-4 pt-6 border-t border-slate-200">
        <h3 className="text-lg font-medium text-slate-900">Guarantor Information (Optional)</h3>
        
        <div className="flex items-center justify-between">
          <Label className="text-base">Add a Guarantor for this Lease?</Label>
          <Switch
            checked={leaseData.hasGuarantor || false}
            onCheckedChange={(checked) => updateLeaseData({ hasGuarantor: checked })}
          />
        </div>
        
        {leaseData.hasGuarantor && (
          <div className="ml-4 p-4 bg-slate-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Guarantor Name</Label>
                <Input
                  placeholder="Full name of guarantor"
                  value={leaseData.guarantorName || ""}
                  onChange={(e) => updateLeaseData({ guarantorName: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Guarantor Contact Info</Label>
                <Input
                  placeholder="Phone or email"
                  value={leaseData.guarantorContact || ""}
                  onChange={(e) => updateLeaseData({ guarantorContact: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignTenantScreen;

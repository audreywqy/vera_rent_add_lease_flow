
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Plus } from "lucide-react";
import { LeaseData } from "../AddLeaseWizard";

interface SelectUnitScreenProps {
  leaseData: LeaseData;
  updateLeaseData: (data: Partial<LeaseData>) => void;
  propertyName: string;
}

const SelectUnitScreen = ({ leaseData, updateLeaseData }: SelectUnitScreenProps) => {
  const [selectionType, setSelectionType] = useState("existing");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUnitData, setNewUnitData] = useState({
    number: "",
    sqft: "",
    type: ""
  });

  // Mock existing units data
  const availableUnits = [
    { id: "1", number: "11735", sqft: "1,200", type: "Retail" },
    { id: "2", number: "11740", sqft: "850", type: "Office" },
    { id: "3", number: "11745", sqft: "2,100", type: "Restaurant" },
    { id: "4", number: "11750", sqft: "650", type: "Retail" },
  ];

  const filteredUnits = availableUnits.filter(unit =>
    unit.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    unit.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUnitSelect = (unit: typeof availableUnits[0]) => {
    updateLeaseData({
      selectedUnit: { ...unit, sqft: unit.sqft + " sq ft" },
      newUnit: undefined
    });
  };

  const handleCreateUnit = () => {
    if (newUnitData.number && newUnitData.sqft && newUnitData.type) {
      updateLeaseData({
        newUnit: newUnitData,
        selectedUnit: undefined
      });
      setShowCreateModal(false);
      setNewUnitData({ number: "", sqft: "", type: "" });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Select the unit this lease is for</h2>
        <p className="text-slate-600">Choose an existing unit or create a new one for this property.</p>
      </div>

      <RadioGroup
        value={selectionType}
        onValueChange={setSelectionType}
        className="space-y-6"
      >
        {/* Select Existing Unit */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="existing" id="existing" />
            <Label htmlFor="existing" className="text-base font-medium">
              Select an Existing Unit
            </Label>
          </div>
          
          {selectionType === "existing" && (
            <div className="ml-6 space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search units by number or type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Units List */}
              <div className="grid gap-3">
                {filteredUnits.map((unit) => (
                  <Card
                    key={unit.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      leaseData.selectedUnit?.id === unit.id
                        ? 'ring-2 ring-blue-500 bg-blue-50'
                        : 'hover:bg-slate-50'
                    }`}
                    onClick={() => handleUnitSelect(unit)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-slate-900">Unit {unit.number}</div>
                          <div className="text-sm text-slate-600">{unit.sqft} sq ft • {unit.type}</div>
                        </div>
                        {leaseData.selectedUnit?.id === unit.id && (
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

        {/* Create New Unit */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="new" id="new" />
            <Label htmlFor="new" className="text-base font-medium">
              Create a New Unit
            </Label>
          </div>
          
          {selectionType === "new" && (
            <div className="ml-6">
              {leaseData.newUnit ? (
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-slate-900">Unit {leaseData.newUnit.number}</div>
                        <div className="text-sm text-slate-600">{leaseData.newUnit.sqft} sq ft • {leaseData.newUnit.type}</div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowCreateModal(true)}
                      >
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Create New Unit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Unit</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="unitNumber">Unit Number/Name</Label>
                        <Input
                          id="unitNumber"
                          placeholder="e.g., 11755"
                          value={newUnitData.number}
                          onChange={(e) => setNewUnitData(prev => ({ ...prev, number: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="sqft">Square Footage</Label>
                        <Input
                          id="sqft"
                          type="number"
                          placeholder="e.g., 1200"
                          value={newUnitData.sqft}
                          onChange={(e) => setNewUnitData(prev => ({ ...prev, sqft: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="unitType">Unit Type</Label>
                        <Select
                          value={newUnitData.type}
                          onValueChange={(value) => setNewUnitData(prev => ({ ...prev, type: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select unit type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Retail">Retail</SelectItem>
                            <SelectItem value="Office">Office</SelectItem>
                            <SelectItem value="Restaurant">Restaurant</SelectItem>
                            <SelectItem value="Medical">Medical</SelectItem>
                            <SelectItem value="Warehouse">Warehouse</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                          Cancel
                        </Button>
                        <Button
                          onClick={handleCreateUnit}
                          disabled={!newUnitData.number || !newUnitData.sqft || !newUnitData.type}
                        >
                          Save Unit
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          )}
        </div>
      </RadioGroup>
    </div>
  );
};

export default SelectUnitScreen;

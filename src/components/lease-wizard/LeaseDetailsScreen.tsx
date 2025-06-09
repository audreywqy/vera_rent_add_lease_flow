
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, Trash } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { LeaseData } from "../AddLeaseWizard";

interface RentStep {
  id: string;
  monthlyRent: string;
  fromDate?: Date;
  toDate?: Date;
}

interface LeaseDetailsScreenProps {
  leaseData: LeaseData;
  updateLeaseData: (data: Partial<LeaseData>) => void;
}

const LeaseDetailsScreen = ({ leaseData, updateLeaseData }: LeaseDetailsScreenProps) => {
  const [rentSteps, setRentSteps] = useState<RentStep[]>([
    {
      id: '1',
      monthlyRent: leaseData.baseRent || '',
      fromDate: leaseData.commencementDate,
      toDate: undefined
    }
  ]);

  const DatePickerField = ({ 
    label, 
    value, 
    onChange, 
    placeholder 
  }: { 
    label: string; 
    value?: Date; 
    onChange: (date: Date | undefined) => void;
    placeholder: string;
  }) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, "PPP") : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
            initialFocus
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </div>
  );

  const addRentStep = () => {
    const newStep: RentStep = {
      id: Date.now().toString(),
      monthlyRent: '',
      fromDate: undefined,
      toDate: undefined
    };
    setRentSteps([...rentSteps, newStep]);
  };

  const removeRentStep = (id: string) => {
    setRentSteps(rentSteps.filter(step => step.id !== id));
  };

  const updateRentStep = (id: string, field: keyof RentStep, value: any) => {
    setRentSteps(rentSteps.map(step => 
      step.id === id ? { ...step, [field]: value } : step
    ));
    
    // Update the base rent in leaseData if it's the first step
    if (id === '1' && field === 'monthlyRent') {
      updateLeaseData({ baseRent: value });
    }
  };

  // Update first rent step when commencement date changes
  const handleCommencementDateChange = (date: Date | undefined) => {
    updateLeaseData({ commencementDate: date });
    updateRentStep('1', 'fromDate', date);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Lease Details</h2>
        <p className="text-slate-600">Enter the core financial and term information for this lease.</p>
      </div>

      {/* Lease Term Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-slate-900 border-b border-slate-200 pb-2">
          Lease Term
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DatePickerField
            label="Lease Start Date"
            value={leaseData.startDate}
            onChange={(date) => updateLeaseData({ startDate: date })}
            placeholder="Select start date"
          />
          
          <DatePickerField
            label="Lease End Date"
            value={leaseData.endDate}
            onChange={(date) => updateLeaseData({ endDate: date })}
            placeholder="Select end date"
          />
          
          <DatePickerField
            label="Rent Commencement Date"
            value={leaseData.commencementDate}
            onChange={handleCommencementDateChange}
            placeholder="Select commencement date"
          />
        </div>
      </div>

      {/* Rent Schedule Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-slate-900 border-b border-slate-200 pb-2">
          Rent Schedule
        </h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Lease Type</Label>
            <Select
              value={leaseData.leaseType || ""}
              onValueChange={(value) => updateLeaseData({ leaseType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select lease type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nnn">Triple Net (NNN)</SelectItem>
                <SelectItem value="gross">Gross Lease</SelectItem>
                <SelectItem value="modified-gross">Modified Gross</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Enter the rent amount for each period of the lease term.
            </p>
            
            {rentSteps.map((step, index) => (
              <div key={step.id} className="p-4 border rounded-lg bg-slate-50 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-slate-900">
                    {index === 0 ? 'Initial Rent Period' : `Rent Step ${index + 1}`}
                  </h4>
                  {index > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeRentStep(step.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Monthly Rent</Label>
                    <Input
                      type="number"
                      placeholder="2,350.00"
                      value={step.monthlyRent}
                      onChange={(e) => updateRentStep(step.id, 'monthlyRent', e.target.value)}
                      className="text-right"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>From</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !step.fromDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {step.fromDate ? format(step.fromDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={step.fromDate}
                          onSelect={(date) => updateRentStep(step.id, 'fromDate', date)}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>To</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !step.toDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {step.toDate ? format(step.toDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={step.toDate}
                          onSelect={(date) => updateRentStep(step.id, 'toDate', date)}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            ))}
            
            <Button
              variant="outline"
              onClick={addRentStep}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Rent Step
            </Button>
          </div>
        </div>
      </div>

      {/* Additional Details Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-slate-900 border-b border-slate-200 pb-2">
          Additional Details
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Security Deposit</Label>
            <Input
              type="number"
              placeholder="0.00"
              value={leaseData.securityDeposit || ""}
              onChange={(e) => updateLeaseData({ securityDeposit: e.target.value })}
              className="text-right"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Permitted Use</Label>
          <Textarea
            placeholder="Describe what the tenant's business is (e.g., Dance studio/dance school selling related retail items)"
            value={leaseData.permittedUse || ""}
            onChange={(e) => updateLeaseData({ permittedUse: e.target.value })}
            rows={3}
          />
        </div>

        {/* Option to Extend */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base">Has Option to Extend?</Label>
            <Switch
              checked={leaseData.hasExtensionOption || false}
              onCheckedChange={(checked) => updateLeaseData({ hasExtensionOption: checked })}
            />
          </div>
          
          {leaseData.hasExtensionOption && (
            <div className="ml-4 p-4 bg-slate-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Number of Options</Label>
                  <Input
                    type="number"
                    placeholder="1"
                    value={leaseData.extensionOptions || ""}
                    onChange={(e) => updateLeaseData({ extensionOptions: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Option Term Length</Label>
                  <Input
                    placeholder="e.g., 3 years"
                    value={leaseData.extensionTerm || ""}
                    onChange={(e) => updateLeaseData({ extensionTerm: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaseDetailsScreen;

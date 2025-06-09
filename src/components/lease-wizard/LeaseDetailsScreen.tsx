
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { LeaseData } from "../AddLeaseWizard";

interface LeaseDetailsScreenProps {
  leaseData: LeaseData;
  updateLeaseData: (data: Partial<LeaseData>) => void;
}

const LeaseDetailsScreen = ({ leaseData, updateLeaseData }: LeaseDetailsScreenProps) => {
  const [escalationSteps, setEscalationSteps] = useState(1);

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
            onChange={(date) => updateLeaseData({ commencementDate: date })}
            placeholder="Select commencement date"
          />
        </div>
      </div>

      {/* Rent Schedule Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-slate-900 border-b border-slate-200 pb-2">
          Rent Schedule
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          
          <div className="space-y-2">
            <Label>Monthly Minimum Rent</Label>
            <Input
              type="number"
              placeholder="0.00"
              value={leaseData.baseRent || ""}
              onChange={(e) => updateLeaseData({ baseRent: e.target.value })}
              className="text-right"
            />
          </div>
        </div>

        {/* Rent Escalation */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base">Add Rent Escalations?</Label>
            <Switch
              checked={leaseData.hasEscalations || false}
              onCheckedChange={(checked) => updateLeaseData({ hasEscalations: checked })}
            />
          </div>
          
          {leaseData.hasEscalations && (
            <div className="ml-4 p-4 bg-slate-50 rounded-lg space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Increase By</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="3"
                      value={leaseData.escalationAmount || ""}
                      onChange={(e) => updateLeaseData({ escalationAmount: e.target.value })}
                    />
                    <Select
                      value={leaseData.escalationType || "%"}
                      onValueChange={(value) => updateLeaseData({ escalationType: value })}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="%">%</SelectItem>
                        <SelectItem value="$">$</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Frequency</Label>
                  <Select
                    value={leaseData.escalationFrequency || ""}
                    onValueChange={(value) => updateLeaseData({ escalationFrequency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="annually">Annually</SelectItem>
                      <SelectItem value="every-2-years">Every 2 Years</SelectItem>
                      <SelectItem value="every-3-years">Every 3 Years</SelectItem>
                      <SelectItem value="every-5-years">Every 5 Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button variant="outline" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Another Escalation Step
              </Button>
            </div>
          )}
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

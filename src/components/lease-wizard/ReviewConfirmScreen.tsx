
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Upload, FileText } from "lucide-react";
import { format } from "date-fns";
import { LeaseData } from "../AddLeaseWizard";

interface ReviewConfirmScreenProps {
  leaseData: LeaseData;
  updateLeaseData: (data: Partial<LeaseData>) => void;
  propertyName: string;
}

const ReviewConfirmScreen = ({ leaseData, updateLeaseData, propertyName }: ReviewConfirmScreenProps) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf") {
        updateLeaseData({ leaseDocument: file });
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === "application/pdf") {
        updateLeaseData({ leaseDocument: file });
      }
    }
  };

  const formatCurrency = (amount: string | undefined) => {
    if (!amount) return "Not specified";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(parseFloat(amount));
  };

  const formatDate = (date: Date | undefined) => {
    return date ? format(date, "MMM dd, yyyy") : "Not specified";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Review and Add Lease</h2>
        <p className="text-slate-600">Review all lease information before creating the lease record.</p>
      </div>

      {/* Property & Unit Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg">Property & Unit</CardTitle>
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-slate-600">Property</Label>
              <div className="text-slate-900">{propertyName}</div>
            </div>
            <div>
              <Label className="text-sm font-medium text-slate-600">Unit</Label>
              <div className="text-slate-900">
                Unit {leaseData.selectedUnit?.number || leaseData.newUnit?.number}
                {leaseData.selectedUnit?.sqft && (
                  <span className="text-slate-600 ml-2">• {leaseData.selectedUnit.sqft}</span>
                )}
                {leaseData.newUnit?.sqft && (
                  <span className="text-slate-600 ml-2">• {leaseData.newUnit.sqft} sq ft</span>
                )}
                {(leaseData.selectedUnit?.type || leaseData.newUnit?.type) && (
                  <Badge variant="secondary" className="ml-2">
                    {leaseData.selectedUnit?.type || leaseData.newUnit?.type}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lease Details Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg">Lease Details</CardTitle>
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium text-slate-600">Lease Type</Label>
              <div className="text-slate-900">
                {leaseData.leaseType === "nnn" && "Triple Net (NNN)"}
                {leaseData.leaseType === "gross" && "Gross Lease"}
                {leaseData.leaseType === "modified-gross" && "Modified Gross"}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-slate-600">Start Date</Label>
              <div className="text-slate-900">{formatDate(leaseData.startDate)}</div>
            </div>
            <div>
              <Label className="text-sm font-medium text-slate-600">End Date</Label>
              <div className="text-slate-900">{formatDate(leaseData.endDate)}</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium text-slate-600">Base Rent</Label>
              <div className="text-slate-900 font-semibold">{formatCurrency(leaseData.baseRent)}/month</div>
            </div>
            <div>
              <Label className="text-sm font-medium text-slate-600">Security Deposit</Label>
              <div className="text-slate-900">{formatCurrency(leaseData.securityDeposit)}</div>
            </div>
            <div>
              <Label className="text-sm font-medium text-slate-600">Rent Commencement</Label>
              <div className="text-slate-900">{formatDate(leaseData.commencementDate)}</div>
            </div>
          </div>

          {leaseData.hasEscalations && (
            <div>
              <Label className="text-sm font-medium text-slate-600">Rent Escalations</Label>
              <div className="text-slate-900">
                {leaseData.escalationAmount}{leaseData.escalationType} {leaseData.escalationFrequency}
              </div>
            </div>
          )}

          {leaseData.permittedUse && (
            <div>
              <Label className="text-sm font-medium text-slate-600">Permitted Use</Label>
              <div className="text-slate-900">{leaseData.permittedUse}</div>
            </div>
          )}

          {leaseData.hasExtensionOption && (
            <div>
              <Label className="text-sm font-medium text-slate-600">Extension Options</Label>
              <div className="text-slate-900">
                {leaseData.extensionOptions} option(s) of {leaseData.extensionTerm} each
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tenant Information Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg">Tenant Information</CardTitle>
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-slate-600">Company Name</Label>
              <div className="text-slate-900">
                {leaseData.selectedTenant?.name || leaseData.newTenant?.companyName}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-slate-600">Contact Person</Label>
              <div className="text-slate-900">
                {leaseData.selectedTenant?.contact || leaseData.newTenant?.contactName}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-slate-600">Email</Label>
              <div className="text-slate-900">
                {leaseData.selectedTenant?.email || leaseData.newTenant?.email}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-slate-600">Phone</Label>
              <div className="text-slate-900">
                {leaseData.selectedTenant?.phone || leaseData.newTenant?.phone}
              </div>
            </div>
          </div>

          {leaseData.hasGuarantor && (
            <div className="pt-3 border-t border-slate-200">
              <Label className="text-sm font-medium text-slate-600">Guarantor</Label>
              <div className="text-slate-900">
                {leaseData.guarantorName} - {leaseData.guarantorContact}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Document Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lease Document (Optional)</CardTitle>
        </CardHeader>
        <CardContent>
          {leaseData.leaseDocument ? (
            <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <FileText className="h-8 w-8 text-green-600" />
              <div className="flex-1">
                <div className="font-medium text-slate-900">{leaseData.leaseDocument.name}</div>
                <div className="text-sm text-slate-600">
                  {(leaseData.leaseDocument.size / 1024 / 1024).toFixed(1)} MB
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateLeaseData({ leaseDocument: undefined })}
              >
                Remove
              </Button>
            </div>
          ) : (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? 'border-blue-400 bg-blue-50' : 'border-slate-300'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <div className="text-slate-900 font-medium mb-2">Upload Signed Lease Document</div>
              <div className="text-slate-600 mb-4">Drag and drop your PDF file here, or click to browse</div>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
                id="lease-upload"
              />
              <Button variant="outline" asChild>
                <label htmlFor="lease-upload" className="cursor-pointer">
                  Browse Files
                </label>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewConfirmScreen;

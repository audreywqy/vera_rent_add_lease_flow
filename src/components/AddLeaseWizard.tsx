
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, X } from "lucide-react";
import SelectUnitScreen from "./lease-wizard/SelectUnitScreen";
import LeaseDetailsScreen from "./lease-wizard/LeaseDetailsScreen";
import AssignTenantScreen from "./lease-wizard/AssignTenantScreen";
import ReviewConfirmScreen from "./lease-wizard/ReviewConfirmScreen";

export interface LeaseData {
  // Unit data
  selectedUnit?: {
    id: string;
    number: string;
    sqft: string;
    type?: string;
  };
  newUnit?: {
    number: string;
    sqft: string;
    type: string;
  };
  
  // Lease details
  startDate?: Date;
  endDate?: Date;
  commencementDate?: Date;
  leaseType?: string;
  baseRent?: string;
  hasEscalations?: boolean;
  escalationAmount?: string;
  escalationType?: string;
  escalationFrequency?: string;
  securityDeposit?: string;
  permittedUse?: string;
  hasExtensionOption?: boolean;
  extensionOptions?: string;
  extensionTerm?: string;
  
  // Tenant data
  selectedTenant?: {
    id: string;
    name: string;
    contact: string;
    email?: string;
    phone?: string;
  };
  newTenant?: {
    companyName: string;
    contactName: string;
    email: string;
    phone: string;
    address: string;
  };
  hasGuarantor?: boolean;
  guarantorName?: string;
  guarantorContact?: string;
  
  // Documents
  leaseDocument?: File;
}

interface AddLeaseWizardProps {
  onClose: () => void;
  propertyName: string;
}

const AddLeaseWizard = ({ onClose, propertyName }: AddLeaseWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [leaseData, setLeaseData] = useState<LeaseData>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const steps = [
    { number: 1, title: "Select a Unit", component: SelectUnitScreen },
    { number: 2, title: "Lease Details", component: LeaseDetailsScreen },
    { number: 3, title: "Assign a Tenant", component: AssignTenantScreen },
    { number: 4, title: "Review and Confirm", component: ReviewConfirmScreen },
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setShowSuccess(true);
    setTimeout(() => {
      onClose();
    }, 3000);
  };

  const updateLeaseData = (data: Partial<LeaseData>) => {
    setLeaseData(prev => ({ ...prev, ...data }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return !!(leaseData.selectedUnit || leaseData.newUnit);
      case 2:
        return !!(leaseData.startDate && leaseData.endDate && leaseData.baseRent && leaseData.leaseType);
      case 3:
        return !!(leaseData.selectedTenant || leaseData.newTenant);
      case 4:
        return true;
      default:
        return false;
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <ArrowLeft className="h-4 w-4 text-white rotate-45" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Lease Created Successfully!</h2>
            <p className="text-slate-600">
              Lease for {leaseData.selectedTenant?.name || leaseData.newTenant?.companyName} in Unit{" "}
              {leaseData.selectedUnit?.number || leaseData.newUnit?.number} has been successfully created.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto p-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onClose} className="p-2">
              <X className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Add Lease: {steps[currentStep - 1].title}
              </h1>
              <p className="text-slate-600">{propertyName}</p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                ${currentStep >= step.number 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-200 text-slate-600'
                }
              `}>
                {step.number}
              </div>
              <div className="ml-3 text-sm">
                <div className={`font-medium ${currentStep >= step.number ? 'text-blue-600' : 'text-slate-600'}`}>
                  {step.title}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`
                  w-12 h-0.5 mx-4
                  ${currentStep > step.number ? 'bg-blue-600' : 'bg-slate-200'}
                `} />
              )}
            </div>
          ))}
        </div>

        {/* Current Step Content */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <CurrentStepComponent
              leaseData={leaseData}
              updateLeaseData={updateLeaseData}
              propertyName={propertyName}
            />
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          
          {currentStep === steps.length ? (
            <Button
              onClick={handleComplete}
              disabled={!canProceed()}
              className="bg-green-600 hover:bg-green-700"
            >
              Create Lease
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddLeaseWizard;

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Shield, 
  User, 
  MapPin, 
  Building,
  Camera,
  X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Logo from './Logo';
import LoadingSpinner from './LoadingSpinner';

const KYCVerification: React.FC = () => {
  const { user, updateUser, uploadDocument, startKYC } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States'
    },
    dateOfBirth: '',
    ssn: '',
    occupation: '',
    sourceOfFunds: '',
    purposeOfAccount: ''
  });
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: File }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const steps = [
    { id: 1, title: 'Personal Information', description: 'Basic identity verification' },
    { id: 2, title: 'Address Verification', description: 'Confirm your address' },
    { id: 3, title: 'Document Upload', description: 'Upload required documents' },
    { id: 4, title: 'Review & Submit', description: 'Review and submit for verification' }
  ];

  const documentTypes = [
    {
      id: 'drivers_license',
      name: 'Driver\'s License',
      description: 'Front and back of your driver\'s license',
      required: true
    },
    {
      id: 'passport',
      name: 'Passport',
      description: 'Alternative to driver\'s license',
      required: false
    },
    {
      id: 'utility_bill',
      name: 'Utility Bill',
      description: 'Recent utility bill for address verification',
      required: true
    },
    {
      id: 'bank_statement',
      name: 'Bank Statement',
      description: 'Recent bank statement (last 3 months)',
      required: true
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('address.')) {
      const addressField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: { ...prev.address, [addressField]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    setErrors([]);
  };

  const handleFileUpload = (documentType: string, file: File) => {
    setUploadedFiles(prev => ({ ...prev, [documentType]: file }));
    setErrors([]);
  };

  const removeFile = (documentType: string) => {
    setUploadedFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[documentType];
      return newFiles;
    });
  };

  const validateStep = (step: number): boolean => {
    const newErrors: string[] = [];

    switch (step) {
      case 1:
        if (!formData.dateOfBirth) newErrors.push('Date of birth is required');
        if (!formData.ssn) newErrors.push('SSN is required');
        if (!formData.occupation) newErrors.push('Occupation is required');
        break;
      case 2:
        if (!formData.address.street) newErrors.push('Street address is required');
        if (!formData.address.city) newErrors.push('City is required');
        if (!formData.address.state) newErrors.push('State is required');
        if (!formData.address.zipCode) newErrors.push('ZIP code is required');
        break;
      case 3: {
        const requiredDocs = documentTypes.filter(doc => doc.required);
        for (const doc of requiredDocs) {
          if (!uploadedFiles[doc.id]) {
            newErrors.push(`${doc.name} is required`);
          }
        }
        break;
      }
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    setErrors([]);

    try {
      // Update user information
      await updateUser({
        address: formData.address,
        // Note: In a real app, never store SSN in plain text
        // This would be encrypted and handled securely
      });

      // Upload documents
      for (const [docType, file] of Object.entries(uploadedFiles)) {
        await uploadDocument(file, docType);
      }

      // Start KYC process
      await startKYC();

      // Move to completion step
      setCurrentStep(5);
    } catch (error) {
      setErrors(['Failed to submit KYC information. Please try again.']);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepIcon = (step: number) => {
    if (step < currentStep) return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (step === currentStep) return <div className="h-5 w-5 rounded-full bg-orange-500" />;
    return <div className="h-5 w-5 rounded-full bg-gray-300" />;
  };

  const getKYCStatusBadge = () => {
    switch (user?.kycStatus) {
      case 'approved':
        return <Badge className="bg-green-500 text-white">Verified</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 text-white">Under Review</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500 text-white">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Not Started</Badge>;
    }
  };

  if (user?.kycStatus === 'approved') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="glass-effect ember-glow max-w-md w-full text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <Logo size="md" />
            </div>
            <CardTitle className="text-gray-800 flex items-center justify-center space-x-2">
              <CheckCircle className="h-6 w-6 text-green-500" />
              <span>Verification Complete</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">
              Your identity has been successfully verified. You now have full access to all AutoFoundry PRO features.
            </p>
            <Button 
              className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
              onClick={() => window.location.reload()}
            >
              Continue to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === 5) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="glass-effect ember-glow max-w-md w-full text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <Logo size="md" />
            </div>
            <CardTitle className="text-gray-800 flex items-center justify-center space-x-2">
              <Clock className="h-6 w-6 text-orange-500" />
              <span>Verification Submitted</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">
              Your KYC information has been submitted for review. This process typically takes 1-3 business days. 
              You'll receive an email notification once your verification is complete.
            </p>
            <Button 
              className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
              onClick={() => window.location.reload()}
            >
              Continue with Limited Access
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="md" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Identity Verification (KYC)
          </h1>
          <p className="text-gray-600 mb-4">
            Complete your identity verification to access all AutoFoundry PRO features
          </p>
          <div className="flex justify-center">
            {getKYCStatusBadge()}
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  {getStepIcon(step.id)}
                  <div className="text-center mt-2">
                    <div className="text-sm font-medium text-gray-800">{step.title}</div>
                    <div className="text-xs text-gray-600">{step.description}</div>
                  </div>
                </div>
                {step.id < steps.length && (
                  <div className={`h-1 w-16 mx-4 ${
                    step.id < currentStep ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <Progress value={(currentStep / 4) * 100} className="h-2" />
        </div>

        {/* Error Display */}
        {errors.length > 0 && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <ul className="list-disc list-inside space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <Card className="glass-effect ember-glow">
          <CardHeader>
            <CardTitle className="text-gray-800 flex items-center space-x-2">
              <Shield className="h-5 w-5 text-orange-500" />
              <span>{steps[currentStep - 1]?.title}</span>
            </CardTitle>
          </CardHeader>

          <CardContent>
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-700">Date of Birth</Label>
                    <Input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      className="glass-effect border-orange-200"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700">SSN (Last 4 digits)</Label>
                    <Input
                      type="text"
                      placeholder="1234"
                      maxLength={4}
                      value={formData.ssn}
                      onChange={(e) => handleInputChange('ssn', e.target.value)}
                      className="glass-effect border-orange-200"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700">Occupation</Label>
                  <Input
                    placeholder="Software Engineer, Business Owner, etc."
                    value={formData.occupation}
                    onChange={(e) => handleInputChange('occupation', e.target.value)}
                    className="glass-effect border-orange-200"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700">Source of Funds</Label>
                  <Select onValueChange={(value) => handleInputChange('sourceOfFunds', value)}>
                    <SelectTrigger className="glass-effect border-orange-200">
                      <SelectValue placeholder="Select source of funds" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employment">Employment</SelectItem>
                      <SelectItem value="business">Business Income</SelectItem>
                      <SelectItem value="investments">Investments</SelectItem>
                      <SelectItem value="inheritance">Inheritance</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700">Purpose of Account</Label>
                  <Textarea
                    placeholder="Describe how you plan to use AutoFoundry PRO..."
                    value={formData.purposeOfAccount}
                    onChange={(e) => handleInputChange('purposeOfAccount', e.target.value)}
                    className="glass-effect border-orange-200"
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Address Verification */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-gray-700">Street Address</Label>
                  <Input
                    placeholder="123 Main Street"
                    value={formData.address.street}
                    onChange={(e) => handleInputChange('address.street', e.target.value)}
                    className="glass-effect border-orange-200"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-700">City</Label>
                    <Input
                      placeholder="San Francisco"
                      value={formData.address.city}
                      onChange={(e) => handleInputChange('address.city', e.target.value)}
                      className="glass-effect border-orange-200"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700">State</Label>
                    <Select onValueChange={(value) => handleInputChange('address.state', value)}>
                      <SelectTrigger className="glass-effect border-orange-200">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CA">California</SelectItem>
                        <SelectItem value="NY">New York</SelectItem>
                        <SelectItem value="TX">Texas</SelectItem>
                        <SelectItem value="FL">Florida</SelectItem>
                        {/* Add more states as needed */}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700">ZIP Code</Label>
                    <Input
                      placeholder="94102"
                      value={formData.address.zipCode}
                      onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
                      className="glass-effect border-orange-200"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700">Country</Label>
                  <Select 
                    value={formData.address.country}
                    onValueChange={(value) => handleInputChange('address.country', value)}
                  >
                    <SelectTrigger className="glass-effect border-orange-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="United States">United States</SelectItem>
                      <SelectItem value="Canada">Canada</SelectItem>
                      <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                      {/* Add more countries as needed */}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 3: Document Upload */}
            {currentStep === 3 && (
              <div className="space-y-6">
                {documentTypes.map((docType) => (
                  <Card key={docType.id} className="border-orange-200">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg text-gray-800 flex items-center space-x-2">
                            <FileText className="h-5 w-5 text-orange-500" />
                            <span>{docType.name}</span>
                            {docType.required && <span className="text-red-500">*</span>}
                          </CardTitle>
                          <p className="text-gray-600 text-sm">{docType.description}</p>
                        </div>
                        {uploadedFiles[docType.id] && (
                          <Badge className="bg-green-500 text-white">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Uploaded
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      {uploadedFiles[docType.id] ? (
                        <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-green-600" />
                            <span className="text-green-800 text-sm">
                              {uploadedFiles[docType.id].name}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(docType.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-orange-300 rounded-lg p-6 text-center">
                          <Upload className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                          <p className="text-gray-600 mb-2">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, PDF up to 10MB
                          </p>
                          <input
                            ref={(el) => {
                              if (fileInputRefs.current) {
                                fileInputRefs.current[docType.id] = el;
                              }
                            }}
                            type="file"
                            accept=".png,.jpg,.jpeg,.pdf"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleFileUpload(docType.id, file);
                              }
                            }}
                            className="hidden"
                          />
                          <Button
                            variant="outline"
                            className="mt-2 border-orange-300 text-orange-600 hover:bg-orange-50"
                            onClick={() => fileInputRefs.current?.[docType.id]?.click()}
                          >
                            <Camera className="h-4 w-4 mr-2" />
                            Upload Document
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Step 4: Review & Submit */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="bg-orange-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-4">Review Your Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Personal Information</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>Name: {user?.firstName} {user?.lastName}</p>
                        <p>Email: {user?.email}</p>
                        <p>Date of Birth: {formData.dateOfBirth}</p>
                        <p>Occupation: {formData.occupation}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Address</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>{formData.address.street}</p>
                        <p>{formData.address.city}, {formData.address.state} {formData.address.zipCode}</p>
                        <p>{formData.address.country}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-medium text-gray-700 mb-2">Uploaded Documents</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      {Object.entries(uploadedFiles).map(([docType, file]) => (
                        <p key={docType} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>{documentTypes.find(d => d.id === docType)?.name}: {file.name}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                <Alert className="border-orange-200 bg-orange-50">
                  <Shield className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-800">
                    By submitting this information, you confirm that all details are accurate and agree 
                    to our terms of service and privacy policy. This information will be used solely 
                    for identity verification purposes.
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="border-orange-300 text-orange-600 hover:bg-orange-50"
              >
                Previous
              </Button>

              {currentStep < 4 ? (
                <Button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Submitting...
                    </>
                  ) : (
                    'Submit for Verification'
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default KYCVerification;

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Phone, Mail, MapPin, Landmark, Loader2, FileText, Upload, Eye, ExternalLink, Image as ImageIcon, Edit, X, CheckCircle2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { vendorService } from "@/services/vendorService";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect } from "react";
import { chatService, UpdateRequest } from "@/services/chatService";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Clock } from "lucide-react";

const vendorTypes = [
    "Accommodation", "Tours & Experiences", "Food & Dining", "Transportation",
    "Photography", "Wellness & Spa", "Adventure Sports", "Cultural Experience",
    "Merchant", "Other",
];

const operatingAreas = [
    "Colombo", "Galle", "Kandy", "Negombo", "Ella", "Sigiriya",
    "Trincomalee", "Jaffna", "Mirissa", "Hikkaduwa", "Nuwara Eliya",
    "Bentota", "Arugam Bay", "Dambulla", "Polonnaruwa", "Other",
];

const payoutCycles = [
    { value: "weekly", label: "Weekly (Every Monday)" },
    { value: "biweekly", label: "Bi-Weekly (Every other Monday)" },
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Quarterly" },
];

const payoutDates = [
    { value: "1", label: "1st of the month" },
    { value: "15", label: "15th of the month" },
    { value: "last", label: "Last day of the month" },
];

const banks = [
    "Bank of Ceylon",
    "People's Bank",
    "Commercial Bank",
    "Hatton National Bank",
    "Sampath Bank",
    "Nations Trust Bank",
    "DFCC Bank",
    "Seylan Bank",
    "National Development Bank",
    "Pan Asia Bank",
    "Union Bank",
    "Amana Bank",
    "HSBC",
    "Standard Chartered",
    "Other"
];

const profileSchema = z.object({
    businessName: z.string().min(2, "Business name is required"),
    legalName: z.string().optional(),
    contactPerson: z.string().min(2, "Contact person is required"),
    email: z.string().email().optional(), // Read-only
    phoneNumber: z.string().min(5, "Valid phone number is required"),
    vendorType: z.string().min(1, "Vendor type is required"),
    vendorTypeOther: z.string().optional(),
    operatingAreas: z.array(z.string()).optional(),
    operatingAreasOther: z.string().optional(),
    businessAddress: z.string().min(5, "Business address is required"),
    businessRegNumber: z.string().optional(),
    taxId: z.string().optional(),
    bankName: z.string().min(2, "Bank name is required"),
    bankNameOther: z.string().optional(),
    accountHolderName: z.string().min(2, "Account holder name is required"),
    accountNumber: z.string().min(5, "Account number is required"),
    bankBranch: z.string().min(2, "Bank branch is required"),
    payoutCycle: z.string().optional(),
    payoutDate: z.string().optional(),
    regCertificateUrl: z.string().optional(),
    nicPassportUrl: z.string().optional(),
    tourismLicenseUrl: z.string().optional(),
    marketingPermission: z.boolean().default(false),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
    initialData: any;
    onUpdate?: () => void;
}

const DocumentUploadField = ({
    label,
    fileType,
    vendorId,
    currentUrl,
    onUploadSuccess,
    fieldName,
    PendingValueIndicator,
    disabled
}: {
    label: string,
    fileType: string,
    vendorId: string,
    currentUrl?: string,
    onUploadSuccess: (url: string) => void,
    fieldName?: string,
    PendingValueIndicator?: any,
    disabled?: boolean
}) => {
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const response = await vendorService.uploadFile(file, vendorId, fileType);
            if (response.success) {
                toast.success(`${label} uploaded successfully`);
                onUploadSuccess(response.url);
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to upload file");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="space-y-2">
            <FormLabel>{label}</FormLabel>
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-4 p-4 border rounded-lg bg-background">
                    <div className="p-2 bg-primary/10 rounded-full">
                        <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                            {currentUrl ? "Document on file" : "No document uploaded"}
                        </p>
                        {currentUrl && (
                            <a
                                href={currentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 mt-0.5"
                            >
                                View current file <ExternalLink className="w-3 h-3" />
                            </a>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="relative"
                            disabled={isUploading}
                        >
                            {isUploading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    <Upload className="w-4 h-4 mr-2" />
                                    {currentUrl ? "Replace" : "Upload"}
                                </>
                            )}
                            <input
                                type="file"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                                onChange={handleFileChange}
                                accept=".pdf,.jpg,.jpeg,.png"
                                disabled={isUploading || disabled}
                            />
                        </Button>
                    </div>
                </div>
                {fieldName && PendingValueIndicator && (
                    <div className="px-1">
                        <PendingValueIndicator fieldName={fieldName} />
                    </div>
                )}
            </div>
        </div>
    );
};

const ProfileForm = ({ initialData, onUpdate }: ProfileFormProps) => {
    const [isUpdating, setIsUpdating] = useState(false);
    // Local state for document URLs to reflect immediate updates
    const [documents, setDocuments] = useState({
        regCertificate: initialData.reg_certificate_url,
        nicPassport: initialData.nic_passport_url,
        tourismLicense: initialData.tourism_license_url,
    });
    const [pendingRequests, setPendingRequests] = useState<UpdateRequest[]>([]);
    const [unlockedFields, setUnlockedFields] = useState<Record<string, boolean>>({});

    useEffect(() => {
        fetchPendingRequests();
    }, []);

    const fetchPendingRequests = async () => {
        try {
            const res = await chatService.getVendorUpdateRequests('pending');
            if (res.success) {
                setPendingRequests(res.requests);
            }
        } catch (error) {
            console.error("Failed to fetch pending requests:", error);
        }
    };

    // Ensure locked fields stay in sync with confirmed data
    // This addresses "do not make it updated like usually" by reverting input to confirmed value when locked
    useEffect(() => {
        const fields = Object.keys(profileSchema.shape);
        fields.forEach(field => {
            if (!unlockedFields[field]) {
                const dbKey = chatService.getDbKey(field);
                const confirmedValue = initialData[dbKey];
                if (confirmedValue !== undefined) {
                    form.setValue(field as any, confirmedValue);
                }
            }
        });
    }, [unlockedFields, initialData]);

    // Helper to get pending value for a field
    const getPendingValue = (fieldName: string) => {
        const dbKey = chatService.getDbKey(fieldName);
        // Find the most recent pending request that contains this field
        const latestRequest = [...pendingRequests]
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .find(req => req.requested_data && req.requested_data[dbKey] !== undefined);

        return latestRequest ? latestRequest.requested_data[dbKey] : null;
    };

    const PendingValueIndicator = ({ fieldName }: { fieldName: string }) => {
        const pendingValue = getPendingValue(fieldName);
        if (pendingValue === null || pendingValue === undefined) return null;

        const isUrl = typeof pendingValue === 'string' && pendingValue.startsWith('http');

        return (
            <div className="text-[10px] text-red-500 font-medium mt-1 flex items-center gap-1.5 bg-red-50/50 p-1.5 rounded-md border border-red-100">
                <Clock className="w-3 h-3 shrink-0" />
                <div className="flex flex-wrap items-center gap-1">
                    <span>Pending Update: </span>
                    {isUrl ? (
                        <a href={pendingValue} target="_blank" rel="noopener noreferrer" className="underline hover:text-red-700 transition-colors flex items-center gap-0.5 font-bold">
                            View New Attachment <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                    ) : (
                        <span className="font-bold">{Array.isArray(pendingValue) ? pendingValue.join(", ") : String(pendingValue)}</span>
                    )}
                </div>
            </div>
        );
    };

    const EditableLabel = ({ label, fieldName, icon: Icon }: { label: string, fieldName: string, icon?: any }) => {
        const isUnlocked = unlockedFields[fieldName];
        const hasPending = getPendingValue(fieldName) !== null;

        return (
            <div className="flex items-center justify-between mb-1.5">
                <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                    {Icon && <Icon className="w-4 h-4 text-muted-foreground" />}
                    {label}
                </FormLabel>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={`h-7 px-2 text-[10px] gap-1.5 transition-all ${isUnlocked ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-primary hover:bg-primary/5'}`}
                    onClick={() => setUnlockedFields(prev => ({ ...prev, [fieldName]: !prev[fieldName] }))}
                >
                    {isUnlocked ? (
                        <>
                            <X className="w-3 h-3" />
                            Lock
                        </>
                    ) : (
                        <>
                            <Edit className="w-3 h-3" />
                            Edit
                        </>
                    )}
                </Button>
            </div>
        );
    };

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            businessName: initialData.business_name || "",
            legalName: initialData.legal_name || "",
            contactPerson: initialData.contact_person || "",
            email: initialData.email || "",
            phoneNumber: initialData.phone_number || "",
            vendorType: initialData.vendor_type || "",
            vendorTypeOther: initialData.vendor_type_other || "",
            operatingAreas: initialData.operating_areas || [],
            operatingAreasOther: initialData.operating_areas_other || "",
            businessAddress: initialData.business_address || "",
            businessRegNumber: initialData.business_reg_number || "",
            taxId: initialData.tax_id || "",
            bankName: initialData.bank_name || "",
            bankNameOther: initialData.bank_name_other || "",
            accountHolderName: initialData.account_holder_name || "",
            accountNumber: initialData.account_number || "",
            bankBranch: initialData.bank_branch || "",
            payoutCycle: initialData.payout_cycle || "",
            payoutDate: initialData.payout_date || "",
            regCertificateUrl: initialData.reg_certificate_url || "",
            nicPassportUrl: initialData.nic_passport_url || "",
            tourismLicenseUrl: initialData.tourism_license_url || "",
            marketingPermission: initialData.marketing_permission || false,
        },
    });

    async function onSubmit(values: ProfileFormValues) {
        setIsUpdating(true);
        try {
            // Merge document URLs from local state into form values before submission
            const fullValues = {
                ...values,
                regCertificateUrl: documents.regCertificate,
                nicPassportUrl: documents.nicPassport,
                tourismLicenseUrl: documents.tourismLicense,
            };

            // Optimization: Only send changed fields
            const changedValues: any = {};
            let hasChanges = false;

            Object.keys(fullValues).forEach(key => {
                const dbKey = chatService.getDbKey(key);
                const currentValue = initialData[dbKey];
                const newValue = (fullValues as any)[key];

                // Deep comparison for arrays (operatingAreas)
                if (Array.isArray(newValue)) {
                    const currentArray = currentValue || [];
                    if (JSON.stringify([...newValue].sort()) !== JSON.stringify([...currentArray].sort())) {
                        changedValues[key] = newValue;
                        hasChanges = true;
                    }
                } else if (newValue !== currentValue) {
                    // Simple comparison for primitives
                    if (newValue || currentValue) { // Avoid sending null vs undefined as change
                        changedValues[key] = newValue;
                        hasChanges = true;
                    }
                }
            });

            if (!hasChanges) {
                toast.info("No changes detected");
                setIsUpdating(false);
                return;
            }

            const response = await vendorService.updateVendorProfile(changedValues);
            if (response.success) {
                setUnlockedFields({}); // Lock all fields on success
                // Check if changes are pending approval
                if (response.pending_approval) {
                    toast.info(response.message || "Your profile update request has been submitted for approval. You will be notified once it is reviewed.", {
                        duration: 6000,
                        description: response.changed_fields?.length
                            ? `Fields pending: ${response.changed_fields.join(", ")}`
                            : undefined
                    });
                } else {
                    toast.success(response.message || "Profile updated successfully");
                }
                if (onUpdate) onUpdate();
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to update profile");
        } finally {
            setIsUpdating(false);
        }
    }

    const handleAreaToggle = (area: string, field: any) => {
        const current = field.value || [];
        const updated = current.includes(area)
            ? current.filter((a: string) => a !== area)
            : [...current, area];
        field.onChange(updated);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-4xl mx-auto pb-10">

                {/* Section 1: About Your Business */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-primary" />
                            About Your Business
                        </CardTitle>
                        <CardDescription>
                            Basic information about your business identity and contact details.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="businessName"
                                render={({ field }) => (
                                    <FormItem>
                                        <EditableLabel label="Business Name" fieldName="businessName" />
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="e.g., Adventure Paradise Tours"
                                                disabled={!unlockedFields["businessName"]}
                                                className={!unlockedFields["businessName"] ? "bg-muted/30 border-transparent transition-all" : "border-primary/50 ring-1 ring-primary/20"}
                                            />
                                        </FormControl>
                                        <PendingValueIndicator fieldName="businessName" />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="vendorType"
                                render={({ field }) => (
                                    <FormItem>
                                        <EditableLabel label="Vendor Type" fieldName="vendorType" />
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            disabled={!unlockedFields["vendorType"]}
                                        >
                                            <FormControl>
                                                <SelectTrigger className={!unlockedFields["vendorType"] ? "bg-muted/30 border-transparent mt-0" : "border-primary/50 ring-1 ring-primary/20 mt-0"}>
                                                    <SelectValue placeholder="Select vendor type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {vendorTypes.map((type) => (
                                                    <SelectItem key={type} value={type}>
                                                        {type}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <PendingValueIndicator fieldName="vendorType" />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {form.watch("vendorType") === "Other" && (
                                <FormField
                                    control={form.control}
                                    name="vendorTypeOther"
                                    render={({ field }) => (
                                        <FormItem className="col-span-2">
                                            <EditableLabel label="Specify Vendor Type" fieldName="vendorTypeOther" />
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Please specify"
                                                    disabled={!unlockedFields["vendorTypeOther"]}
                                                    className={!unlockedFields["vendorTypeOther"] ? "bg-muted/30 border-transparent transition-all" : "border-primary/50 ring-1 ring-primary/20"}
                                                />
                                            </FormControl>
                                            <PendingValueIndicator fieldName="vendorTypeOther" />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                            <FormField
                                control={form.control}
                                name="legalName"
                                render={({ field }) => (
                                    <FormItem>
                                        <EditableLabel label="Legal Name (Optional)" fieldName="legalName" />
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Full Legal Entity Name"
                                                disabled={!unlockedFields["legalName"]}
                                                className={!unlockedFields["legalName"] ? "bg-muted/30 border-transparent" : "border-primary/50 ring-1 ring-primary/20"}
                                            />
                                        </FormControl>
                                        <PendingValueIndicator fieldName="legalName" />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="contactPerson"
                                render={({ field }) => (
                                    <FormItem>
                                        <EditableLabel label="Contact Person" fieldName="contactPerson" />
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="e.g., John Doe"
                                                disabled={!unlockedFields["contactPerson"]}
                                                className={!unlockedFields["contactPerson"] ? "bg-muted/30 border-transparent" : "border-primary/50 ring-1 ring-primary/20"}
                                            />
                                        </FormControl>
                                        <PendingValueIndicator fieldName="contactPerson" />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email Address</FormLabel>
                                        <FormControl>
                                            <Input {...field} disabled className="bg-muted" />
                                        </FormControl>
                                        <FormDescription>Contact support to change email</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phoneNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex items-center justify-between">
                                            <EditableLabel label="Phone Number" fieldName="phoneNumber" />
                                            {initialData.phone_verified && (
                                                <div className="flex items-center gap-1 text-[10px] text-green-600 font-bold mb-1 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                                                    <CheckCircle2 className="w-3 h-3" />
                                                    <span>Verified</span>
                                                </div>
                                            )}
                                        </div>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="+94 77 XXX XXXX"
                                                disabled={!unlockedFields["phoneNumber"]}
                                                className={!unlockedFields["phoneNumber"] ? "bg-muted/30 border-transparent" : "border-primary/50 ring-1 ring-primary/20"}
                                            />
                                        </FormControl>
                                        <PendingValueIndicator fieldName="phoneNumber" />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="operatingAreas"
                            render={({ field }) => (
                                <FormItem>
                                    <EditableLabel label="Operating Areas" fieldName="operatingAreas" />
                                    <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mt-2 ${!unlockedFields["operatingAreas"] ? "opacity-70 pointer-events-none" : ""}`}>
                                        {operatingAreas.map((area) => (
                                            <button
                                                key={area}
                                                type="button"
                                                onClick={() => handleAreaToggle(area, field)}
                                                className={`px-3 py-2 rounded-md text-sm transition-colors border ${(field.value || []).includes(area)
                                                    ? "bg-primary text-primary-foreground border-primary"
                                                    : "bg-background hover:bg-muted border-input"
                                                    }`}
                                            >
                                                {area}
                                            </button>
                                        ))}
                                    </div>
                                    <PendingValueIndicator fieldName="operatingAreas" />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {(form.watch("operatingAreas") || []).includes("Other") && (
                            <FormField
                                control={form.control}
                                name="operatingAreasOther"
                                render={({ field }) => (
                                    <FormItem>
                                        <EditableLabel label="Other Areas" fieldName="operatingAreasOther" />
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                placeholder="Please list other areas"
                                                disabled={!unlockedFields["operatingAreasOther"]}
                                                className={!unlockedFields["operatingAreasOther"] ? "bg-muted/30 border-transparent" : "border-primary/50 ring-1 ring-primary/20"}
                                            />
                                        </FormControl>
                                        <PendingValueIndicator fieldName="operatingAreasOther" />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                    </CardContent>
                </Card>

                {/* Section 2: Business Details */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-primary" />
                            Business Details
                        </CardTitle>
                        <CardDescription>
                            Verification documents and location information.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <FormField
                            control={form.control}
                            name="businessAddress"
                            render={({ field }) => (
                                <FormItem>
                                    <EditableLabel label="Business Address" fieldName="businessAddress" />
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="Enter your registered business address"
                                            disabled={!unlockedFields["businessAddress"]}
                                            className={!unlockedFields["businessAddress"] ? "bg-muted/30 border-transparent" : "border-primary/50 ring-1 ring-primary/20"}
                                        />
                                    </FormControl>
                                    <PendingValueIndicator fieldName="businessAddress" />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="businessRegNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <EditableLabel label="Business Registration Number" fieldName="businessRegNumber" />
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="e.g., BR-XXXXX"
                                                disabled={!unlockedFields["businessRegNumber"]}
                                                className={!unlockedFields["businessRegNumber"] ? "bg-muted/30 border-transparent" : "border-primary/50 ring-1 ring-primary/20"}
                                            />
                                        </FormControl>
                                        <PendingValueIndicator fieldName="businessRegNumber" />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="taxId"
                                render={({ field }) => (
                                    <FormItem>
                                        <EditableLabel label="Tax ID / VAT (Optional)" fieldName="taxId" />
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Tax Identification Number"
                                                disabled={!unlockedFields["taxId"]}
                                                className={!unlockedFields["taxId"] ? "bg-muted/30 border-transparent" : "border-primary/50 ring-1 ring-primary/20"}
                                            />
                                        </FormControl>
                                        <PendingValueIndicator fieldName="taxId" />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Document Uploads */}
                        <div className="space-y-4 pt-4 border-t">
                            <h3 className="text-sm font-semibold text-foreground">Documents</h3>
                            <div className="grid gap-4">
                                <div className="space-y-4">
                                    <EditableLabel label="Business Registration Certificate" fieldName="regCertificateUrl" />
                                    <DocumentUploadField
                                        label=""
                                        fileType="reg_certificate"
                                        vendorId={initialData.id}
                                        currentUrl={documents.regCertificate}
                                        onUploadSuccess={(url) => setDocuments(prev => ({ ...prev, regCertificate: url }))}
                                        fieldName="regCertificateUrl"
                                        PendingValueIndicator={PendingValueIndicator}
                                        disabled={!unlockedFields["regCertificateUrl"]}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <EditableLabel label="NIC / Passport" fieldName="nicPassportUrl" />
                                    <DocumentUploadField
                                        label=""
                                        fileType="nic_passport"
                                        vendorId={initialData.id}
                                        currentUrl={documents.nicPassport}
                                        onUploadSuccess={(url) => setDocuments(prev => ({ ...prev, nicPassport: url }))}
                                        fieldName="nicPassportUrl"
                                        PendingValueIndicator={PendingValueIndicator}
                                        disabled={!unlockedFields["nicPassportUrl"]}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <EditableLabel label="Tourism License (Optional)" fieldName="tourismLicenseUrl" />
                                    <DocumentUploadField
                                        label=""
                                        fileType="tourism_license"
                                        vendorId={initialData.id}
                                        currentUrl={documents.tourismLicense}
                                        onUploadSuccess={(url) => setDocuments(prev => ({ ...prev, tourismLicense: url }))}
                                        fieldName="tourismLicenseUrl"
                                        PendingValueIndicator={PendingValueIndicator}
                                        disabled={!unlockedFields["tourismLicenseUrl"]}
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Section 3: Getting Paid */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Landmark className="w-5 h-5 text-primary" />
                            Getting Paid
                        </CardTitle>
                        <CardDescription>
                            Bank account details for your payouts.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="bankName"
                                render={({ field }) => (
                                    <FormItem>
                                        <EditableLabel label="Bank Name" fieldName="bankName" />
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            disabled={!unlockedFields["bankName"]}
                                        >
                                            <FormControl>
                                                <SelectTrigger className={!unlockedFields["bankName"] ? "bg-muted/30 border-transparent mt-0" : "border-primary/50 ring-1 ring-primary/20 mt-0"}>
                                                    <SelectValue placeholder="Select your bank" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {banks.map((bank) => (
                                                    <SelectItem key={bank} value={bank}>
                                                        {bank}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <PendingValueIndicator fieldName="bankName" />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {form.watch("bankName") === "Other" && (
                                <FormField
                                    control={form.control}
                                    name="bankNameOther"
                                    render={({ field }) => (
                                        <FormItem>
                                            <EditableLabel label="Specify Bank Name" fieldName="bankNameOther" />
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Enter bank name"
                                                    disabled={!unlockedFields["bankNameOther"]}
                                                    className={!unlockedFields["bankNameOther"] ? "bg-muted/30 border-transparent" : "border-primary/50 ring-1 ring-primary/20"}
                                                />
                                            </FormControl>
                                            <PendingValueIndicator fieldName="bankNameOther" />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                            <FormField
                                control={form.control}
                                name="bankBranch"
                                render={({ field }) => (
                                    <FormItem>
                                        <EditableLabel label="Bank Branch" fieldName="bankBranch" />
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="e.g., Colombo Main"
                                                disabled={!unlockedFields["bankBranch"]}
                                                className={!unlockedFields["bankBranch"] ? "bg-muted/30 border-transparent" : "border-primary/50 ring-1 ring-primary/20"}
                                            />
                                        </FormControl>
                                        <PendingValueIndicator fieldName="bankBranch" />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="accountHolderName"
                                render={({ field }) => (
                                    <FormItem>
                                        <EditableLabel label="Account Holder Name" fieldName="accountHolderName" />
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Name exactly as on bank documents"
                                                disabled={!unlockedFields["accountHolderName"]}
                                                className={!unlockedFields["accountHolderName"] ? "bg-muted/30 border-transparent" : "border-primary/50 ring-1 ring-primary/20"}
                                            />
                                        </FormControl>
                                        <PendingValueIndicator fieldName="accountHolderName" />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="accountNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <EditableLabel label="Account Number" fieldName="accountNumber" />
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="e.g., 000123456789"
                                                disabled={!unlockedFields["accountNumber"]}
                                                className={!unlockedFields["accountNumber"] ? "bg-muted/30 border-transparent" : "border-primary/50 ring-1 ring-primary/20"}
                                            />
                                        </FormControl>
                                        <PendingValueIndicator fieldName="accountNumber" />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                            <FormField
                                control={form.control}
                                name="payoutCycle"
                                render={({ field }) => (
                                    <FormItem>
                                        <EditableLabel label="Payout Cycle" fieldName="payoutCycle" />
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            disabled={!unlockedFields["payoutCycle"]}
                                        >
                                            <FormControl>
                                                <SelectTrigger className={!unlockedFields["payoutCycle"] ? "bg-muted/30 border-transparent mt-0" : "border-primary/50 ring-1 ring-primary/20 mt-0"}>
                                                    <SelectValue placeholder="Select payout cycle" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {payoutCycles.map((cycle) => (
                                                    <SelectItem key={cycle.value} value={cycle.value}>
                                                        {cycle.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <PendingValueIndicator fieldName="payoutCycle" />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {(form.watch("payoutCycle") === "monthly" || form.watch("payoutCycle") === "quarterly") && (
                                <FormField
                                    control={form.control}
                                    name="payoutDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <EditableLabel label="Payout Date" fieldName="payoutDate" />
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                disabled={!unlockedFields["payoutDate"]}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className={!unlockedFields["payoutDate"] ? "bg-muted/30 border-transparent mt-0" : "border-primary/50 ring-1 ring-primary/20 mt-0"}>
                                                        <SelectValue placeholder="Select payout date" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {payoutDates.map((date) => (
                                                        <SelectItem key={date.value} value={date.value}>
                                                            {date.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <PendingValueIndicator fieldName="payoutDate" />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Marketing Permissions */}
                <div className="bg-muted/30 rounded-xl p-6 border border-border">
                    <FormField
                        control={form.control}
                        name="marketingPermission"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel className="text-base font-semibold">
                                        Grant marketing permission
                                    </FormLabel>
                                    <FormDescription className="text-sm">
                                        I grant LankaPass permission to use my uploaded images, logos, and videos for marketing purposes on the platform and promotional materials.
                                    </FormDescription>
                                </div>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end pt-4 sticky bottom-0 bg-background/80 backdrop-blur-sm p-4 border-t rounded-t-xl z-10 shadow-lg">
                    <Button type="submit" size="lg" disabled={isUpdating} className="w-full sm:w-auto min-w-[200px]">
                        {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default ProfileForm;

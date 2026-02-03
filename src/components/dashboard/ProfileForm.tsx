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
import { Building2, Phone, Mail, MapPin, Landmark, Loader2, FileText, Upload, Eye, ExternalLink, Image as ImageIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { vendorService } from "@/services/vendorService";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
    onUploadSuccess
}: {
    label: string,
    fileType: string,
    vendorId: string,
    currentUrl?: string,
    onUploadSuccess: (url: string) => void
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
                            disabled={isUploading}
                        />
                    </Button>
                </div>
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
            const updatedValues = {
                ...values,
                regCertificateUrl: documents.regCertificate,
                nicPassportUrl: documents.nicPassport,
                tourismLicenseUrl: documents.tourismLicense,
            };
            const response = await vendorService.updateVendorProfile(updatedValues);
            if (response.success) {
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
                                        <FormLabel>Business Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="e.g., Adventure Paradise Tours" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="vendorType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Vendor Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
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
                                            <FormLabel>Specify Vendor Type</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Please specify" />
                                            </FormControl>
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
                                        <FormLabel>Legal Name (Optional)</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Full Legal Entity Name" />
                                        </FormControl>
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
                                        <FormLabel>Contact Person</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="e.g., John Doe" />
                                        </FormControl>
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
                                        <FormLabel>Phone Number</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="+94 77 XXX XXXX" />
                                        </FormControl>
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
                                    <FormLabel>Operating Areas</FormLabel>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mt-2">
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
                                        <FormLabel>Other Areas</FormLabel>
                                        <FormControl>
                                            <Textarea {...field} placeholder="Please list other areas" />
                                        </FormControl>
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
                                    <FormLabel>Business Address</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} placeholder="Enter your registered business address" />
                                    </FormControl>
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
                                        <FormLabel>Business Registration Number</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="e.g., BR-XXXXX" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="taxId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tax ID / VAT (Optional)</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Tax Identification Number" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Document Uploads */}
                        <div className="space-y-4 pt-4 border-t">
                            <h3 className="text-sm font-semibold text-foreground">Documents</h3>
                            <div className="grid gap-4">
                                <DocumentUploadField
                                    label="Business Registration Certificate"
                                    fileType="reg_certificate"
                                    vendorId={initialData.id}
                                    currentUrl={documents.regCertificate}
                                    onUploadSuccess={(url) => setDocuments(prev => ({ ...prev, regCertificate: url }))}
                                />
                                <DocumentUploadField
                                    label="NIC / Passport"
                                    fileType="nic_passport"
                                    vendorId={initialData.id}
                                    currentUrl={documents.nicPassport}
                                    onUploadSuccess={(url) => setDocuments(prev => ({ ...prev, nicPassport: url }))}
                                />
                                <DocumentUploadField
                                    label="Tourism License (Optional)"
                                    fileType="tourism_license"
                                    vendorId={initialData.id}
                                    currentUrl={documents.tourismLicense}
                                    onUploadSuccess={(url) => setDocuments(prev => ({ ...prev, tourismLicense: url }))}
                                />
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
                                        <FormLabel>Bank Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="e.g., Bank of Ceylon" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="bankBranch"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bank Branch</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="e.g., Colombo Main" />
                                        </FormControl>
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
                                        <FormLabel>Account Holder Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Name exactly as on bank documents" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="accountNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Account Number</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="e.g., 000123456789" />
                                        </FormControl>
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
                                        <FormLabel>Payout Cycle</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
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
                                            <FormLabel>Payout Date</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
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

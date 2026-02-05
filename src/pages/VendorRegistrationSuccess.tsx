import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Mail, Clock, FileText, Home, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';
import { vendorService } from '@/services/vendorService';
import { generateVendorPDF } from '@/utils/generateVendorPDF';

const VendorRegistrationSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { vendorId, businessName, email } = location.state || {};
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
        if (!vendorId) {
            toast.error('Missing application ID. Please contact support.');
            return;
        }

        setIsDownloading(true);
        try {
            // Fetch full vendor data to ensure PDF has all details
            const response = await vendorService.getVendor(vendorId);

            if (!response.success) {
                throw new Error(response.message || 'Failed to fetch vendor data');
            }

            const v = response.vendor;
            const services = response.services || [];

            // Map to the format generateVendorPDF expects
            const fullVendorData = {
                id: v.id,
                submittedAt: new Date(v.created_at).toISOString().split('T')[0],
                status: v.status || "pending",
                vendorType: v.vendor_type || "",
                businessName: v.business_name || "",
                legalName: v.legal_name || "",
                contactPerson: v.contact_person || "",
                countryCode: "+94",
                mobileNumber: v.phone_number || "",
                email: v.email || "",
                website: v.website || "",
                businessAddress: v.business_address || "",
                operatingAreas: v.operating_areas || [],
                businessRegNumber: v.business_reg_number || "",
                taxId: v.tax_id || "",
                bankName: v.bank_name || "",
                accountHolderName: v.account_holder_name || "",
                accountNumber: v.account_number || "",
                bankBranch: v.bank_branch || "",
                payoutFrequency: v.payout_frequency || "",
                logoUrl: v.logo_url,
                coverImageUrl: v.cover_image_url,
                galleryUrls: v.gallery_urls || [],
                documents: {
                    businessRegistration: v.reg_certificate_url,
                    nicPassport: v.nic_passport_url,
                    tourismLicense: v.tourism_license_url,
                },
                services: services.map((s: any) => ({
                    id: s.id,
                    serviceName: s.service_name,
                    serviceCategory: s.service_category,
                    shortDescription: s.short_description,
                    durationValue: s.duration_value,
                    durationUnit: s.duration_unit,
                    groupSizeMin: s.group_size_min,
                    groupSizeMax: s.group_size_max,
                    retailPrice: s.retail_price,
                    currency: s.currency,
                    netPrice: s.net_price ?? s.retail_price,
                    commission: s.commission ?? 0,
                    imageUrls: s.image_urls || [],
                    languagesOffered: s.languages_offered || [],
                    operatingDays: s.operating_days || [],
                    whatsIncluded: s.whats_included || '',
                    whatsNotIncluded: s.whats_not_included || '',
                    cancellationPolicy: s.cancellation_policy || '',
                    advanceBooking: s.advance_booking || 'N/A',
                    operatingHoursFrom: s.operating_hours_from,
                    operatingHoursFromPeriod: s.operating_hours_from_period,
                    operatingHoursTo: s.operating_hours_to,
                    operatingHoursToPeriod: s.operating_hours_to_period,
                    status: s.status
                })),
                pricing: services.map((s: any) => ({
                    currency: s.currency,
                    retailPrice: s.retail_price,
                    netPrice: s.net_price ?? s.retail_price,
                    commission: s.commission ?? 0,
                })),
            };

            generateVendorPDF(fullVendorData);
            toast.success('Professional registration confirmation downloaded!');
        } catch (error: any) {
            console.error('Download failed:', error);
            toast.error(error.message || 'Failed to download confirmation. Please try again.');
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-amber-100/50">
                    {/* Success Icon */}
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl md:text-3xl font-display font-bold text-amber-900 mb-4 px-2">
                        Application Submitted Successfully!
                    </h1>

                    <p className="text-gray-600 mb-8 max-w-lg mx-auto">
                        Thank you for choosing Lanka Pass Travel. Your vendor application has been received and is under review.
                    </p>

                    {/* Application Details */}
                    <div className="bg-amber-50 rounded-xl p-6 mb-8 text-left border border-amber-100">
                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border border-amber-200">
                                    <FileText className="w-5 h-5 text-amber-600" />
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-wider font-semibold text-amber-800/60 mb-1">Application ID</p>
                                    <p className="text-lg font-mono font-medium text-amber-950">{vendorId || 'VP-' + Date.now().toString().slice(-8)}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border border-blue-200">
                                    <Mail className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-wider font-semibold text-blue-800/60 mb-1">Business Name</p>
                                    <p className="text-lg font-medium text-amber-950">{businessName || 'Your Business'}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border border-green-200">
                                    <Clock className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-wider font-semibold text-green-800/60 mb-1">Next Steps</p>
                                    <ul className="text-sm text-amber-900/80 space-y-2 mt-2">
                                        <li className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                                            Our team will review your application within 2-3 business days
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                                            <span>You'll receive an email at <span className="font-semibold break-all">{email || 'your email'}</span> with verification results</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                                            Once approved, you'll get access to your full vendor dashboard
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Visual Timeline */}
                    <div className="mb-10 relative">
                        {/* Desktop Connector */}
                        <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-amber-100 -translate-y-1/2 hidden md:block" />

                        {/* Mobile Connector */}
                        <div className="absolute left-1/2 top-4 bottom-4 w-0.5 bg-amber-100 -translate-x-1/2 md:hidden" />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                            <div className="bg-white p-4 rounded-xl border border-amber-100 shadow-sm relative z-10 transition-transform hover:scale-105 duration-300">
                                <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold mx-auto mb-2 shadow-md">1</div>
                                <p className="text-sm font-semibold text-gray-800">Review</p>
                                <p className="text-[11px] text-gray-500 mt-1">Our team checks your details</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-amber-100 shadow-sm relative z-10 transition-transform hover:scale-105 duration-300">
                                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold mx-auto mb-2 border border-amber-200">2</div>
                                <p className="text-sm font-semibold text-gray-800">Verification</p>
                                <p className="text-[11px] text-gray-500 mt-1">Background checks & ID</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-amber-100 shadow-sm relative z-10 transition-transform hover:scale-105 duration-300">
                                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold mx-auto mb-2 border border-amber-200">3</div>
                                <p className="text-sm font-semibold text-gray-800">Activation</p>
                                <p className="text-[11px] text-gray-500 mt-1">Full dashboard access</p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            variant="outline"
                            onClick={() => navigate('/')}
                            className="flex items-center gap-2 h-12 px-8"
                        >
                            <Home className="w-4 h-4" />
                            Back to Home
                        </Button>

                        <Button
                            variant="outline"
                            onClick={handleDownload}
                            disabled={isDownloading}
                            className="flex items-center gap-2 h-12 px-8 border-green-200 text-green-700 hover:bg-green-50"
                        >
                            <Download className="w-4 h-4" />
                            {isDownloading ? 'Downloading...' : 'Download Enrollment Form'}
                        </Button>

                        <Button
                            variant="default"
                            onClick={() => navigate('/onboarding')}
                            className="bg-amber-500 hover:bg-amber-600 h-12 px-8"
                        >
                            Submit Another Application
                        </Button>
                    </div>

                    {/* Contact Info */}
                    <div className="mt-10 pt-6 border-t border-gray-100">
                        <p className="text-sm text-gray-500">
                            Need immediate assistance? Email our onboarding team at{' '}
                            <a href="mailto:vendors@lankapass.com" className="text-amber-600 font-semibold hover:underline">
                                vendors@lankapass.com
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorRegistrationSuccess;

import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Mail, Clock, FileText, Home, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'sonner';

const VendorRegistrationSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { vendorId, businessName, email } = location.state || {};
    const contentRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
        if (!contentRef.current) return;

        setIsDownloading(true);
        try {
            // Capture the content as canvas
            const canvas = await html2canvas(contentRef.current, {
                scale: 2,
                backgroundColor: '#fffbeb', // amber-50 background
                logging: false,
                useCORS: true
            });

            // Convert to PDF
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const imgWidth = 210; // A4 width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

            // Download with filename
            const filename = `LankaPass_Registration_${vendorId || 'Confirmation'}.pdf`;
            pdf.save(filename);

            toast.success('Registration confirmation downloaded successfully!');
        } catch (error) {
            console.error('Download failed:', error);
            toast.error('Failed to download confirmation. Please try again.');
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                <div ref={contentRef} className="bg-white rounded-2xl shadow-xl p-8 text-center border border-amber-100/50">
                    {/* Success Icon */}
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl font-display font-bold text-amber-900 mb-4">
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
                                            You'll receive an email at <span className="font-semibold">{email || 'your email'}</span> with verification results
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
                        <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-gray-100 -translate-y-1/2 hidden md:block" />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm relative z-10">
                                <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold mx-auto mb-2">1</div>
                                <p className="text-sm font-semibold text-gray-800">Review</p>
                                <p className="text-xs text-gray-500 mt-1">Our team checks your details</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm relative z-10">
                                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold mx-auto mb-2">2</div>
                                <p className="text-sm font-semibold text-gray-800">Verification</p>
                                <p className="text-xs text-gray-500 mt-1">Background checks & ID</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm relative z-10">
                                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold mx-auto mb-2">3</div>
                                <p className="text-sm font-semibold text-gray-800">Activation</p>
                                <p className="text-xs text-gray-500 mt-1">Full dashboard access</p>
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
                            {isDownloading ? 'Downloading...' : 'Download Confirmation'}
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
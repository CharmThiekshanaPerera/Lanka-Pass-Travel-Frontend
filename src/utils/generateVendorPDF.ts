import jsPDF from 'jspdf';

interface VendorData {
    id: string;
    businessName: string;
    legalName?: string;
    contactPerson: string;
    countryCode: string;
    mobileNumber: string;
    email: string;
    businessAddress: string;
    vendorType: string;
    businessRegNumber?: string;
    taxId?: string;
    submittedAt: string;
    status: string;
    operatingAreas: string[];
    bankName?: string;
    accountHolderName?: string;
    accountNumber?: string;
    bankBranch?: string;
    payoutFrequency?: string;
    payoutCycle?: string;
    payoutDate?: string;
    logoUrl?: string;
    coverImageUrl?: string;
    galleryUrls?: string[];
    documents: {
        businessRegistration?: string;
        nicPassport?: string;
        tourismLicense?: string;
    };
    services: any[];
    pricing: any[];
    adminNotes?: string;
}

export const generateVendorPDF = (vendor: VendorData) => {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    const contentWidth = pageWidth - 2 * margin;
    let y = 20;

    // Helper functions
    const addNewPage = () => {
        doc.addPage();
        y = 20;
    };

    const checkPageBreak = (neededHeight: number) => {
        if (y + neededHeight > 270) {
            addNewPage();
        }
    };

    const addSectionTitle = (title: string) => {
        checkPageBreak(15);
        doc.setFillColor(20, 184, 166); // Teal
        doc.rect(margin, y, contentWidth, 8, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(title.toUpperCase(), margin + 3, y + 5.5);
        doc.setTextColor(0, 0, 0);
        y += 12;
    };

    const addField = (label: string, value: string | undefined | null, isLink = false) => {
        checkPageBreak(10);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(100, 100, 100);
        doc.text(label + ':', margin, y);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);

        const displayValue = value || 'Not provided';
        const maxWidth = contentWidth - 50;

        if (isLink && value) {
            doc.setTextColor(20, 120, 200);
            const linkLines = doc.splitTextToSize(displayValue, maxWidth);
            doc.text(linkLines, margin + 45, y);
            y += linkLines.length * 4 + 3;
            doc.setTextColor(0, 0, 0);
        } else {
            const lines = doc.splitTextToSize(displayValue, maxWidth);
            doc.text(lines, margin + 45, y);
            y += lines.length * 4 + 3;
        }
    };

    const addMultiLineField = (label: string, value: string | undefined | null) => {
        if (!value) return;
        checkPageBreak(20);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(100, 100, 100);
        doc.text(label + ':', margin, y);
        y += 5;

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        const lines = doc.splitTextToSize(value, contentWidth - 5);
        checkPageBreak(lines.length * 4);
        doc.text(lines, margin + 3, y);
        y += lines.length * 4 + 5;
    };

    // ========== HEADER ==========
    doc.setFillColor(245, 158, 11); // Amber
    doc.rect(0, 0, pageWidth, 35, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('VENDOR PROFILE DOCUMENT', pageWidth / 2, 15, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Lanka Pass Travel - Admin Portal', pageWidth / 2, 22, { align: 'center' });
    doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, 28, { align: 'center' });

    doc.setTextColor(0, 0, 0);
    y = 45;

    // ========== VENDOR SUMMARY ==========
    doc.setFillColor(240, 240, 240);
    doc.roundedRect(margin, y, contentWidth, 25, 3, 3, 'F');

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(vendor.businessName, margin + 5, y + 10);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(`ID: ${vendor.id}`, margin + 5, y + 17);
    doc.text(`Status: ${vendor.status.toUpperCase()}`, margin + 80, y + 17);
    doc.text(`Type: ${vendor.vendorType}`, margin + 120, y + 17);

    doc.setTextColor(0, 0, 0);
    y += 35;

    // ========== CONTACT INFORMATION ==========
    addSectionTitle('Contact Information');
    addField('Contact Person', vendor.contactPerson);
    addField('Phone', `${vendor.countryCode} ${vendor.mobileNumber}`);
    addField('Email', vendor.email);
    addField('Address', vendor.businessAddress);
    y += 5;

    // ========== BUSINESS DETAILS ==========
    addSectionTitle('Business Details');
    addField('Legal Name', vendor.legalName);
    addField('Vendor Type', vendor.vendorType);
    addField('Registration No.', vendor.businessRegNumber);
    addField('Tax ID / VAT', vendor.taxId);
    addField('Submitted Date', vendor.submittedAt);
    addField('Operating Areas', vendor.operatingAreas?.join(', '));
    y += 5;

    // ========== BANKING INFORMATION ==========
    if (vendor.bankName || vendor.accountNumber) {
        addSectionTitle('Banking Information');
        addField('Bank Name', vendor.bankName);
        addField('Account Holder', vendor.accountHolderName);
        addField('Account Number', vendor.accountNumber);
        addField('Branch', vendor.bankBranch);
        addField('Payout Frequency', vendor.payoutFrequency);
        y += 5;
    }

    // ========== DOCUMENTS (LINKS) ==========
    addSectionTitle('Documents');
    addField('Business Registration', vendor.documents.businessRegistration, true);
    addField('NIC / Passport', vendor.documents.nicPassport, true);
    addField('Tourism License', vendor.documents.tourismLicense, true);
    y += 5;

    // ========== MEDIA LINKS ==========
    addSectionTitle('Media & Gallery');
    addField('Logo URL', vendor.logoUrl, true);
    addField('Cover Image URL', vendor.coverImageUrl, true);

    if (vendor.galleryUrls && vendor.galleryUrls.length > 0) {
        checkPageBreak(10);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(100, 100, 100);
        doc.text('Gallery Images:', margin, y);
        y += 5;

        vendor.galleryUrls.forEach((url, idx) => {
            checkPageBreak(6);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(20, 120, 200);
            const truncatedUrl = url.length > 70 ? url.substring(0, 70) + '...' : url;
            doc.text(`${idx + 1}. ${truncatedUrl}`, margin + 3, y);
            y += 5;
        });
        doc.setTextColor(0, 0, 0);
    }
    y += 5;

    // ========== SERVICES ==========
    if (vendor.services && vendor.services.length > 0) {
        addSectionTitle(`Services (${vendor.services.length})`);

        vendor.services.forEach((service, index) => {
            checkPageBreak(50);

            // Service header
            doc.setFillColor(250, 250, 250);
            doc.roundedRect(margin, y, contentWidth, 8, 2, 2, 'F');
            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.text(`${index + 1}. ${service.serviceName || 'Unnamed Service'}`, margin + 3, y + 5.5);

            const pricing = vendor.pricing[index];
            if (pricing) {
                doc.setFontSize(10);
                doc.text(`${pricing.currency || 'USD'} ${pricing.retailPrice || 'N/A'}`, pageWidth - margin - 25, y + 5.5);
            }
            y += 12;

            addField('Category', service.serviceCategory);
            addField('Status', service.status || 'pending');
            addField('Duration', `${service.durationValue} ${service.durationUnit}`);
            addField('Group Size', `${service.groupSizeMin} - ${service.groupSizeMax} people`);
            addField('Advance Booking', service.advanceBooking);
            addField('Languages', service.languagesOffered?.join(', '));
            addField('Operating Days', service.operatingDays?.join(', '));

            if (service.operatingHoursFrom) {
                addField('Operating Hours', `${service.operatingHoursFrom} ${service.operatingHoursFromPeriod} - ${service.operatingHoursTo} ${service.operatingHoursToPeriod}`);
            }

            addMultiLineField('Description', service.shortDescription);
            addMultiLineField("What's Included", service.whatsIncluded);
            addMultiLineField("What's Not Included", service.whatsNotIncluded);
            addMultiLineField('Cancellation Policy', service.cancellationPolicy);

            // Service images
            if (service.imageUrls && service.imageUrls.length > 0) {
                checkPageBreak(10);
                doc.setFontSize(9);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(100, 100, 100);
                doc.text('Service Images:', margin, y);
                y += 5;

                service.imageUrls.forEach((url: string, imgIdx: number) => {
                    checkPageBreak(5);
                    doc.setFont('helvetica', 'normal');
                    doc.setTextColor(20, 120, 200);
                    const truncatedUrl = url.length > 65 ? url.substring(0, 65) + '...' : url;
                    doc.text(`  ${imgIdx + 1}. ${truncatedUrl}`, margin, y);
                    y += 4;
                });
                doc.setTextColor(0, 0, 0);
            }

            y += 8;
        });
    }

    // ========== FOOTER ==========
    const pageCount = doc.internal.pages.length - 1;
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
            `Page ${i} of ${pageCount} | Lanka Pass Travel - Confidential Document`,
            pageWidth / 2,
            290,
            { align: 'center' }
        );
    }

    // Save the PDF
    const filename = `LankaPass_Vendor_${vendor.businessName.replace(/\s+/g, '_')}_${vendor.id}.pdf`;
    doc.save(filename);

    return filename;
};

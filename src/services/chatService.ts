// chatService.ts
// Service for chat messages and update request approval workflow

import { api } from '../lib/api';

export interface ChatMessage {
    id: string;
    vendor_id: string;
    sender: 'vendor' | 'admin';
    sender_id: string;
    sender_name: string;
    message: string;
    message_type: 'text' | 'update_request' | 'system';
    attachments: {
        name: string;
        url: string;
        type: 'image' | 'file';
    }[];
    update_request_id?: string;
    created_at: string;
    read_at?: string;
}

export interface UpdateRequest {
    id: string;
    vendor_id: string;
    service_id?: string;  // For service update requests
    requested_by: string;
    requested_by_name: string;
    request_type: string;
    current_data: Record<string, any>;
    requested_data: Record<string, any>;
    changed_fields: string[];
    status: 'pending' | 'approved' | 'rejected';
    reviewed_by?: string;
    reviewed_by_name?: string;
    review_reason?: string;
    created_at: string;
    reviewed_at?: string;
}

export interface ChatMessagesResponse {
    success: boolean;
    messages: ChatMessage[];
}

export interface UpdateRequestsResponse {
    success: boolean;
    requests: UpdateRequest[];
    count: number;
}

class ChatService {
    // ==================== CHAT MESSAGES ====================

    /**
     * Send a chat message
     */
    async sendMessage(
        vendorId: string,
        message: string,
        attachments?: { name: string; url: string; type: 'image' | 'file' }[]
    ): Promise<{ success: boolean; message: ChatMessage }> {
        try {
            const response = await api.post(`/api/chat/messages/${vendorId}`, {
                message,
                attachments: attachments || []
            });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.detail || 'Failed to send message');
        }
    }

    /**
     * Get chat messages for a vendor
     */
    async getMessages(
        vendorId: string,
        limit: number = 100,
        skip: number = 0
    ): Promise<ChatMessagesResponse> {
        try {
            const response = await api.get(`/api/chat/messages/${vendorId}`, {
                params: { limit, skip }
            });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.detail || 'Failed to fetch messages');
        }
    }

    /**
     * Get unread message count for admin
     */
    async getUnreadCount(): Promise<{ success: boolean; unread_count: number }> {
        try {
            const response = await api.get('/api/admin/chat/unread-count');
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.detail || 'Failed to get unread count');
        }
    }

    // ==================== UPDATE REQUESTS ====================

    /**
     * Get pending update requests (admin)
     */
    async getPendingUpdateRequests(
        vendorId?: string,
        limit: number = 50,
        skip: number = 0
    ): Promise<UpdateRequestsResponse> {
        try {
            const params: any = { status: 'pending', limit, skip };
            if (vendorId) params.vendor_id = vendorId;

            const response = await api.get('/api/admin/update-requests', { params });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.detail || 'Failed to fetch update requests');
        }
    }

    /**
     * Get all update requests (admin)
     */
    async getAllUpdateRequests(
        status?: string,
        limit: number = 50,
        skip: number = 0
    ): Promise<UpdateRequestsResponse> {
        try {
            const params: any = { limit, skip };
            if (status) params.status = status;

            const response = await api.get('/api/admin/update-requests', { params });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.detail || 'Failed to fetch update requests');
        }
    }

    /**
     * Get update request by ID
     */
    async getUpdateRequestById(requestId: string): Promise<{ success: boolean; request: UpdateRequest }> {
        try {
            const response = await api.get(`/api/admin/update-requests/${requestId}`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.detail || 'Failed to fetch update request');
        }
    }

    /**
     * Approve an update request
     */
    async approveUpdateRequest(requestId: string): Promise<{ success: boolean; message: string; request: UpdateRequest }> {
        try {
            const response = await api.post(`/api/admin/update-requests/${requestId}/approve`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.detail || 'Failed to approve update request');
        }
    }

    /**
     * Reject an update request
     */
    async rejectUpdateRequest(
        requestId: string,
        reason: string
    ): Promise<{ success: boolean; message: string; request: UpdateRequest }> {
        try {
            const response = await api.post(`/api/admin/update-requests/${requestId}/reject`, {
                reason
            });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.detail || 'Failed to reject update request');
        }
    }

    /**
     * Get vendor's own update requests
     */
    async getVendorUpdateRequests(
        status?: string,
        limit: number = 20,
        skip: number = 0
    ): Promise<UpdateRequestsResponse> {
        try {
            const params: any = { limit, skip };
            if (status) params.status = status;

            const response = await api.get('/api/vendor/update-requests', { params });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.detail || 'Failed to fetch update requests');
        }
    }

    /**
     * Get service update requests for a specific service
     */
    async getServiceUpdateRequests(
        serviceId?: string,
        status?: string,
        limit: number = 20,
        skip: number = 0
    ): Promise<UpdateRequestsResponse> {
        try {
            const params: any = { limit, skip };
            if (status) params.status = status;
            if (serviceId) params.service_id = serviceId;

            const response = await api.get('/api/vendor/update-requests', { params });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.detail || 'Failed to fetch service update requests');
        }
    }

    // ==================== HELPERS ====================

    /**
     * Format field name for display
     */
    formatFieldName(field: string): string {
        const fieldMap: Record<string, string> = {
            // Profile fields
            businessName: 'Business Name',
            legalName: 'Legal Name',
            contactPerson: 'Contact Person',
            phoneNumber: 'Phone Number',
            operatingAreas: 'Operating Areas',
            operatingAreasOther: 'Other Operating Areas',
            vendorType: 'Vendor Type',
            vendorTypeOther: 'Other Vendor Type',
            businessAddress: 'Business Address',
            businessRegNumber: 'Business Registration Number',
            taxId: 'Tax ID',
            bankName: 'Bank Name',
            bankNameOther: 'Other Bank Name',
            accountHolderName: 'Account Holder Name',
            accountNumber: 'Account Number',
            bankBranch: 'Bank Branch',
            payoutCycle: 'Payout Cycle',
            payoutDate: 'Payout Date',
            // Service fields
            serviceName: 'Service Name',
            serviceCategory: 'Category',
            serviceCategoryOther: 'Other Category',
            shortDescription: 'Description',
            whatsIncluded: "What's Included",
            whatsNotIncluded: "What's Not Included",
            retailPrice: 'Price',
            currency: 'Currency',
            durationValue: 'Duration',
            durationUnit: 'Duration Unit',
            languagesOffered: 'Languages',
            languagesOther: 'Other Languages',
            groupSizeMin: 'Min Group Size',
            groupSizeMax: 'Max Group Size',
            dailyCapacity: 'Daily Capacity',
            operatingDays: 'Operating Days',
            locationsCovered: 'Locations',
            operatingHoursFrom: 'Opening Time',
            operatingHoursTo: 'Closing Time',
            blackoutDates: 'Blackout Dates',
            blackoutHolidays: 'Blackout Holidays',
            blackoutWeekends: 'Blackout Weekends',
            advanceBooking: 'Advance Booking',
            advanceBookingOther: 'Other Advance Booking',
            notSuitableFor: 'Not Suitable For',
            importantInfo: 'Important Info',
            cancellationPolicy: 'Cancellation Policy',
            accessibilityInfo: 'Accessibility Info',
            serviceTimeSlots: 'Time Slots'
        };
        return fieldMap[field] || field;
    }

    /**
     * Map frontend field name to database key
     */
    getDbKey(field: string): string {
        const map: Record<string, string> = {
            // Profile fields
            businessName: 'business_name',
            legalName: 'legal_name',
            contactPerson: 'contact_person',
            phoneNumber: 'phone_number',
            operatingAreas: 'operating_areas',
            operatingAreasOther: 'operating_areas_other',
            vendorType: 'vendor_type',
            vendorTypeOther: 'vendor_type_other',
            businessAddress: 'business_address',
            businessRegNumber: 'business_reg_number',
            taxId: 'tax_id',
            bankName: 'bank_name',
            bankNameOther: 'bank_name_other',
            accountHolderName: 'account_holder_name',
            accountNumber: 'account_number',
            bankBranch: 'bank_branch',
            payoutCycle: 'payout_cycle',
            payoutDate: 'payout_date',
            regCertificateUrl: 'reg_certificate_url',
            nicPassportUrl: 'nic_passport_url',
            tourismLicenseUrl: 'tourism_license_url',
            logoUrl: 'logo_url',
            coverImageUrl: 'cover_image_url',
            galleryUrls: 'gallery_urls',
            // Service fields
            serviceName: 'service_name',
            serviceCategory: 'service_category',
            serviceCategoryOther: 'service_category_other',
            shortDescription: 'short_description',
            whatsIncluded: 'whats_included',
            whatsNotIncluded: 'whats_not_included',
            retailPrice: 'retail_price',
            currency: 'currency',
            durationValue: 'duration_value',
            durationUnit: 'duration_unit',
            languagesOffered: 'languages_offered',
            languagesOther: 'languages_other',
            groupSizeMin: 'group_size_min',
            groupSizeMax: 'group_size_max',
            dailyCapacity: 'daily_capacity',
            operatingDays: 'operating_days',
            locationsCovered: 'locations_covered',
            operatingHoursFrom: 'operating_hours_from',
            operatingHoursFromPeriod: 'operating_hours_from_period',
            operatingHoursTo: 'operating_hours_to',
            operatingHoursToPeriod: 'operating_hours_to_period',
            blackoutDates: 'blackout_dates',
            blackoutHolidays: 'blackout_holidays',
            blackoutWeekends: 'blackout_weekends',
            advanceBooking: 'advance_booking',
            advanceBookingOther: 'advance_booking_other',
            notSuitableFor: 'not_suitable_for',
            importantInfo: 'important_info',
            cancellationPolicy: 'cancellation_policy',
            accessibilityInfo: 'accessibility_info',
            serviceTimeSlots: 'service_time_slots',
            imageUrls: 'image_urls'
        };
        return map[field] || field;
    }


    /**
     * Get status badge color
     */
    getStatusColor(status: string): string {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }
}

export const chatService = new ChatService();

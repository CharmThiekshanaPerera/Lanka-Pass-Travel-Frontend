// vendorService.ts
import { api } from '../lib/api';

export interface ServiceData {
  serviceName: string;
  serviceCategory: string;
  serviceCategoryOther?: string;
  shortDescription: string;
  whatsIncluded?: string;
  whatsNotIncluded?: string;
  durationValue: number;
  durationUnit: string;
  languagesOffered: string[];
  languagesOther?: string;
  groupSizeMin: number;
  groupSizeMax: number;
  dailyCapacity?: number;
  operatingDays: string[];
  locationsCovered: string[];
  retailPrice: number;
  currency: string;
  advanceBooking?: string;
  advanceBookingOther?: string;
  notSuitableFor?: string;
  importantInfo?: string;
  cancellationPolicy?: string;
  accessibilityInfo?: string;
  operatingHoursFrom?: string;
  operatingHoursFromPeriod?: string;
  operatingHoursTo?: string;
  operatingHoursToPeriod?: string;
  blackoutDates?: any[];
  blackoutHolidays?: boolean;
  serviceImages?: File[];
}

export interface VendorRegistrationData {
  // Step 1: Vendor Basics
  vendorType: string;
  vendorTypeOther?: string;
  businessName: string;
  legalName?: string;
  contactPerson: string;
  email: string;
  phoneNumber: string;
  operatingAreas: string[];
  operatingAreasOther?: string;

  // Step 2: Business Details
  businessRegNumber?: string;
  businessAddress: string;
  taxId?: string;

  // Step 3: Service Details
  services: ServiceData[];

  // Step 4: Documents
  businessRegCertificate?: File;
  nicPassport?: File;
  tourismLicense?: File;

  // Step 5: Media
  logo?: File;
  coverImage?: File;
  galleryImages?: File[];
  promoVideo?: File;

  // Step 6: Payment Details
  bankName: string;
  bankNameOther?: string;
  accountHolderName: string;
  accountNumber: string;
  bankBranch: string;


  // Step 7: Agreements
  acceptTerms: boolean;
  acceptCommission: boolean;
  acceptCancellation: boolean;
  grantRights: boolean;
  confirmAccuracy: boolean;
  marketingPermission: boolean;

  // Additional metadata
  phoneVerified?: boolean;

  // Account Details
  password?: string;
}

export interface VendorResponse {
  success: boolean;
  message: string;
  vendor_id: string;
  user_id: string;
  status: string;
  next_steps: string;
  access_token?: string;
  user?: any;
}

export interface FileUploadResponse {
  success: boolean;
  url: string;
  message: string;
}

export interface VendorDetails {
  id: string;
  user_id: string;
  business_name: string;
  contact_person: string;
  email: string;
  phone_number: string;
  status: string;
  vendor_type: string;
  created_at: string;
  // ... other vendor fields
}

export interface VendorListResponse {
  success: boolean;
  vendors: VendorDetails[];
  count: number;
}

class VendorService {
  // Helper to generate a secure random password
  private generateSecurePassword(): string {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 16; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  // Submit vendor registration
  async registerVendor(formData: VendorRegistrationData): Promise<VendorResponse> {
    try {
      console.log('Submitting vendor registration...');

      // Prepare data for API
      const submissionData = {
        // Step 1
        vendorType: formData.vendorType,
        vendorTypeOther: formData.vendorTypeOther,
        businessName: formData.businessName,
        legalName: formData.legalName,
        contactPerson: formData.contactPerson,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        operatingAreas: formData.operatingAreas || [],
        operatingAreasOther: formData.operatingAreasOther,

        // Step 2
        businessRegNumber: formData.businessRegNumber,
        businessAddress: formData.businessAddress,
        taxId: formData.taxId,

        // Step 3
        services: (formData.services || []).map((s: any) => ({
          ...s,
          durationValue: Number(s.durationValue) || 0,
          groupSizeMin: Number(s.groupSizeMin) || 0,
          groupSizeMax: Number(s.groupSizeMax) || 0,
          dailyCapacity: s.dailyCapacity ? Number(s.dailyCapacity) : undefined,
          retailPrice: Number(s.retailPrice) || 0,
          // Operating hours
          operatingHoursFrom: s.operatingHoursFrom,
          operatingHoursFromPeriod: s.operatingHoursFromPeriod,
          operatingHoursTo: s.operatingHoursTo,
          operatingHoursToPeriod: s.operatingHoursToPeriod,
          // Blackout dates
          blackoutDates: (s.blackoutDates || []).map((date: Date) => date.toISOString()),
          blackoutHolidays: s.blackoutHolidays || false,
          // Additional service info (ensure they're included)
          advanceBooking: s.advanceBooking,
          advanceBookingOther: s.advanceBookingOther,
          notSuitableFor: s.notSuitableFor,
          importantInfo: s.importantInfo,
          cancellationPolicy: s.cancellationPolicy,
          accessibilityInfo: s.accessibilityInfo,
        })),

        // Step 6
        bankName: formData.bankName,
        bankNameOther: formData.bankNameOther,
        accountHolderName: formData.accountHolderName,
        accountNumber: formData.accountNumber,
        bankBranch: formData.bankBranch,


        // Step 7
        acceptTerms: formData.acceptTerms,
        acceptCommission: formData.acceptCommission,
        acceptCancellation: formData.acceptCancellation,
        grantRights: formData.grantRights,
        confirmAccuracy: formData.confirmAccuracy,
        marketingPermission: formData.marketingPermission,

        // Additional metadata
        phoneVerified: formData.phoneVerified || false,

        // Password - Default to '123456' if not provided
        password: formData.password || "123456"
      };

      // Submit to backend
      console.log('Submitting data:', submissionData);
      const response = await api.post<VendorResponse>('/api/vendor/register', submissionData);

      console.log('Vendor registration successful:', response.data);

      // Save token if present (Fix for 401 reload issue during upload)
      if (response.data.access_token) {
        localStorage.setItem('access_token', response.data.access_token);
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
      } else if (submissionData.email && submissionData.password) {
        // Fallback: Try to login automatically if no token returned
        try {
          console.log('Attempting auto-login for file uploads...');
          const loginRes = await api.post('/api/auth/login', {
            email: submissionData.email,
            password: submissionData.password
          });

          if (loginRes.data.access_token) {
            localStorage.setItem('access_token', loginRes.data.access_token);
            if (loginRes.data.user) {
              localStorage.setItem('user', JSON.stringify(loginRes.data.user));
            }
          }
        } catch (authError) {
          console.error('Auto-login failed, file uploads may fail with 401:', authError);
        }
      }

      // Upload files if vendor was created successfully
      if (response.data.success && response.data.vendor_id) {
        await this.uploadVendorFiles(formData, response.data.vendor_id);
      }

      return response.data;

    } catch (error: any) {
      console.error('Vendor registration error:', error);
      console.error('Error response:', error.response);

      // Extract detailed error message
      let errorMessage = 'Vendor registration failed';

      if (error.response?.data?.detail) {
        // FastAPI validation errors
        if (Array.isArray(error.response.data.detail)) {
          // Pydantic validation errors
          const errors = error.response.data.detail.map((err: any) => {
            const field = err.loc?.join('.') || 'unknown';
            return `${field}: ${err.msg}`;
          }).join(', ');
          errorMessage = `Validation errors: ${errors}`;
        } else if (typeof error.response.data.detail === 'string') {
          errorMessage = error.response.data.detail;
        } else {
          errorMessage = JSON.stringify(error.response.data.detail);
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  }

  // Upload all vendor files
  async uploadVendorFiles(formData: VendorRegistrationData, vendorId: string): Promise<void> {
    try {
      console.log('Starting file uploads for vendor:', vendorId);
      const uploadPromises = [];

      // Upload registration certificate
      if (formData.businessRegCertificate) {
        console.log('Uploading business registration certificate...');
        uploadPromises.push(
          this.uploadFile(
            formData.businessRegCertificate,
            vendorId,
            'reg_certificate'
          )
        );
      }

      // Upload NIC/Passport
      if (formData.nicPassport) {
        console.log('Uploading NIC/Passport...');
        uploadPromises.push(
          this.uploadFile(
            formData.nicPassport,
            vendorId,
            'nic_passport'
          )
        );
      }

      // Upload tourism license
      if (formData.tourismLicense) {
        console.log('Uploading tourism license...');
        uploadPromises.push(
          this.uploadFile(
            formData.tourismLicense,
            vendorId,
            'tourism_license'
          )
        );
      }

      // Upload logo
      if (formData.logo) {
        console.log('Uploading logo...');
        uploadPromises.push(
          this.uploadFile(
            formData.logo,
            vendorId,
            'logo'
          )
        );
      }

      // Upload cover image
      if (formData.coverImage) {
        console.log('Uploading cover image...');
        uploadPromises.push(
          this.uploadFile(
            formData.coverImage,
            vendorId,
            'cover_image'
          )
        );
      }

      // Upload gallery images
      if (formData.galleryImages && formData.galleryImages.length > 0) {
        console.log('Uploading gallery images...');
        formData.galleryImages.forEach((file: File) => {
          uploadPromises.push(
            this.uploadFile(file, vendorId, 'gallery')
          );
        });
      }

      // Upload promo video
      if (formData.promoVideo) {
        console.log('Uploading promo video...');
        uploadPromises.push(
          this.uploadFile(
            formData.promoVideo,
            vendorId,
            'promo_video'
          )
        );
      }

      // Upload service images
      if (formData.services && formData.services.length > 0) {
        console.log('Uploading service images...');
        formData.services.forEach((service: ServiceData, index: number) => {
          if (service.serviceImages && service.serviceImages.length > 0) {
            service.serviceImages.forEach((file: File) => {
              uploadPromises.push(
                this.uploadFile(
                  file,
                  vendorId,
                  `service_${index}`,
                  index
                )
              );
            });
          }
        });
      }

      // Execute all uploads
      if (uploadPromises.length > 0) {
        await Promise.all(uploadPromises);
        console.log('All files uploaded successfully');
      } else {
        console.log('No files to upload');
      }

    } catch (error: any) {
      console.error('File upload error:', error);
      throw new Error(error.response?.data?.detail || error.message || 'File upload failed');
    }
  }

  // Upload single file
  async uploadFile(
    file: File,
    vendorId: string,
    fileType: string,
    serviceIndex?: number,
    serviceId?: string
  ): Promise<FileUploadResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('vendor_id', vendorId);
      formData.append('file_type', fileType);

      if (serviceIndex !== undefined) {
        formData.append('service_index', serviceIndex.toString());
      }

      if (serviceId) {
        formData.append('service_id', serviceId);
      }

      const response = await api.post<FileUploadResponse>(
        '/api/vendor/upload-file',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log(`File uploaded (${fileType}):`, response.data.url);
      return response.data;

    } catch (error: any) {
      console.error(`File upload error (${fileType}):`, error);
      throw error;
    }
  }

  // Get vendor details
  async getVendor(vendorId: string): Promise<any> {
    try {
      const response = await api.get(`/api/admin/vendors/${vendorId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch vendor details');
    }
  }

  // Get all vendors
  async getVendors(
    status?: string,
    skip: number = 0,
    limit: number = 50
  ): Promise<VendorListResponse> {
    try {
      const params: any = { skip, limit };
      if (status) params.status = status;

      const response = await api.get<VendorListResponse>('/api/admin/vendors', { params });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch vendors');
    }
  }

  // Update vendor status (admin only)
  async updateVendorStatus(
    vendorId: string,
    status: string,
    reason?: string,
    adminNotes?: string,
    isPublic?: boolean
  ): Promise<any> {
    try {
      const data: any = { status, status_reason: reason };
      if (adminNotes) {
        data.admin_notes = adminNotes;
      }
      if (isPublic !== undefined) {
        data.is_public = isPublic;
      }
      const response = await api.patch(`/api/admin/vendors/${vendorId}`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to update vendor status');
    }
  }

  // Get current vendor's profile
  async getVendorProfile(): Promise<any> {
    try {
      const response = await api.get('/api/vendor/profile');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch vendor profile');
    }
  }

  // Get current vendor's stats
  async getVendorStats(): Promise<any> {
    try {
      const response = await api.get('/api/vendor/stats');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch vendor stats');
    }
  }

  // Update current vendor's profile
  async updateVendorProfile(data: any): Promise<any> {
    try {
      const response = await api.put('/api/vendor/profile', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to update vendor profile');
    }
  }

  // --- Service Management ---

  async createService(data: any): Promise<any> {
    try {
      const response = await api.post('/api/vendor/services', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to create service');
    }
  }

  async updateService(serviceId: string, data: any): Promise<any> {
    try {
      const response = await api.put(`/api/vendor/services/${serviceId}`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to update service');
    }
  }

  async deleteService(serviceId: string): Promise<any> {
    try {
      const response = await api.delete(`/api/vendor/services/${serviceId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to delete service');
    }
  }

  async updateServiceStatus(serviceId: string, status: string): Promise<any> {
    try {
      const response = await api.patch(`/api/vendor/services/${serviceId}/status`, { status });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to update service status');
    }
  }

  async checkRegistrationStatus(email: string): Promise<any> {
    try {
      // This would typically check if email is already registered
      // Implementation depends on your backend
      const response = await api.get(`/api/vendor/check-status?email=${email}`);
      return response.data;
    } catch (error: any) {
      throw new Error('Failed to check registration status');
    }
  }

  // --- Manager Management (Admin Only) ---

  async getManagers(): Promise<{ success: boolean; managers: any[] }> {
    try {
      const response = await api.get('/api/admin/managers');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch managers');
    }
  }

  async createManager(data: any): Promise<any> {
    try {
      const response = await api.post('/api/admin/managers', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to create manager');
    }
  }

  async deleteManager(userId: string): Promise<any> {
    try {
      const response = await api.delete(`/api/admin/managers/${userId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to delete manager');
    }
  }

  // --- Export Data ---
  async exportVendors(): Promise<void> {
    try {
      const response = await api.get('/api/admin/export/vendors', {
        responseType: 'blob'
      });

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `vendors_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error: any) {
      console.error("Export error:", error);
      throw new Error(error.response?.data?.detail || 'Failed to export vendors');
    }
  }

  // Delete vendor file
  async deleteVendorFile(vendorId: string, fileUrl: string, fileType: string, serviceId?: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.delete('/api/vendor/delete-file', {
        data: {
          vendor_id: vendorId,
          file_url: fileUrl,
          file_type: fileType,
          service_id: serviceId
        }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to delete file');
    }
  }

  async getFeaturedVendors(): Promise<any[]> {
    try {
      const response = await api.get('/api/public/vendors/featured');
      return response.data.vendors || [];
    } catch (error: any) {
      console.error("Failed to fetch featured vendors:", error);
      return [];
    }
  }
}

export const vendorService = new VendorService();
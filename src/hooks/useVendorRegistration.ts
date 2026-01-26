import { useState, useCallback } from 'react';
import { vendorService, VendorRegistrationData, VendorResponse } from '../services/vendorService';

interface UseVendorRegistrationReturn {
    registerVendor: (data: VendorRegistrationData) => Promise<void>;
    loading: boolean;
    error: string | null;
    success: boolean;
    response: VendorResponse | null;
    reset: () => void;
}

export const useVendorRegistration = (): UseVendorRegistrationReturn => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [response, setResponse] = useState<VendorResponse | null>(null);

    const registerVendor = useCallback(async (data: VendorRegistrationData) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            // Validate required fields
            if (!data.acceptTerms || !data.confirmAccuracy) {
                throw new Error('You must accept the terms and confirm accuracy');
            }

            const result = await vendorService.registerVendor(data);

            setResponse(result);
            setSuccess(true);

            // Reset form after successful submission
            setTimeout(() => {
                setSuccess(false);
            }, 5000);

        } catch (err: any) {
            setError(err.message || 'Registration failed. Please try again.');
            setSuccess(false);
        } finally {
            setLoading(false);
        }
    }, []);

    const reset = useCallback(() => {
        setLoading(false);
        setError(null);
        setSuccess(false);
        setResponse(null);
    }, []);

    return {
        registerVendor,
        loading,
        error,
        success,
        response,
        reset
    };
};

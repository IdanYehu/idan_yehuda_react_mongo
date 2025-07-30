import { useState } from 'react';

/**
 * @param {Object} initialValues 
 * @param {Object} validationSchema 
 * @param {Object} options.store 
 * @param {Function} options.onSubmitSuccess 
 * @param {Function} options.onSubmitError 
 * @returns {Object}
 */
const useForm = (initialValues, validationSchema, options = {}) => {
    const {
        store,
        onSubmitSuccess,
        onSubmitError
    } = options;
    
    const [formData, setFormData] = useState(initialValues);
    
    
    const [errors, setErrors] = useState({});
    
    
    const [internalLoading, setInternalLoading] = useState(false);

   
    const isSubmitting = store?.isLoading ?? internalLoading;
    const serverError = store?.error;

    
    const clearServerError = () => {
        if (store?.clearError) {
            store.clearError();
        }
    };

    /**
     * @param {Event} e - אירוע השינוי מהשדה
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
       
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
        
        
        clearServerError();
    };

    /**
     * @returns {Object} אובייקט שגיאות - ריק אם אין שגיאות
     */
    const validateForm = async () => {
        try {
             await validationSchema.validate(formData, { abortEarly: false });
            return {}; 
        } catch (validationError) {
            
            const newErrors = {};
            validationError.inner?.forEach(error => {
                newErrors[error.path] = error.message;
            });
            return newErrors;
        }
    };

    /**
     * @param {Function} onSubmit - פונקציה שתתבצע אחרי וולידציה מוצלחת
     * @returns {Function} פונקציה לטיפול באירוע השליחה
     */
    const handleSubmit = (onSubmit) => {
        return async (e) => {
            e.preventDefault();
            

            if (!store) {
                setInternalLoading(true);
            }
            
            setErrors({}); 
            clearServerError(); 
            
            try {
                const validationErrors = await validateForm();
                
                if (Object.keys(validationErrors).length === 0) {
                    
                    const result = await onSubmit(formData);
                    
                    if (result && result.success === false) {
                        if (onSubmitError) {
                            onSubmitError(result.error);
                        }
                    } else if (result && result.success !== false) {
                        // הצלחה
                        if (onSubmitSuccess) {
                            onSubmitSuccess(result);
                        }
                    }
                } else {
                    
                    setErrors(validationErrors);
                }
            } catch (error) {
                console.error('שגיאה בטיפול בטופס:', error);
                
                
                if (!store) {
                    const errorMessage = error.message || 'אירעה שגיאה לא צפויה';
                    setErrors({ submit: errorMessage });
                }
                
                if (onSubmitError) {
                    onSubmitError(error);
                }
            } finally {
         
                if (!store) {
                    setInternalLoading(false);
                }
            }
        };
    };

    /**
     * @returns {Object} 
     */
    return {
        formData,
        errors,
        isSubmitting,
        serverError,
        handleChange,
        handleSubmit
    };
};

export default useForm;

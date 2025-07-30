import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '@components/Reusables/Input';
import { registerSchema } from '@src/validation/authSchemas';
import { MdOutlineEmail, MdPerson, MdLocationCity } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import { FaCalendarAlt } from "react-icons/fa";
import useForm from '@hooks/useForm';
import { useAuthStore } from '@store/authStore';

const RegisterForm = () => {
    const [showPassword, setShowPassword] = useState(false);

    const authStore = useAuthStore();
    const navigate = useNavigate();

    const { formData, errors, isSubmitting, serverError, handleChange, handleSubmit } = useForm(
        {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            city: '',
            age: ''
        },
        registerSchema,
        { store: authStore }
    );

    const onSubmit = async (data) => {
        const result = await authStore.register(data);
        
        if (result?.success || authStore.user) {
            navigate('/');
        }
        
        return result;
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-right" dir="rtl">
            <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                label="שם מלא"
                placeholder="הזן שם מלא"
                error={errors.name}
                icon={<MdPerson />}
            />

            <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                label="אימייל"
                placeholder="הזן אימייל"
                error={errors.email}
                icon={<MdOutlineEmail />}
                dir="ltr"
            />

            <Input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                label="סיסמה"
                placeholder="הזן סיסמה"
                error={errors.password}
                icon={<TbLockPassword />}
                hasToggleButton={true}
                isToggled={showPassword}
                onToggle={() => setShowPassword(!showPassword)}
                dir="ltr"
            />

            <Input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                label="אשר סיסמה"
                placeholder="הזן סיסמה שוב"
                error={errors.confirmPassword}
                icon={<TbLockPassword />}
                hasToggleButton={true}
                isToggled={showPassword}
                onToggle={() => setShowPassword(!showPassword)}
                dir="ltr"
            />

            <Input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                label="עיר"
                placeholder="הזן עיר"
                error={errors.city}
                icon={<MdLocationCity />}
            />

            <Input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                label="גיל"
                placeholder="הזן גיל"
                error={errors.age}
                icon={<FaCalendarAlt />}
                min="16"
                max="120"
            />

            <button
                type="submit"
                className="w-full bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700 transition duration-300 text-lg font-medium disabled:opacity-50"
                disabled={isSubmitting}
            >
                {isSubmitting ? 'מתרשם...' : 'הירשם'}
            </button>

            {serverError && (
                <div className="text-red-600 text-sm text-center mt-2">
                    {serverError}
                </div>
            )}
        </form>
    );
};

export default RegisterForm;

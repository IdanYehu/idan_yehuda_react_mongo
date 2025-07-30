import * as Yup from 'yup';


const hebrewNameRegex = /^[\u0590-\u05FF\s]+$/;
const hebrewCityRegex = /^[\u0590-\u05FF\s'-]+$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = {
    uppercase: /[A-Z]/,
    lowercase: /[a-z]/,
    number: /[0-9]/,
    special: /[!@#$%^&*(),.?":{}|<>]/
};

// סכמת וולידציה לטופס התחברות
export const loginSchema = Yup.object({
    email: Yup.string()
        .matches(emailRegex, 'אנא הזן כתובת אימייל חוקית (לדוגמה: user@example.com)')
        .required('אימייל הוא שדה חובה'),
    password: Yup.string()
        .min(6, 'הסיסמה חייבת להכיל לפחות 6 תווים')
        .required('סיסמה היא שדה חובה')
});

// סכמת וולידציה לטופס הרשמה
export const registerSchema = Yup.object({
    name: Yup.string()
        .required('שם הוא שדה חובה')
        .test('is-valid-name', 'שם יכול להכיל אותיות בעברית ורווחים בלבד',
            value => !value || hebrewNameRegex.test(value) || /^[a-zA-Z\s]+$/.test(value))
        .min(2, 'שם חייב להכיל לפחות 2 תווים'),
    email: Yup.string()
        .matches(emailRegex, 'אנא הזן כתובת אימייל חוקית (לדוגמה: user@example.com)')
        .required('אימייל הוא שדה חובה'),
    password: Yup.string()
        .min(8, 'הסיסמה חייבת להכיל לפחות 8 תווים')
        .test('password-strength', 'הסיסמה חייבת להכיל לפחות אות גדולה, אות קטנה, מספר ותו מיוחד',
            value => !value || (
                passwordRegex.uppercase.test(value) &&
                passwordRegex.lowercase.test(value) &&
                passwordRegex.number.test(value) &&
                passwordRegex.special.test(value)
            ))
        .required('סיסמה היא שדה חובה'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'הסיסמאות אינן תואמות')
        .required('אנא אשר את הסיסמה'),
    city: Yup.string()
        .required('עיר היא שדה חובה')
        .test('is-valid-city', 'שם העיר יכול להכיל אותיות בעברית, רווחים וסימני פיסוק בלבד',
            value => !value || hebrewCityRegex.test(value) || /^[a-zA-Z\s'-]+$/.test(value))
        .min(2, 'שם העיר חייב להכיל לפחות 2 תווים'),
    age: Yup.number()
        .typeError('אנא הזן מספר תקין')
        .integer('גיל חייב להיות מספר שלם')
        .min(16, 'גיל מינימלי הוא 16')
        .max(120, 'גיל מקסימלי הוא 120')
        .required('גיל הוא שדה חובה')
});
export const updateProfileSchema = Yup.object({
    name: Yup.string()
        .required('שם הוא שדה חובה')
        .test('is-valid-name', 'שם יכול להכיל אותיות בעברית ורווחים בלבד',
            value => !value || hebrewNameRegex.test(value) || /^[a-zA-Z\s]+$/.test(value))
        .min(2, 'שם חייב להכיל לפחות 2 תווים'),
    city: Yup.string()
        .required('עיר היא שדה חובה')
        .test('is-valid-city', 'שם העיר יכול להכיל אותיות בעברית, רווחים וסימני פיסוק בלבד',
            value => !value || hebrewCityRegex.test(value) || /^[a-zA-Z\s'-]+$/.test(value))
        .min(2, 'שם העיר חייב להכיל לפחות 2 תווים'),
    age: Yup.number()
        .typeError('אנא הזן מספר תקין')
        .integer('גיל חייב להיות מספר שלם')
        .min(16, 'גיל מינימלי הוא 16')
        .max(120, 'גיל מקסימלי הוא 120'),
    password: Yup.string()
        .min(8, 'הסיסמה חייבת להכיל לפחות 8 תווים')
        .test('password-strength', 'הסיסמה חייבת להכיל לפחות אות גדולה, אות קטנה, מספר ותו מיוחד',
            value => !value || (
                passwordRegex.uppercase.test(value) &&
                passwordRegex.lowercase.test(value) &&
                passwordRegex.number.test(value) &&
                passwordRegex.special.test(value)
            )).optional(),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'הסיסמאות אינן תואמות')
        .optional(),

});


// פונקציה לבדיקת חוזק סיסמה
export const checkPasswordStrength = (password) => {
    if (!password) return { strength: 0, feedback: '' };

    let strength = 0;
    let feedback = '';

    if (password.length >= 8) strength++;
    if (passwordRegex.uppercase.test(password)) strength++;
    if (passwordRegex.lowercase.test(password)) strength++;
    if (passwordRegex.number.test(password)) strength++;
    if (passwordRegex.special.test(password)) strength++;

    if (strength < 3) feedback = 'סיסמה חלשה';
    else if (strength < 5) feedback = 'סיסמה בינונית';
    else feedback = 'סיסמה חזקה';

    return { strength, feedback };
};

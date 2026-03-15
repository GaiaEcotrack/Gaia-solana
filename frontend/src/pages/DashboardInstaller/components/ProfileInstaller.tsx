import { useState } from 'react';
import { useFormik } from 'formik';
import { motion, AnimatePresence } from 'framer-motion';
import * as yup from 'yup';
import { 

  FiFileText, 
  FiMapPin, 
  FiPhone, 
  FiMail, 
  FiGlobe, 
  FiUser, 
  FiKey, 
  FiUsers,
  FiSave,
  FiCheckCircle,
  FiAlertCircle,
  FiZap
} from 'react-icons/fi';

interface UserFormProps {
  role: string;
}

const validationSchema = yup.object({
  companyName: yup.string().required('Company Name is required'),
  taxId: yup.string().required('Tax ID is required'),
  address: yup.string().required('Address is required'),
  contactPhone: yup.string().required('Contact Phone is required'),
  companyEmail: yup.string().email('Invalid email format').required('Company Email is required'),
  website: yup.string().url('Invalid URL format'),
  legalRepresentative: yup.string().required('Legal Representative Name is required'),
  legalRepId: yup.string().required('Legal Rep ID is required'),
  legalRepEmail: yup.string().email('Invalid email format').required('Legal Rep Email is required'),
  legalRepPhone: yup.string().required('Legal Rep Phone is required'),
  associatedPartner: yup.string().email('Invalid email format'),
});

const UserForm: React.FC<UserFormProps> = ({ role }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      companyName: '',
      taxId: '',
      address: '',
      contactPhone: '',
      companyEmail: '',
      website: '',
      legalRepresentative: '',
      legalRepId: '',
      legalRepEmail: '',
      legalRepPhone: '',
      associatedPartner: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setSuccess(false);
      setError(null);

      try {
        const URL = import.meta.env.VITE_APP_API_EXPRESS;
        const endpoint = role === 'Installer' ? '/installer' : '/comercial/users';
        
        const token = localStorage.getItem('token');
        
        const response = await fetch(`${URL}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            ...values,
            role: role,
            status: 'active',
            registrationDate: new Date().toISOString()
          }),
        });

        if (!response.ok) {
          throw new Error('Error submitting data');
        }

        const result = await response.json();
        setSuccess(true);
        
        // Reset form after successful submission
        setTimeout(() => {
          formik.resetForm();
        }, 2000);
        
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to submit form. Please try again.');
      } finally {
        setLoading(false);
      }
    },
  });

  const formSections = [
    {
      title: "Company Information",
      icon: <FiZap className="w-5 h-5" />,
      color: "from-blue-500 to-blue-600",
      fields: [
        { name: 'companyName', label: 'Company Name', icon: <FiZap className="w-4 h-4" />, required: true },
        { name: 'taxId', label: 'Tax ID (NIT)', icon: <FiFileText className="w-4 h-4" />, required: true },
        { name: 'address', label: 'Address', icon: <FiMapPin className="w-4 h-4" />, required: true },
        { name: 'contactPhone', label: 'Contact Phone', icon: <FiPhone className="w-4 h-4" />, required: true },
        { name: 'companyEmail', label: 'Company Email', icon: <FiMail className="w-4 h-4" />, required: true },
        { name: 'website', label: 'Website (Optional)', icon: <FiGlobe className="w-4 h-4" />, required: false },
      ]
    },
    {
      title: "Legal Representative",
      icon: <FiUser className="w-5 h-5" />,
      color: "from-green-500 to-green-600",
      fields: [
        { name: 'legalRepresentative', label: 'Legal Representative Name', icon: <FiUser className="w-4 h-4" />, required: true },
        { name: 'legalRepId', label: 'Legal Rep ID', icon: <FiKey className="w-4 h-4" />, required: true },
        { name: 'legalRepEmail', label: 'Legal Rep Email', icon: <FiMail className="w-4 h-4" />, required: true },
        { name: 'legalRepPhone', label: 'Legal Rep Phone', icon: <FiPhone className="w-4 h-4" />, required: true },
      ]
    },
    {
      title: "Partnership",
      icon: <FiUsers className="w-5 h-5" />,
      color: "from-purple-500 to-purple-600",
      fields: [
        { name: 'associatedPartner', label: 'Email of Associated Partner (Optional)', icon: <FiUsers className="w-4 h-4" />, required: false },
      ]
    }
  ];

  return (
    <div className="bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white">
              {role === 'Installer' ? <FiZap className="w-6 h-6" /> : <FiUsers className="w-6 h-6" />}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {role === 'Installer' ? 'Installer Profile' : 'Commercial Partner Profile'}
              </h1>
              <p className="text-gray-600">Complete your company profile to access all Gaia features</p>
            </div>
          </div>
          
          {/* Progress Indicator */}
          <div className="bg-white rounded-xl p-4 border border-gray-200 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Profile Completion</span>
              <span className="text-sm font-bold text-blue-600">30%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                initial={{ width: "30%" }}
                animate={{ width: Object.values(formik.values).filter(v => v).length / Object.keys(formik.values).length * 100 + "%" }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Sections */}
          <div className="lg:col-span-2">
            <form onSubmit={formik.handleSubmit}>
              {formSections.map((section, sectionIndex) => (
                <motion.div
                  key={sectionIndex}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: sectionIndex * 0.1 }}
                >
                  {/* Section Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-10 h-10 bg-gradient-to-br ${section.color} rounded-lg flex items-center justify-center text-white`}>
                      {section.icon}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">{section.title}</h2>
                      <p className="text-sm text-gray-600">Fill in the required information</p>
                    </div>
                  </div>

                  {/* Fields Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {section.fields.map((field, fieldIndex) => (
                      <div key={field.name} className={field.name === 'associatedPartner' ? "md:col-span-2" : ""}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">{field.icon}</span>
                            {field.label}
                            {field.required && <span className="text-red-500">*</span>}
                          </div>
                        </label>
                        <div className="relative">
                          <input
                            type={field.name.includes('email') ? 'email' : 
                                  field.name.includes('website') ? 'url' : 'text'}
                            name={field.name}
                            value={(formik.values as any)[field.name]}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`w-full px-4 py-3 pl-11 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                              formik.touched[field.name as keyof typeof formik.touched] && 
                              formik.errors[field.name as keyof typeof formik.errors] 
                                ? 'border-red-300' 
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                            placeholder={`Enter ${field.label.toLowerCase()}`}
                          />
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            {field.icon}
                          </div>
                        </div>
                        {formik.touched[field.name as keyof typeof formik.touched] && 
                         formik.errors[field.name as keyof typeof formik.errors] && (
                          <motion.div 
                            className="flex items-center gap-2 mt-2 text-red-600 text-sm"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            <FiAlertCircle className="w-4 h-4" />
                            {(formik.errors as any)[field.name]}
                          </motion.div>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}

              {/* Submit Section */}
              <motion.div
                className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">Ready to submit?</h3>
                    <p className="text-gray-600">Review your information before submitting</p>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => formik.resetForm()}
                      className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                      disabled={loading}
                    >
                      Reset Form
                    </button>
                    
                    <button
                      type="submit"
                      disabled={loading || !formik.isValid}
                      className={`px-6 py-3 font-medium rounded-xl transition-all flex items-center gap-2 ${
                        loading || !formik.isValid
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg'
                      }`}
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <FiSave className="w-5 h-5" />
                          Submit Profile
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Requirements Card */}
            <motion.div
              className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Requirements</h3>
              <ul className="space-y-3">
                {[
                  "Valid company registration",
                  "Tax identification number",
                  "Legal representative details",
                  "Contact information",
                  "Business address"
                ].map((req, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                      <FiCheckCircle className="w-4 h-4" />
                    </div>
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Status Card */}
            <motion.div
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Profile Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Verification</span>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                    Pending
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Documents</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    Required
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">KYC Status</span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                    Not Started
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Alerts */}
            <AnimatePresence>
              {success && (
                <motion.div
                  className="bg-gradient-to-r from-green-50 to-emerald-50 border border-emerald-200 rounded-2xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <FiCheckCircle className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-emerald-800">Profile Submitted!</h4>
                      <p className="text-emerald-600 text-sm">Your profile has been successfully submitted for review.</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {error && (
                <motion.div
                  className="bg-gradient-to-r from-red-50 to-red-50 border border-red-200 rounded-2xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <FiAlertCircle className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-800">Submission Failed</h4>
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Help Card */}
            <motion.div
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Need Help?</h3>
              <p className="text-gray-600 text-sm mb-4">
                Contact our support team if you have questions about filling out this form.
              </p>
              <button className="w-full py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                Contact Support
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserForm;
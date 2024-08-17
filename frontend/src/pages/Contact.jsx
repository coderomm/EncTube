import { useState } from 'react';
import { z } from 'zod';
import axiosInstance from '../utils/AxiosInstance';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        mobileNumber: '',
        email: '',
        subject: '',
        message: '',
    });

    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState('');
    const [uploading, setUploading] = useState(false);

    const contactValidationSchema = z.object({
        name: z.string().min(1, { message: 'Name is required' }),
        mobileNumber: z.string().min(10, { message: 'Mobile number must be at least 10 digits' }).regex(/^\d+$/, 'Mobile number must contain only digits'),
        email: z.string().email({ message: 'Invalid email address' }),
        subject: z.string().min(1, { message: 'Subject is required' }),
        message: z.string().min(1, { message: 'Message is required' }),
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validation = contactValidationSchema.safeParse(formData);
        if (!validation.success) {
            const errorMessages = validation.error.errors.reduce((acc, curr) => {
                acc[curr.path[0]] = curr.message;
                return acc;
            }, {});
            setErrors(errorMessages);
            return;
        }

        setUploading(true);
        try {
            await axiosInstance.post('/contact/query', formData);
            setStatus('Form submitted successfully');
            setFormData({ name: '', mobileNumber: '', email: '', subject: '', message: '' });
            setErrors({});
        } catch (error) {
            setStatus('Failed to submit form');
        } finally {
            setUploading(false);
            setTimeout(() => {
                setStatus('')
            }, 3000)
        }
    };

    return (
        <section className='bg-img rounded-[50px] mx-1 mt-4 md:mx-10 md:mt-4 p-8 px-2 md:p-16 md:py-7 flex justify-center items-center'>
            <form className='lg:max-w-2xl w-full' onSubmit={handleSubmit}>
                <label className="label mt-4 mb-1 ms-1 text-white">Full Name</label>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full ${errors.name ? 'mb-1' : 'mb-4'} px-4 py-2 border rounded-lg bg-transparent`}
                />
                {errors.name && <p className="text-red-500 mt-0 mb-4">{errors.name}</p>}

                <label className="label mt-4 mb-1 ms-1 text-white">Mobile Number</label>
                <input
                    type="text"
                    name="mobileNumber"
                    placeholder="Mobile Number"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    className={`w-full ${errors.mobileNumber ? 'mb-1' : 'mb-4'} px-4 py-2 border rounded-lg bg-transparent`}
                />
                {errors.mobileNumber && <p className="text-red-500 mt-0 mb-4">{errors.mobileNumber}</p>}

                <label className="label mt-4 mb-1 ms-1 text-white">Email</label>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full ${errors.email ? 'mb-1' : 'mb-4'} px-4 py-2 border rounded-lg bg-transparent`}
                />
                {errors.email && <p className="text-red-500 mt-0 mb-4">{errors.email}</p>}

                <label className="label mt-4 mb-1 ms-1 text-white">Subject</label>
                <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full ${errors.subject ? 'mb-1' : 'mb-4'} px-4 py-2 border rounded-lg bg-transparent`}
                />
                {errors.subject && <p className="text-red-500 mt-0 mb-4">{errors.subject}</p>}

                <label className="label mt-4 mb-1 ms-1 text-white">Message</label>
                <textarea
                    name="message"
                    placeholder="Message"
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full ${errors.message ? 'mb-1' : 'mb-4'} px-4 py-2 border rounded-lg bg-transparent text-white`}
                />
                {errors.message && <p className="text-red-500 mt-0 mb-4">{errors.message}</p>}

                <button type="submit" className={`brandBtn font-lowballBold text-xl tracking-wider drop-shadow-2xl text-white w-full py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-900 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={uploading}>
                    {uploading ? 'Submiting ...' : 'Submit'}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                    </svg>
                </button>
                {status && <p className="drop-shadow-2xl my-3 text-white-500 text-center text-2xl">{status}</p>}
            </form>
        </section>
    );
};

export default Contact;
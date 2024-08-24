import { useNavigate } from 'react-router-dom';

const BackButton = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <button
            onClick={handleGoBack}
            className={`backBtn text-[#999] hover:text-white px-4 py-2 mb-5 rounded-[20px] transition duration-300 flex items-center justify-center gap-3 md:hidden`}
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
            </svg>Go Back
        </button>
    );
};

export default BackButton;
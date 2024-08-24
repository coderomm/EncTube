import { useState } from "react";

const Faq = () => {
    const FAQs = [
        {
            question: `What is ${import.meta.env.VITE_APP_NAME}?`,
            answer: `${import.meta.env.VITE_APP_NAME} is a platform that allows YouTubers to securely manage and approve videos uploaded by their editors before they are published on YouTube, streamlining the upload process without compromising control over their channel.`
        },
        {
            question: `How does the one-click approval process work?`,
            answer: `Simple! When an editor uploads a video, you'll get an email with all the details. Just click the 'Approve & Publish' button, and your video goes live on YouTube—no need to log in!`
        },
        {
            question: `How does ${import.meta.env.VITE_APP_NAME} ensure my channel's security?`,
            answer: `${import.meta.env.VITE_APP_NAME} only uploads videos to YouTube after you’ve reviewed and approved them. Your YouTube API keys are securely stored, and you have the option to self-host the platform for added security.`
        },
        {
            question: `Can I use ${import.meta.env.VITE_APP_NAME} without giving full access to my YouTube channel?`,
            answer: `Yes! ${import.meta.env.VITE_APP_NAME} is designed specifically to allow editors to upload videos without having full access to your channel. You maintain full control, approving every video before it’s published.`
        },
        {
            question: `Is ${import.meta.env.VITE_APP_NAME} compatible with all types of YouTube channels?`,
            answer: `Yes, ${import.meta.env.VITE_APP_NAME} can be used by any YouTube channel, whether it’s a personal vlogging channel or a large, multi-editor production team.`
        },
        {
            question: `Can I self-host ${import.meta.env.VITE_APP_NAME} on my own server?`,
            answer: `Absolutely. We are working on this. For those who prefer to maintain full control over their data, ${import.meta.env.VITE_APP_NAME} offers the option to self-host on a trusted server like AWS, ensuring your API keys and content are always secure.`
        }
    ];
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };
    return (
        <>
            {FAQs.map((faq, index) => (
                <div key={index} className="mb-1 rounded-[30px] bg-faq-collaps w-full">
                    <h3 className="text-white text-base md:text-xl">
                        <button
                            onClick={() => toggleFAQ(index)}
                            className="w-full text-left p-4 focus:outline-none flex justify-between items-center"
                        >
                            {faq.question}
                        </button>
                    </h3>
                    {activeIndex === index && (
                        <div className="border-0">
                            <div className="p-5 pt-0">
                                <p className="text-[#999] text-base">{faq.answer}</p>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </>
    )
}

export default Faq;
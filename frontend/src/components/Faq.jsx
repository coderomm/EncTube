import { useState } from "react";

const Faq = () => {
    const FAQs = [
        {
            question: "Can editors access my YouTube channel's revenue and other sensitive data?",
            answer: "Absolutely not! YouTubePro keeps all your financial data and sensitive information completely hidden from editors, so you can collaborate without any worries."
        },
        {
            question: "How does the one-click approval process work?",
            answer: "Simple! When an editor uploads a video, you'll get an email with all the details. Just click the 'Approve & Publish' button, and your video goes live on YouTube—no need to log in!"
        },
        {
            question: "What if I own multiple YouTube channels?",
            answer: "Each account is tied to a single channel. If you have multiple channels, just create separate accounts for each, ensuring everything stays organized and secure."
        },
        {
            question: "Can editors work on multiple channels at once?",
            answer: "Yes, editors can be associated with multiple channels. They can easily switch between channels from their dashboard, making multitasking a breeze."
        },
        {
            question: "Is it possible for editors to sign up without an invitation?",
            answer: "Nope! Editors can only access your channel through an invitation sent by you, ensuring that only trusted individuals can contribute to your content."
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
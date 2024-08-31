import Faq from '../components/Faq';
import faqImg from '/images/faq.svg';
const Features = () => {

    return (
        <>
            <section className="mx-1 mt-2 md:mx-10 md:mt-4 p-8 px-2 md:p-16 md:py-7 text-center">
                <h1 className="text-4xl md:text-6xl text-white font-lowballBold tracking-wider">About YouLayer</h1>
                <h3 className="text-3xl md:text-3xl text-white font-lowballThin tracking-wider mt-3">🎬 YouLayer: Control Your Content, Simplify Your Workflow, Upload Safely! 🚀</h3>
                <div className="text-center text-[#e2e2e2] text-xl tracking-wide mt-2">
                    <p>YouLayer is a platform designed to bridge the gap between YouTubers and their video editors, ensuring a seamless and secure video upload process. With YouLayer, YouTubers can maintain full control over their channels by approving videos before they are published, without the hassle of downloading and re-uploading large files. Our platform provides a safe space where editors can upload their work, and YouTubers can easily manage and approve content from anywhere in the world.</p>
                </div>
            </section>
            <section className="mx-1 mt-2 md:mx-10 md:mt-4 p-8 px-2 md:p-16 md:py-7 text-center">
                <h1 className="text-4xl md:text-6xl text-white font-lowballBold tracking-wider">⚡Our USPs</h1>
                <div className="text-center text-[#e2e2e2] text-xl tracking-wide mt-2">
                    <ul className='text-left'>
                        <li className='mt-3'>- 🔒 Full Control, No Worries: Keep your revenue and sensitive data hidden while editors focus on what they do best—creating amazing content.</li>
                        <li className='mt-3'>- ⬇️⬆️ Eliminate manual downloads and uploads.</li>
                        <li className='mt-3'>- 📧 Instant Approval, Zero Hassles: Approve and publish videos directly from your email with just one click. Streamlined and efficient.</li>
                        <li className='mt-3'>- 📂 All Your Channels, One Place: Editors can manage multiple channels from a single account, each with its own secure dashboard.</li>
                        <li className='mt-3'>- 📣 Feedback Loop: Review, suggest edits, and collaborate without losing control. Every video is polished to perfection before going live.</li>
                        <li className='mt-3'>- 🔐 Invite-Only Access: Editors can only join your channel by invitation, ensuring your content remains safe and secure.</li>
                    </ul>
                </div>
            </section>
            <section className="bg-img rounded-[50px] mx-1 mt-4 md:mx-10 md:mt-4 p-8 px-2 md:p-16 md:py-7">
                <div className="flex flex-col md:flex-row items-center gap-3">
                    <div className="flex flex-col items-center text-center md:text-left md:items-start justify-start w-full gap-5">
                        <h1 className="text-4xl md:text-6xl text-white font-lowballBold tracking-wider flex flex-col items-center justify-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-16">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                        </svg>Answers to our most frequently asked questions</h1>
                        <img src={faqImg} className="max-w-full h-auto w-[195px]" />
                    </div>
                    <div className="flex flex-col items-center justify-start w-full gap-1">
                        <Faq />
                    </div>
                </div>
            </section>
        </>
    )
}

export default Features;
import bannerVideo from '/videos/video.mp4'
export const VideoRender = () => {
    return (
        <div className="flex flex-col-reverse md:flex-row gap-6">
            <div className="tracking-wider text-white text-center flex-grow w-full p-5">
                <h2 className="text-4xl md:text-5xl mb-2">
                    ⚡&nbsp;No Need to give Your Channel Access to Editors For Content Management
                </h2>
                <ul className="flex flex-col gap-2 justify-start items-center text-left list-decimal">
                    <li className='text-xl md:text-2xl font-thin text-gray-300 bg-blend-hard-light'>Skip sharing channel editor access!</li>
                    <li className='text-xl md:text-2xl font-thin text-gray-300 bg-blend-hard-light'>Effortless Content Approval Process</li>
                    <li className='text-xl md:text-2xl font-thin text-gray-300 bg-blend-hard-light'>Customizable Collaboration Tools</li>
                    <li className='text-xl md:text-2xl font-thin text-gray-300 bg-blend-hard-light'>Complete Oversight on Final Content</li>
                    <li className='text-xl md:text-2xl font-thin text-gray-300 bg-blend-hard-light'>No Competition in 2024</li>
                </ul>
            </div>
            <div className="w-100 px-3 flex-grow w-full mt-10">
                <div className="p-[48px 30px 40px] rounded-[30px] bgblur">
                    <video autoPlay playsInline loop preload='auto' className='max-h-full max-w-full rounded-xl shadow-[0px_5px_50px_#a90dd040]'>
                        <source src={bannerVideo} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            </div>
        </div>
    )
}
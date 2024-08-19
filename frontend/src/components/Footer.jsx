import { Link } from "react-router-dom"

const Footer = () => {
    return (
        <footer className="bg-img rounded-t-[50px] mt-7 md:mx-0 md:mt-8 p-4 md:p-16">
            <div className="flex flex-col md:flex-row gap-1 md:gap-16 justify-evenly items-center text-center md:text-left md:items-start">
                <div className="flex flex-col items-center md:items-start gap-3">
                    <div className="flex items-center gap-2 sm:gap-4 sm:flex-grow">
                        <a href="/" className="font-lowballBold text-3xl drop-shadow-2xl text-white cursor-pointer">EncTube</a>
                    </div>
                    <p className="text-lg tracking-wider text-[#999999]">Connect with us!</p>
                    <div className="flex gap-3 items-center justify-center">
                        <Link to={'https://x.com/1omsharma'} className='rounded-full p-2 bg-[#1d1d1d] w-12 h-12 text-center color-[#cfcfcf] iconhover flex justify-center items-center'>
                            <svg className='fill-white w-4' enableBackground="new 0 0 24 24" height="24px" id="Layer_1" version="1.1" viewBox="0 0 24 24" width="24px" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg"><g><path d="M22.8,23.5H17c-0.2,0-0.3-0.1-0.4-0.2L12,15.3l-4.6,7.9c-0.1,0.2-0.2,0.2-0.4,0.2H1.2c-0.2,0-0.3-0.1-0.4-0.2   c-0.1-0.1-0.1-0.3,0-0.5c0-0.1,0.1-0.2,0.1-0.2L6.9,12L0.8,1.4c0-0.1-0.1-0.1-0.1-0.2c-0.1-0.2-0.1-0.4,0-0.5   C0.8,0.6,1,0.5,1.2,0.5H7c0.2,0,0.3,0.1,0.4,0.2L12,8.7l4.6-7.9c0.1-0.2,0.2-0.2,0.4-0.2h5.9c0.2,0,0.3,0.1,0.4,0.2   c0.1,0.1,0.1,0.3,0,0.5c0,0.1-0.1,0.2-0.1,0.2L17.1,12l6.1,10.6c0,0.1,0.1,0.1,0.1,0.2c0.1,0.2,0.1,0.4,0,0.5   C23.2,23.4,23,23.5,22.8,23.5z" /></g></svg>
                        </Link>
                        <Link to={'https://github.com/coderomm'} className='rounded-full p-2 bg-[#1d1d1d] w-12 h-12 text-center color-[#cfcfcf] iconhover flex justify-center items-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 24 24" className='fill-white w-6'>
                                <path d="M10.9,2.1c-4.6,0.5-8.3,4.2-8.8,8.7c-0.5,4.7,2.2,8.9,6.3,10.5C8.7,21.4,9,21.2,9,20.8v-1.6c0,0-0.4,0.1-0.9,0.1 c-1.4,0-2-1.2-2.1-1.9c-0.1-0.4-0.3-0.7-0.6-1C5.1,16.3,5,16.3,5,16.2C5,16,5.3,16,5.4,16c0.6,0,1.1,0.7,1.3,1c0.5,0.8,1.1,1,1.4,1 c0.4,0,0.7-0.1,0.9-0.2c0.1-0.7,0.4-1.4,1-1.8c-2.3-0.5-4-1.8-4-4c0-1.1,0.5-2.2,1.2-3C7.1,8.8,7,8.3,7,7.6c0-0.4,0-0.9,0.2-1.3 C7.2,6.1,7.4,6,7.5,6c0,0,0.1,0,0.1,0C8.1,6.1,9.1,6.4,10,7.3C10.6,7.1,11.3,7,12,7s1.4,0.1,2,0.3c0.9-0.9,2-1.2,2.5-1.3 c0,0,0.1,0,0.1,0c0.2,0,0.3,0.1,0.4,0.3C17,6.7,17,7.2,17,7.6c0,0.8-0.1,1.2-0.2,1.4c0.7,0.8,1.2,1.8,1.2,3c0,2.2-1.7,3.5-4,4 c0.6,0.5,1,1.4,1,2.3v2.6c0,0.3,0.3,0.6,0.7,0.5c3.7-1.5,6.3-5.1,6.3-9.3C22,6.1,16.9,1.4,10.9,2.1z"></path>
                            </svg>
                        </Link>
                        <Link to={'https://www.linkedin.com/in/1omsharma/'} className='rounded-full p-2 bg-[#1d1d1d] w-12 h-12 text-center color-[#cfcfcf] iconhover flex justify-center items-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 30 30" className='fill-white w-6'>
                                <path d="M24,4H6C4.895,4,4,4.895,4,6v18c0,1.105,0.895,2,2,2h18c1.105,0,2-0.895,2-2V6C26,4.895,25.105,4,24,4z M10.954,22h-2.95 v-9.492h2.95V22z M9.449,11.151c-0.951,0-1.72-0.771-1.72-1.72c0-0.949,0.77-1.719,1.72-1.719c0.948,0,1.719,0.771,1.719,1.719 C11.168,10.38,10.397,11.151,9.449,11.151z M22.004,22h-2.948v-4.616c0-1.101-0.02-2.517-1.533-2.517 c-1.535,0-1.771,1.199-1.771,2.437V22h-2.948v-9.492h2.83v1.297h0.04c0.394-0.746,1.356-1.533,2.791-1.533 c2.987,0,3.539,1.966,3.539,4.522V22z"></path>
                            </svg>
                        </Link>
                        <Link to={'https://www.instagram.com/coder.om'} className='rounded-full p-2 bg-[#1d1d1d] w-12 h-12 text-center color-[#cfcfcf] iconhover flex justify-center items-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 30 30" className='fill-white w-6'>
                                <path d="M 9.9980469 3 C 6.1390469 3 3 6.1419531 3 10.001953 L 3 20.001953 C 3 23.860953 6.1419531 27 10.001953 27 L 20.001953 27 C 23.860953 27 27 23.858047 27 19.998047 L 27 9.9980469 C 27 6.1390469 23.858047 3 19.998047 3 L 9.9980469 3 z M 22 7 C 22.552 7 23 7.448 23 8 C 23 8.552 22.552 9 22 9 C 21.448 9 21 8.552 21 8 C 21 7.448 21.448 7 22 7 z M 15 9 C 18.309 9 21 11.691 21 15 C 21 18.309 18.309 21 15 21 C 11.691 21 9 18.309 9 15 C 9 11.691 11.691 9 15 9 z M 15 11 A 4 4 0 0 0 11 15 A 4 4 0 0 0 15 19 A 4 4 0 0 0 19 15 A 4 4 0 0 0 15 11 z"></path>
                            </svg>
                        </Link>
                    </div>
                </div>
                <div className="flex flex-col justify-start gap-1">
                    <h3 className="text-2xl font-semibold tracking-wider text-white">BROWSE</h3>
                    <div className="flex flex-col justify-start">
                        <a href="" className="mt-1 text-lg tracking-wider text-[#999999]">Home</a>
                        <a href="" className="mt-1 text-lg tracking-wider text-[#999999]">Youtuber</a>
                        <a href="" className="mt-1 text-lg tracking-wider text-[#999999]">Editor</a>
                        <a href="" className="mt-1 text-lg tracking-wider text-[#999999]">Features</a>
                        <a href="" className="mt-1 text-lg tracking-wider text-[#999999]">Contact Us</a>
                    </div>
                </div>
                <div className="flex flex-col justify-start md:justify-between py-6 mt-6 md:mt-0 border-t border-[#1e1d1d] gap-3">
                    <p className="text-xl font-semibold tracking-wider text-white">© EncTube 2024, Designed <a className="underline" href="https://x.com/1omsharma">CoderOm</a></p>
                    <a href="" className="text-lg tracking-wider text-[#999999]">Privacy Policy</a>
                </div>
            </div>
        </footer>
    )
}
export default Footer;
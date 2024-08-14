import React, { useState } from 'react';

export const Login = () => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <section className="w-[350px] h-[400px] bg-white rounded p-7 relative flex">
            <div className="w-full flex flex-wrap items-center justify-center relative overflow-hidden">
                <input
                    type="radio"
                    id="login"
                    name="toggle"
                    className="hidden"
                    checked={isLogin}
                    onChange={() => setIsLogin(true)}
                />
                <input
                    type="radio"
                    id="signup"
                    name="toggle"
                    className="hidden"
                    checked={!isLogin}
                    onChange={() => setIsLogin(false)}
                />

                <div className="text-center mb-5 w-full overflow-hidden">
                    <h3 className="text-xl text-black transition-all duration-300">Login Form</h3>
                    <h3 className="text-xl text-black transition-all duration-300">Signup Form</h3>
                </div>

                <label
                    htmlFor="login"
                    className="w-1/2 border-2 border-black h-10 rounded flex items-center justify-center text-base mb-5 select-none transition-colors duration-300 ease-out"
                    onClick={() => setIsLogin(true)}
                >
                    Login
                </label>
                <label
                    htmlFor="signup"
                    className="w-1/2 border-2 border-black h-10 rounded flex items-center justify-center text-base mb-5 select-none transition-colors duration-300 ease-out"
                    onClick={() => setIsLogin(false)}
                >
                    Signup
                </label>

                <span className='left-0 bg-sky-500 w-1/2 h-9 rounded absolute top-14 opacity-10 transition-all ease-linear duration-300'></span>

                <div className="flex w-full flex-none basis-full transition-transform duration-300 ease-out translate-x-0">
                    <div className="w-full transition-all duration-500 ease-in-out flex-none basis-full">
                        <div className="space-y-3">
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="w-full p-2 border-2 rounded-lg focus:outline-none focus:border-pink-300"
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full p-2 border-2 rounded-lg focus:outline-none focus:border-pink-300"
                            />
                            <a href="#forgot" className="text-pink-500 hover:text-purple-500 block">Forgot password?</a>
                            <button className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:bg-gradient-to-l">Login</button>
                            <div className="text-center">
                                <label htmlFor="signup" className="cursor-pointer text-pink-500 hover:text-purple-500">
                                    Not a member? <span>Signup now</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="w-full transition-all duration-500 ease-in-out flex-none basis-full">
                        <div className="space-y-3">
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="w-full p-2 border-2 rounded-lg focus:outline-none focus:border-pink-300"
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full p-2 border-2 rounded-lg focus:outline-none focus:border-pink-300"
                            />
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                className="w-full p-2 border-2 rounded-lg focus:outline-none focus:border-pink-300"
                            />
                            <button className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:bg-gradient-to-l">Signup</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

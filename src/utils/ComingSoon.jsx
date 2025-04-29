import React from 'react';
import Socials from './Socials';
import { ClockIcon } from '@heroicons/react/solid'; // You can import any icon from Heroicons or Font Awesome

const ComingSoon = () => {
    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-screen bg-black/90 p-4">
                <div className="bg-white/5 border border-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center backdrop-blur-md">
                    <div className="flex justify-center mb-6">
                        <ClockIcon className="w-10 h-10 text-white animate-pulse" />
                    </div>
                    <h1 className="text-5xl font-extrabold text-white">Coming Soon</h1>
                    <p className="mt-6 text-lg text-gray-300">We are working hard to bring you this feature.</p>
                    <p className="mt-2 text-lg text-gray-300">Stay tuned!</p>
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a href="/" className="px-6 py-3 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-md transition-all">
                            Go Back Home
                        </a>
                        <div>
                            <Socials />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ComingSoon;

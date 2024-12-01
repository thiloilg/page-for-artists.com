import React from 'react';
import { motion } from 'framer-motion';

export function DemoPreview() {
    return (
        <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">
                        See It in Action
                    </h2>
                    <p className="text-lg text-gray-600">
                        Check out how your artist landing page could look like
                    </p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex justify-center"
                >
                    <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[720px] w-[360px] shadow-xl">
                        <div className="h-[32px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -start-[17px] top-[72px] rounded-s-lg"></div>
                        <div className="h-[46px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -start-[17px] top-[124px] rounded-s-lg"></div>
                        <div className="h-[46px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -start-[17px] top-[178px] rounded-s-lg"></div>
                        <div className="h-[64px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -end-[17px] top-[142px] rounded-e-lg"></div>
                        <div className="rounded-[2rem] overflow-hidden w-[332px] h-[692px] bg-white">
                            <iframe
                                src="https://pinobluntslide.de/"
                                className="w-full h-full"
                                title="Demo Landing Page"
                                scrolling="no"
                                style={{
                                    border: 'none',
                                    overflow: 'hidden',
                                    width: '100%',
                                    height: '100%',
                                }}
                            />
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

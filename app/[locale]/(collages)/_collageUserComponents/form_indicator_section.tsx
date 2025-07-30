"use client"

import { College } from '@/types/Collage'
import React from 'react'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'


function FormIndicatorSection({ college }: { college: College }) {
    const forms = college.forms || [] as any[]
    console.log(forms)

    if (!forms.length) {
        return null
    }

    // Dynamic grid classes based on form count
    const getGridClasses = (formCount: number) => {
        switch (formCount) {
            case 1:
                return "grid-cols-1 max-w-2xl mx-auto"
            case 2:
                return "grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto"
            case 3:
                return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto"
            case 4:
                return "grid-cols-1 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto"
            default:
                return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl mx-auto"
        }
    }

    return (
        <section className="py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="max-w-7xl mx-auto relative z-10">
                {/* Section Header */}
                <motion.div
                    className="text-center mb-12 md:mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                        <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                            Application Forms
                        </span>
                    </h2>
                    <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto">
                        Access important application forms for your academic needs
                    </p>
                </motion.div>

                {/* Forms Grid */}
                <div className={`grid gap-6 ${getGridClasses(forms.length)}`}>
                    {forms.map((form, index) => (
                        <motion.div
                            key={form.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true, margin: "-50px" }}
                        >
                            <FormCard description={form.description || 'No description'} title={form.title} active={form.active} id={form.id} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

const FormCard = ({ description, title, active, id }: { description: string, title: string, active: boolean, id: string }) => {
    const formUrl = `${process.env.NEXT_PUBLIC_API_URL}/form/${id}`

    return (
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-blue-400 transition-all h-full flex flex-col">
            <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                {description && (
                    <p className="text-slate-300 mb-4">{description}</p>
                )}
            </div>

            {active ? (
                <Button
                    asChild
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                >
                    <a href={formUrl} target="_blank" rel="noopener noreferrer">
                        <span>Open Form</span>
                        <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                </Button>
            ) : (
                <div className="w-full mt-4 px-4 py-2 text-center text-slate-400 border border-slate-700 rounded-md">
                    Currently Unavailable
                </div>
            )}
        </div>
    )
}

export default FormIndicatorSection
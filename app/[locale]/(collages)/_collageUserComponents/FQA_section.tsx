"use client"

import React, { useState, useRef, useEffect } from 'react'
import { College } from '@/types/Collage'
import { FAQItem } from '@/types/faq'
import { FormSection } from '@/types/form'
import { FAQService } from '@/services/faq.service'
import { MarkdownPreview } from '@/components/markdown-preview'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    Search,
    MessageCircle,
    HelpCircle,
    ExternalLink,
    FileText,
    X,
    ArrowRight,
    SortAsc,
    SortDesc,
    BookOpen,
    Clock,
    Star,
    AlertCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

interface FQA_sectionProps {
    collage: College
}

interface FAQData {
    items: FAQItem[];
    title?: string;
    description?: string;
    lastUpdated: Date;
}

const FAQItemCard = ({
    item,
    isSelected,
    onClick,
    index
}: {
    item: FAQItem;
    isSelected: boolean;
    onClick: () => void;
    index: number;
}) => {
    return (
        <motion.div
            onClick={onClick}
            className={cn(
                "relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-300 p-4",
                isSelected
                    ? 'border-blue-500 shadow-lg shadow-blue-500/25 bg-slate-700/50'
                    : 'border-slate-700 hover:border-slate-500 bg-slate-800/30'
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                    {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2">
                        {item.question}
                    </h3>
                    <div className="flex items-center gap-2 text-slate-300 text-xs mb-2">
                        <BookOpen className="h-3 w-3" />
                        <span>Question #{item.order}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(item.updatedAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>

            {isSelected && (
                <div className="absolute top-2 right-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
            )}
        </motion.div>
    )
}

const MainFAQDisplay = ({
    item,
    index
}: {
    item: FAQItem;
    index: number;
}) => {
    const [isExpanded, setIsExpanded] = useState(true)

    return (
        <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="h-full"
        >
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-slate-700 h-full flex flex-col">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg flex items-center justify-center text-lg font-bold">
                                {index + 1}
                            </div>
                            <div className="flex items-center gap-4 text-slate-300">
                                <div className="flex items-center gap-2">
                                    <BookOpen className="h-5 w-5 text-blue-400" />
                                    <span className="text-lg">Question #{item.order}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-purple-400" />
                                    <span className="text-lg">{new Date(item.updatedAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                        <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                            {item.question}
                        </h2>
                    </div>
                </div>

                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-slate-800/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-700 flex-1"
                        >
                            <div className="p-6">
                                <div className="prose prose-lg max-w-none prose-invert">
                                    <MarkdownPreview
                                        content={item.answer}
                                        className="text-gray-300"
                                    />
                                </div>
                                <div className="mt-6 pt-4 border-t border-slate-600">
                                    <div className="flex items-center justify-between text-sm text-gray-400">
                                        <span>Created: {new Date(item.createdAt).toLocaleDateString()}</span>
                                        <div className="flex items-center gap-2">
                                            <Star className="h-3 w-3 text-yellow-400" />
                                            <span>Helpful answer</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    )
}

function FQA_section({ collage }: FQA_sectionProps) {
    const { faq } = collage as College & { faq: FAQData }
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedItem, setSelectedItem] = useState<FAQItem | null>(null)
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    const { data: formLinks, isLoading: formsLoading, error: formsError } = useQuery({
        queryKey: ['faq-forms', collage.id],
        queryFn: () => FAQService.getFormsForCOllageByIdForFAQ(collage.id),
        staleTime: 5 * 60 * 1000,
        retry: 2,
    })

    // Filter FAQ items based on search term (only for sidebar)
    const filteredItems = faq?.items?.filter(item =>
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    ) || []

    // Sort items
    const sortedItems = [...filteredItems].sort((a, b) => {
        return sortOrder === 'asc' ? a.order - b.order : b.order - a.order
    })

    // Set initial selected item
    useEffect(() => {
        if (faq?.items && faq.items.length > 0 && !selectedItem) {
            setSelectedItem(faq.items[0])
        }
    }, [faq?.items, selectedItem])

    const toggleSort = () => {
        setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
    }

    const clearSearch = () => {
        setSearchTerm('')
    }

    const handleItemClick = (item: FAQItem) => {
        setSelectedItem(item)
    }

    if (!faq || !faq.items) {
        return null
    }

    // if (!faq || !faq.items) {
    //     return (
    //         <div className="py-12 text-center">
    //             <div className="max-w-md mx-auto">
    //                 <HelpCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
    //                 <h3 className="text-lg font-medium text-gray-900 mb-2">No FAQ Available</h3>
    //                 <p className="text-gray-500 mb-6">
    //                     There are no frequently asked questions available for this college yet.
    //                 </p>
    //                 {formLinks && formLinks.length > 0 && (
    //                     <div className="space-y-3">
    //                         <p className="text-sm text-gray-600">Have a question? Ask the administrators:</p>
    //                         <div className="flex flex-col gap-2">
    //                             {formLinks.map((form: FormSection) => (
    //                                 <Button
    //                                     key={form.id}
    //                                     variant="outline"
    //                                     size="sm"
    //                                     className="justify-start"
    //                                     onClick={() => window.open(`/form/${form.id}`, '_blank')}
    //                                 >
    //                                     <MessageCircle className="mr-2 h-4 w-4" />
    //                                     {form.title}
    //                                     <ExternalLink className="ml-auto h-4 w-4" />
    //                                 </Button>
    //                             ))}
    //                         </div>
    //                     </div>
    //                 )}
    //             </div>
    //         </div>
    //     )
    // }

    // Check if selected item exists in filtered results

    return (
        <section className="relative py-12 lg:py-20 w-full">
            <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto">
                <motion.div
                    className="text-center mb-12 lg:mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-white">
                        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                            {faq.title?.toLocaleUpperCase() || 'Frequently Asked Questions'}
                        </span>
                    </h2>
                    {faq.description && (
                        <p className="text-xl lg:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
                            {faq.description}
                        </p>
                    )}
                    <div className="w-32 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 mx-auto rounded-full mt-8"></div>
                </motion.div>

                <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* Main Content Area */}
                    <div className="lg:col-span-8">
                        {selectedItem ? (
                            <MainFAQDisplay
                                item={selectedItem}
                                index={faq.items.findIndex(item => item.id === selectedItem.id)}
                            />
                        ) : (
                            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-12 border border-slate-700 h-full flex items-center justify-center">
                                <div className="text-center">
                                    <HelpCircle className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-white mb-2">Select a Question</h3>
                                    <p className="text-slate-400">Choose a question from the right to view its details</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* FAQ Items Sidebar */}
                    <div className="lg:col-span-4 min-h-[840px]">
                        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 h-full flex flex-col">
                            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2 flex-shrink-0">
                                <HelpCircle className="h-5 w-5 text-blue-400" />
                                All Questions
                            </h3>

                            <div className="space-y-4 mb-6 flex-shrink-0">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        type="text"
                                        placeholder="Search questions..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 pr-10 py-2 text-sm"
                                    />
                                    {searchTerm && (
                                        <button
                                            onClick={clearSearch}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="secondary" className="text-xs">
                                            {filteredItems.length} of {faq.items.length}
                                        </Badge>
                                        {searchTerm && (
                                            <Badge variant="outline" className="text-blue-600 text-xs">
                                                &quot;{searchTerm}&quot;
                                            </Badge>
                                        )}
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={toggleSort}
                                        className="text-xs h-7 px-2"
                                    >
                                        {sortOrder === 'asc' ? (
                                            <SortAsc className="mr-1 h-3 w-3" />
                                        ) : (
                                            <SortDesc className="mr-1 h-3 w-3" />
                                        )}
                                        {sortOrder === 'asc' ? 'Oldest' : 'Newest'}
                                    </Button>
                                </div>
                            </div>

                            {/* No Results in Sidebar */}
                            {filteredItems.length === 0 && searchTerm && (
                                <div className="text-center py-8 flex-1 flex items-center justify-center">
                                    <div className="space-y-4">
                                        <Search className="mx-auto h-12 w-12 text-slate-400" />
                                        <div>
                                            <h4 className="text-lg font-semibold text-white mb-2">No Questions Found</h4>
                                            <p className="text-slate-300 text-sm mb-4">
                                                No questions match &quot;{searchTerm}&quot;
                                            </p>
                                            <Button
                                                onClick={clearSearch}
                                                variant="outline"
                                                size="sm"
                                                className="text-xs"
                                            >
                                                Clear Search
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Questions List */}
                            {filteredItems.length > 0 && (
                                <div
                                    ref={scrollContainerRef}
                                    className="space-y-3 flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800/50"
                                    style={{ maxHeight: 'calc(100vh - 400px)' }}
                                >
                                    {sortedItems.map((item, index) => (
                                        <FAQItemCard
                                            key={item.id}
                                            item={item}
                                            index={index}
                                            isSelected={selectedItem?.id === item.id}
                                            onClick={() => handleItemClick(item)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {(formLinks && formLinks.length > 0) && (
                <div className="space-y-6 m-12 ">
                    <div className="text-center">
                        <h2 className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent text-4xl font-bold mb-2">Still Have Questions?</h2>
                        <p className="text-white max-w-2xl mx-auto">
                            Can&apos;t find what you&apos;re looking for? Our administrators are here to help.
                            Choose the most relevant form below to get your question answered.
                        </p>
                    </div>

                    <div className={`grid gap-6 md:grid-cols-${formLinks.length > 2 ? '2' : '1'} lg:grid-cols-${formLinks.length > 3 ? '3' : formLinks.length > 2 ? '2' : '1'}`}>
                        {formLinks.map((form: FormSection, index: number) => (
                            <Card key={form.id} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700 hover:border-slate-600 transition-all hover:shadow-lg">
                                <CardHeader className="pb-4">
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                            <FileText className="h-6 w-6 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <CardTitle className="text-white text-lg mb-1">
                                                {form.title}
                                            </CardTitle>
                                            {form.description && (
                                                <CardDescription className="text-gray-300 text-sm">
                                                    {form.description}
                                                </CardDescription>
                                            )}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <Button
                                        onClick={() => window.open(`/form/${form.id}`, '_blank')}
                                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0"
                                        size="lg"
                                    >
                                        <MessageCircle className="mr-2 h-4 w-4" />
                                        Ask Question
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {formsLoading && (
                        <div className="text-center py-8">
                            <div className="inline-flex items-center gap-3">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                <span className="text-gray-500">Loading contact forms...</span>
                            </div>
                        </div>
                    )}

                    {formsError && (
                        <div className="text-center py-8">
                            <Card className="bg-red-50 border-red-200 max-w-md mx-auto">
                                <CardContent className="pt-6">
                                    <div className="flex items-center gap-2 text-red-600 mb-2">
                                        <AlertCircle className="h-5 w-5" />
                                        <span className="font-medium">Unable to load forms</span>
                                    </div>
                                    <p className="text-red-500 text-sm">
                                        Please try again later or contact the administration directly.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            )}
        </section>
    )
}

export default FQA_section
"use client"

import { useUser } from "@/context/userContext";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, GraduationCap, Library, NotebookPen, LayoutDashboard, Shield, UserCheck, Loader2, CheckCircle, LogIn } from "lucide-react";

interface AdminAuthGuardProps {
    children: React.ReactNode;
    requireAdmin?: boolean;
    requireSuperAdmin?: boolean;
}

// Loading screen component for AdminAuthGuard
function AuthLoadingScreen({ message }: { message: string }) {
    const [progress, setProgress] = useState(0);
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        // Simulate loading progress
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + Math.floor(Math.random() * 8) + 2;
            });
        }, 200);

        // Show content after a brief delay
        const timeout = setTimeout(() => {
            setShowContent(true);
        }, 300);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, []);

    return (
        <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-slate-900 p-4">
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden opacity-20">
                <div className="absolute -left-[20%] -top-[20%] h-[60%] w-[60%] rounded-full bg-blue-500/20 blur-3xl" />
                <div className="absolute -right-[20%] -bottom-[20%] h-[60%] w-[60%] rounded-full bg-slate-700/20 blur-3xl" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center text-center">
                {showContent && (
                    <>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="mb-8 flex flex-col items-center"
                        >
                            <motion.div
                                animate={{
                                    rotate: [0, 15, -15, 0],
                                    y: [0, -10, 0]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                    ease: "easeInOut"
                                }}
                            >
                                <Shield className="h-16 w-16 text-blue-400" />
                            </motion.div>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl"
                            >
                                <span className="bg-gradient-to-r from-blue-400 to-slate-200 bg-clip-text text-transparent">
                                    Admin Portal
                                </span>
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="mt-4 max-w-2xl text-lg text-slate-300"
                            >
                                {message}
                            </motion.p>
                        </motion.div>

                        {/* Progress bar */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="mt-8 w-full max-w-md"
                        >
                            <div className="mb-2 flex justify-between text-sm text-slate-300">
                                <span>Verifying permissions...</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-700">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.3 }}
                                    className="h-full bg-gradient-to-r from-blue-500 to-blue-300"
                                />
                            </div>
                        </motion.div>
                    </>
                )}

                {/* Floating security icons */}
                {[...Array(6)].map((_, i) => {
                    const icons = [Shield, UserCheck, GraduationCap, BookOpen, Library, NotebookPen];
                    const Icon = icons[i % icons.length];
                    return (
                        <motion.div
                            key={i}
                            animate={{
                                opacity: [0, 0.4, 0],
                                y: [0, -40],
                                rotate: [0, 180],
                            }}
                            transition={{
                                duration: 3 + Math.random() * 4,
                                delay: Math.random() * 2,
                                repeat: Infinity,
                                repeatType: "reverse",
                            }}
                            className="absolute text-blue-400/30"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                        >
                            <Icon className="h-6 w-6" />
                        </motion.div>
                    );
                })}

                {/* Grid pattern */}
                <div className="absolute inset-0 -z-10 overflow-hidden opacity-10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-blue-500/10"></div>
                    <div className="h-[200%] w-[200%] -translate-x-1/2 -translate-y-1/2 transform bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                </div>
            </div>

            {/* Light effects */}
            <div className="absolute top-0 left-0 right-0 h-1/4 bg-gradient-to-b from-white/5 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-white/5 to-transparent"></div>
        </div>
    );
}

// Access granted success screen
function AccessGrantedScreen({ userType }: { userType: string }) {
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setShowContent(true);
        }, 300);

        return () => clearTimeout(timeout);
    }, []);

    return (
        <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-slate-900 p-4">
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden opacity-20">
                <div className="absolute -left-[20%] -top-[20%] h-[60%] w-[60%] rounded-full bg-green-500/20 blur-3xl" />
                <div className="absolute -right-[20%] -bottom-[20%] h-[60%] w-[60%] rounded-full bg-slate-700/20 blur-3xl" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center text-center">
                {showContent && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="mb-8 flex flex-col items-center"
                    >
                        <motion.div
                            animate={{
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, -5, 0]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatType: "reverse",
                                ease: "easeInOut"
                            }}
                        >
                            <CheckCircle className="h-16 w-16 text-green-400" />
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl"
                        >
                            <span className="bg-gradient-to-r from-green-400 to-slate-200 bg-clip-text text-transparent">
                                Access Granted
                            </span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="mt-4 max-w-2xl text-lg text-slate-300"
                        >
                            Welcome to the Admin Portal. You have {userType.toLowerCase()} privileges.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="mt-6"
                        >
                            <div className="flex items-center space-x-2 text-green-400">
                                <CheckCircle className="h-5 w-5" />
                                <span className="text-sm">Authentication successful</span>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {/* Grid pattern */}
                <div className="absolute inset-0 -z-10 overflow-hidden opacity-10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-green-500/10"></div>
                    <div className="h-[200%] w-[200%] -translate-x-1/2 -translate-y-1/2 transform bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                </div>
            </div>

            {/* Light effects */}
            <div className="absolute top-0 left-0 right-0 h-1/4 bg-gradient-to-b from-white/5 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-white/5 to-transparent"></div>
        </div>
    );
}

// Access denied screen component with login button
function AccessDeniedScreen({ title, message }: { title: string; message: string }) {
    const router = useRouter();

    const handleLogin = () => {
        router.push("/login");
    };

    return (
        <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-slate-900 p-4">
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden opacity-20">
                <div className="absolute -left-[20%] -top-[20%] h-[60%] w-[60%] rounded-full bg-red-500/20 blur-3xl" />
                <div className="absolute -right-[20%] -bottom-[20%] h-[60%] w-[60%] rounded-full bg-slate-700/20 blur-3xl" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8 flex flex-col items-center"
                >
                    <motion.div
                        animate={{
                            rotate: [0, 10, -10, 0],
                            y: [0, -5, 0]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "reverse",
                            ease: "easeInOut"
                        }}
                    >
                        <Shield className="h-16 w-16 text-red-400" />
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl"
                    >
                        <span className="bg-gradient-to-r from-red-400 to-slate-200 bg-clip-text text-transparent">
                            {title}
                        </span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="mt-4 max-w-2xl text-lg text-slate-300"
                    >
                        {message}
                    </motion.p>

                    {/* Login button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="mt-8"
                    >
                        <button
                            onClick={handleLogin}
                            className="flex items-center space-x-2 rounded-lg bg-red-600 px-6 py-3 text-white hover:bg-red-700 transition-colors duration-200"
                        >
                            <LogIn className="h-5 w-5" />
                            <span>Login to Continue</span>
                        </button>
                    </motion.div>
                </motion.div>

                {/* Grid pattern */}
                <div className="absolute inset-0 -z-10 overflow-hidden opacity-10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-red-500/10"></div>
                    <div className="h-[200%] w-[200%] -translate-x-1/2 -translate-y-1/2 transform bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                </div>
            </div>

            {/* Light effects */}
            <div className="absolute top-0 left-0 right-0 h-1/4 bg-gradient-to-b from-white/5 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-white/5 to-transparent"></div>
        </div>
    );
}

export const AdminAuthGuard: React.FC<AdminAuthGuardProps> = ({
    children,
    requireAdmin = true,
    requireSuperAdmin = false,
}) => {
    const { isSignedIn, isLoaded: clerkLoaded } = useAuth();
    const { user, loading: userLoading } = useUser();
    const router = useRouter();
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (clerkLoaded && isSignedIn && !userLoading && user) {
            // Check admin permissions
            if (requireSuperAdmin && user.userType !== "SUPERADMIN") {
                // Don't redirect, just show access denied screen
                return;
            }

            if (requireAdmin && user.userType === "GUEST") {
                // Don't redirect, just show access denied screen
                return;
            }

            // If we reach here, user has proper permissions
            // Show success screen briefly before rendering children
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
            }, 2000); // Show success for 2 seconds
        }
    }, [clerkLoaded, isSignedIn, userLoading, user, requireAdmin, requireSuperAdmin, router]);

    // Show loading while checking authentication
    if (!clerkLoaded || userLoading) {
        return <AuthLoadingScreen message="Verifying your identity..." />;
    }

    // Show access denied screen if not signed in
    if (!isSignedIn) {
        return (
            <AccessDeniedScreen
                title="Authentication Required"
                message="Please login to access the admin portal."
            />
        );
    }

    // Show access denied screen if user not found in database
    if (isSignedIn && !user) {
        return (
            <AccessDeniedScreen
                title="Account Setup Required"
                message="Your account needs to be set up. Please contact an administrator."
            />
        );
    }

    // Check final permissions and show access denied if needed
    if (requireSuperAdmin && user && user.userType !== "SUPERADMIN") {
        return (
            <AccessDeniedScreen
                title="Access Denied"
                message="You need super admin privileges to access this page."
            />
        );
    }

    if (requireAdmin && user && user.userType === "GUEST") {
        return (
            <AccessDeniedScreen
                title="Access Denied"
                message="You need admin privileges to access this page."
            />
        );
    }

    // Show success screen if user has proper permissions
    if (showSuccess && user) {
        return <AccessGrantedScreen userType={user.userType} />;
    }

    // User is authenticated and has proper permissions
    return <>{children}</>;
}; 
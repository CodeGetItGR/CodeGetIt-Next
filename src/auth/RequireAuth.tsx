'use client'

import { useAuth } from '@/auth/useAuth';
import {ReactNode} from "react";
import Link from "next/link";

interface RequireAuthProps {
    requireAdmin?: boolean;
    children: ReactNode
}

export const RequireAuth = ({ requireAdmin = true, children }: RequireAuthProps) : ReactNode => {
    const { isAuthenticated, isAdmin } = useAuth();

    if (!isAuthenticated) {
        return <Link href="/admin/login" replace />;
    }

    if (requireAdmin && !isAdmin) {
        return (
            <div className="grid min-h-screen place-items-center px-6">
                <div className="max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                    <h1 className="text-2xl font-semibold text-gray-900">Access denied</h1>
                    <p className="mt-2 text-sm text-gray-600">You are logged in, but your account does not have admin permissions.</p>
                </div>
            </div>
        );
    }

    return children;
};

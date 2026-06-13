'use client'

import { Suspense, useCallback, useEffect, useState, type ChangeEvent } from 'react';
import * as React from 'react';
import {Input} from "@/components";
import {useApiErrorState, useNavigation} from "@/hooks";
import {useAuth} from "@/auth/useAuth";

export default function LoginPage() {
    return <Suspense fallback={null}>
        <LoginForm />
    </Suspense>
}

function LoginForm() {
    const { login, isAuthenticated } = useAuth();
    const {navigate, searchParams} = useNavigation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { errorMessage, setApiError, clearError } = useApiErrorState();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/admin', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = useCallback(
        async (event: React.SubmitEvent<HTMLFormElement>) => {
            event.preventDefault();
            setIsSubmitting(true);
            clearError();

            try {
                await login(username.trim(), password);
                const from = searchParams.get("from")
                const destination = typeof from === 'string' ? from : '/admin';
                navigate(destination, { replace: true });
            } catch (error) {
                setApiError(error);
            } finally {
                setIsSubmitting(false);
            }
        },
        [clearError, login, navigate, password, searchParams, setApiError, username]
    );

    const handleUsernameChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    }, []);

    const handlePasswordChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-10 md:grid md:place-items-center">
            <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
                <p className="text-xs tracking-[0.2em] text-gray-500 uppercase">CodeGetIt</p>
                <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">Admin sign in</h1>
                <p className="mt-2 text-sm text-gray-600">Use your admin credentials to access workflow management.</p>

                <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                    <Input
                        id="username"
                        label="Username"
                        value={username}
                        onChange={handleUsernameChange}
                        className="rounded-xl px-4 py-2.5 text-sm"
                        autoComplete="username"
                        required
                    />

                    <Input
                        id="password"
                        type="password"
                        label="Password"
                        value={password}
                        onChange={handlePasswordChange}
                        className="rounded-xl px-4 py-2.5 text-sm"
                        autoComplete="current-password"
                        required
                    />

                    {errorMessage && <p className="text-sm text-rose-600">{errorMessage}</p>}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {isSubmitting ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>
            </div>
        </div>
    );
};

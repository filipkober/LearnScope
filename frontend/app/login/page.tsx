"use client";

import LoginPage from "@/components/LoginPage";
import { Suspense } from "react";

export default function Page() {
    

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginPage />
        </Suspense>
    );
}
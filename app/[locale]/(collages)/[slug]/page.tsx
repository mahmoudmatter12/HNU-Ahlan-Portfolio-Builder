"use client"
import { useParams } from 'next/navigation'
import React from 'react'

function Page() {
    const { slug } = useParams();
    return (
        <div>{slug}</div>
    )
}

export default Page
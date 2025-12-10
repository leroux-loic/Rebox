"use client"

import dynamic from "next/dynamic"

const Map = dynamic(() => import("@/components/map"), {
    ssr: false,
    loading: () => <div className="h-[400px] w-full bg-muted animate-pulse rounded-lg" />
})

export default function MapWrapper(props: any) {
    return <Map {...props} />
}

"use client"

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { useEffect } from "react"

// Fix for default marker icon in Leaflet with Next.js
const iconUrl = "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png"
const iconRetinaUrl = "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png"
const shadowUrl = "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png"

const customIcon = new L.Icon({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
})

interface MapProps {
    center?: [number, number]
    zoom?: number
    markers?: Array<{
        id: string
        position: [number, number]
        title: string
    }>
    className?: string
}

function MapUpdater({ center, zoom }: { center: [number, number], zoom: number }) {
    const map = useMap()
    useEffect(() => {
        map.setView(center, zoom)
    }, [center, zoom, map])
    return null
}

export default function Map({ center = [48.8566, 2.3522], zoom = 13, markers = [], className }: MapProps) {
    return (
        <div className={`w-full rounded-lg overflow-hidden border border-border ${className || 'h-[400px]'}`}>
            <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} className="h-full w-full">
                <MapUpdater center={center} zoom={zoom} />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {markers.map((marker) => (
                    <Marker key={marker.id} position={marker.position} icon={customIcon}>
                        <Popup>{marker.title}</Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    )
}

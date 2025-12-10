"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { ListingCard } from "@/components/listing-card"
import { ImpactCard } from "@/components/impact-card"
import { BadgesList } from "@/components/badges-list"
import { Leaderboard } from "@/components/leaderboard"
import { Box, Button, Container, Flex, Heading, SimpleGrid, Input, InputGroup, InputLeftElement, Icon, VStack, HStack, Text, useColorModeValue } from "@chakra-ui/react"
import MapWrapper from "@/components/map-wrapper"
import { Search } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"

// Define available badges
const AVAILABLE_BADGES = [
    { id: 'first_buy', name: 'Premier Sauvetage', description: 'Vous avez sauvé vos premiers cartons !', icon: 'medal' },
    { id: 'eco_warrior', name: 'Eco Warrior', description: 'Plus de 10kg de CO2 économisés', icon: 'trophy' },
    { id: 'super_buyer', name: 'Super Recycleur', description: '5 commandes réalisées', icon: 'star' },
]

export default function IndividualDashboard() {
    const { user } = useAuth()
    const [listings, setListings] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [profile, setProfile] = useState<any>(null)

    // Advanced Filters State
    const [showFilters, setShowFilters] = useState(false)
    const [filters, setFilters] = useState({
        minLength: "", maxLength: "",
        minWidth: "", maxWidth: "",
        minHeight: "", maxHeight: "",
        radius: "50", // km
    })
    const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null)

    useEffect(() => {
        fetchListings()
        if (user) fetchProfile()

        // Get user location for radius filter
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                setUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                })
            })
        }
    }, [user])

    const fetchProfile = async () => {
        const { data } = await supabase.from('profiles').select('*').eq('id', user!.id).single()
        if (data) setProfile(data)
    }

    const fetchListings = async () => {
        setLoading(true)
        let query = supabase
            .from('listings')
            .select('*, profiles(company_name)')
            .eq('status', 'active')
            .order('created_at', { ascending: false })

        // Apply server-side dimension filters if set
        if (filters.minLength) query = query.gte('length', parseInt(filters.minLength))
        if (filters.maxLength) query = query.lte('length', parseInt(filters.maxLength))
        if (filters.minWidth) query = query.gte('width', parseInt(filters.minWidth))
        if (filters.maxWidth) query = query.lte('width', parseInt(filters.maxWidth))
        if (filters.minHeight) query = query.gte('height', parseInt(filters.minHeight))
        if (filters.maxHeight) query = query.lte('height', parseInt(filters.maxHeight))

        const { data, error } = await query

        if (!error && data) {
            setListings(data)
        }
        setLoading(false)
    }

    // Re-fetch when filters change (debounced ideally, but button click for now or effect)
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchListings()
        }, 500)
        return () => clearTimeout(timer)
    }, [filters.minLength, filters.maxLength, filters.minWidth, filters.maxWidth, filters.minHeight, filters.maxHeight])

    // Client-side filtering for Radius and Search Term
    const filteredListings = listings.filter(l => {
        // Text search
        const matchesSearch = l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            l.description?.toLowerCase().includes(searchTerm.toLowerCase())

        // Radius search
        let matchesRadius = true
        if (userLocation && filters.radius) {
            const R = 6371 // Earth radius in km
            const dLat = (l.location_lat - userLocation.lat) * Math.PI / 180
            const dLon = (l.location_lng - userLocation.lng) * Math.PI / 180
            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(l.location_lat * Math.PI / 180) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2)
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
            const distance = R * c

            matchesRadius = distance <= parseInt(filters.radius)
        }

        return matchesSearch && matchesRadius
    })

    const mapMarkers = filteredListings.map(l => ({
        id: l.id,
        position: [l.location_lat, l.location_lng] as [number, number],
        title: `${l.title} - ${l.price}€`
    }))

    // Merge unlocked badges
    const displayBadges = AVAILABLE_BADGES.map(badge => {
        const unlocked = profile?.badges?.find((b: any) => b.id === badge.id)
        return unlocked ? { ...badge, unlocked: true } : { ...badge, unlocked: false }
    })

    return (
        <Container maxW="container.xl" py={8}>
            <Flex direction={{ base: "column", md: "row" }} justify="space-between" align="center" mb={8} gap={4}>
                <Heading size="lg">Trouver des cartons</Heading>
                <Flex w={{ base: "full", md: "auto" }} gap={2} align="center">
                    <Link href="/profile">
                        <Button variant="outline">Mes Commandes</Button>
                    </Link>
                    <InputGroup maxW="xs">
                        <InputLeftElement pointerEvents="none">
                            <Icon as={Search} color="gray.300" />
                        </InputLeftElement>
                        <Input
                            placeholder="Rechercher..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </InputGroup>
                    <Button onClick={() => setShowFilters(!showFilters)} variant={showFilters ? "solid" : "outline"} colorScheme="brand">
                        Filtres
                    </Button>
                </Flex>
            </Flex>

            {/* Advanced Filters Section */}
            {showFilters && (
                <Box mb={8} p={4} borderWidth="1px" borderRadius="lg" bg="gray.50">
                    <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
                        <Box>
                            <Text fontSize="sm" mb={1} fontWeight="bold">Longueur (cm)</Text>
                            <HStack>
                                <Input placeholder="Min" bg="white" type="number" value={filters.minLength} onChange={(e) => setFilters({ ...filters, minLength: e.target.value })} />
                                <Input placeholder="Max" bg="white" type="number" value={filters.maxLength} onChange={(e) => setFilters({ ...filters, maxLength: e.target.value })} />
                            </HStack>
                        </Box>
                        <Box>
                            <Text fontSize="sm" mb={1} fontWeight="bold">Largeur (cm)</Text>
                            <HStack>
                                <Input placeholder="Min" bg="white" type="number" value={filters.minWidth} onChange={(e) => setFilters({ ...filters, minWidth: e.target.value })} />
                                <Input placeholder="Max" bg="white" type="number" value={filters.maxWidth} onChange={(e) => setFilters({ ...filters, maxWidth: e.target.value })} />
                            </HStack>
                        </Box>
                        <Box>
                            <Text fontSize="sm" mb={1} fontWeight="bold">Hauteur (cm)</Text>
                            <HStack>
                                <Input placeholder="Min" bg="white" type="number" value={filters.minHeight} onChange={(e) => setFilters({ ...filters, minHeight: e.target.value })} />
                                <Input placeholder="Max" bg="white" type="number" value={filters.maxHeight} onChange={(e) => setFilters({ ...filters, maxHeight: e.target.value })} />
                            </HStack>
                        </Box>
                        <Box>
                            <Text fontSize="sm" mb={1} fontWeight="bold">Rayon (km)</Text>
                            <Input placeholder="50" bg="white" type="number" value={filters.radius} onChange={(e) => setFilters({ ...filters, radius: e.target.value })} />
                            {userLocation && <Text fontSize="xs" color="green.600" mt={1}>📍 Localisation active</Text>}
                        </Box>
                    </SimpleGrid>
                </Box>
            )}

            {/* Gamification Section */}
            {user && (
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
                    <Box gridColumn={{ md: "span 1" }}>
                        <ImpactCard carbonScore={profile?.carbon_score || 0} />
                    </Box>
                    <Box gridColumn={{ md: "span 2" }}>
                        <VStack spacing={6} align="stretch">
                            <BadgesList badges={displayBadges} />

                            <Box borderWidth="1px" borderRadius="xl" p={0} overflow="hidden">
                                <Box p={4} borderBottomWidth="1px" bg="gray.50">
                                    <Heading size="sm">Top Recycleurs</Heading>
                                </Box>
                                <Box p={4}>
                                    <Leaderboard limit={3} compact />
                                    <Link href="/leaderboard">
                                        <Button variant="link" colorScheme="brand" size="sm" mt={2}>
                                            Voir le classement
                                        </Button>
                                    </Link>
                                </Box>
                            </Box>
                        </VStack>
                    </Box>
                </SimpleGrid>
            )}

            <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={8}>
                <Box gridColumn={{ lg: "span 2" }}>
                    {loading ? (
                        <Text>Chargement des annonces...</Text>
                    ) : filteredListings.length === 0 ? (
                        <Text>Aucune annonce trouvée.</Text>
                    ) : (
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                            {filteredListings.map((listing) => {
                                let distanceDisplay = undefined
                                if (userLocation) {
                                    const R = 6371 // km
                                    const dLat = (listing.location_lat - userLocation.lat) * Math.PI / 180
                                    const dLon = (listing.location_lng - userLocation.lng) * Math.PI / 180
                                    const a =
                                        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                                        Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(listing.location_lat * Math.PI / 180) *
                                        Math.sin(dLon / 2) * Math.sin(dLon / 2)
                                    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
                                    const d = R * c
                                    distanceDisplay = d < 1 ? `${Math.round(d * 1000)}m` : `${d.toFixed(1)}km`
                                }

                                return (
                                    <Link key={listing.id} href={`/listings/${listing.id}`}>
                                        <ListingCard
                                            title={listing.title}
                                            price={listing.price}
                                            quantity={listing.quantity}
                                            condition="Bon état"
                                            sellerName={listing.profiles?.company_name || "Vendeur"}
                                            imageUrl={listing.image_url}
                                            distance={distanceDisplay}
                                        />
                                    </Link>
                                )
                            })}
                        </SimpleGrid>
                    )}
                </Box>

                <Box position="sticky" top="4" h="500px">
                    <Box borderRadius="lg" overflow="hidden" h="full" borderWidth="1px">
                        <MapWrapper
                            markers={mapMarkers}
                            className="h-full"
                            center={userLocation ? [userLocation.lat, userLocation.lng] : undefined}
                        />
                    </Box>
                </Box>
            </SimpleGrid>
        </Container>
    )
}

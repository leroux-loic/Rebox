"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { ListingCard } from "@/components/listing-card"
import { ImpactCard } from "@/components/impact-card"
import { BadgesList } from "@/components/badges-list"
import { Leaderboard } from "@/components/leaderboard"
import { Box, Button, Container, Flex, Heading, SimpleGrid, Input, InputGroup, InputLeftElement, Icon, VStack, HStack, Text, useColorModeValue, Avatar, Grid, GridItem, InputRightAddon } from "@chakra-ui/react"
import MapWrapper from "@/components/map-wrapper"
import { Search, Package, Award, Heart } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { motion } from "framer-motion"

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
    const [showFilters, setShowFilters] = useState(false)
    const [filters, setFilters] = useState({
        minLength: "", maxLength: "",
        minWidth: "", maxWidth: "",
        minHeight: "", maxHeight: "",
        radius: "50",
    })
    const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null)

    useEffect(() => {
        fetchListings()
        if (user) fetchProfile()
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude })
            })
        }
    }, [user])

    const fetchProfile = async () => {
        const { data } = await supabase.from('profiles').select('*').eq('id', user!.id).single()
        if (data) setProfile(data)
    }

    const fetchListings = async () => {
        setLoading(true)
        let query = supabase.from('listings').select('*, profiles(company_name)').eq('status', 'active').order('created_at', { ascending: false })
        if (filters.minLength) query = query.gte('length', parseInt(filters.minLength))
        if (filters.maxLength) query = query.lte('length', parseInt(filters.maxLength))
        if (filters.minWidth) query = query.gte('width', parseInt(filters.minWidth))
        if (filters.maxWidth) query = query.lte('width', parseInt(filters.maxWidth))
        if (filters.minHeight) query = query.gte('height', parseInt(filters.minHeight))
        if (filters.maxHeight) query = query.lte('height', parseInt(filters.maxHeight))
        const { data, error } = await query
        if (!error && data) setListings(data)
        setLoading(false)
    }

    useEffect(() => {
        const timer = setTimeout(() => fetchListings(), 500)
        return () => clearTimeout(timer)
    }, [filters])

    const filteredListings = listings.filter(l => {
        const matchesSearch = l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            l.description?.toLowerCase().includes(searchTerm.toLowerCase())
        let matchesRadius = true
        if (userLocation && filters.radius) {
            const R = 6371
            const dLat = (l.location_lat - userLocation.lat) * Math.PI / 180
            const dLon = (l.location_lng - userLocation.lng) * Math.PI / 180
            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(l.location_lat * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
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

    const displayBadges = AVAILABLE_BADGES.map(badge => {
        const unlocked = profile?.badges?.find((b: any) => b.id === badge.id)
        return unlocked ? { ...badge, unlocked: true } : { ...badge, unlocked: false }
    })

    return (
        <Box bg="eco.50" minH="100vh" pb={20}>
            {/* TOP STATS BAR */}
            <Box bg="white" borderBottom="1px solid" borderColor="eco.100" py={6} mb={8} shadow="sm">
                <Container maxW="container.xl">
                    <Flex direction={{ base: "column", lg: "row" }} align="center" gap={8}>
                        <Box flex="1">
                            <VStack align="start" spacing={1}>
                                <Heading size="lg" color="brand.900" letterSpacing="tighter">Bonjour, {user?.user_metadata?.full_name?.split(' ')[0] || "Recycleur"} ! 👋</Heading>
                                <Text color="brown.500" fontWeight="medium">Prêt à sauver de nouveaux cartons aujourd'hui ?</Text>
                            </VStack>
                        </Box>
                        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} flex="2" w="full">
                            <ImpactCard carbonScore={profile?.carbon_score || 0} compact />
                            <Box bg="eco.50" p={4} borderRadius="2xl" border="1px solid" borderColor="eco.100">
                                <HStack spacing={4}>
                                    <Box boxSize="40px" bg="brand.500" borderRadius="xl" display="flex" alignItems="center" justifyContent="center">
                                        <Icon as={Search} color="white" />
                                    </Box>
                                    <VStack align="start" spacing={0}>
                                        <Text fontSize="2xl" fontWeight="black" color="brand.900">{filteredListings.length}</Text>
                                        <Text fontSize="xs" color="brown.400" fontWeight="bold">Annonces autour de vous</Text>
                                    </VStack>
                                </HStack>
                            </Box>
                            <Box bg="brown.900" p={4} borderRadius="2xl" color="white">
                                <HStack spacing={4}>
                                    <Avatar size="sm" src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.email}`} />
                                    <VStack align="start" spacing={0}>
                                        <Text fontSize="sm" fontWeight="black">Niveau 2</Text>
                                        <Text fontSize="xs" color="brown.200">ReBox Enthusiast</Text>
                                    </VStack>
                                </HStack>
                            </Box>
                        </SimpleGrid>
                    </Flex>
                </Container>
            </Box>

            <Container maxW="container.xl">
                <Grid templateColumns={{ base: "1fr", lg: "65fr 35fr" }} gap={12}>

                    {/* LEFT: MARKETPLACE FEED */}
                    <GridItem>
                        <VStack spacing={8} align="stretch">
                            {/* Unified Search & Filters Header */}
                            <Box bg="white" p={4} borderRadius="3xl" shadow="xl" border="1px solid" borderColor="eco.100">
                                <VStack spacing={4}>
                                    <Flex w="full" gap={3}>
                                        <InputGroup size="lg">
                                            <InputLeftElement pointerEvents="none">
                                                <Icon as={Search} color="eco.400" />
                                            </InputLeftElement>
                                            <Input
                                                placeholder="Que recherchez-vous ? (ex: déménagement, palettes...)"
                                                variant="unstyled"
                                                px={4}
                                                h="50px"
                                                fontSize="md"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </InputGroup>
                                        <Button
                                            h="50px"
                                            px={6}
                                            borderRadius="2xl"
                                            colorScheme={showFilters ? "brand" : "eco"}
                                            variant={showFilters ? "solid" : "outline"}
                                            onClick={() => setShowFilters(!showFilters)}
                                            leftIcon={<Search size={18} />}
                                        >
                                            Filtres
                                        </Button>
                                    </Flex>

                                    {showFilters && (
                                        <Box w="full" pt={4} borderTop="1px solid" borderColor="eco.50">
                                            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                                                <Box>
                                                    <Text fontSize="xs" fontWeight="black" mb={2} color="brown.500" textTransform="uppercase">Dimensions</Text>
                                                    <SimpleGrid columns={2} spacing={2}>
                                                        <Input size="sm" placeholder="Longueur min" bg="eco.50" type="number" value={filters.minLength} onChange={(e) => setFilters({ ...filters, minLength: e.target.value })} borderRadius="lg" />
                                                        <Input size="sm" placeholder="Largeur min" bg="eco.50" type="number" value={filters.minWidth} onChange={(e) => setFilters({ ...filters, minWidth: e.target.value })} borderRadius="lg" />
                                                    </SimpleGrid>
                                                </Box>
                                                <Box>
                                                    <Text fontSize="xs" fontWeight="black" mb={2} color="brown.500" textTransform="uppercase">Rayon de recherche</Text>
                                                    <InputGroup size="sm">
                                                        <Input placeholder="Rayon (km)" bg="eco.50" type="number" value={filters.radius} onChange={(e) => setFilters({ ...filters, radius: e.target.value })} borderRadius="lg" />
                                                        <InputRightAddon bg="eco.100" color="brown.700">km</InputRightAddon>
                                                    </InputGroup>
                                                </Box>
                                                <Flex align="end">
                                                    <Button w="full" size="sm" variant="ghost" colorScheme="orange" onClick={() => setFilters({ minLength: "", maxLength: "", minWidth: "", maxWidth: "", minHeight: "", maxHeight: "", radius: "50" })}>Réinitialiser</Button>
                                                </Flex>
                                            </SimpleGrid>
                                        </Box>
                                    )}
                                </VStack>
                            </Box>

                            {/* Listings Grid */}
                            <Box>
                                {loading ? (
                                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                                        {[1, 2, 3, 4].map(i => <Box key={i} h="300px" bg="white" borderRadius="3xl" as={motion.div} animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity } as any} />)}
                                    </SimpleGrid>
                                ) : filteredListings.length === 0 ? (
                                    <VStack py={20} spacing={4} bg="white" borderRadius="4xl" border="1px dashed" borderColor="eco.300">
                                        <Icon as={Package} boxSize={12} color="eco.200" />
                                        <Text fontWeight="bold" color="brown.400">Aucun carton trouvé par ici...</Text>
                                        <Button variant="link" colorScheme="brand" onClick={() => setSearchTerm("")}>Voir toutes les annonces</Button>
                                    </VStack>
                                ) : (
                                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                                        {filteredListings.map((listing) => (
                                            <ListingCard key={listing.id} listing={listing} />
                                        ))}
                                    </SimpleGrid>
                                )}
                            </Box>
                        </VStack>
                    </GridItem>

                    {/* RIGHT: MAP & GAMIFICATION */}
                    <GridItem>
                        <VStack spacing={8} position="sticky" top="110px">
                            {/* Map Container */}
                            <Box
                                bg="white"
                                p={2}
                                borderRadius="4xl"
                                shadow="2xl"
                                border="1px solid"
                                borderColor="eco.100"
                                w="full"
                                h="450px"
                                overflow="hidden"
                            >
                                <MapWrapper
                                    markers={mapMarkers}
                                    center={userLocation ? [userLocation.lat, userLocation.lng] : undefined}
                                />
                            </Box>

                            {/* Leaderboard Compact */}
                            <Box bg="white" p={8} borderRadius="4xl" shadow="lg" w="full" border="1px solid" borderColor="eco.100">
                                <VStack align="stretch" spacing={6}>
                                    <Flex justify="space-between" align="center">
                                        <Heading size="sm" color="brand.900" letterSpacing="tight">Top Recycleurs</Heading>
                                        <Link href="/leaderboard"><Text fontSize="xs" fontWeight="bold" color="brand.500">Voir tout</Text></Link>
                                    </Flex>
                                    <Leaderboard limit={3} compact />
                                </VStack>
                            </Box>

                            {/* Badge Invite */}
                            <Box bgGradient="linear(to-br, brand.600, brand.900)" p={6} borderRadius="3xl" w="full" color="white" shadow="xl">
                                <VStack spacing={4} align="start">
                                    <Icon as={Award} boxSize={8} color="brand.200" />
                                    <VStack align="start" spacing={1}>
                                        <Text fontWeight="black" fontSize="lg">Débloquez vos Badges</Text>
                                        <Text fontSize="xs" color="brand.100">Continuez à sauver des cartons pour obtenir des récompenses exclusives.</Text>
                                    </VStack>
                                    <BadgesList badges={displayBadges.slice(0, 3)} compact />
                                </VStack>
                            </Box>
                        </VStack>
                    </GridItem>

                </Grid>
            </Container>
        </Box>
    )
}


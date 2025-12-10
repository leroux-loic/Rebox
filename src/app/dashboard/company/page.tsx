"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/components/auth-provider"
import { ListingCard } from "@/components/listing-card"
import { Leaderboard } from "@/components/leaderboard"
import { ImpactCard } from "@/components/impact-card"
import { BadgesList } from "@/components/badges-list"
import { Box, Button, Container, Flex, Heading, SimpleGrid, Tabs, TabList, TabPanels, Tab, TabPanel, Text, Input, VStack, HStack, Icon, useColorModeValue, Card, CardHeader, CardBody, Badge } from "@chakra-ui/react"
import Link from "next/link"
import { Plus, CheckCircle, Package } from "lucide-react"

export default function CompanyDashboard() {
    const { user } = useAuth()
    const [listings, setListings] = useState<any[]>([])
    const [reservations, setReservations] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [pickupCodeInput, setPickupCodeInput] = useState("")
    const [profile, setProfile] = useState<any>(null)

    useEffect(() => {
        if (user) {
            fetchData()
            fetchProfile()
        }
    }, [user])

    const fetchProfile = async () => {
        const { data } = await supabase.from('profiles').select('*').eq('id', user!.id).single()
        if (data) setProfile(data)
    }

    const fetchData = async () => {
        // 1. Fetch Listings
        const { data: listingsData } = await supabase
            .from('listings')
            .select('*')
            .eq('seller_id', user!.id)
            .order('created_at', { ascending: false })

        if (listingsData) setListings(listingsData)

        // 2. Fetch Reservations
        if (listingsData && listingsData.length > 0) {
            const listingIds = listingsData.map(l => l.id)
            const { data: ordersData } = await supabase
                .from('orders')
                .select('*, listings(*), profiles(*)')
                .in('listing_id', listingIds)
                .eq('status', 'reserved')
                .order('created_at', { ascending: false })

            if (ordersData) setReservations(ordersData)
        }

        setLoading(false)
    }

    const handleValidatePickup = async (orderId: string, correctCode: string) => {
        if (!confirm("Confirmer que la commande a bien été récupérée ?")) return

        const { error: orderError } = await supabase
            .from('orders')
            .update({ status: 'picked_up' } as any)
            .eq('id', orderId)

        if (orderError) {
            alert("Erreur update order: " + orderError.message)
            return
        }

        const order = reservations.find(r => r.id === orderId)
        if (order) {
            await supabase
                .from('listings')
                .update({ status: 'sold' } as any)
                .eq('id', order.listing_id)
        }

        alert("Vente confirmée !")
        setPickupCodeInput("")
        fetchData()
    }

    return (
        <Container maxW="container.xl" py={8}>
            <Flex justify="between" align="center" mb={8}>
                <Heading size="lg">Tableau de bord Entreprise</Heading>
                <Link href="/dashboard/company/create">
                    <Button leftIcon={<Icon as={Plus} />} colorScheme="brand">
                        Créer une annonce
                    </Button>
                </Link>
            </Flex>

            <SimpleGrid columns={{ base: 1, lg: 7 }} spacing={8}>
                <Box gridColumn={{ lg: "span 4" }}>
                    <Tabs colorScheme="brand" variant="enclosed">
                        <TabList>
                            <Tab>Mes Annonces</Tab>
                            <Tab>Réservations ({reservations.length})</Tab>
                        </TabList>

                        <TabPanels>
                            <TabPanel px={0}>
                                {loading ? (
                                    <Text>Chargement...</Text>
                                ) : listings.length === 0 ? (
                                    <VStack
                                        py={12}
                                        bg="gray.50"
                                        border="1px dashed"
                                        borderColor="gray.200"
                                        borderRadius="lg"
                                        spacing={4}
                                    >
                                        <Text color="gray.500">Vous n'avez aucune annonce active.</Text>
                                        <Link href="/dashboard/company/create">
                                            <Button variant="outline">Créer ma première annonce</Button>
                                        </Link>
                                    </VStack>
                                ) : (
                                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                                        {listings.map((listing) => (
                                            <ListingCard
                                                key={listing.id}
                                                title={listing.title}
                                                price={listing.price}
                                                quantity={listing.quantity}
                                                condition="Bon état"
                                                sellerName="Moi"
                                                imageUrl={listing.image_url}
                                                hideAction={true}
                                            />
                                        ))}
                                    </SimpleGrid>
                                )}
                            </TabPanel>

                            <TabPanel px={0}>
                                {reservations.length === 0 ? (
                                    <Text>Aucune réservation en attente.</Text>
                                ) : (
                                    <VStack spacing={4} align="stretch">
                                        {reservations.map(reservation => (
                                            <Box key={reservation.id} p={4} borderWidth="1px" borderRadius="lg" bg="white">
                                                <Heading size="sm" mb={2}>{reservation.listings?.title}</Heading>
                                                <Flex direction={{ base: "column", md: "row" }} justify="space-between" align="center" gap={4}>
                                                    <Box>
                                                        <Text fontWeight="bold">Acheteur : {reservation.profiles?.company_name || "Particulier"}</Text>
                                                        <Badge colorScheme="green" mt={1}>Payé en ligne</Badge>
                                                    </Box>
                                                    <Button
                                                        colorScheme="green"
                                                        leftIcon={<Icon as={CheckCircle} />}
                                                        onClick={() => handleValidatePickup(reservation.id, reservation.pickup_code)}
                                                    >
                                                        Confirmer le retrait
                                                    </Button>
                                                </Flex>
                                            </Box>
                                        ))}
                                    </VStack>
                                )}
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Box>

                <Box gridColumn={{ lg: "span 3" }}>
                    <VStack spacing={6} align="stretch">
                        <ImpactCard carbonScore={profile?.carbon_score || 0} />
                        <BadgesList badges={profile?.badges || []} />

                        <Box borderWidth="1px" borderRadius="xl" p={0} overflow="hidden">
                            <Box p={4} borderBottomWidth="1px" bg="gray.50">
                                <Heading size="sm">Top Recycleurs</Heading>
                            </Box>
                            <Box p={4}>
                                <Leaderboard limit={5} compact />
                                <Link href="/leaderboard">
                                    <Button variant="link" colorScheme="brand" w="full" mt={2}>
                                        Voir le classement complet
                                    </Button>
                                </Link>
                            </Box>
                        </Box>
                    </VStack>
                </Box>
            </SimpleGrid>
        </Container>
    )
}

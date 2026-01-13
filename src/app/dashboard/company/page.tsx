"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/components/auth-provider"
import { ListingCard } from "@/components/listing-card"
import { Box, Button, Container, Flex, Heading, SimpleGrid, Tabs, TabList, TabPanels, Tab, TabPanel, Text, Input, VStack, HStack, Icon, useColorModeValue, Card, CardHeader, CardBody, Badge, useToast, InputGroup, InputRightElement } from "@chakra-ui/react"
import Link from "next/link"
import { Plus, CheckCircle, Package, Search, LogOut, User, Settings, ShieldCheck } from "lucide-react"

export default function CompanyDashboard() {
    const { user, signOut } = useAuth()
    const toast = useToast()
    const [listings, setListings] = useState<any[]>([])
    const [reservations, setReservations] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [pickupCodes, setPickupCodes] = useState<{ [key: string]: string }>({})

    useEffect(() => {
        if (user) fetchData()
    }, [user])

    const fetchData = async () => {
        // 1. Fetch Listings
        const { data: listingsData } = await supabase
            .from('listings')
            .select('*')
            .eq('seller_id', user!.id)
            .order('created_at', { ascending: false })

        if (listingsData) setListings(listingsData)

        // 2. Fetch Reservations (Sales)
        if (listingsData && listingsData.length > 0) {
            const listingIds = (listingsData as any[]).map(l => l.id)
            const { data: ordersData } = await supabase
                .from('orders')
                .select('*, listings(*), profiles(*)')
                .in('listing_id', listingIds)
                .order('created_at', { ascending: false })

            if (ordersData) setReservations(ordersData)
        }
        setLoading(false)
    }

    const handleValidatePickup = async (orderId: string, trueCode: string) => {
        const inputCode = pickupCodes[orderId]

        if (!inputCode) {
            toast({ title: "Code manquant", description: "Veuillez entrer le code fourni par l'acheteur.", status: "warning" })
            return
        }

        if (inputCode.trim() !== trueCode) {
            toast({ title: "Code incorrect", description: "Le code ne correspond pas.", status: "error" })
            return
        }

        if (!confirm("Confirmer la remise du colis ?")) return

        const { error: orderError } = await (supabase
            .from('orders') as any)
            .update({ status: 'picked_up' })
            .eq('id', orderId)

        if (orderError) {
            toast({ title: "Erreur", description: orderError.message, status: "error" })
            return
        }

        const order = reservations.find(r => r.id === orderId)
        if (order) {
            await (supabase
                .from('listings') as any)
                .update({ status: 'sold' })
                .eq('id', order.listing_id)
        }

        toast({ title: "Succès", description: "Vente finalisée !", status: "success" })
        setPickupCodes({ ...pickupCodes, [orderId]: "" })
        fetchData()
    }

    return (
        <Container maxW="container.xl" py={8} pb={24}>
            {/* Header Pro Style */}
            <Flex justify="space-between" align="center" mb={8} direction={{ base: "column", md: "row" }} gap={4}>
                <VStack align="start" spacing={1}>
                    <Heading size="lg">Espace Pro</Heading>
                    <Text color="gray.500" fontSize="sm">Gérez vos stocks et retraits</Text>
                </VStack>
                <Link href="/dashboard/company/create">
                    <Button leftIcon={<Icon as={Plus} />} colorScheme="orange" size="md" shadow="md">
                        Déposer une annonce
                    </Button>
                </Link>
            </Flex>

            <Tabs colorScheme="orange" variant="soft-rounded" isLazy>
                <TabList mb={6} overflowX="auto" py={2}>
                    <Tab _selected={{ color: 'white', bg: 'orange.500' }} mr={4}>📦 Mes Stocks ({listings.filter(l => l.status === 'active').length})</Tab>
                    <Tab _selected={{ color: 'white', bg: 'orange.500' }}>🤝 Ventes & Retraits ({reservations.filter(r => r.status === 'reserved').length})</Tab>
                </TabList>

                <TabPanels>
                    {/* ONGLET STOCKS */}
                    <TabPanel px={0}>
                        {loading ? <Text>Chargement...</Text> : (
                            <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
                                {listings.map((listing) => (
                                    <Box key={listing.id} position="relative">
                                        <ListingCard listing={listing} />
                                        <Badge
                                            position="absolute"
                                            top={2}
                                            right={2}
                                            colorScheme={listing.status === 'active' ? 'green' : 'gray'}
                                        >
                                            {listing.status === 'active' ? 'En ligne' : 'Vendu'}
                                        </Badge>
                                    </Box>
                                ))}
                            </SimpleGrid>
                        )}
                    </TabPanel>

                    {/* ONGLET VENTES (SECURE VALIDATION) */}
                    <TabPanel px={0}>
                        <VStack spacing={4} align="stretch">
                            {reservations.length === 0 && <Text color="gray.500">Aucune commande pour le moment.</Text>}

                            {reservations.map(order => (
                                <Card key={order.id} variant="outline" borderColor={order.status === 'picked_up' ? "gray.200" : "orange.200"} bg={order.status === 'picked_up' ? "gray.50" : "white"}>
                                    <CardBody>
                                        <Flex direction={{ base: "column", md: "row" }} justify="space-between" align="center" gap={6}>
                                            <HStack spacing={4} align="start" flex={1}>
                                                <Box bg="orange.100" p={2} borderRadius="md">
                                                    <Icon as={Package} color="orange.600" w={6} h={6} />
                                                </Box>
                                                <VStack align="start" spacing={0}>
                                                    <Text fontWeight="bold" fontSize="lg">{order.listings?.title}</Text>
                                                    <Text fontSize="sm" color="gray.500">Acheteur: {order.profiles?.company_name || "Utilisateur"}</Text>
                                                    <Badge colorScheme={order.status === 'picked_up' ? "gray" : "green"} mt={1}>
                                                        {order.status === 'picked_up' ? "Terminé" : "À retirer"}
                                                    </Badge>
                                                </VStack>
                                            </HStack>

                                            {/* Security Check Section */}
                                            <Box w={{ base: "full", md: "auto" }}>
                                                {order.status === 'reserved' ? (
                                                    <VStack align="stretch" spacing={2}>
                                                        <Text fontSize="xs" fontWeight="bold" color="orange.600">Code de retrait requis</Text>
                                                        <HStack>
                                                            <Input
                                                                placeholder="ex: 123456"
                                                                value={pickupCodes[order.id] || ""}
                                                                onChange={(e) => setPickupCodes({ ...pickupCodes, [order.id]: e.target.value })}
                                                                maxLength={6}
                                                                bg="white"
                                                                borderColor="orange.300"
                                                                width="140px"
                                                                textAlign="center"
                                                                letterSpacing="4px"
                                                                fontSize="lg"
                                                            />
                                                            <Button
                                                                colorScheme="orange"
                                                                leftIcon={<Icon as={ShieldCheck} />}
                                                                onClick={() => handleValidatePickup(order.id, order.pickup_code)}
                                                            >
                                                                Valider
                                                            </Button>
                                                        </HStack>
                                                    </VStack>
                                                ) : (
                                                    <Flex align="center" color="green.600">
                                                        <Icon as={CheckCircle} mr={2} />
                                                        <Text fontWeight="bold">Remis le {new Date(order.created_at).toLocaleDateString()}</Text>
                                                    </Flex>
                                                )}
                                            </Box>
                                        </Flex>
                                    </CardBody>
                                </Card>
                            ))}
                        </VStack>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Container>
    )
}

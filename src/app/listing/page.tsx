"use client"

import { ChatDialog } from "@/components/chat-dialog"
import { VerifiedBadge } from "@/components/verified-badge"
import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/components/auth-provider"
import { Button, Box, Container, Flex, Heading, Text, Badge, Image, VStack, HStack, Icon, Divider, Avatar, SimpleGrid, Card, CardBody, useToast, Grid, GridItem } from "@chakra-ui/react"
import { ArrowLeft, MapPin, ShieldCheck, Truck, Flag, Heart, Share2, ChevronLeft, MessageCircle } from "lucide-react"
import Link from "next/link"
import MapWrapper from "@/components/map-wrapper"

function ListingDetailsContent() {
    const searchParams = useSearchParams()
    const id = searchParams.get('id')
    const { user } = useAuth()
    const router = useRouter()
    const [listing, setListing] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [reserving, setReserving] = useState(false)
    const toast = useToast()

    useEffect(() => {
        if (id) {
            fetchListing()
        }
    }, [id])

    const fetchListing = async () => {
        const { data, error } = await supabase
            .from('listings')
            .select('*, profiles(company_name, is_verified, id, avatar_url)')
            .eq('id', id as string)
            .single()

        if (!error && data) {
            setListing(data)
        }
        setLoading(false)
    }

    const handleReserve = async () => {
        if (!user) {
            router.push('/login')
            return
        }

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || ''
            const res = await fetch(`${apiUrl}/api/checkout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    listingId: listing.id,
                    title: listing.title,
                    price: listing.price,
                    userId: user.id,
                    sellerId: listing.seller_id
                })
            })

            const data = await res.json()
            if (data.error) throw new Error(data.error)

            const { error: orderError } = await (supabase.from('orders') as any).insert({
                buyer_id: user.id,
                listing_id: listing.id,
                pickup_code: "PENDING",
                status: 'reserved',
                payment_status: 'pending',
                stripe_session_id: data.sessionId
            })

            if (orderError) throw orderError

            if (data.url) window.location.href = data.url
        } catch (err: any) {
            toast({ title: "Erreur paiement", description: err.message, status: "error" })
        }
    }

    if (loading) return <Container py={20}><Text>Chargement...</Text></Container>
    if (!listing) return <Container py={20}><Text>Annonce introuvable.</Text></Container>

    return (
        <Box bg="gray.50" minH="100vh" pb={24}>
            {/* Nav */}
            <Box bg="white" borderBottom="1px" borderColor="gray.100" py={3}>
                <Container maxW="container.xl">
                    <Link href="/">
                        <Button variant="ghost" size="sm" leftIcon={<ChevronLeft size={16} />}>Retour</Button>
                    </Link>
                </Container>
            </Box>

            <Container maxW="container.xl" py={8}>
                <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={8}>

                    {/* LEFT COLUMN: VISUALS & DESCRIPTION */}
                    <GridItem>
                        {/* Main Image Gallery */}
                        <Box
                            bg="white"
                            borderRadius="2xl"
                            overflow="hidden"
                            boxShadow="sm"
                            borderWidth="1px"
                            borderColor="gray.100"
                            mb={6}
                        >
                            <Box position="relative" w="full" pt="66%"> {/* 3:2 Aspect Ratio */}
                                <Image
                                    src={listing.image_url || "https://placehold.co/800x600/D2B48C/ffffff?text=Carton"}
                                    alt={listing.title}
                                    position="absolute"
                                    top="0"
                                    left="0"
                                    w="full"
                                    h="full"
                                    objectFit="cover"
                                />
                                <Badge
                                    position="absolute"
                                    top={4}
                                    right={4}
                                    fontSize="xl"
                                    bg="white"
                                    color="brand.600"
                                    px={4}
                                    py={1}
                                    borderRadius="full"
                                    boxShadow="md"
                                >
                                    {listing.price === 0 ? "Gratuit" : `${listing.price} €`}
                                </Badge>
                            </Box>
                        </Box>

                        {/* Description Block */}
                        <Box bg="white" p={{ base: 6, md: 8 }} borderRadius="2xl" shadow="sm" borderWidth="1px" borderColor="gray.100" mb={6}>
                            <VStack align="start" spacing={4}>
                                <Heading size="lg" color="gray.800">{listing.title}</Heading>
                                <HStack color="gray.500" fontSize="sm">
                                    <Icon as={MapPin} />
                                    <Text>{listing.location || "Paris, France"}</Text>
                                    <Text>•</Text>
                                    <Text>Publié le {new Date(listing.created_at).toLocaleDateString()}</Text>
                                </HStack>

                                <Divider my={2} />

                                <Heading size="md" pt={2} color="gray.700">Description</Heading>
                                <Text color="gray.600" whiteSpace="pre-wrap" lineHeight="tall">
                                    {listing.description}
                                </Text>

                                {/* Specs Grid */}
                                <SimpleGrid columns={2} spacing={4} w="full" mt={6} p={5} bg="brand.50" borderRadius="xl">
                                    <Box>
                                        <Text fontSize="xs" color="gray.500" textTransform="uppercase" fontWeight="bold">Dimensions</Text>
                                        <Text fontWeight="medium" color="brand.900">{listing.length} x {listing.width} x {listing.height} cm</Text>
                                    </Box>
                                    <Box>
                                        <Text fontSize="xs" color="gray.500" textTransform="uppercase" fontWeight="bold">Quantité</Text>
                                        <Text fontWeight="medium" color="brand.900">{listing.quantity} Unités</Text>
                                    </Box>
                                </SimpleGrid>
                            </VStack>
                        </Box>

                        {/* Map Block */}
                        <Box bg="white" borderRadius="2xl" boxShadow="sm" overflow="hidden" mb={6}>
                            <Box p={4} borderBottom="1px" borderColor="gray.100">
                                <Heading size="sm">Localisation</Heading>
                            </Box>
                            <Box h="250px">
                                <MapWrapper
                                    center={[listing.location_lat || 48.8566, listing.location_lng || 2.3522]}
                                    zoom={14}
                                    markers={[{ id: listing.id, position: [listing.location_lat || 48.8566, listing.location_lng || 2.3522], title: listing.title }]}
                                />
                            </Box>
                        </Box>
                    </GridItem>

                    {/* RIGHT COLUMN: ACTIONS (Sticky) */}
                    <GridItem>
                        <Box position={{ base: "static", lg: "sticky" }} top="100px">

                            {/* Seller Card */}
                            <Box bg="white" p={6} borderRadius="2xl" shadow="sm" borderWidth="1px" borderColor="gray.100" mb={4}>
                                <Flex align="center" gap={4} mb={4}>
                                    <Avatar size="md" name={listing.profiles?.company_name} src={listing.profiles?.avatar_url} />
                                    <Box>
                                        <Text fontWeight="bold" fontSize="lg">{listing.profiles?.company_name || "Vendeur"}</Text>
                                        <Flex align="center" gap={1}>
                                            <Icon as={VerifiedBadge} w={4} h={4} />
                                            <Text fontSize="sm" color="gray.500">Compte Pro vérifié</Text>
                                        </Flex>
                                    </Box>
                                </Flex>
                                <Button w="full" variant="outline" size="sm">Voir les autres annonces</Button>
                            </Box>

                            {/* Main Action Card */}
                            <Box bg="white" p={6} borderRadius="2xl" shadow="md" borderWidth="1px" borderColor="brand.100" mb={4}>
                                <VStack spacing={3}>
                                    <Button
                                        w="full"
                                        size="lg"
                                        colorScheme="brand"
                                        onClick={handleReserve}
                                        isLoading={reserving}
                                        isDisabled={listing.status === 'reserved'}
                                        borderRadius="xl"
                                        height="3.5rem"
                                        fontSize="lg"
                                        boxShadow="lg"
                                        _hover={{ transform: "translateY(-2px)", boxShadow: "xl" }}
                                    >
                                        {listing.status === 'reserved' ? "Réservé" : (listing.price === 0 ? "Réserver (Gratuit)" : "Acheter maintenant")}
                                    </Button>

                                    <ChatDialog
                                        listingId={listing.id}
                                        receiverId={listing.seller_id}
                                        receiverName={listing.profiles?.company_name || "Vendeur"}
                                        trigger={
                                            <Button w="full" variant="ghost" leftIcon={<MessageCircle size={18} />}>
                                                Renvoyer un message
                                            </Button>
                                        }
                                    />

                                    <HStack w="full" justify="center" pt={2} color="gray.500">
                                        <Button variant="ghost" size="sm" leftIcon={<Heart size={16} />}>Sauvegarder</Button>
                                        <Button variant="ghost" size="sm" leftIcon={<Share2 size={16} />}>Partager</Button>
                                    </HStack>
                                </VStack>
                            </Box>

                            {/* Trust Signals */}
                            <VStack align="start" spacing={3} p={4} bg="blue.50" borderRadius="xl" color="blue.800">
                                <HStack>
                                    <ShieldCheck size={18} />
                                    <Text fontWeight="bold" fontSize="sm">Paiement sécurisé</Text>
                                </HStack>
                                <Text fontSize="xs" lineHeight="short">
                                    Votre argent est conservé jusqu'à ce que vous validiez la réception de la commande via le code de retrait.
                                </Text>
                            </VStack>

                        </Box>
                    </GridItem>
                </Grid>
            </Container>

            {/* Mobile Sticky Action Bar */}
            <Box
                display={{ base: "block", lg: "none" }}
                position="fixed"
                bottom="56px" // Above BottomNav
                left={0}
                right={0}
                bg="white"
                p={4}
                borderTopWidth="1px"
                borderColor="gray.200"
                zIndex="modal"
                boxShadow="0 -4px 6px -1px rgba(0, 0, 0, 0.1)"
            >
                <Flex align="center" gap={3}>
                    <VStack align="start" spacing={0} flex={1}>
                        <Text fontSize="xs" color="gray.500" noOfLines={1}>{listing.title}</Text>
                        <Text fontWeight="bold" fontSize="xl" color="brand.600">{listing.price} €</Text>
                    </VStack>
                    <Button
                        colorScheme="brand"
                        size="lg"
                        px={8}
                        borderRadius="xl"
                        onClick={handleReserve}
                        isLoading={reserving}
                        isDisabled={listing.status === 'reserved'}
                    >
                        {listing.price === 0 ? "Réserver" : "Acheter"}
                    </Button>
                </Flex>
            </Box>
        </Box>
    )
}

export default function ListingDetailsPage() {
    return (
        <Suspense fallback={<div className="p-8">Chargement...</div>}>
            <ListingDetailsContent />
        </Suspense>
    )
}

"use client"

import { ChatDialog } from "@/components/chat-dialog"
import { VerifiedBadge } from "@/components/verified-badge"
import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/components/auth-provider"
import { Button, Box, Container, Flex, Heading, Text, Badge, Image, VStack, HStack, Icon, Divider, Avatar, SimpleGrid, Card, CardBody, useToast, Grid, GridItem, IconButton } from "@chakra-ui/react"
import { ArrowLeft, MapPin, ShieldCheck, Truck, Flag, Heart, Share2, ChevronLeft, MessageCircle } from "lucide-react"
import Link from "next/link"
import MapWrapper from "@/components/map-wrapper"
import { formatDate } from "@/lib/utils"

function ListingDetailsContent() {
    const searchParams = useSearchParams()
    const id = searchParams.get('id')
    const { user } = useAuth()
    const router = useRouter()
    const [listing, setListing] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [reserving, setReserving] = useState(false)
    const toast = useToast()
    const [fetchError, setFetchError] = useState<string | null>(null)
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
        if (id) {
            fetchListing()
        }
    }, [id])

    const fetchListing = async () => {
        setLoading(true)
        setFetchError(null)
        try {
            const { data, error } = await supabase
                .from('listings')
                .select(`
                    *,
                    profiles (
                        company_name
                    )
                `)
                .eq('id', id as string)
                .single()

            if (error) {
                console.error("Fetch error:", error)
                setFetchError(error.message)
            } else {
                setListing(data)
            }
        } catch (err: any) {
            setFetchError(err.message)
        } finally {
            setLoading(false)
        }
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

    if (loading) return <Container py={20}><VStack spacing={4}><Text color="slate.500" fontWeight="bold">Chargement de l'annonce...</Text></VStack></Container>

    if (fetchError) {
        return (
            <Container py={20}>
                <VStack spacing={6} align="center" textAlign="center">
                    <Box bg="red.50" p={8} borderRadius="3xl" border="1px solid" borderColor="red.100">
                        <Heading size="md" color="red.600" mb={2}>Erreur de récupération</Heading>
                        <Text color="red.500">{fetchError}</Text>
                        <Text fontSize="xs" color="red.300" mt={4}>ID: {id}</Text>
                    </Box>
                    <Link href="/dashboard/individual">
                        <Button colorScheme="brand" size="lg" borderRadius="2xl">Retour au marketplace</Button>
                    </Link>
                </VStack>
            </Container>
        )
    }

    if (!listing) return <Container py={20}><Text>Annonce introuvable.</Text></Container>

    return (
        <Box bg="eco.50" minH="100vh" pb={24}>
            {/* Header / Nav */}
            <Box bg="rgba(253, 251, 247, 0.8)" backdropFilter="blur(10px)" borderBottom="1px" borderColor="eco.100" py={4} position="sticky" top="80px" zIndex={10}>
                <Container maxW="container.xl">
                    <Flex align="center" justify="space-between">
                        <Link href="/dashboard/individual">
                            <Button variant="ghost" size="sm" leftIcon={<ChevronLeft size={18} />} color="brown.600">Retour aux annonces</Button>
                        </Link>
                        <HStack spacing={4}>
                            <IconButton aria-label="Partager" icon={<Share2 size={18} />} variant="ghost" borderRadius="xl" />
                            <IconButton aria-label="Favoris" icon={<Heart size={18} />} variant="ghost" borderRadius="xl" />
                        </HStack>
                    </Flex>
                </Container>
            </Box>

            <Container maxW="container.xl" py={12}>
                <Grid templateColumns={{ base: "1fr", lg: "7fr 4fr" }} gap={12}>

                    {/* LEFT COLUMN */}
                    <GridItem>
                        <VStack align="stretch" spacing={10}>
                            {/* Main Image */}
                            <Box
                                bg="eco.100"
                                borderRadius="4xl"
                                overflow="hidden"
                                border="1px solid"
                                borderColor="eco.200"
                                shadow="2xl"
                            >
                                <Box position="relative" w="full" pt="60%">
                                    <Image
                                        src={listing.image_url || "https://placehold.co/1200x800/F7F2E9/064e3b?text=ReBox+Listing"}
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
                                        bottom={8}
                                        right={8}
                                        fontSize="2xl"
                                        bg="brand.500"
                                        color="white"
                                        px={8}
                                        py={3}
                                        borderRadius="2xl"
                                        shadow="2xl"
                                        fontWeight="900"
                                    >
                                        {listing.price === 0 ? "GRATUIT" : `${listing.price} €`}
                                    </Badge>
                                </Box>
                            </Box>

                            {/* Info Block */}
                            <Box bg="white" p={10} borderRadius="3xl" shadow="sm" border="1px solid" borderColor="eco.100">
                                <VStack align="start" spacing={6}>
                                    <VStack align="start" spacing={2}>
                                        <Heading size="2xl" color="brand.900" letterSpacing="tighter">{listing.title}</Heading>
                                        <HStack color="brown.500" fontSize="md" fontWeight="medium" spacing={4}>
                                            <HStack spacing={1}>
                                                <Icon as={MapPin} size={16} />
                                                <Text>{listing.location || "Localisation non précisée"}</Text>
                                            </HStack>
                                            <Text>•</Text>
                                            <Text>Publié le {isMounted ? formatDate(listing.created_at) : '...'}</Text>
                                        </HStack>
                                    </VStack>

                                    <Divider />

                                    <VStack align="start" spacing={4} w="full">
                                        <Heading size="md" color="brown.800">Détails de l'offre</Heading>
                                        <Text color="brown.600" fontSize="lg" lineHeight="relaxed">
                                            {listing.description}
                                        </Text>

                                        <SimpleGrid columns={{ base: 2, md: 3 }} spacing={6} w="full" pt={6}>
                                            <Box p={4} bg="eco.50" borderRadius="2xl" border="1px solid" borderColor="eco.100">
                                                <Text fontSize="xs" color="brown.400" fontWeight="black" textTransform="uppercase">Dimensions</Text>
                                                <Text fontWeight="bold" fontSize="lg" color="brown.800">{listing.length}x{listing.width}x{listing.height} cm</Text>
                                            </Box>
                                            <Box p={4} bg="eco.50" borderRadius="2xl" border="1px solid" borderColor="eco.100">
                                                <Text fontSize="xs" color="brown.400" fontWeight="black" textTransform="uppercase">Quantité</Text>
                                                <Text fontWeight="bold" fontSize="lg" color="brown.800">{listing.quantity} unités</Text>
                                            </Box>
                                            <Box p={4} bg="brand.50" borderRadius="2xl" border="1px solid" borderColor="brand.100">
                                                <Text fontSize="xs" color="brand.400" fontWeight="black" textTransform="uppercase">Statut</Text>
                                                <Text fontWeight="bold" fontSize="lg" color="brand.600">{listing.status === 'active' ? 'Disponible' : 'Réservé'}</Text>
                                            </Box>
                                        </SimpleGrid>
                                    </VStack>
                                </VStack>
                            </Box>

                            {/* Location Map */}
                            <Box bg="white" borderRadius="3xl" overflow="hidden" border="1px solid" borderColor="eco.100" shadow="sm">
                                <Box p={6} borderBottom="1px solid" borderColor="eco.50">
                                    <Heading size="sm" color="brown.700">Zone de récupération</Heading>
                                </Box>
                                <Box h="300px">
                                    <MapWrapper
                                        center={[listing.location_lat || 48.8566, listing.location_lng || 2.3522]}
                                        zoom={14}
                                        markers={[{ id: listing.id, position: [listing.location_lat || 48.8566, listing.location_lng || 2.3522], title: listing.title }]}
                                    />
                                </Box>
                            </Box>
                        </VStack>
                    </GridItem>

                    {/* RIGHT COLUMN */}
                    <GridItem>
                        <VStack spacing={8} position="sticky" top="180px">

                            {/* Seller Box */}
                            <Box bg="white" p={8} borderRadius="3xl" shadow="xl" border="1px solid" borderColor="eco.100" w="full">
                                <VStack spacing={6}>
                                    <Flex align="center" gap={4} w="full">
                                        <Avatar size="xl" name={listing.profiles?.company_name} src={listing.profiles?.avatar_url} border="4px solid" borderColor="brand.50" />
                                        <VStack align="start" spacing={0}>
                                            <Text fontWeight="black" fontSize="xl" color="brand.900">{listing.profiles?.company_name || "Vendeur"}</Text>
                                            <Text fontSize="sm" color="brown.500">Membre depuis 2024</Text>
                                            <Badge colorScheme="brand" mt={1}>Pro Vérifié</Badge>
                                        </VStack>
                                    </Flex>
                                    <Button w="full" variant="outline" borderColor="brown.200" color="brown.600" h={12} borderRadius="xl">Voir toutes ses annonces</Button>
                                </VStack>
                            </Box>

                            {/* Action Box */}
                            <Box bg="brand.900" p={8} borderRadius="3xl" shadow="2xl" w="full" color="white">
                                <VStack spacing={5}>
                                    <VStack spacing={1} align="stretch" w="full">
                                        <Text fontSize="sm" color="brand.200" fontWeight="bold">Total à payer</Text>
                                        <Text fontSize="4xl" fontWeight="black">{listing.price} €</Text>
                                    </VStack>
                                    <Button
                                        w="full"
                                        size="lg"
                                        bg="brown.400"
                                        color="white"
                                        _hover={{ bg: "brown.300", transform: "translateY(-2px)" }}
                                        onClick={handleReserve}
                                        isLoading={reserving}
                                        isDisabled={listing.status === 'reserved'}
                                        borderRadius="2xl"
                                        h={16}
                                        fontSize="xl"
                                        fontWeight="black"
                                    >
                                        {listing.status === 'reserved' ? "Déjà réservé" : (listing.price === 0 ? "Réserver gratuitement" : "Acheter maintenant")}
                                    </Button>

                                    <ChatDialog
                                        listingId={listing.id}
                                        receiverId={listing.seller_id}
                                        receiverName={listing.profiles?.company_name || "Vendeur"}
                                        trigger={
                                            <Button w="full" variant="link" color="brand.100" py={2} leftIcon={<MessageCircle size={18} />}>
                                                Poser une question
                                            </Button>
                                        }
                                    />
                                </VStack>
                            </Box>

                            {/* Security Box */}
                            <VStack align="start" spacing={3} p={6} bg="eco.100" borderRadius="2xl" w="full" border="1px dashed" borderColor="eco.300">
                                <HStack color="brand.800">
                                    <ShieldCheck size={20} />
                                    <Text fontWeight="extrabold" fontSize="sm">Garantie ReBox Safe</Text>
                                </HStack>
                                <Text fontSize="xs" color="brown.600" lineHeight="tall">
                                    Votre paiement est sécurisé jusqu’à confirmation du retrait avec le code unique fourni après achat.
                                </Text>
                            </VStack>

                        </VStack>
                    </GridItem>
                </Grid>
            </Container>
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

"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { ListingCard } from "@/components/listing-card"
import { Box, Container, Heading, SimpleGrid, Text, VStack, Button, Icon, Flex } from "@chakra-ui/react"
import { Heart, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function FavoritesPage() {
    const [listings, setListings] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchFavorites()
        const handleUpdate = () => fetchFavorites()
        window.addEventListener('favorites-updated', handleUpdate)
        return () => window.removeEventListener('favorites-updated', handleUpdate)
    }, [])

    const fetchFavorites = async () => {
        setLoading(true)
        const favIds = JSON.parse(localStorage.getItem('rebox_favorites') || '[]')
        if (favIds.length === 0) {
            setListings([])
            setLoading(false)
            return
        }
        const { data, error } = await supabase
            .from('listings')
            .select('*, profiles(company_name)')
            .in('id', favIds)
        if (!error && data) setListings(data)
        setLoading(false)
    }

    return (
        <Box bg="eco.50" minH="100vh" pb={20}>
            <Container maxW="container.xl" py={12}>
                <VStack align="start" spacing={8} mb={12}>
                    <Link href="/dashboard/individual">
                        <Button variant="ghost" leftIcon={<ArrowLeft size={18} />} color="brown.500">
                            Retour à la marketplace
                        </Button>
                    </Link>
                    <VStack align="start" spacing={2}>
                        <Heading size="2xl" fontWeight="900" letterSpacing="tight" color="brand.900">
                            Mes Favoris
                        </Heading>
                        <Text color="brown.500" fontSize="lg" fontWeight="medium">
                            Retrouvez ici les cartons que vous avez mis de côté pour vos futurs projets.
                        </Text>
                    </VStack>
                </VStack>

                {loading ? (
                    <Text color="brand.600" fontWeight="bold">Chargement de vos coups de cœur...</Text>
                ) : listings.length === 0 ? (
                    <Flex direction="column" align="center" justify="center" py={24} bg="white" borderRadius="4xl" border="2px dashed" borderColor="eco.300" shadow="sm">
                        <Icon as={Heart} boxSize={16} color="eco.200" mb={6} />
                        <Text fontSize="2xl" fontWeight="black" color="brown.300" mb={8}>Vous n'avez pas encore de favoris.</Text>
                        <Link href="/dashboard/individual">
                            <Button colorScheme="brand" size="lg" h={16} px={10} borderRadius="2xl" shadow="0 8px 15px -5px rgba(0, 135, 83, 0.4)">
                                Explorer les annonces
                            </Button>
                        </Link>
                    </Flex>
                ) : (
                    <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={10}>
                        {listings.map((listing) => (
                            <ListingCard key={listing.id} listing={listing} />
                        ))}
                    </SimpleGrid>
                )}
            </Container>
        </Box>
    )
}

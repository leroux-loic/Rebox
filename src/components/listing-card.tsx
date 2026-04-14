import Link from "next/link"
import { Box, Image, Badge, Text, Flex, Avatar, HStack, Icon, Card, CardBody, VStack } from "@chakra-ui/react"
import { MapPin, Star, Heart, Calendar } from "lucide-react"
import { VerifiedBadge } from "./verified-badge"
import { useState, useEffect } from "react"
import { IconButton } from "@chakra-ui/react"
import { formatDate } from "@/lib/utils"

interface ListingCardProps {
    listing: any
}

export function ListingCard({ listing }: ListingCardProps) {
    const [isFavorite, setIsFavorite] = useState(false)
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
        const favs = JSON.parse(localStorage.getItem('rebox_favorites') || '[]')
        setIsFavorite(favs.includes(listing.id))
    }, [listing.id])

    const toggleFavorite = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        const favs = JSON.parse(localStorage.getItem('rebox_favorites') || '[]')
        let newFavs
        if (isFavorite) {
            newFavs = favs.filter((id: string) => id !== listing.id)
        } else {
            newFavs = [...favs, listing.id]
        }
        localStorage.setItem('rebox_favorites', JSON.stringify(newFavs))
        setIsFavorite(!isFavorite)

        window.dispatchEvent(new Event('favorites-updated'))
    }

    return (
        <Link href={`/listing?id=${listing.id}`}>
            <Box
                bg="white"
                borderRadius="3xl"
                overflow="hidden"
                boxShadow="sm"
                borderWidth="1px"
                borderColor="eco.100"
                transition="all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                _hover={{
                    transform: "translateY(-10px)",
                    boxShadow: "2xl",
                    borderColor: "brand.200"
                }}
                position="relative"
            >
                {/* Image Container */}
                <Box position="relative" h="240px" bg="eco.50">
                    <Image
                        src={listing.image_url || "https://placehold.co/600x400/F7F2E9/064e3b?text=ReBox"}
                        alt={listing.title}
                        objectFit="cover"
                        w="full"
                        h="full"
                    />

                    {/* Favorite Button */}
                    <IconButton
                        aria-label="Ajouter aux favoris"
                        icon={<Heart size={18} fill={isFavorite ? "#EF4444" : "none"} color={isFavorite ? "#EF4444" : "white"} />}
                        position="absolute"
                        top={4}
                        left={4}
                        bg="blackAlpha.300"
                        _hover={{ bg: "blackAlpha.500", transform: "scale(1.1)" }}
                        backdropFilter="blur(8px)"
                        borderRadius="full"
                        size="sm"
                        onClick={toggleFavorite}
                    />

                    <Badge
                        position="absolute"
                        top={4}
                        right={4}
                        bg="brand.500"
                        color="white"
                        px={4}
                        py={1.5}
                        borderRadius="xl"
                        boxShadow="xl"
                        fontSize="sm"
                        fontWeight="900"
                    >
                        {listing.price === 0 ? "OFFERT" : `${listing.price} €`}
                    </Badge>
                </Box>

                {/* Content */}
                <Box p={6}>
                    <VStack align="start" spacing={3}>
                        <Text fontWeight="800" fontSize="xl" noOfLines={1} color="brand.900" letterSpacing="tight">
                            {listing.title}
                        </Text>

                        <Flex align="center" gap={2} color="brown.600" fontSize="sm">
                            <Icon as={MapPin} size={14} />
                            <Text isTruncated>{listing.location || "Localisation non précisée"}</Text>
                        </Flex>

                        <Flex align="center" gap={2} color="brown.400" fontSize="xs" fontWeight="medium">
                            <Icon as={Calendar} size={12} />
                            <Text>{isMounted ? formatDate(listing.created_at) : "..."}</Text>
                        </Flex>

                        <Box w="full" pt={2} borderTop="1px solid" borderColor="eco.50">
                            <Flex align="center" justify="space-between">
                                <Flex align="center" gap={2}>
                                    <Avatar size="xs" name={listing.profiles?.company_name} src={listing.profiles?.avatar_url} />
                                    <Text fontSize="xs" color="brown.600" fontWeight="bold">
                                        {listing.profiles?.company_name || "Anonyme"}
                                    </Text>
                                </Flex>
                                <Badge variant="subtle" colorScheme="brown" fontSize="10px" borderRadius="md" px={2}>
                                    {listing.quantity} unités
                                </Badge>
                            </Flex>
                        </Box>
                    </VStack>
                </Box>
            </Box>
        </Link>
    )
}

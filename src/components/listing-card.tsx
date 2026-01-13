import Link from "next/link"
import { Box, Image, Badge, Text, Flex, Avatar, HStack, Icon, Card, CardBody } from "@chakra-ui/react"
import { MapPin, Star } from "lucide-react"
import { VerifiedBadge } from "./verified-badge"

interface ListingCardProps {
    listing: any
}

export function ListingCard({ listing }: ListingCardProps) {
    return (
        <Link href={`/listing?id=${listing.id}`}>
            <Box
                bg="white"
                borderRadius="2xl"
                overflow="hidden"
                boxShadow="sm"
                borderWidth="1px"
                borderColor="gray.100"
                transition="all 0.2s"
                _hover={{
                    transform: "translateY(-4px)",
                    boxShadow: "xl",
                    borderColor: "brand.200"
                }}
                position="relative"
            >
                {/* Image Container */}
                <Box position="relative" h="200px" bg="gray.100">
                    <Image
                        src={listing.image_url || "https://placehold.co/600x400/D2B48C/ffffff?text=Carton"}
                        alt={listing.title}
                        objectFit="cover"
                        w="full"
                        h="full"
                    />
                    <Badge
                        position="absolute"
                        top={3}
                        right={3}
                        bg="white"
                        color="brand.600"
                        px={3}
                        py={1}
                        borderRadius="full"
                        boxShadow="md"
                        fontSize="sm"
                        fontWeight="bold"
                    >
                        {listing.price === 0 ? "GRATUIT" : `${listing.price} €`}
                    </Badge>
                </Box>

                {/* Content */}
                <Box p={4}>
                    <Flex justify="space-between" align="start" mb={2}>
                        <Text fontWeight="bold" fontSize="lg" noOfLines={1} color="gray.800">
                            {listing.title}
                        </Text>
                    </Flex>

                    <HStack spacing={1} color="gray.500" fontSize="sm" mb={4}>
                        <MapPin size={14} />
                        <Text>{listing.distance ? listing.distance : (listing.location || "Paris, France")}</Text>
                    </HStack>

                    {/* Footer / Seller */}
                    <Flex align="center" pt={3} borderTopWidth="1px" borderColor="gray.50">
                        <Avatar size="xs" name={listing.profiles?.company_name} src={listing.profiles?.avatar_url} mr={2} />
                        <Text fontSize="xs" color="gray.600" fontWeight="medium" flex={1} isTruncated>
                            {listing.profiles?.company_name || "Vendeur"}
                        </Text>
                        {listing.profiles?.is_verified && <Icon as={VerifiedBadge} w={4} h={4} color="blue.500" />}
                    </Flex>
                </Box>
            </Box>
        </Link>
    )
}

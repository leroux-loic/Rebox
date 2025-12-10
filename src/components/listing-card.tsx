"use client"

import { Box, Image, Badge, Button, Text, VStack, HStack, Icon, useColorModeValue } from "@chakra-ui/react"
import { MapPin, Package } from "lucide-react"

interface ListingCardProps {
    title: string
    price: number
    quantity: number
    condition: string
    distance?: string
    sellerName: string
    imageUrl?: string
    hideAction?: boolean
}

export function ListingCard({
    title,
    price,
    quantity,
    condition,
    distance,
    sellerName,
    imageUrl,
    hideAction = false,
}: ListingCardProps) {
    const imageSrc = imageUrl || "https://placehold.co/600x400/D2B48C/ffffff?text=Carton"
    const bg = useColorModeValue('white', 'gray.800')
    const borderColor = useColorModeValue('gray.200', 'gray.700')

    return (
        <Box
            maxW="sm"
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            bg={bg}
            borderColor={borderColor}
            _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
            transition="all 0.3s"
        >
            <Box position="relative" h="48">
                <Image
                    src={imageSrc}
                    alt={title}
                    objectFit="cover"
                    w="full"
                    h="full"
                />
                <Badge
                    position="absolute"
                    top="2"
                    right="2"
                    colorScheme="brand"
                    variant="solid"
                    fontSize="0.8em"
                >
                    {price === 0 ? "Gratuit" : `${price}€`}
                </Badge>
            </Box>

            <Box p="4">
                <VStack align="start" spacing={2}>
                    <Box w="full">
                        <Text fontWeight="bold" fontSize="lg" noOfLines={1}>
                            {title}
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                            Vendu par {sellerName}
                        </Text>
                    </Box>

                    <HStack fontSize="sm" color="gray.600" spacing={4}>
                        <HStack>
                            <Icon as={Package} color="brand.500" />
                            <Text>{quantity} unités • {condition}</Text>
                        </HStack>
                    </HStack>

                    {distance && (
                        <HStack fontSize="sm" color="gray.600">
                            <Icon as={MapPin} color="brand.500" />
                            <Text>À {distance}</Text>
                        </HStack>
                    )}

                    {!hideAction && (
                        <Button w="full" colorScheme="brand" mt={2}>
                            Réserver
                        </Button>
                    )}
                </VStack>
            </Box>
        </Box>
    )
}

"use client"

import { Box, Text, VStack, SimpleGrid, Icon, useColorModeValue, HStack } from "@chakra-ui/react"
import { Award, Medal, Trophy, Star } from "lucide-react"

interface Badge {
    id: string
    name: string
    description: string
    icon: string
    unlocked: boolean
    unlockedAt?: string
}

interface BadgesListProps {
    badges: Badge[]
    compact?: boolean
}

export function BadgesList({ badges, compact }: BadgesListProps) {
    const getIcon = (iconName: string) => {
        switch (iconName) {
            case 'medal': return Medal
            case 'trophy': return Trophy
            case 'star': return Star
            default: return Award
        }
    }

    if (compact) {
        return (
            <HStack spacing={3}>
                {badges.map((badge) => (
                    <Box
                        key={badge.id}
                        p={2.5}
                        borderRadius="xl"
                        bg={badge.unlocked ? "brand.500" : "whiteAlpha.200"}
                        color={badge.unlocked ? "white" : "whiteAlpha.500"}
                        opacity={badge.unlocked ? 1 : 0.4}
                        shadow={badge.unlocked ? "lg" : "none"}
                    >
                        <Icon as={getIcon(badge.icon)} w={5} h={5} />
                    </Box>
                ))}
            </HStack>
        )
    }

    return (
        <Box
            bg="white"
            p={6}
            borderRadius="xl"
            borderWidth="1px"
            borderColor="eco.100"
            shadow="sm"
        >
            <HStack mb={4} spacing={2}>
                <Icon as={Trophy} color="brand.500" w={5} h={5} />
                <Text fontWeight="black" fontSize="lg" color="brand.900">Mes Badges</Text>
            </HStack>

            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                {badges.map((badge) => (
                    <VStack
                        key={badge.id}
                        p={3}
                        borderRadius="lg"
                        borderWidth="1px"
                        borderColor={badge.unlocked ? "brand.100" : "eco.50"}
                        bg={badge.unlocked ? "brand.50" : "eco.50"}
                        opacity={badge.unlocked ? 1 : 0.6}
                        filter={badge.unlocked ? "none" : "grayscale(100%)"}
                        spacing={2}
                        textAlign="center"
                    >
                        <Box
                            p={2}
                            borderRadius="full"
                            bg={badge.unlocked ? "brand.100" : "eco.200"}
                            color={badge.unlocked ? "brand.600" : "eco.400"}
                        >
                            <Icon as={getIcon(badge.icon)} w={6} h={6} />
                        </Box>
                        <Text fontWeight="black" fontSize="xs" color="brand.900">{badge.name}</Text>
                        <Text fontSize="10px" color="brown.500" fontWeight="medium">{badge.description}</Text>
                    </VStack>
                ))}
            </SimpleGrid>
        </Box>
    )
}

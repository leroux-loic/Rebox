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
}

export function BadgesList({ badges }: BadgesListProps) {
    const getIcon = (iconName: string) => {
        switch (iconName) {
            case 'medal': return Medal
            case 'trophy': return Trophy
            case 'star': return Star
            default: return Award
        }
    }

    const bg = useColorModeValue('white', 'gray.800')
    const borderColor = useColorModeValue('gray.200', 'gray.700')

    return (
        <Box
            bg={bg}
            p={6}
            borderRadius="xl"
            borderWidth="1px"
            borderColor={borderColor}
            shadow="sm"
        >
            <HStack mb={4} spacing={2}>
                <Icon as={Trophy} color="yellow.500" w={5} h={5} />
                <Text fontWeight="bold" fontSize="lg">Mes Badges</Text>
            </HStack>

            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                {badges.map((badge) => (
                    <VStack
                        key={badge.id}
                        p={3}
                        borderRadius="lg"
                        borderWidth="1px"
                        borderColor={badge.unlocked ? "yellow.200" : "gray.100"}
                        bg={badge.unlocked ? "yellow.50" : "gray.50"}
                        opacity={badge.unlocked ? 1 : 0.6}
                        filter={badge.unlocked ? "none" : "grayscale(100%)"}
                        spacing={2}
                        textAlign="center"
                    >
                        <Box
                            p={2}
                            borderRadius="full"
                            bg={badge.unlocked ? "yellow.100" : "gray.200"}
                            color={badge.unlocked ? "yellow.600" : "gray.400"}
                        >
                            <Icon as={getIcon(badge.icon)} w={6} h={6} />
                        </Box>
                        <Text fontWeight="semibold" fontSize="sm">{badge.name}</Text>
                        <Text fontSize="xs" color="gray.500">{badge.description}</Text>
                    </VStack>
                ))}
            </SimpleGrid>
        </Box>
    )
}

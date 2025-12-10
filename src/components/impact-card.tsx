"use client"

import { Box, Text, VStack, HStack, Icon, SimpleGrid, useColorModeValue } from "@chakra-ui/react"
import { Leaf, TreeDeciduous } from "lucide-react"

interface ImpactCardProps {
    carbonScore: number
}

export function ImpactCard({ carbonScore }: ImpactCardProps) {
    const treesEquivalent = (carbonScore / 20).toFixed(1)
    const carKmEquivalent = (carbonScore / 0.12).toFixed(0)

    const bg = useColorModeValue('green.50', 'green.900')
    const cardBg = useColorModeValue('whiteAlpha.600', 'whiteAlpha.200')

    return (
        <Box
            bgGradient="linear(to-br, brand.50, green.100)"
            _dark={{ bgGradient: "linear(to-br, brand.900, green.900)" }}
            p={6}
            borderRadius="xl"
            borderWidth="1px"
            borderColor="brand.200"
        >
            <VStack align="start" spacing={4}>
                <HStack color="brand.600">
                    <Icon as={Leaf} w={5} h={5} />
                    <Text fontWeight="bold">Mon Impact Écologique</Text>
                </HStack>

                <HStack align="baseline" spacing={2}>
                    <Text fontSize="4xl" fontWeight="bold" color="brand.600">
                        {carbonScore.toFixed(1)}
                    </Text>
                    <Text fontSize="lg" color="gray.600" fontWeight="medium">
                        kg de CO2 évités
                    </Text>
                </HStack>

                <SimpleGrid columns={2} spacing={4} w="full">
                    <HStack bg={cardBg} p={3} borderRadius="lg" spacing={3}>
                        <Icon as={TreeDeciduous} w={8} h={8} color="green.500" />
                        <Box>
                            <Text fontWeight="bold">{treesEquivalent}</Text>
                            <Text fontSize="xs" color="gray.500">Arbres plantés</Text>
                        </Box>
                    </HStack>

                    <HStack bg={cardBg} p={3} borderRadius="lg" spacing={3}>
                        <Text fontSize="2xl">🚗</Text>
                        <Box>
                            <Text fontWeight="bold">{carKmEquivalent} km</Text>
                            <Text fontSize="xs" color="gray.500">en voiture</Text>
                        </Box>
                    </HStack>
                </SimpleGrid>
            </VStack>
        </Box>
    )
}

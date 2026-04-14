"use client"

import { Box, Text, VStack, HStack, Icon, SimpleGrid, useColorModeValue } from "@chakra-ui/react"
import { Leaf, TreeDeciduous } from "lucide-react"

interface ImpactCardProps {
    carbonScore: number
    compact?: boolean
}

export function ImpactCard({ carbonScore, compact }: ImpactCardProps) {
    const treesEquivalent = (carbonScore / 20).toFixed(1)
    const carKmEquivalent = (carbonScore / 0.12).toFixed(0)

    if (compact) {
        return (
            <Box bg="eco.50" p={4} borderRadius="2xl" border="1px solid" borderColor="eco.100">
                <HStack spacing={4}>
                    <Box boxSize="40px" bg="brand.500" borderRadius="xl" display="flex" alignItems="center" justifyContent="center">
                        <Icon as={Leaf} color="white" />
                    </Box>
                    <VStack align="start" spacing={0}>
                        <HStack spacing={1} align="baseline">
                            <Text fontSize="2xl" fontWeight="black" color="brand.900">{carbonScore.toFixed(1)}</Text>
                            <Text fontSize="xs" color="brand.600" fontWeight="bold">kg</Text>
                        </HStack>
                        <Text fontSize="xs" color="brown.400" fontWeight="bold">CO2 évités</Text>
                    </VStack>
                </HStack>
            </Box>
        )
    }

    return (
        <Box
            bgGradient="linear(to-br, brand.50, green.100)"
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
                    <Text fontSize="lg" color="brown.600" fontWeight="medium">
                        kg de CO2 évités
                    </Text>
                </HStack>

                <SimpleGrid columns={2} spacing={4} w="full">
                    <HStack bg="whiteAlpha.600" p={3} borderRadius="lg" spacing={3}>
                        <Icon as={TreeDeciduous} w={8} h={8} color="green.500" />
                        <Box>
                            <Text fontWeight="bold" color="brown.800">{treesEquivalent}</Text>
                            <Text fontSize="xs" color="brown.500">Arbres plantés</Text>
                        </Box>
                    </HStack>

                    <HStack bg="whiteAlpha.600" p={3} borderRadius="lg" spacing={3}>
                        <Text fontSize="2xl">🚗</Text>
                        <Box>
                            <Text fontWeight="bold" color="brown.800">{carKmEquivalent} km</Text>
                            <Text fontSize="xs" color="brown.500">en voiture</Text>
                        </Box>
                    </HStack>
                </SimpleGrid>
            </VStack>
        </Box>
    )
}

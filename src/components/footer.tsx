"use client"

import { Box, Container, SimpleGrid, Stack, Text, Icon, HStack, Link as ChakraLink } from "@chakra-ui/react"
import { Package, Github, Twitter, Linkedin } from "lucide-react"
import Link from "next/link"

export function Footer() {
    return (
        <Box bg="gray.950" color="gray.300" py={12} borderTop="1px" borderColor="whiteAlpha.100">
            <Container maxW="container.xl">
                <SimpleGrid columns={{ base: 1, md: 4 }} spacing={8} mb={12}>
                    <Stack spacing={4}>
                        <HStack spacing={2}>
                            <Box bg="brand.500" p={1.5} borderRadius="md">
                                <Icon as={Package} color="white" boxSize={5} />
                            </Box>
                            <Text fontSize="xl" fontWeight="900" color="white" letterSpacing="tight">
                                ReBox
                            </Text>
                        </HStack>
                        <Text fontSize="sm" lineHeight="tall">
                            La première solution de réemploi de cartons pour particuliers et professionnels.
                            Engageons-nous ensemble pour un déménagement plus durable.
                        </Text>
                        <HStack spacing={4}>
                            <Icon as={Twitter} boxSize={5} cursor="pointer" _hover={{ color: "brand.400" }} />
                            <Icon as={Linkedin} boxSize={5} cursor="pointer" _hover={{ color: "brand.400" }} />
                            <Icon as={Github} boxSize={5} cursor="pointer" _hover={{ color: "brand.400" }} />
                        </HStack>
                    </Stack>

                    <Stack spacing={4}>
                        <Text fontWeight="bold" color="white">Navigation</Text>
                        <Link href="/dashboard/individual" passHref>
                            <ChakraLink fontSize="sm" _hover={{ color: "brand.400" }}>Trouver des cartons</ChakraLink>
                        </Link>
                        <Link href="/dashboard/company/create" passHref>
                            <ChakraLink fontSize="sm" _hover={{ color: "brand.400" }}>Vendre mes cartons</ChakraLink>
                        </Link>
                        <Link href="/profile" passHref>
                            <ChakraLink fontSize="sm" _hover={{ color: "brand.400" }}>Mon compte</ChakraLink>
                        </Link>
                    </Stack>

                    <Stack spacing={4}>
                        <Text fontWeight="bold" color="white">À propos</Text>
                        <Link href="/a-propos" passHref>
                            <ChakraLink fontSize="sm" _hover={{ color: "brand.400" }}>Qu'est-ce que ReBox ?</ChakraLink>
                        </Link>
                        <Link href="/particuliers" passHref>
                            <ChakraLink fontSize="sm" _hover={{ color: "brand.400" }}>ReBox pour les particuliers</ChakraLink>
                        </Link>
                        <Link href="/pro" passHref>
                            <ChakraLink fontSize="sm" _hover={{ color: "brand.400" }}>ReBox Pro</ChakraLink>
                        </Link>
                    </Stack>

                    <Stack spacing={4}>
                        <Text fontWeight="bold" color="white">Contact</Text>
                        <Text fontSize="sm">contact@rebox.fr</Text>
                        <Text fontSize="sm">Paris, France</Text>
                    </Stack>
                </SimpleGrid>

                <Box borderTopWidth="1px" borderColor="whiteAlpha.100" pt={8}>
                    <Flex justify="space-between" align="center" direction={{ base: "column", md: "row" }} gap={4}>
                        <Text fontSize="xs">
                            © 2026 ReBox. Tous droits réservés.
                        </Text>
                        <Text fontSize="xs" fontWeight="bold">
                            Trademark ReBox 2026
                        </Text>
                    </Flex>
                </Box>
            </Container>
        </Box>
    )
}

import { Flex } from "@chakra-ui/react"

"use client"

import { Box, Container, Heading, Text, VStack, SimpleGrid, Icon, Flex, Button, HStack, Badge, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, Divider } from "@chakra-ui/react"
import { Building2, Recycle, ArrowUpRight, TrendingUp, Handshake, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

const MotionBox = motion(Box)

export default function ProPage() {
    return (
        <Box pb={20}>
            {/* Dark Professional Hero */}
            <Box bg="brand.900" color="white" py={24} position="relative" overflow="hidden">
                <Container maxW="container.xl">
                    <VStack spacing={8} maxW="3xl" align="start">
                        <Badge colorScheme="brand" variant="solid" px={3} py={1} borderRadius="md">
                            REBOX PRO
                        </Badge>
                        <Heading size="4xl" fontWeight="900" letterSpacing="tight">
                            Valorisez vos cartons de <Text as="span" color="brand.400">manière rentable.</Text>
                        </Heading>
                        <Text fontSize="xl" opacity={0.8}>
                            Ne payez plus pour l'enlèvement de vos cartons. Devenez un acteur de l'économie locale et boostez vos indicateurs RSE.
                        </Text>
                        <HStack spacing={4}>
                            <Link href="/login?role=company">
                                <Button colorScheme="brand" size="lg" px={10} bg="brand.500" _hover={{ bg: "brand.400" }}>
                                    Devenir partenaire
                                </Button>
                            </Link>
                            <Button variant="ghost" colorScheme="whiteAlpha" size="lg">En savoir plus</Button>
                        </HStack>
                    </VStack>
                </Container>

                {/* Decorative Elements */}
                <Box position="absolute" top="-10%" right="-5%" boxSize="600px" bg="brand.500" borderRadius="full" filter="blur(150px)" opacity="0.2" />
            </Box>

            {/* Impact Section */}
            <Container maxW="container.xl" mt={-12}>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
                    <Stat bg="white" p={8} borderRadius="2xl" shadow="2xl" border="1px" borderColor="gray.100">
                        <StatLabel color="gray.500" fontSize="md">Économie Moyenne</StatLabel>
                        <StatNumber fontSize="4xl" color="brand.600">1 200 € / an</StatNumber>
                        <StatHelpText>
                            <StatArrow type="increase" /> par point de vente
                        </StatHelpText>
                    </Stat>
                    <Stat bg="white" p={8} borderRadius="2xl" shadow="2xl" border="1px" borderColor="gray.100">
                        <StatLabel color="gray.500" fontSize="md">Émissions Évitées</StatLabel>
                        <StatNumber fontSize="4xl" color="green.500">2.5 tCO2</StatNumber>
                        <StatHelpText>Impact annuel moyen</StatHelpText>
                    </Stat>
                    <Stat bg="white" p={8} borderRadius="2xl" shadow="2xl" border="1px" borderColor="gray.100">
                        <StatLabel color="gray.500" fontSize="md">Temps de gestion</StatLabel>
                        <StatNumber fontSize="4xl" color="blue.500">-30%</StatNumber>
                        <StatHelpText>Optimisation logistique</StatHelpText>
                    </Stat>
                </SimpleGrid>
            </Container>

            {/* Why Pro? */}
            <Container maxW="container.lg" py={24}>
                <VStack spacing={16}>
                    <VStack textAlign="center" spacing={4}>
                        <Heading size="2xl">Pourquoi choisir ReBox Pro ?</Heading>
                        <Text color="gray.500" maxW="2xl">Une solution clé en main pour transformer vos déchets en opportunités locales.</Text>
                    </VStack>

                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={16}>
                        <VStack align="start" spacing={4}>
                            <Flex bg="brand.50" p={2} borderRadius="md">
                                <Icon as={TrendingUp} color="brand.600" boxSize={6} />
                            </Flex>
                            <Heading size="md">Bonus Économique</Heading>
                            <Text color="gray.600">
                                Au lieu de payer pour le traitement de vos cartons, revendez-les ou donnez-les pour attirer de nouveaux flux de personnes dans votre enseigne.
                            </Text>
                        </VStack>

                        <VStack align="start" spacing={4}>
                            <Flex bg="green.50" p={2} borderRadius="md">
                                <Icon as={Recycle} color="green.600" boxSize={6} />
                            </Flex>
                            <Heading size="md">Engagement RSE</Heading>
                            <Text color="gray.600">
                                Améliorez votre bilan carbone et communiquez auprès de vos clients sur vos actions concrètes pour l'environnement.
                            </Text>
                        </VStack>

                        <VStack align="start" spacing={4}>
                            <Flex bg="blue.50" p={2} borderRadius="md">
                                <Icon as={ShieldCheck} color="blue.600" boxSize={6} />
                            </Flex>
                            <Heading size="md">Conformité Loi AGEC</Heading>
                            <Text color="gray.600">
                                Répondez aux nouvelles exigences réglementaires sur la gestion des déchets et la priorité donnée au réemploi.
                            </Text>
                        </VStack>

                        <VStack align="start" spacing={4}>
                            <Flex bg="purple.50" p={2} borderRadius="md">
                                <Icon as={Handshake} color="purple.600" boxSize={6} />
                            </Flex>
                            <Heading size="md">Flux en Magasin</Heading>
                            <Text color="gray.600">
                                Le retrait en magasin génère du trafic qualifié de proximité, idéal pour vos ventes complémentaires.
                            </Text>
                        </VStack>
                    </SimpleGrid>

                    <Box w="full" bg="gray.50" p={10} borderRadius="3xl" border="1px" borderColor="gray.200">
                        <Flex direction={{ base: "column", md: "row" }} justify="space-between" align="center" gap={8}>
                            <VStack align="start" spacing={2}>
                                <Heading size="lg">Prêt à valoriser vos cartons ?</Heading>
                                <Text color="gray.600">Rejoignez plus de 500 entreprises déjà partenaires.</Text>
                            </VStack>
                            <Link href="/login?role=company">
                                <Button colorScheme="brand" size="xl" height="60px" px={12} borderRadius="full">
                                    Commencer maintenant
                                </Button>
                            </Link>
                        </Flex>
                    </Box>
                </VStack>
            </Container>
        </Box>
    )
}

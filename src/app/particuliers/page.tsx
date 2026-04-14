"use client"

import { Box, Container, Heading, Text, VStack, SimpleGrid, Icon, Flex, Button, HStack, Image, List, ListItem, ListIcon } from "@chakra-ui/react"
import { CheckCircle, Truck, Wallet, Leaf, ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

const MotionBox = motion(Box)

export default function ParticularsPage() {
    return (
        <Box pb={20}>
            {/* Split Hero */}
            <Box bg="gray.950" color="white" pt={20} pb={32} position="relative" overflow="hidden">
                <Container maxW="container.xl">
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={12} alignItems="center">
                        <VStack align="start" spacing={8} zIndex={1}>
                            <MotionBox
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <Heading size="3xl" fontWeight="900" lineHeight="1.1" mb={4}>
                                    Déménagez sans <br />
                                    <Text as="span" color="brand.400">vous ruiner.</Text>
                                </Heading>
                                <Text fontSize="xl" color="gray.400">
                                    Trouvez des cartons de qualité professionnelle à prix réduit ou gratuitement près de chez vous.
                                    Faites un geste pour la planète et pour votre portefeuille.
                                </Text>
                            </MotionBox>

                            <HStack spacing={4} w="full">
                                <Link href="/dashboard/individual">
                                    <Button colorScheme="brand" size="lg" px={8} borderRadius="full" rightIcon={<ArrowRight size={18} />}>
                                        Trouver des cartons
                                    </Button>
                                </Link>
                                <Link href="/login">
                                    <Button variant="outline" colorScheme="whiteAlpha" size="lg" px={8} borderRadius="full">
                                        Créer un compte
                                    </Button>
                                </Link>
                            </HStack>
                        </VStack>

                        <MotionBox
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            position="relative"
                        >
                            <Box
                                borderRadius="3xl"
                                overflow="hidden"
                                shadow="2xl"
                                border="1px"
                                borderColor="whiteAlpha.200"
                            >
                                <Image
                                    src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2084&auto=format&fit=crop"
                                    alt="Couple déménageant"
                                />
                            </Box>
                            {/* Abstract Glow */}
                            <Box
                                position="absolute"
                                top="-10%"
                                right="-10%"
                                boxSize="300px"
                                bg="brand.500"
                                filter="blur(80px)"
                                opacity="0.3"
                                zIndex={-1}
                            />
                        </MotionBox>
                    </SimpleGrid>
                </Container>
            </Box>

            {/* Benefits Section */}
            <Container maxW="container.lg" mt={-20}>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
                    {[
                        { title: "Prix Imbattables", text: "Jusqu'à 80% moins cher que dans les magasins de bricolage.", icon: Wallet, color: "orange" },
                        { title: "Qualité Pro", text: "Des cartons double-cannelure robustes issus de grandes entreprises.", icon: CheckCircle, color: "brand" },
                        { title: "Planète Préservée", text: "Chaque carton réutilisé économise 0.5kg de CO2.", icon: Leaf, color: "green" }
                    ].map((item, i) => (
                        <MotionBox
                            key={i}
                            bg="white"
                            p={8}
                            borderRadius="2xl"
                            shadow="xl"
                            whileHover={{ y: -5 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Flex bg={`${item.color}.100`} p={3} borderRadius="lg" w="fit-content" mb={4}>
                                <Icon as={item.icon} color={`${item.color}.600`} boxSize={6} />
                            </Flex>
                            <Heading size="md" mb={2}>{item.title}</Heading>
                            <Text color="gray.600">{item.text}</Text>
                        </MotionBox>
                    ))}
                </SimpleGrid>
            </Container>

            {/* How it works */}
            <Container maxW="container.xl" py={24}>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={20} alignItems="center">
                    <VStack align="start" spacing={8}>
                        <Heading size="2xl">Comment ça marche ?</Heading>
                        <List spacing={6}>
                            <ListItem display="flex" alignItems="start">
                                <ListIcon as={CheckCircle} color="brand.500" boxSize={6} mt={1} />
                                <Box>
                                    <Text fontWeight="bold" fontSize="lg">Recherchez</Text>
                                    <Text color="gray.600">Entrez votre ville et trouvez les annonces les plus proches de chez vous.</Text>
                                </Box>
                            </ListItem>
                            <ListItem display="flex" alignItems="start">
                                <ListIcon as={CheckCircle} color="brand.500" boxSize={6} mt={1} />
                                <Box>
                                    <Text fontWeight="bold" fontSize="lg">Réservez</Text>
                                    <Text color="gray.600">Payez en ligne de façon sécurisée (ou réservez gratuitement).</Text>
                                </Box>
                            </ListItem>
                            <ListItem display="flex" alignItems="start">
                                <ListIcon as={CheckCircle} color="brand.500" boxSize={6} mt={1} />
                                <Box>
                                    <Text fontWeight="bold" fontSize="lg">Retirez</Text>
                                    <Text color="gray.600">Allez chercher vos cartons directement au point de retrait indiqué.</Text>
                                </Box>
                            </ListItem>
                        </List>
                        <Link href="/dashboard/individual">
                            <Button colorScheme="brand" size="lg" px={10} borderRadius="full">Explorer la marketplace</Button>
                        </Link>
                    </VStack>

                    <Box bg="gray.100" borderRadius="3xl" p={12} position="relative">
                        <VStack spacing={6}>
                            <Icon as={Truck} boxSize={20} color="brand.500" />
                            <Heading size="lg" textAlign="center">Bientôt : La livraison entre particuliers</Heading>
                            <Text textAlign="center" color="gray.600">
                                Nous travaillons sur une solution de covoiturage de cartons pour vous faire gagner encore plus de temps !
                            </Text>
                        </VStack>
                    </Box>
                </SimpleGrid>
            </Container>
        </Box>
    )
}

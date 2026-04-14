"use client"

import { Box, Container, Heading, Text, VStack, SimpleGrid, Icon, Flex, Badge, Image } from "@chakra-ui/react"
import { motion } from "framer-motion"
import { Package, Users, Recycle, TrendingUp } from "lucide-react"

const MotionBox = motion(Box)

export default function AboutPage() {
    return (
        <Box pb={20}>
            {/* Hero Section */}
            <Box bg="brand.500" color="white" py={20} borderBottomRadius="3xl">
                <Container maxW="container.lg">
                    <VStack spacing={6} textAlign="center">
                        <Badge colorScheme="green" bg="whiteAlpha.300" color="white" px={4} py={1} borderRadius="full">
                            L'histoire de ReBox
                        </Badge>
                        <Heading size="3xl" fontWeight="900" letterSpacing="tight">
                            Redonner du sens au carton.
                        </Heading>
                        <Text fontSize="xl" opacity="0.9" maxW="2xl">
                            Découvrez comment une galère étudiante s'est transformée en une mission écologique nationale.
                        </Text>
                    </VStack>
                </Container>
            </Box>

            <Container maxW="container.lg" mt={-10}>
                {/* Story Section */}
                <MotionBox
                    bg="white"
                    p={10}
                    borderRadius="2xl"
                    shadow="2xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} alignItems="center">
                        <VStack align="start" spacing={6}>
                            <Heading size="lg" color="gray.800">Deux étudiants, une galère, une idée.</Heading>
                            <Text color="gray.600" fontSize="lg" lineHeight="tall">
                                Tout a commencé lors d'un déménagement. Comme des millions de personnes chaque année, deux étudiants (Loïc et son colocataire) se sont retrouvés face à un problème absurde :
                                <strong> les cartons coûtent cher</strong>, sont difficiles à trouver en bon état, et finissent souvent à la poubelle après une seule utilisation.
                            </Text>
                            <Text color="gray.600" fontSize="lg" lineHeight="tall">
                                D'un autre côté, les entreprises locales sont submergées de cartons de haute qualité qu'elles doivent payer pour faire recycler.
                                <strong>ReBox est né de ce paradoxe.</strong>
                            </Text>
                        </VStack>
                        <Box borderRadius="2xl" overflow="hidden" boxShadow="xl">
                            <Image
                                src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=2070&auto=format&fit=crop"
                                alt="Cartons empilés"
                            />
                        </Box>
                    </SimpleGrid>
                </MotionBox>

                {/* Mission Section */}
                <Box py={20}>
                    <VStack spacing={12}>
                        <VStack spacing={4} textAlign="center">
                            <Heading size="xl">Notre Mission</Heading>
                            <Text color="gray.500" maxW="2xl">
                                Faciliter l'accès à des emballages abordables tout en réduisant l'empreinte carbone du secteur de la logistique.
                            </Text>
                        </VStack>

                        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} w="full">
                            <VStack p={8} bg="gray.50" borderRadius="xl" align="start" spacing={4} border="1px" borderColor="gray.100">
                                <Flex bg="brand.100" p={3} borderRadius="lg">
                                    <Icon as={Users} color="brand.600" boxSize={6} />
                                </Flex>
                                <Heading size="md">Pour Tous</Heading>
                                <Text color="gray.600">Rendre le déménagement accessible à tous les budgets grâce au réemploi.</Text>
                            </VStack>

                            <VStack p={8} bg="gray.50" borderRadius="xl" align="start" spacing={4} border="1px" borderColor="gray.100">
                                <Flex bg="green.100" p={3} borderRadius="lg">
                                    <Icon as={Recycle} color="green.600" boxSize={6} />
                                </Flex>
                                <Heading size="md">Écologie</Heading>
                                <Text color="gray.600">Éviter la production de nouveaux cartons en prolongeant la vie de ceux déjà existants.</Text>
                            </VStack>

                            <VStack p={8} bg="gray.50" borderRadius="xl" align="start" spacing={4} border="1px" borderColor="gray.100">
                                <Flex bg="orange.100" p={3} borderRadius="lg">
                                    <Icon as={TrendingUp} color="orange.600" boxSize={6} />
                                </Flex>
                                <Heading size="md">Économie Circulaire</Heading>
                                <Text color="gray.600">Permettre aux entreprises de valoriser leurs déchets tout en aidant les locaux.</Text>
                            </VStack>
                        </SimpleGrid>
                    </VStack>
                </Box>
            </Container>
        </Box>
    )
}

'use client'

import { Box, Button, Container, Flex, Heading, Text, SimpleGrid, Icon, Stack, Image, useColorModeValue } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Package, Leaf, ShieldCheck, TrendingUp } from 'lucide-react'

const MotionBox = motion(Box)
const MotionHeading = motion(Heading)
const MotionText = motion(Text)

export default function LandingPage() {
  const bg = useColorModeValue('brand.50', 'gray.900')
  const color = useColorModeValue('gray.700', 'gray.200')

  return (
    <Box bg={bg} color={color} minH="100vh">
      {/* Hero Section */}
      <Container maxW="container.xl" pt={{ base: 20, md: 32 }} pb={{ base: 20, md: 32 }}>
        <Flex direction={{ base: 'column', md: 'row' }} align="center" justify="space-between">
          <Box flex="1" pr={{ md: 12 }} mb={{ base: 12, md: 0 }}>
            <MotionHeading
              as="h1"
              size="4xl"
              fontWeight="extrabold"
              lineHeight="shorter"
              mb={6}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Text as="span" color="brand.600">Donnez une seconde vie</Text>
              <br />
              à vos cartons.
            </MotionHeading>
            <MotionText
              fontSize="xl"
              color="gray.500"
              mb={8}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              La première marketplace B2B/B2C pour l'achat et la revente de cartons de réemploi.
              Économique pour vous, écologique pour la planète.
            </MotionText>
            <Stack direction={{ base: 'column', sm: 'row' }} spacing={4}>
              <Link href="/dashboard/individual">
                <Button
                  size="lg"
                  colorScheme="brand"
                  px={8}
                  rightIcon={<ArrowRight />}
                  _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                >
                  Trouver des cartons
                </Button>
              </Link>
              <Link href="/dashboard/company">
                <Button
                  size="lg"
                  variant="outline"
                  colorScheme="brand"
                  px={8}
                  _hover={{ bg: 'brand.50' }}
                >
                  Vendre mes stocks
                </Button>
              </Link>
            </Stack>
          </Box>
          <Box flex="1" position="relative">
            <MotionBox
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <Image
                src="https://images.unsplash.com/photo-1586769852044-692d6e3703f0?q=80&w=2574&auto=format&fit=crop"
                alt="Cardboard boxes"
                rounded="2xl"
                shadow="2xl"
                objectFit="cover"
                maxH="500px"
                w="full"
              />
              {/* Floating Badge */}
              <Box
                position="absolute"
                bottom="-20px"
                left="-20px"
                bg="white"
                p={4}
                rounded="xl"
                shadow="xl"
                maxW="200px"
              >
                <Flex align="center" mb={2}>
                  <Icon as={TrendingUp} color="green.500" w={6} h={6} mr={2} />
                  <Text fontWeight="bold" color="gray.800">Impact Direct</Text>
                </Flex>
                <Text fontSize="sm" color="gray.600">Déjà 12 tonnes de CO2 économisées cette année !</Text>
              </Box>
            </MotionBox>
          </Box>
        </Flex>
      </Container>

      {/* Features Section (Bento Grid Style) */}
      <Box py={20} bg="white">
        <Container maxW="container.xl">
          <Heading textAlign="center" mb={16} size="2xl">Pourquoi ReBox ?</Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
            <Feature
              icon={Package}
              title="Économie Circulaire"
              text="Réutilisez des cartons existants plutôt que d'en produire de nouveaux. Réduisez vos coûts d'emballage de 40%."
            />
            <Feature
              icon={Leaf}
              title="Impact Écologique"
              text="Chaque tonne de carton réemployée sauve 17 arbres et économise 4000L d'eau. Suivez votre impact en temps réel."
            />
            <Feature
              icon={ShieldCheck}
              title="Qualité Vérifiée"
              text="Nos vendeurs partenaires sont vérifiés. Les cartons sont inspectés pour garantir leur solidité."
            />
          </SimpleGrid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box py={20} bg="brand.600" color="white" textAlign="center">
        <Container maxW="container.md">
          <Heading size="2xl" mb={6}>Prêt à changer le monde ?</Heading>
          <Text fontSize="xl" mb={10} opacity={0.9}>
            Rejoignez plus de 500 entreprises et particuliers qui ont choisi le réemploi.
          </Text>
          <Link href="/signup">
            <Button
              size="xl"
              bg="white"
              color="brand.600"
              px={12}
              py={8}
              fontSize="xl"
              _hover={{ bg: 'brand.50', transform: 'scale(1.05)' }}
            >
              Commencer maintenant
            </Button>
          </Link>
        </Container>
      </Box>
    </Box>
  )
}

function Feature({ title, text, icon }: { title: string, text: string, icon: any }) {
  return (
    <Stack
      bg="gray.50"
      p={8}
      rounded="2xl"
      spacing={4}
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-5px)', shadow: 'lg', bg: 'brand.50' }}
    >
      <Flex
        w={12}
        h={12}
        align="center"
        justify="center"
        rounded="full"
        bg="brand.100"
        color="brand.600"
      >
        <Icon as={icon} w={6} h={6} />
      </Flex>
      <Heading size="md">{title}</Heading>
      <Text color="gray.600">{text}</Text>
    </Stack>
  )
}
